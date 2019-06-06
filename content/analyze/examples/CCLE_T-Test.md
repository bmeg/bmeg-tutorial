---
title: Drug Response
path: CCLE/t-test
authors:
- kellrott
tags:
- ccle
- drug response
created_at: 2018-05-09
updated_at: 2018-05-09
tldr: Identify drug response seperation for CCLE cohorts defined by gene mutation
---

```python
import pandas
import gripql
import itertools
import scipy.stats as stats

conn = gripql.Connection("https://bmeg.io/api", credential_file="/tmp/bmeg_credentials.json")
O = conn.graph("bmeg_rc1_2")
```

Find all of the aliquots in the [CTRP](https://portals.broadinstitute.org/ctrp/) experiment


```python
q = O.query().V("Program:CTRP").in_("InProgram").in_("InProject").in_("SampleFor").in_("AliquotFor").distinct("_gid")
all_aliquots = []
for row in q:
    all_aliquots.append(row.gid)
```

    [INFO]	2019-03-11 16:27:26,999	841 results received in 0 seconds


For the genes of interest, get Ensembl gene ids, from the HUGO symbols


```python
GENES = ["CDKN2A", "PTEN", "TP53", "SMAD4"]
```


```python
gene_ids = {}
for g in GENES:
    for i in O.query().V().hasLabel("Gene").has(gripql.eq("symbol", g)):
        gene_ids[g] = i.gid
```

    [INFO]	2019-03-11 16:27:27,225	1 results received in 0 seconds
    [INFO]	2019-03-11 16:27:27,399	1 results received in 0 seconds
    [INFO]	2019-03-11 16:27:27,576	1 results received in 0 seconds
    [INFO]	2019-03-11 16:27:27,752	1 results received in 0 seconds



```python
gene_ids
```




    {'CDKN2A': 'ENSG00000147889',
     'PTEN': 'ENSG00000171862',
     'TP53': 'ENSG00000141510',
     'SMAD4': 'ENSG00000141646'}



For each of the genes, find the set of samples that have a mutation in that gene


```python
mut_samples = {}
norm_samples = {}

q = O.query().V(all_aliquots).as_("sample").in_("CallsetFor").outE("AlleleCall")
q = q.has(gripql.within("ensembl_gene", list(gene_ids.values()))).as_("variant")
q = q.render({"sample" : "$sample._gid", "gene" : "$variant._data.ensembl_gene"})

for res in q:
    mut_samples[res.gene] = mut_samples.get(res.gene, set()) | set([res.sample])

#get CCLE samples without mutation    
for i in gene_ids.values():
    norm_samples[i] = list(set(all_aliquots).difference(mut_samples[i]))

    print( "%s Positive Set: %d" % (i, len(mut_samples[i])) )
    print( "%s Negative Set: %d" % (i, len(norm_samples[i])) )

```

    [INFO]	2019-03-11 16:27:48,969	1,198 results received in 21 seconds


    ENSG00000147889 Positive Set: 99
    ENSG00000147889 Negative Set: 742
    ENSG00000171862 Positive Set: 120
    ENSG00000171862 Negative Set: 721
    ENSG00000141510 Positive Set: 597
    ENSG00000141510 Negative Set: 244
    ENSG00000141646 Positive Set: 69
    ENSG00000141646 Negative Set: 772



```python
pos_response = {}
for g in gene_ids.values():
    pos_response[g] = {}
    q = O.query().V(list(mut_samples[g])).in_("ResponseIn").has(gripql.eq("source", "CTRP")).as_("a").out("ResponseTo").as_("b").select(["a", "b"])
    for row in q:
        v = row['a']['data']['act_area']
        compound = row['b']['gid']
        if compound not in pos_response[g]:
            pos_response[g][compound] = [ v ]
        else:
            pos_response[g][compound].append(v)
   
```

    [INFO]	2019-03-11 16:28:07,266	45,065 results received in 18 seconds
    [INFO]	2019-03-11 16:28:28,027	52,559 results received in 20 seconds
    [INFO]	2019-03-11 16:30:08,716	261,093 results received in 100 seconds
    [INFO]	2019-03-11 16:30:19,911	30,334 results received in 11 seconds



```python
neg_response = {}
for g in gene_ids.values():
    neg_response[g] = {}
    q = O.query().V(list(norm_samples[g])).in_("ResponseIn").has(gripql.eq("source", "CTRP")).as_("a").out("ResponseTo").as_("b").select(["a", "b"])
    for row in q:
        v = row['a']['data']['act_area']
        compound = row['b']['gid']
        if compound not in neg_response[g]:
            neg_response[g][compound] = [ v ]
        else:
            neg_response[g][compound].append(v)
   
```

    [INFO]	2019-03-11 16:32:24,361	321,190 results received in 124 seconds
    [INFO]	2019-03-11 16:34:41,644	313,696 results received in 137 seconds
    [INFO]	2019-03-11 16:35:22,911	105,162 results received in 41 seconds
    [INFO]	2019-03-11 16:37:35,496	335,921 results received in 132 seconds



```python
drugs = set(itertools.chain.from_iterable( i.keys() for i in pos_response.values() ))
out = []
for drug in drugs:
    for g in gene_ids.values():
        if drug in pos_response[g] and drug in neg_response[g]:
            row = {"drug" : drug, "mutation" : g}
            mut_values = pos_response[g][drug]
            norm_values = neg_response[g][drug]
            if len(mut_values) > 5 and len(norm_values) > 5:
                s = stats.ttest_ind(mut_values, norm_values, equal_var=False)
                row["t-statistic"] = s.statistic
                row["t-pvalue"] = s.pvalue
                s = stats.f_oneway(mut_values, norm_values)
                row["a-statistic"] = s.statistic
                row["a-pvalue"] = s.pvalue
                out.append(row)
```


```python
pandas.DataFrame(out, columns=["drug", "mutation", "t-statistic", "t-pvalue", "a-statistic", "a-pvalue"]).sort_values("a-pvalue").head(30)
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
      <th>drug</th>
      <th>mutation</th>
      <th>t-statistic</th>
      <th>t-pvalue</th>
      <th>a-statistic</th>
      <th>a-pvalue</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1038</th>
      <td>Compound:CID11433190</td>
      <td>ENSG00000141510</td>
      <td>13.047139</td>
      <td>5.317522e-31</td>
      <td>259.778790</td>
      <td>1.184247e-50</td>
    </tr>
    <tr>
      <th>1845</th>
      <td>Compound:CID10127622</td>
      <td>ENSG00000171862</td>
      <td>14.762042</td>
      <td>7.981893e-47</td>
      <td>179.304787</td>
      <td>1.641445e-40</td>
    </tr>
    <tr>
      <th>1846</th>
      <td>Compound:CID10127622</td>
      <td>ENSG00000141510</td>
      <td>10.688355</td>
      <td>2.465168e-26</td>
      <td>127.405960</td>
      <td>2.358116e-29</td>
    </tr>
    <tr>
      <th>1338</th>
      <td>Compound:CID24978538</td>
      <td>ENSG00000141510</td>
      <td>7.740424</td>
      <td>1.240948e-14</td>
      <td>63.907146</td>
      <td>1.483366e-15</td>
    </tr>
    <tr>
      <th>1510</th>
      <td>Compound:CID11609586</td>
      <td>ENSG00000141510</td>
      <td>6.241976</td>
      <td>8.088568e-10</td>
      <td>52.314159</td>
      <td>7.472634e-13</td>
    </tr>
    <tr>
      <th>693</th>
      <td>Compound:CHEMBL401930</td>
      <td>ENSG00000171862</td>
      <td>8.302645</td>
      <td>2.440095e-14</td>
      <td>49.757986</td>
      <td>3.862614e-12</td>
    </tr>
    <tr>
      <th>1336</th>
      <td>Compound:CID24978538</td>
      <td>ENSG00000147889</td>
      <td>6.527219</td>
      <td>9.533273e-11</td>
      <td>40.010125</td>
      <td>2.659870e-10</td>
    </tr>
    <tr>
      <th>558</th>
      <td>Compound:CID31703</td>
      <td>ENSG00000141510</td>
      <td>5.785938</td>
      <td>1.071401e-08</td>
      <td>39.482605</td>
      <td>4.256624e-10</td>
    </tr>
    <tr>
      <th>1339</th>
      <td>Compound:CID24978538</td>
      <td>ENSG00000141646</td>
      <td>6.429776</td>
      <td>2.146093e-10</td>
      <td>34.934173</td>
      <td>3.547833e-09</td>
    </tr>
    <tr>
      <th>549</th>
      <td>Compound:CID9825149</td>
      <td>ENSG00000171862</td>
      <td>5.932992</td>
      <td>1.955910e-08</td>
      <td>33.090768</td>
      <td>1.266485e-08</td>
    </tr>
    <tr>
      <th>1901</th>
      <td>Compound:CID12003241</td>
      <td>ENSG00000171862</td>
      <td>6.056617</td>
      <td>9.415681e-09</td>
      <td>31.770410</td>
      <td>2.396710e-08</td>
    </tr>
    <tr>
      <th>917</th>
      <td>Compound:CID16038120</td>
      <td>ENSG00000171862</td>
      <td>6.327688</td>
      <td>2.345613e-09</td>
      <td>28.930932</td>
      <td>9.928930e-08</td>
    </tr>
    <tr>
      <th>709</th>
      <td>Compound:CHEMBL1091644</td>
      <td>ENSG00000171862</td>
      <td>7.158885</td>
      <td>1.212246e-11</td>
      <td>27.669131</td>
      <td>1.856315e-07</td>
    </tr>
    <tr>
      <th>1450</th>
      <td>Compound:CID11626560</td>
      <td>ENSG00000141510</td>
      <td>4.969099</td>
      <td>8.227653e-07</td>
      <td>25.591613</td>
      <td>4.718561e-07</td>
    </tr>
    <tr>
      <th>494</th>
      <td>Compound:CID44462760</td>
      <td>ENSG00000141510</td>
      <td>3.845680</td>
      <td>1.844618e-04</td>
      <td>25.876791</td>
      <td>5.647977e-07</td>
    </tr>
    <tr>
      <th>374</th>
      <td>Compound:CID11717001</td>
      <td>ENSG00000141510</td>
      <td>4.286482</td>
      <td>2.411596e-05</td>
      <td>24.598161</td>
      <td>8.679683e-07</td>
    </tr>
    <tr>
      <th>1656</th>
      <td>Compound:CID16722836</td>
      <td>ENSG00000147889</td>
      <td>4.586444</td>
      <td>1.142000e-05</td>
      <td>24.162761</td>
      <td>1.078975e-06</td>
    </tr>
    <tr>
      <th>1101</th>
      <td>Compound:CID10231331</td>
      <td>ENSG00000171862</td>
      <td>5.831482</td>
      <td>2.502220e-08</td>
      <td>23.939656</td>
      <td>1.200220e-06</td>
    </tr>
    <tr>
      <th>1073</th>
      <td>Compound:CID24785538</td>
      <td>ENSG00000171862</td>
      <td>6.561520</td>
      <td>3.916417e-10</td>
      <td>23.661479</td>
      <td>1.385508e-06</td>
    </tr>
    <tr>
      <th>293</th>
      <td>Compound:CID5328940</td>
      <td>ENSG00000171862</td>
      <td>4.952539</td>
      <td>1.930155e-06</td>
      <td>23.299296</td>
      <td>1.668798e-06</td>
    </tr>
    <tr>
      <th>1965</th>
      <td>Compound:CID11707110</td>
      <td>ENSG00000171862</td>
      <td>6.957522</td>
      <td>1.812686e-10</td>
      <td>23.331620</td>
      <td>1.950337e-06</td>
    </tr>
    <tr>
      <th>1473</th>
      <td>Compound:CID176870</td>
      <td>ENSG00000171862</td>
      <td>5.251573</td>
      <td>2.702363e-07</td>
      <td>19.892882</td>
      <td>8.791931e-06</td>
    </tr>
    <tr>
      <th>1781</th>
      <td>Compound:CID10184653</td>
      <td>ENSG00000171862</td>
      <td>4.889542</td>
      <td>2.639552e-06</td>
      <td>18.957445</td>
      <td>1.534211e-05</td>
    </tr>
    <tr>
      <th>949</th>
      <td>Compound:CID9915743</td>
      <td>ENSG00000171862</td>
      <td>4.919408</td>
      <td>1.938827e-06</td>
      <td>17.633489</td>
      <td>2.977588e-05</td>
    </tr>
    <tr>
      <th>1244</th>
      <td>Compound:CID451668</td>
      <td>ENSG00000147889</td>
      <td>5.080006</td>
      <td>5.546808e-07</td>
      <td>16.400735</td>
      <td>5.290745e-05</td>
    </tr>
    <tr>
      <th>1844</th>
      <td>Compound:CID10127622</td>
      <td>ENSG00000147889</td>
      <td>-4.226107</td>
      <td>2.518708e-05</td>
      <td>16.273715</td>
      <td>5.526157e-05</td>
    </tr>
    <tr>
      <th>1134</th>
      <td>Compound:CID6253</td>
      <td>ENSG00000141510</td>
      <td>3.863943</td>
      <td>1.304145e-04</td>
      <td>16.169516</td>
      <td>6.347135e-05</td>
    </tr>
    <tr>
      <th>1657</th>
      <td>Compound:CID16722836</td>
      <td>ENSG00000171862</td>
      <td>4.043392</td>
      <td>8.329122e-05</td>
      <td>16.168543</td>
      <td>6.356201e-05</td>
    </tr>
    <tr>
      <th>1350</th>
      <td>Compound:CID24180719</td>
      <td>ENSG00000141510</td>
      <td>3.209481</td>
      <td>1.473440e-03</td>
      <td>14.775437</td>
      <td>1.308989e-04</td>
    </tr>
    <tr>
      <th>1062</th>
      <td>Compound:CID6505803</td>
      <td>ENSG00000141510</td>
      <td>3.573446</td>
      <td>3.677986e-04</td>
      <td>14.626433</td>
      <td>1.345047e-04</td>
    </tr>
  </tbody>
</table>
</div>




```python

```
