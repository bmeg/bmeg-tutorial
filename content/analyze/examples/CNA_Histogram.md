---
title: CNA Histogram
authors:
- kellrott
tags:
- ccle
- drug response
created_at: 2018-05-09
updated_at: 2018-05-09
tldr: Build a histogram from the copy number alteration values for genes in a TCGA cohort
---

```python
import matplotlib.pyplot as plt
import numpy as np
import gripql
conn = gripql.Connection("http://grip.compbio.ohsu.edu")
O = conn.graph("bmeg_rc1_2")
```


```python
GENES = ["PTEN", "TP53", "RB1"]
gene_ids = {}
for g in GENES:
    for i in O.query().V().hasLabel("Gene").has(gripql.eq("symbol", g)):
        gene_ids[g] = i.gid
```

    [INFO]	2019-02-20 16:54:18,146	1 results received in 0 seconds
    [INFO]	2019-02-20 16:54:18,277	1 results received in 0 seconds
    [INFO]	2019-02-20 16:54:18,408	1 results received in 0 seconds



```python
gene_ids
```




    {'PTEN': 'ENSG00000171862',
     'TP53': 'ENSG00000141510',
     'RB1': 'ENSG00000139687'}




```python
q = O.query().V("Project:TCGA-PRAD").in_("InProject").in_("SampleFor").in_("AliquotFor")
q = q.has(gripql.eq("$.gdc_attributes.sample_type", 'Primary Tumor')).in_("CopyNumberAlterationOf")
q = q.aggregate(
    list( gripql.term( g, "values.%s" % (g), 5) for g in gene_ids.values() )
)

res = list(q)
print(res)
```

    [INFO]	2019-02-20 16:54:23,109	1 results received in 4 seconds


    [<AttrDict({'ENSG00000139687': {'buckets': [{'key': '0', 'value': 269}, {'key': '-1', 'value': 139}, {'key': '-2', 'value': 81}, {'key': '1', 'value': 3}]}, 'ENSG00000141510': {'buckets': [{'key': '0', 'value': 329}, {'key': '-1', 'value': 126}, {'key': '-2', 'value': 37}]}, 'ENSG00000171862': {'buckets': [{'key': '0', 'value': 327}, {'key': '-2', 'value': 95}, {'key': '-1', 'value': 64}, {'key': '1', 'value': 5}, {'key': '2', 'value': 1}]}})>]



```python
val = []
count = []
for i in sorted(res[0]['ENSG00000139687']['buckets'], key=lambda x:int(x["key"])):
    val.append(int(i["key"]))
    count.append(i["value"])
plt.bar(val, count, width=0.35)
```




    <BarContainer object of 4 artists>




![png](CNA_Histogram_files/CNA_Histogram_5_1.png)



```python

```
