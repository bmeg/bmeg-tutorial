---
title: Cohort Mutation Counts
path: TCGA
authors:
- kellrott
tags:
- tcga
- mutations
- mc3
created_at: 2018-05-09
updated_at: 2018-05-09
tldr: Find the number of mutations per gene for TCGA cohort
---

```python
import pandas
import gripql
conn = gripql.Connection("http://grip.compbio.ohsu.edu")
O = conn.graph("bmeg_rc1_2")
```


```python
q = O.query().V("Project:TCGA-KIRC")
q = q.in_("InProject").in_("SampleFor").has(gripql.eq("gdc_attributes.sample_type", "Primary Tumor"))
q = q.in_("AliquotFor").in_("CallsetFor").outE("AlleleCall")
q = q.has(gripql.contains("methods", "MUTECT"))
q = q.aggregate(gripql.term("geneCount", "ensembl_gene"))

res = list(q)
counts = {}
for i in res[0]['geneCount']['buckets']:
    counts[i['key']] = i['value']

```

    [INFO]	2019-03-01 17:22:30,156	1 results received in 6 seconds



```python
countDF = pandas.Series(counts)
```


```python
goi = list(countDF.index[countDF >= 20])
```


```python
for e,g in O.query().V(goi).render(["$._gid" ,"$.symbol"]):
    print(e,g)
```

    [INFO]	2019-03-04 14:52:32,121	10 results received in 0 seconds


    ENSG00000007174 DNAH9
    ENSG00000081479 LRP2
    ENSG00000134086 VHL
    ENSG00000151914 DST
    ENSG00000155657 TTN
    ENSG00000163930 BAP1
    ENSG00000163939 PBRM1
    ENSG00000181143 MUC16
    ENSG00000181555 SETD2
    ENSG00000198793 MTOR



```python

```
