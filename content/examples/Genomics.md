---
title: Gene Mutation Hotstops
authors:
- kellrott
tags:
- ccle
- drug response
created_at: 2018-05-09
updated_at: 2018-05-09
tldr: Build a rolling average of mutations for a given gene region
---

```python
import matplotlib.pyplot as plt
import pandas
import gripql
conn = gripql.Connection("http://grip.compbio.ohsu.edu")
O = conn.graph("bmeg_rc1_2")
```

## Get BRCA1 start and stop locations


```python
loc = list( O.query().V().hasLabel("Gene").has(gripql.eq("symbol", "BRCA1")).render(["$.start", "$.end"]) )[0]
```

    [INFO]	2019-03-05 10:40:46,821	1 results received in 0 seconds



```python
counts = [0] * (loc[1]-loc[0])
q = O.query().V().hasLabel("Gene").has(gripql.eq("symbol", "BRCA1")).in_("AlleleIn").has(gripql.eq("type", "SNP"))
q = q.aggregate(gripql.term("brac1_pos", "start"))
res = list(q)[0]
for v in res.brac1_pos.buckets:
    counts[ v['key'] - loc[0] ] = v['value']
```

    [INFO]	2019-03-05 10:40:51,743	1 results received in 4 seconds



```python
s = pandas.DataFrame(counts)
```


```python
s.rolling(500).sum().plot()
```




    <matplotlib.axes._subplots.AxesSubplot at 0x11e6e10f0>




![png](Genomics_files/Genomics_6_1.png)



```python

```
