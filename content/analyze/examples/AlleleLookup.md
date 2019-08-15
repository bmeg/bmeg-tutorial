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
conn = gripql.Connection("https://bmeg.io/api", credential_file="bmeg_credentials.json")
O = conn.graph("bmeg_rc2")
```

BMEG stores alleles using a hashed version of the alteration description
```
genome:chromosome:start:end:reference_bases:alternate_bases
```
So an example allele would be:
```
GRCh37:1:27100988:27100988:C:T
```
Which is then run though a `sha1` hash to get the string
```
0b0a7a23d57414e768677a6cbd764563922209df
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

    [INFO]	2019-07-24 17:12:10,693	1 results received in 0 seconds


    <AttrDict({'gid': 'Allele:0b0a7a23d57414e768677a6cbd764563922209df', 'label': 'Allele', 'data': {'alternate_bases': 'T', 'chromosome': '1', 'dbSNP_RS': '.', 'effect': 'Nonsense_Mutation', 'end': 27100988, 'ensembl_transcript': 'ENST00000324856', 'genome': 'GRCh37', 'hugo_symbol': 'ARID1A', 'project_id': 'Project:Reference', 'reference_bases': 'C', 'start': 27100988, 'strand': '+', 'submitter_id': '0b0a7a23d57414e768677a6cbd764563922209df', 'type': 'SNP'}})>

