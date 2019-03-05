---
title: Gene Info
weight: 30
authors:
- kellrott
tags:
- ccle
- drug response
created_at: 2018-05-09
updated_at: 2018-05-09
tldr: Look up gene ontology information and references
---

```python
import gripql
conn = gripql.Connection("http://grip.compbio.ohsu.edu")
O = conn.graph("bmeg_rc1_2")
```


```python
gids = list(O.query().V().hasLabel("Gene").has(gripql.eq("$.symbol", "BRCA1")).render("_gid"))
```

    [INFO]	2019-03-05 10:28:54,005	1 results received in 0 seconds



```python
for ent in O.query().V(gids).inE("GeneOntologyAnnotation"):
    print(ent.data)
```

    [INFO]	2019-03-05 10:36:09,776	82 results received in 0 seconds


    <AttrDict({'evidence': 'IDA', 'references': ['PMID:19117993'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IPI', 'references': ['PMID:19369211'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'TAS', 'references': ['PMID:9662397'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'TAS', 'references': [], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'ISS', 'references': ['GO_REF:0000024'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:20160719'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:21282464'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'TAS', 'references': [], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:17349954'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IMP', 'references': ['PMID:17525340'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'TAS', 'references': [], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IPI', 'references': ['PMID:29656893'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'TAS', 'references': ['PMID:10918303'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:9774970'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IEA', 'references': ['GO_REF:0000107'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IMP', 'references': ['PMID:16326698'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:21102443'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:12890688'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:17349954'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'NAS', 'references': ['PMID:15572661'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:12419249'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'TAS', 'references': [], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:9774970'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IEA', 'references': ['GO_REF:0000107'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IMP', 'references': ['PMID:17643121'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:14654789'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IMP', 'references': ['PMID:23415688'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IMP', 'references': ['PMID:23415688'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IPI', 'references': ['PMID:15965487'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:15965487'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:15265711'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IMP', 'references': ['PMID:15965487'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'TAS', 'references': ['PMID:10918303'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:20820192'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IEA', 'references': ['GO_REF:0000107'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:20820192'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IEA', 'references': ['GO_REF:0000107'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IMP', 'references': ['PMID:23415688'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:12890688'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IMP', 'references': ['PMID:19261748'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'TAS', 'references': [], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:16288014'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:20820192'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'TAS', 'references': ['PMID:10918303'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:17643121'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:17525340'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IMP', 'references': ['PMID:23415688'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IPI', 'references': ['PMID:17873885'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IEA', 'references': ['GO_REF:0000107'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:17349954'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'NAS', 'references': ['PMID:15572661'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:16331276'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IEA', 'references': ['GO_REF:0000002'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IEA', 'references': ['GO_REF:0000107'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:8895509'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'NAS', 'references': ['PMID:12214252'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:20820192'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IEA', 'references': ['GO_REF:0000107'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:20820192'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'NAS', 'references': ['PMID:12214252'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:20820192'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:20820192'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:18809582'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IMP', 'references': ['PMID:9662397'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'TAS', 'references': ['PMID:10918303'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IEA', 'references': ['GO_REF:0000037'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'TAS', 'references': ['PMID:10918303'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'TAS', 'references': ['PMID:10910365'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'TAS', 'references': ['PMID:10918303'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IMP', 'references': ['PMID:17505062'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IMP', 'references': ['PMID:23415688'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:9662397'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'NAS', 'references': ['PMID:15572661'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IMP', 'references': ['PMID:19261748'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IMP', 'references': ['PMID:23415688'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IDA', 'references': ['PMID:10868478'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'NAS', 'references': ['PMID:14976165'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'NAS', 'references': ['PMID:12214252'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'TAS', 'references': [], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IBA', 'references': ['PMID:21873635'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IBA', 'references': ['PMID:21873635'], 'title': 'Breast cancer type 1 susceptibility protein'})>
    <AttrDict({'evidence': 'IBA', 'references': ['PMID:21873635'], 'title': 'Breast cancer type 1 susceptibility protein'})>



```python

```
