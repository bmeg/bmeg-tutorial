---
title: Drug Response
path: CCLE/t-test
authors:
- kellrott
tags:
- ccle
- drug response
created_at: 2018-05-09
updated_at: 2018-05-09
tldr: Identify drug response seperation for CCLE cohorts defined by gene mutation
---

```python
import pandas
import gripql
import itertools
import scipy.stats as stats

conn = gripql.Connection("https://bmeg.io/api", credential_file="bmeg_credentials.json")
O = conn.graph("bmeg_rc2")
```

Find all of the samples in the [CTRP](https://portals.broadinstitute.org/ctrp/) Breast Cancer experiment


```python
q = O.query().V("Project:CTRP_Breast_Cancer").out("cases").distinct("_gid")
all_cases = []
for row in q:
    all_cases.append(row.gid)
```

    [INFO]	2019-07-26 20:29:14,278	40 results received in 0 seconds


For the genes of interest, get Ensembl gene ids, from the HUGO symbols


```python
GENES = ["PTEN", "TP53"]
```


```python
gene_ids = {}
for i in O.query().V().hasLabel("Gene").has(gripql.within("symbol", GENES)):
    gene_ids[i.data.symbol] = i.gid
```

    [INFO]	2019-07-26 20:29:14,423	2 results received in 0 seconds


The CTRP doesn't have direct mutation calling, but rather they used the same cell lines as the CCLE, and we can use the mutation calls from that project. So use the `same_as` edge to identify the cases from CCLE that are the same as the ones in CTRP. Then use the mutations from those samples.


```python
gene_ids
```




    {'PTEN': 'ENSG00000171862', 'TP53': 'ENSG00000141510'}



For each of the genes, find the set of samples that have a mutation in that gene


```python
mut_cases = {}
norm_cases = {}

q = O.query().V(all_cases).as_("ctrp").out("same_as").has(gripql.eq("project_id", "Project:CCLE_Breast_Cancer"))
q = q.out("samples").out("aliquots").out("somatic_callsets")
q = q.outE("alleles").has(gripql.within("ensembl_gene", list(gene_ids.values())))
q = q.render({"case" : "$ctrp._gid", "gene" : "$._data.ensembl_gene"})

for res in q:
    mut_cases[res.gene] = mut_cases.get(res.gene, set()) | set([res.case])

#get CCLE samples without mutation
for i in gene_ids.values():
    norm_cases[i] = list(set(all_cases).difference(mut_cases[i]))

    print( "%s Positive Set: %d" % (i, len(mut_cases[i])) )
    print( "%s Negative Set: %d" % (i, len(norm_cases[i])) )

```

    [INFO]	2019-07-26 20:29:14,690	43 results received in 0 seconds


    ENSG00000171862 Positive Set: 9
    ENSG00000171862 Negative Set: 31
    ENSG00000141510 Positive Set: 29
    ENSG00000141510 Negative Set: 11



```python
pos_response = {}
for g in gene_ids.values():
    pos_response[g] = {}
    q = O.query().V(list(mut_cases[g])).as_("a").out("samples").out("aliquots")
    q = q.out("drug_response").as_("a").out("compounds").as_("b")
    q = q.select(["a", "b"])    
    for row in q:
        v = row['a']['data']['auc']
        compound = row['b']['gid']
        if compound not in pos_response[g]:
            pos_response[g][compound] = [ v ]
        else:
            pos_response[g][compound].append(v)
   
```

    [INFO]	2019-07-26 20:29:16,035	3,592 results received in 1 seconds
    [INFO]	2019-07-26 20:29:19,540	12,224 results received in 3 seconds



```python
neg_response = {}
for g in gene_ids.values():
    neg_response[g] = {}
    q = O.query().V(list(norm_cases[g])).as_("a").out("samples").out("aliquots")
    q = q.out("drug_response").as_("a").out("compounds").as_("b")
    q = q.select(["a", "b"])    
    for row in q:
        v = row['a']['data']['auc']
        compound = row['b']['gid']
        if compound not in neg_response[g]:
            neg_response[g][compound] = [ v ]
        else:
            neg_response[g][compound].append(v)
   
```

    [INFO]	2019-07-26 20:29:23,489	13,250 results received in 3 seconds
    [INFO]	2019-07-26 20:29:25,137	4,618 results received in 1 seconds



```python
drugs = set(itertools.chain.from_iterable( i.keys() for i in pos_response.values() ))
out = []
for drug in drugs:
    for g in gene_ids.values():
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


```python
pandas.DataFrame(out, columns=["drug", "mutation", "t-statistic", "t-pvalue", "a-statistic", "a-pvalue"]).sort_values("a-pvalue").head(10)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>drug</th>
      <th>mutation</th>
      <th>t-statistic</th>
      <th>t-pvalue</th>
      <th>a-statistic</th>
      <th>a-pvalue</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>369</th>
      <td>Compound:CID9967941</td>
      <td>ENSG00000141510</td>
      <td>4.098840</td>
      <td>0.000438</td>
      <td>12.705330</td>
      <td>0.001136</td>
    </tr>
    <tr>
      <th>136</th>
      <td>Compound:CID11433190</td>
      <td>ENSG00000141510</td>
      <td>2.941631</td>
      <td>0.011004</td>
      <td>12.336689</td>
      <td>0.001189</td>
    </tr>
    <tr>
      <th>315</th>
      <td>Compound:CID56949517</td>
      <td>ENSG00000171862</td>
      <td>-2.611946</td>
      <td>0.041333</td>
      <td>13.650130</td>
      <td>0.001197</td>
    </tr>
    <tr>
      <th>191</th>
      <td>Compound:CID11152667</td>
      <td>ENSG00000141510</td>
      <td>-3.003887</td>
      <td>0.008382</td>
      <td>9.205017</td>
      <td>0.004602</td>
    </tr>
    <tr>
      <th>41</th>
      <td>Compound:NO_ONTOLOGY~BRD-K97651142</td>
      <td>ENSG00000141510</td>
      <td>2.556805</td>
      <td>0.023745</td>
      <td>8.381266</td>
      <td>0.006489</td>
    </tr>
    <tr>
      <th>44</th>
      <td>Compound:CID11609586</td>
      <td>ENSG00000171862</td>
      <td>-1.952776</td>
      <td>0.068235</td>
      <td>7.382291</td>
      <td>0.008403</td>
    </tr>
    <tr>
      <th>649</th>
      <td>Compound:CID52947560</td>
      <td>ENSG00000141510</td>
      <td>2.319721</td>
      <td>0.036225</td>
      <td>7.511026</td>
      <td>0.009386</td>
    </tr>
    <tr>
      <th>682</th>
      <td>Compound:CID46943432</td>
      <td>ENSG00000171862</td>
      <td>-2.160075</td>
      <td>0.055895</td>
      <td>7.443883</td>
      <td>0.009680</td>
    </tr>
    <tr>
      <th>538</th>
      <td>Compound:CID5566</td>
      <td>ENSG00000141510</td>
      <td>1.736441</td>
      <td>0.118978</td>
      <td>7.362028</td>
      <td>0.010777</td>
    </tr>
    <tr>
      <th>377</th>
      <td>Compound:CID31703</td>
      <td>ENSG00000171862</td>
      <td>-2.835380</td>
      <td>0.009463</td>
      <td>6.628285</td>
      <td>0.012186</td>
    </tr>
  </tbody>
</table>
</div>


