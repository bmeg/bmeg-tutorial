---
title: Expression Data
authors:
- kellrott
tags:
- ccle
- drug response
created_at: 2018-05-09
updated_at: 2018-05-09
tldr: Build a pandas matrix of expression data
---

```python
import pandas
import gripql
conn = gripql.Connection("http://grip.compbio.ohsu.edu")
O = conn.graph("bmeg_rc1_2")
```

## Download gene expression values from TCGA-READ cohort and build matrix with submitter id as label


```python
c = O.query().V("Project:TCGA-READ").in_("InProject").in_("SampleFor").as_("sample")
c = c.in_("AliquotFor").in_("GeneExpressionOf").as_("exp")
c = c.render( ["$sample._data.gdc_attributes.submitter_id", "$exp._data.values"])
data = {}
for row in c.execute(stream=True):
    data[row[0]] = row[1]
samples = pandas.DataFrame(data).transpose().fillna(0.0)
```

    [INFO]	2019-03-05 12:34:10,640	177 results received in 33 seconds



```python
samples["ENSG00000000003"]
```




    TCGA-AF-A56N-01A    121.814080
    TCGA-AF-6655-01A    115.784470
    TCGA-AG-3584-01A     68.075530
    TCGA-AG-4021-01A     76.315404
    TCGA-AG-3602-01A    149.292850
    TCGA-AG-4015-01A    144.383820
    TCGA-DC-6154-01A    198.705750
    TCGA-DY-A1DG-01A     91.135477
    TCGA-F5-6571-01A     68.264725
    TCGA-AG-3885-01A     23.977357
    TCGA-AG-A02G-01A    109.893070
    TCGA-EI-6507-01A     24.978050
    TCGA-AG-A016-01A     57.055670
    TCGA-AH-6549-01A     79.102460
    TCGA-EI-6917-01A     35.480240
    TCGA-AH-6897-01A    119.721760
    TCGA-F5-6861-01A     61.498415
    TCGA-AG-3582-01A    212.158210
    TCGA-AG-3909-01A     84.553668
    TCGA-AG-3600-01A     50.407649
    TCGA-AG-3732-11A     46.770179
    TCGA-AG-3732-01A     89.309673
    TCGA-AG-3894-01A     81.334448
    TCGA-DC-4745-01A    126.200510
    TCGA-EF-5830-01A    107.157133
    TCGA-AH-6644-01A    114.694460
    TCGA-CI-6619-01B     70.996527
    TCGA-AF-6136-01A     90.418270
    TCGA-AG-A014-01A     65.825818
    TCGA-CI-6622-01A     91.304080
                           ...    
    TCGA-DC-6157-01A    238.577380
    TCGA-F5-6702-01A    131.229660
    TCGA-AG-A02X-01A     27.554430
    TCGA-CI-6621-01A     94.811930
    TCGA-AG-3578-01A     50.730529
    TCGA-EI-6883-01A     69.266780
    TCGA-AG-3580-01A     81.587024
    TCGA-AG-A023-01A    117.490870
    TCGA-DY-A0XA-01A    129.798320
    TCGA-AF-6672-01A     69.238120
    TCGA-AG-3902-01A     44.422523
    TCGA-AF-5654-01A    101.475331
    TCGA-AF-5654-11A     75.733573
    TCGA-EI-6885-01A    123.452640
    TCGA-G5-6641-01A     68.610776
    TCGA-AG-A020-01A     68.978676
    TCGA-AF-4110-01A     63.816002
    TCGA-DC-6156-01A     99.719176
    TCGA-AG-3608-01A    110.437916
    TCGA-AG-A01L-01A     69.184040
    TCGA-AG-3593-01A     97.519640
    TCGA-DC-6158-01A    205.319220
    TCGA-AG-3892-01A     61.560723
    TCGA-AG-A00Y-01A     71.117058
    TCGA-AG-A00H-01A     81.571808
    TCGA-AF-2692-01A    114.603420
    TCGA-AF-2692-11A     57.313690
    TCGA-AG-3893-01A    239.065593
    TCGA-AG-A025-01A     72.399533
    TCGA-CI-6623-01B    121.638317
    Name: ENSG00000000003, Length: 177, dtype: float64




```python

```
