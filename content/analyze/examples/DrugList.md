---
title: Get compound Information
draft: True
authors:
- kellrott
tags:
- ccle
- drug response
created_at: 2018-05-09
updated_at: 2018-05-09
tldr: Get info about CCLE drug response experiments
---

```python
import gripql
conn = gripql.Connection("https://bmegio.ohsu.edu/api", credential_file="bmeg_credentials.json")
O = conn.graph("bmeg_rc2")
```


```python
print( list(O.query().V().hasLabel("Sample").limit(5) ))
```

    [INFO]	2019-07-26 18:24:25,627	5 results received in 0 seconds


    [<AttrDict({'gid': 'Sample:CCLE:ACH-000511', 'label': 'Sample', 'data': {'project_id': 'Project:CCLE_Lung_Cancer', 'sample_id': 'ACH-000511', 'submitter_id': 'CALU1_LUNG'}})>, <AttrDict({'gid': 'Sample:CCLE:ACH-001306', 'label': 'Sample', 'data': {'project_id': 'Project:CCLE_Thyroid_Cancer', 'sample_id': 'ACH-001306', 'submitter_id': '8305C_THYROID'}})>, <AttrDict({'gid': 'Sample:CCLE:ACH-000046', 'label': 'Sample', 'data': {'project_id': 'Project:CCLE_Kidney_Cancer', 'sample_id': 'ACH-000046', 'submitter_id': 'ACHN_KIDNEY'}})>, <AttrDict({'gid': 'Sample:CCLE:ACH-001041', 'label': 'Sample', 'data': {'project_id': 'Project:CCLE_Lung_Cancer', 'sample_id': 'ACH-001041', 'submitter_id': 'COLO699_LUNG'}})>, <AttrDict({'gid': 'Sample:CCLE:ACH-001039', 'label': 'Sample', 'data': {'project_id': 'Project:CCLE_Colon/Colorectal_Cancer', 'sample_id': 'ACH-001039', 'submitter_id': 'COLO205_LARGE_INTESTINE'}})>]



```python
aliquots = list(O.query().V("Program:CCLE").out("projects").out("cases").out("samples").out("aliquots").render("$._gid"))
```

    [INFO]	2019-07-26 18:24:27,023	16,521 results received in 1 seconds



```python
q = O.query().V().hasLabel("Sample").where(aql.eq("datasetId", "ccle")).mark("s")\
.in_("responseFor").mark("r").out("responseTo").mark("d")\
.render(["$s._gid", "$r.summary", "$d._gid"]).limit(10)
for row in q:
    print(row)
```


    ---------------------------------------------------------------------------

    AttributeError                            Traceback (most recent call last)

    <ipython-input-4-1c1f88e51aea> in <module>
    ----> 1 q = O.query().V().hasLabel("Sample").where(aql.eq("datasetId", "ccle")).mark("s")\
          2 .in_("responseFor").mark("r").out("responseTo").mark("d")\
          3 .render(["$s._gid", "$r.summary", "$d._gid"]).limit(10)
          4 for row in q:
          5     print(row)


    AttributeError: 'Query' object has no attribute 'where'



```python
q = O.query().V().where(aql.eq("_label", "Biosample")).where(aql.eq("datasetId", "ccle")).mark("s")\
.in_("responseFor").mark("r").outEdge("responseTo").distinct("_to").render(["_to"])
for row in q:
    print row
```


```python
q = O.query().V().where(aql.eq("_label", "ResponseCurve")).outEdge("responseTo").distinct("_to").render(["_to"])
for row in q:
    print row
```


```python
print list(O.query().V().where(aql.eq("_label", "ResponseCurve")).outEdge("responseTo").distinct("_to").render(["_to"]).count())

```


```python
print list(O.query().V().where(aql.eq("_label", "G2PAssociation")).outEdge("environmentFor").distinct("_to").render(["_to"]))

```


```python
print list(O.query().V().where(aql.eq("_label", "G2PAssociation")).outEdge().limit(100).render(["_label"]))
```


```python
print list(O.query().V().where(aql.eq("$.label", "Individual")).outEdge("drugTherapyFrom").distinct("$.to").render(["$.to"]))
```


```python
q = O.query().V().where(aql.eq("_label", "Compound"))
for i in q:
    print i
```


```python
q = O.query().V("compound:UNKNOWN:oxaliplatin").inEdge().distinct("_label").render(["_label"])
print list(q)
```


```python
q =  O.query().V("compound:UNKNOWN:oxaliplatin").inEdge("sameAs")
print list(q)
```


```python
print list(O.query().V("compound:UNKNOWN:BRD-M14820059"))
```


```python
q = O.query().V().where(aql.eq("_label", "ResponseCurve")).aggregate(aql.term("test", "ResponseCurve", "source"))
print list(q)
```


```python
print O.aggregate(aql.term("test", "ResponseCurve", "responseType"))
```


```python

```
