---
title: Allele Lookup
weight: 20
authors:
- kellrott
tags:
- ccle
- drug response
created_at: 2018-05-09
updated_at: 2018-05-09
tldr: Look up an allele
---

```python
import hashlib
import gripql
conn = gripql.Connection("http://grip.compbio.ohsu.edu")
O = conn.graph("bmeg_rc1_2")
```


```python
def allele_gid(genome, chromosome, start, end, reference_bases,
                 alternate_bases):
        vid = "%s:%s:%d:%d:%s:%s" % (genome, chromosome,
                                     start, end, reference_bases,
                                     alternate_bases)
        vid = vid.encode('utf-8')
        vidhash = hashlib.sha1()
        vidhash.update(vid)
        vidhash = vidhash.hexdigest()
        return "Allele:%s" % (vidhash)
```


```python
chrom = 1
loc = 27100988
ids = []
for r in ['A', 'C', 'G', 'T']:
    for a in ['A', 'C', 'G', 'T']:
        ids.append( allele_gid("GRCh37", chrom, loc, loc, r, a) )
for row in O.query().V(ids):
    print( row )
```

    [INFO]	2019-03-05 10:39:04,389	1 results received in 0 seconds


    <AttrDict({'gid': 'Allele:0b0a7a23d57414e768677a6cbd764563922209df', 'label': 'Allele', 'data': {'alternate_bases': 'T', 'chromosome': '1', 'effect': 'Nonsense_Mutation', 'end': 27100988, 'ensembl_transcript': 'ENST00000324856', 'genome': 'GRCh37', 'hugo_symbol': 'ARID1A', 'reference_bases': 'C', 'start': 27100988, 'strand': '+', 'type': 'SNP'}})>



```python

```
