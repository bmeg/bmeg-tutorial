---
title: Gene Mutation Hotstops
weight: 63
authors:
- kellrott
tags:
- ccle
- drug response
created_at: 2018-05-09
updated_at: 2018-05-09
tldr: Build a rolling average of mutations for a given gene region
---
For this example, we will start from a single gene, and identify all mutations that occur on it. 


```python
import matplotlib.pyplot as plt
import pandas
import gripql
conn = gripql.Connection("https://bmeg.io/api", credential_file="bmeg_credentials.json")
O = conn.graph("bmeg_rc2")
```

Get BRCA1 start and stop locations


```python
loc = list( O.query().V().hasLabel("Gene").has(gripql.eq("symbol", "BRCA1")).render(["$.start", "$.end"]) )[0]
```

    [INFO]	2019-07-26 17:48:09,443	1 results received in 0 seconds


Run an aggregation query to count up all the mutations


```python
counts = [0] * (loc[1]-loc[0])
q = O.query().V().hasLabel("Gene").has(gripql.eq("symbol", "BRCA1")).out("alleles").has(gripql.eq("type", "SNP"))
q = q.aggregate(gripql.term("brac1_pos", "start"))
res = list(q)[0]
for v in res.brac1_pos.buckets:
    counts[ v['key'] - loc[0] ] = v['value']
```

    [INFO]	2019-07-26 17:51:52,104	1 results received in 0 seconds


Save as a dataframe


```python
s = pandas.DataFrame(counts)
```

Plot the hotspots


```python
s.rolling(500).sum().plot()
```




    <matplotlib.axes._subplots.AxesSubplot at 0x7fdf9c6ba6a0>




![png](Genomics_files/Genomics_10_1.png)

