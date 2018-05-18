---
title: Drug Response
menu:
  main:
    parent: Queries
    weight: 5
---


# Get all CCLE samples
```
q = O.query().V().where(aql.eq("_label", "Biosample"))
q = q.where(aql.and_(aql.eq("source", "ccle"))).render({"id":"_gid"})
all_samples = []
for row in q:
    all_samples.append(row.id)
```

# Genes we'll be looking at
```
GENES = ["CDKN2A", "PTEN", "TP53", "SMAD4"]
gene_ids = {}
for g in GENES:
    for i in O.query().V().where(aql.eq("_label", "Gene")).where(aql.eq("symbol", g)):
        gene_ids[g] = i.gid
```

# Scan CCLE cell lines based on mutation status
```
mut_samples = {}
norm_samples = {}
for g, i in gene_ids.items():
    #get CCLE samples with mutation
    mut_samples[g] = set(k['gid'] for k in O.query().V(i).in_("variantIn").out("variantCall").out("callSetOf").where(aql.in_("_gid", all_samples)).render({"gid":"_gid"}))

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
    for row in O.query().V(mut_samples[g]).in_("responseFor").mark("a").out("responseTo").mark("b").select(["a", "b"]):
        for v in row['a']['data']['summary']:
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
    for row in O.query().V(norm_samples[g]).in_("responseFor").mark("a").out("responseTo").mark("b").select(["a", "b"]):
        for v in row['a']['data']['summary']:
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
        if drug in pos_response[g] and drug in neg_response[g]:
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


# Traversal direction optimization
Note, there is a slower version of this query:
```
q = O.query().V(all_samples).in_("callSetOf").in_("variantCall").out("variantIn").where(aql.eq("gene:ENSG00000141510", "_gid")).count()
#print list(q)
```
