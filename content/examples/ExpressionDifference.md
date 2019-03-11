---
title: Differential Expression
authors:
- kellrott
tags:
- TCGA
created_at: 2018-05-09
updated_at: 2018-05-09
tldr: Look at differential expression patterns
---

```python
import matplotlib.pyplot as plt
import seaborn as sns
import pandas
from scipy.stats import ttest_ind
import gripql
```


```python
conn = gripql.Connection("https://bmeg.io/api", credential_file="/tmp/bmeg_credentials.json")
O = conn.graph("bmeg_rc1_2")
```


```python
PROJECT="Project:TCGA-LUAD"
```


```python
c = O.query().V(PROJECT).in_("InProject").in_("SampleFor").as_("sample")
c = c.has(gripql.eq("gdc_attributes.sample_type", "Solid Tissue Normal"))
c = c.in_("AliquotFor").in_("GeneExpressionOf").as_("exp")
c = c.render( ["$sample._data.gdc_attributes.submitter_id", "$exp._data.values"])
data = {}
for row in c.execute(stream=True):
    data[row[0]] = row[1]
normalDF = pandas.DataFrame(data).transpose()
```

    [INFO]	2019-03-11 15:54:00,433	59 results received in 33 seconds



```python
c = O.query().V(PROJECT).in_("InProject").in_("SampleFor").as_("sample")
c = c.has(gripql.eq("gdc_attributes.sample_type", "Primary Tumor"))
c = c.in_("AliquotFor").in_("GeneExpressionOf").as_("exp")
c = c.render( ["$sample._data.gdc_attributes.submitter_id", "$exp._data.values"])
data = {}
for row in c.execute(stream=True):
    data[row[0]] = row[1]
tumorDF = pandas.DataFrame(data).transpose()
```

    [INFO]	2019-03-11 15:58:22,223	539 results received in 260 seconds



```python
stats = {}
for gene in tumorDF:
    s = ttest_ind(tumorDF[gene], normalDF[gene])
    stats[gene] = { 'statistic': s.statistic, 'pvalue' : s.pvalue }
statsDF = pandas.DataFrame(stats).transpose()
```


```python
statsDF[ statsDF['pvalue'] < 0.0001 ].sort_values('statistic').head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>pvalue</th>
      <th>statistic</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>ENSG00000168484</th>
      <td>3.468274e-227</td>
      <td>-53.424128</td>
    </tr>
    <tr>
      <th>ENSG00000135604</th>
      <td>3.129967e-208</td>
      <td>-48.760390</td>
    </tr>
    <tr>
      <th>ENSG00000204305</th>
      <td>1.240590e-197</td>
      <td>-46.265977</td>
    </tr>
    <tr>
      <th>ENSG00000114854</th>
      <td>1.806339e-188</td>
      <td>-44.169569</td>
    </tr>
    <tr>
      <th>ENSG00000234281</th>
      <td>7.387628e-170</td>
      <td>-40.068918</td>
    </tr>
  </tbody>
</table>
</div>




```python
sns.kdeplot(tumorDF['ENSG00000168484'], color="r")
sns.kdeplot(normalDF['ENSG00000168484'], color="g")
```




    <matplotlib.axes._subplots.AxesSubplot at 0x12b5f3278>




![png](ExpressionDifference_files/ExpressionDifference_8_1.png)



```python
for row in O.query().V("ENSG00000168484").in_("GeneOntologyAnnotation"):
    print(row.gid, row.data.definition)
```

    [INFO]	2019-03-11 16:19:51,113	10 results received in 0 seconds


    GO:0005515 Interacting selectively and non-covalently with any protein or protein complex (a complex of two or more proteins that may include other nonprotein molecules).
    GO:0005576 The space external to the outermost structure of a cell. For cells without external protective or external encapsulating structures this refers to space outside of the plasma membrane. This term covers the host cell environment outside an intracellular parasite.
    GO:0005615 That part of a multicellular organism outside the cells proper, usually taken to be outside the plasma membranes, and occupied by fluid.
    GO:0097486 The volume enclosed by the outermost membrane of a multivesicular body.
    GO:0045334 A clathrin-coated, membrane-bounded intracellular vesicle formed by invagination of the plasma membrane around an extracellular substance.
    GO:0042802 Interacting selectively and non-covalently with an identical protein or proteins.
    GO:0005789 The lipid bilayer surrounding the endoplasmic reticulum.
    GO:0007585 The process of gaseous exchange between an organism and its environment. In plants, microorganisms, and many small animals, air or water makes direct contact with the organism's cells or tissue fluids, and the processes of diffusion supply the organism with dioxygen (O2) and remove carbon dioxide (CO2). In larger animals the efficiency of gaseous exchange is improved by specialized respiratory organs, such as lungs and gills, which are ventilated by breathing mechanisms.
    GO:0042599 A membrane-bounded organelle, specialized for the storage and secretion of various substances (surfactant phospholipids, glycoproteins and acid phosphates) which are arranged in the form of tightly packed, concentric, membrane sheets or lamellae. Has some similar properties to, but is distinct from, a lysosome.
    GO:0044267 The chemical reactions and pathways involving a specific protein, rather than of proteins in general, occurring at the level of an individual cell. Includes cellular protein modification.



```python

```
