---
title: Drug Response
menu:
  main:
    parent: Queries
    weight: 5
---


# Get all CCLE samples
```
all_samples = O.query().has("gid", "cohort:CCLE").outgoing("hasSample").values(["gid"]).execute()
```

# Genes we'll be looking at
```
GENES = ["CDKN2A", "PTEN", "TP53", "SMAD4"]
```

# Scan CCLE cell lines based on mutation status
```
mut_samples = {}
norm_samples = {}
for g in GENES:
    #get CCLE samples with mutation
    mut_samples[g] = list(set(O.query().has("gid", "gene:%s" % (g)).incoming("variantInGene").outgoing("variantInBiosample").mark("a")\
    .incoming("hasSample").has("gid", "cohort:CCLE").select("a").values(["gid"]).execute()))

    #get CCLE samples without mutation
    norm_samples[g] = list(set(all_samples).difference(mut_samples[g]))
    
    print "%s Positive Set: %d" % (g, len(mut_samples[g]))
    print "%s Negative Set: %d" % (g, len(norm_samples[g]))
```

# Get response values for the positive set (samples with mutation) and collect AUC value by drug
```
pos_response = {}
for g in GENES:
    pos_response[g] = {}
    for row in O.query().has("gid", O.within(mut_samples[g])).outEdge("responseToCompound").mark("a").inVertex().mark("b").select(["a", "b"]).execute():
        for v in json.loads(row['a']['properties']['responseSummary']):
            if v['type'] == "AUC":
                compound = row['b']['gid']
                if compound not in pos_response[g]:
                    pos_response[g][compound] = [ v["value"] ]
                else:
                    pos_response[g][compound].append(v["value"])
```


# Get response values for the negative set (samples without mutation) and collect AUC value by drug
```
neg_response = {}
for g in GENES:
    neg_response[g] = {}

    for row in O.query().has("gid", O.within(norm_samples[g])).outEdge("responseToCompound").mark("a").inVertex().mark("b").select(["a", "b"]).execute():
        for v in json.loads(row['a']['properties']['responseSummary']):
            if v['type'] == "AUC":
                compound = row['b']['gid']
                if compound not in neg_response[g]:
                    neg_response[g][compound] = [ v["value"] ]
                else:
                    neg_response[g][compound].append(v["value"])
```

# Collect t-test statistics
```
drugs = set(itertools.chain.from_iterable( i.keys() for i in pos_response.values() ))
out = []
for drug in drugs:
    for g in GENES:
        row = {"drug" : drug, "mutation" : g}
        mut_values = pos_response[g][drug]
        norm_values = neg_response[g][drug]
        if len(mut_values) > 5 and len(norm_values) > 5:
            s = stats.ttest_ind(mut_values, norm_values, equal_var=False)
            row["t-statistic"] = s.statistic
            row["t-pvalue"] = s.pvalue
            s = stats.f_oneway(mut_values, norm_values)
            row["a-statistic"] = s.statistic
            row["a-pvalue"] = s.pvalue
            out.append(row)
```

# Print data sorted by statistical value
```
pandas.DataFrame(out, columns=["drug", "mutation", "t-statistic", "t-pvalue", "a-statistic", "a-pvalue"]).sort_values("a-pvalue")
```

