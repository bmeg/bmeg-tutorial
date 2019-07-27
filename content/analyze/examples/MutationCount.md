---
title: Cohort Mutation Counts
path: TCGA
weight: 60
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
Find the number of mutations per gene for TCGA cohort


```python
import pandas
import gripql
conn = gripql.Connection("https://bmeg.io/api", credential_file="bmeg_credentials.json")
O = conn.graph("bmeg_rc2")
```

Select all the tumor samples in the TCGA KIRC cohort, and aggregate across the `ensembl_gene` field.


```python
q = O.query().V("Project:TCGA-KIRC")
q = q.out("cases").out("samples").has(gripql.eq("gdc_attributes.sample_type", "Primary Tumor"))
q = q.out("aliquots").out("somatic_callsets").outE("alleles")
q = q.has(gripql.contains("methods", "MUTECT"))
q = q.aggregate(gripql.term("geneCount", "ensembl_gene"))

res = list(q)
counts = {}
for i in res[0]['geneCount']['buckets']:
    counts[i['key']] = i['value']

```

    [INFO]	2019-07-24 17:37:39,468	1 results received in 1 seconds


Create a Pandas.Series with the output and find all the genes with 20 or more mutations


```python
countDF = pandas.Series(counts)
```


```python
goi = list(countDF.index[countDF >= 20])
```


```python
for e,g in O.query().V(goi).render(["$._gid" ,"$.symbol"]):
    print("%s (%s) = %d" % (e,g, countDF[e]))
```

    [INFO]	2019-07-24 17:37:39,515	10 results received in 0 seconds


    ENSG00000007174 (DNAH9) = 22
    ENSG00000081479 (LRP2) = 22
    ENSG00000134086 (VHL) = 113
    ENSG00000151914 (DST) = 27
    ENSG00000155657 (TTN) = 120
    ENSG00000163930 (BAP1) = 30
    ENSG00000163939 (PBRM1) = 74
    ENSG00000181143 (MUC16) = 42
    ENSG00000181555 (SETD2) = 34
    ENSG00000198793 (MTOR) = 34

