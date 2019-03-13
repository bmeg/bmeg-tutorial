---
title: Sample Counts
weight: 40
authors:
- kellrott
tags:
- ccle
- drug response
created_at: 2018-05-09
updated_at: 2018-05-09
tldr: Use aggregation methods to count number of samples in a program
---

```python
import gripql
conn = gripql.Connection("http://grip.compbio.ohsu.edu")
O = conn.graph("bmeg_rc1_2")
```

## Count number of Projects per Program


```python
q = O.query().V().hasLabel("Program").as_("p").in_("InProgram").select("p")
q = q.aggregate(gripql.term("project_count", "$._gid"))
for row in q.execute()[0]["project_count"]["buckets"]:
    print("%s\t%s" % (row["key"], row["value"]))
```

    [INFO]	2019-03-04 14:58:56,556	1 results received in 0 seconds


    Program:DepMap	38
    Program:TCGA	33
    Program:GTEx	31
    Program:CTRP	30
    Program:GDSC	27
    Program:CCLE	26
    Program:TARGET	6
    Program:NCICCR	1
    Program:CTSP	1
    Program:FM	1
    Program:VAREPOP	1


## Count number of Samples per Program


```python
q = O.query().V().hasLabel("Program").as_("p").in_("InProgram").in_("InProject").select("p")
q = q.aggregate(gripql.term("sample_count", "$._gid"))
for row in q.execute()[0]["sample_count"]["buckets"]:
    print("%s\t%s" % (row["key"], row["value"]))
```

    [INFO]	2019-03-04 14:59:26,374	1 results received in 5 seconds


    Program:FM	18004
    Program:TCGA	11315
    Program:GTEx	8859
    Program:TARGET	3236
    Program:DepMap	1700
    Program:CTRP	841
    Program:GDSC	746
    Program:CCLE	504
    Program:NCICCR	489
    Program:CTSP	45
    Program:VAREPOP	7



```python

```
