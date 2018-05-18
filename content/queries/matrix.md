---
title: Matrix
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
import aql

conn = aql.Connection("http://bmeg.io")
O = conn.graph("bmeg")

c = O.query().V().where(aql.eq("_label", "Individual"))
c = c.where(aql.and_(aql.eq("source", "tcga"), aql.eq("disease_code", "READ")))
c = c.in_("sampleOf").in_("expressionFor")
c = c.render(["$.biosampleId", "$.expressions"])

data = {}
for row in c:
    data[row[0]] = row[1]
samples = pandas.DataFrame(data).transpose().fillna(0.0)
```
