---
title: Matrix
sidebar: true

menu:
  main:
    parent: Queries
    weight: 4
---

# Using BMEG to get matrix data

Many vertices in the BMEG contain complex data that can be collected and
converted into matrix data.

## Download RNA-Seq for cohort:TCGA-READ

```python
import pandas
import gripql

conn = gripql.Connection("http://bmeg.io")
O = conn.graph("bmeg")

c = O.query().V().where(gripql.eq("_label", "Individual"))
c = c.where(gripql.and_(gripql.eq("source", "tcga"), gripql.eq("disease_code", "READ")))
c = c.in_("sampleOf").in_("expressionFor")
c = c.render(["$.biosampleId", "$.expressions"])

data = {}
for row in c:
    data[row[0]] = row[1]
samples = pandas.DataFrame(data).transpose().fillna(0.0)
```
