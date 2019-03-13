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

conn = gripql.Connection("http://grip.compbio.ohsu.edu")
O = conn.graph("bmeg_rc1_2")
```


```python
q = O.query().V("Program:CCLE").in_("InProgram").in_("InProject").in_("SampleFor").in_("AliquotFor")
all_aliquots = []
for row in q:
    all_aliquots.append(row.gid)
```

    [INFO]	2019-02-20 16:57:22,605	504 results received in 0 seconds



```python
GENES = ["CDKN2A", "PTEN", "TP53", "SMAD4"]
```


```python
gene_ids = {}
for g in GENES:
    for i in O.query().V().hasLabel("Gene").has(gripql.eq("symbol", g)):
        gene_ids[g] = i.gid
```

    [INFO]	2019-02-20 16:57:22,750	1 results received in 0 seconds
    [INFO]	2019-02-20 16:57:22,883	1 results received in 0 seconds
    [INFO]	2019-02-20 16:57:23,014	1 results received in 0 seconds
    [INFO]	2019-02-20 16:57:23,145	1 results received in 0 seconds



```python
gene_ids
```




    {'CDKN2A': 'ENSG00000147889',
     'PTEN': 'ENSG00000171862',
     'TP53': 'ENSG00000141510',
     'SMAD4': 'ENSG00000141646'}




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

    [INFO]	2019-02-20 16:57:29,279	673 results received in 6 seconds


    ENSG00000147889 Positive Set: 69
    ENSG00000147889 Negative Set: 435
    ENSG00000171862 Positive Set: 76
    ENSG00000171862 Negative Set: 428
    ENSG00000141510 Positive Set: 357
    ENSG00000141510 Negative Set: 147
    ENSG00000141646 Positive Set: 39
    ENSG00000141646 Negative Set: 465



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

    [INFO]	2019-02-20 16:57:44,006	30,074 results received in 14 seconds
    [INFO]	2019-02-20 16:57:59,881	32,137 results received in 15 seconds
    [INFO]	2019-02-20 16:59:07,251	146,042 results received in 67 seconds
    [INFO]	2019-02-20 16:59:15,939	17,933 results received in 8 seconds



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

    [INFO]	2019-02-20 17:00:35,445	169,815 results received in 79 seconds
    [INFO]	2019-02-20 17:01:55,601	167,752 results received in 80 seconds
    [INFO]	2019-02-20 17:02:20,688	53,847 results received in 25 seconds
    [INFO]	2019-02-20 17:03:44,473	181,956 results received in 83 seconds



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
pandas.DataFrame(out, columns=["drug", "mutation", "t-statistic", "t-pvalue", "a-statistic", "a-pvalue"]).sort_values("a-pvalue")
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
      <th>574</th>
      <td>Compound:CID10127622</td>
      <td>ENSG00000141510</td>
      <td>12.882003</td>
      <td>1.245427e-36</td>
      <td>184.807516</td>
      <td>2.327147e-41</td>
    </tr>
    <tr>
      <th>769</th>
      <td>Compound:CID11433190</td>
      <td>ENSG00000141510</td>
      <td>9.700591</td>
      <td>1.811754e-17</td>
      <td>152.563635</td>
      <td>3.455239e-30</td>
    </tr>
    <tr>
      <th>573</th>
      <td>Compound:CID10127622</td>
      <td>ENSG00000171862</td>
      <td>10.166484</td>
      <td>2.334855e-23</td>
      <td>89.182738</td>
      <td>5.377786e-21</td>
    </tr>
    <tr>
      <th>62</th>
      <td>Compound:CID11717001</td>
      <td>ENSG00000141510</td>
      <td>5.298232</td>
      <td>4.338974e-07</td>
      <td>43.765050</td>
      <td>1.113371e-10</td>
    </tr>
    <tr>
      <th>468</th>
      <td>Compound:CHEMBL401930</td>
      <td>ENSG00000171862</td>
      <td>6.515571</td>
      <td>1.631341e-09</td>
      <td>28.139904</td>
      <td>1.837929e-07</td>
    </tr>
    <tr>
      <th>1817</th>
      <td>Compound:CID24978538</td>
      <td>ENSG00000147889</td>
      <td>5.279545</td>
      <td>1.610209e-07</td>
      <td>27.066078</td>
      <td>2.054418e-07</td>
    </tr>
    <tr>
      <th>98</th>
      <td>Compound:CID11626560</td>
      <td>ENSG00000141510</td>
      <td>5.032685</td>
      <td>7.502575e-07</td>
      <td>27.348135</td>
      <td>2.143673e-07</td>
    </tr>
    <tr>
      <th>1061</th>
      <td>Compound:CID44462760</td>
      <td>ENSG00000141510</td>
      <td>3.849080</td>
      <td>2.647069e-04</td>
      <td>27.806434</td>
      <td>3.247028e-07</td>
    </tr>
    <tr>
      <th>1843</th>
      <td>Compound:CID31703</td>
      <td>ENSG00000141510</td>
      <td>4.941254</td>
      <td>1.150275e-06</td>
      <td>26.332060</td>
      <td>3.554195e-07</td>
    </tr>
    <tr>
      <th>969</th>
      <td>Compound:CID6505803</td>
      <td>ENSG00000141510</td>
      <td>4.334796</td>
      <td>1.730668e-05</td>
      <td>21.030566</td>
      <td>4.963309e-06</td>
    </tr>
    <tr>
      <th>1037</th>
      <td>Compound:CID10231331</td>
      <td>ENSG00000141510</td>
      <td>4.056189</td>
      <td>7.455309e-05</td>
      <td>20.084720</td>
      <td>9.490546e-06</td>
    </tr>
    <tr>
      <th>936</th>
      <td>Compound:CID9825149</td>
      <td>ENSG00000171862</td>
      <td>4.423001</td>
      <td>2.592948e-05</td>
      <td>19.472324</td>
      <td>1.300546e-05</td>
    </tr>
    <tr>
      <th>988</th>
      <td>Compound:CID12003241</td>
      <td>ENSG00000171862</td>
      <td>4.634551</td>
      <td>1.056798e-05</td>
      <td>18.377951</td>
      <td>2.229591e-05</td>
    </tr>
    <tr>
      <th>1208</th>
      <td>Compound:CID16038120</td>
      <td>ENSG00000171862</td>
      <td>4.632148</td>
      <td>1.098644e-05</td>
      <td>17.667399</td>
      <td>3.210572e-05</td>
    </tr>
    <tr>
      <th>568</th>
      <td>Compound:CID16722836</td>
      <td>ENSG00000147889</td>
      <td>3.999909</td>
      <td>1.361742e-04</td>
      <td>17.400366</td>
      <td>3.665959e-05</td>
    </tr>
    <tr>
      <th>445</th>
      <td>Compound:CID24180719</td>
      <td>ENSG00000141510</td>
      <td>3.289858</td>
      <td>1.264154e-03</td>
      <td>17.277036</td>
      <td>3.908621e-05</td>
    </tr>
    <tr>
      <th>1634</th>
      <td>Compound:CID5284616</td>
      <td>ENSG00000147889</td>
      <td>4.136021</td>
      <td>5.410692e-05</td>
      <td>15.882512</td>
      <td>7.299370e-05</td>
    </tr>
    <tr>
      <th>767</th>
      <td>Compound:CID11433190</td>
      <td>ENSG00000147889</td>
      <td>5.887768</td>
      <td>2.600025e-08</td>
      <td>16.003428</td>
      <td>7.449141e-05</td>
    </tr>
    <tr>
      <th>881</th>
      <td>Compound:CID25161177</td>
      <td>ENSG00000141510</td>
      <td>3.596193</td>
      <td>5.261183e-04</td>
      <td>15.937116</td>
      <td>8.973606e-05</td>
    </tr>
    <tr>
      <th>875</th>
      <td>Compound:CID451668</td>
      <td>ENSG00000147889</td>
      <td>4.910433</td>
      <td>1.418176e-06</td>
      <td>14.795144</td>
      <td>1.257099e-04</td>
    </tr>
    <tr>
      <th>216</th>
      <td>Compound:NO_ONTOLOGY~JQ-1</td>
      <td>ENSG00000147889</td>
      <td>4.536002</td>
      <td>1.575195e-05</td>
      <td>14.836807</td>
      <td>1.350707e-04</td>
    </tr>
    <tr>
      <th>1391</th>
      <td>Compound:CID24970400</td>
      <td>ENSG00000147889</td>
      <td>3.352078</td>
      <td>1.226150e-03</td>
      <td>14.640780</td>
      <td>1.492116e-04</td>
    </tr>
    <tr>
      <th>84</th>
      <td>Compound:CID9903786</td>
      <td>ENSG00000147889</td>
      <td>4.685372</td>
      <td>8.225341e-06</td>
      <td>14.517238</td>
      <td>1.592260e-04</td>
    </tr>
    <tr>
      <th>765</th>
      <td>Compound:CID11609586</td>
      <td>ENSG00000141510</td>
      <td>3.396303</td>
      <td>7.682307e-04</td>
      <td>14.232278</td>
      <td>1.731396e-04</td>
    </tr>
    <tr>
      <th>1819</th>
      <td>Compound:CID24978538</td>
      <td>ENSG00000141510</td>
      <td>3.682249</td>
      <td>2.370057e-04</td>
      <td>14.028056</td>
      <td>1.823775e-04</td>
    </tr>
    <tr>
      <th>1036</th>
      <td>Compound:CID10231331</td>
      <td>ENSG00000171862</td>
      <td>4.344480</td>
      <td>3.055481e-05</td>
      <td>14.177140</td>
      <td>1.892935e-04</td>
    </tr>
    <tr>
      <th>494</th>
      <td>Compound:CID24785538</td>
      <td>ENSG00000171862</td>
      <td>4.798919</td>
      <td>4.312851e-06</td>
      <td>13.946084</td>
      <td>2.133912e-04</td>
    </tr>
    <tr>
      <th>1687</th>
      <td>Compound:CID5328940</td>
      <td>ENSG00000171862</td>
      <td>3.724283</td>
      <td>3.296095e-04</td>
      <td>13.660248</td>
      <td>2.475528e-04</td>
    </tr>
    <tr>
      <th>1671</th>
      <td>Compound:CID10184653</td>
      <td>ENSG00000171862</td>
      <td>4.506876</td>
      <td>1.785473e-05</td>
      <td>13.376562</td>
      <td>2.899453e-04</td>
    </tr>
    <tr>
      <th>152</th>
      <td>Compound:CID15953870</td>
      <td>ENSG00000147889</td>
      <td>3.853358</td>
      <td>2.172215e-04</td>
      <td>13.253834</td>
      <td>3.050655e-04</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>263</th>
      <td>Compound:CID104741</td>
      <td>ENSG00000141646</td>
      <td>-0.025208</td>
      <td>9.803894e-01</td>
      <td>0.000527</td>
      <td>9.817308e-01</td>
    </tr>
    <tr>
      <th>593</th>
      <td>Compound:CID44153236</td>
      <td>ENSG00000141510</td>
      <td>-0.022522</td>
      <td>9.823373e-01</td>
      <td>0.000515</td>
      <td>9.820021e-01</td>
    </tr>
    <tr>
      <th>976</th>
      <td>Compound:CID753704</td>
      <td>ENSG00000171862</td>
      <td>0.019000</td>
      <td>9.848849e-01</td>
      <td>0.000466</td>
      <td>9.827954e-01</td>
    </tr>
    <tr>
      <th>1440</th>
      <td>Compound:NO_ONTOLOGY~BRD-K50799972</td>
      <td>ENSG00000171862</td>
      <td>-0.022128</td>
      <td>9.823916e-01</td>
      <td>0.000449</td>
      <td>9.831119e-01</td>
    </tr>
    <tr>
      <th>1870</th>
      <td>Compound:CID6917907</td>
      <td>ENSG00000171862</td>
      <td>-0.019673</td>
      <td>9.843444e-01</td>
      <td>0.000391</td>
      <td>9.842274e-01</td>
    </tr>
    <tr>
      <th>746</th>
      <td>Compound:CID2729026</td>
      <td>ENSG00000141646</td>
      <td>-0.017164</td>
      <td>9.863881e-01</td>
      <td>0.000391</td>
      <td>9.842310e-01</td>
    </tr>
    <tr>
      <th>1724</th>
      <td>Compound:CID9813758</td>
      <td>ENSG00000141646</td>
      <td>0.023271</td>
      <td>9.815269e-01</td>
      <td>0.000368</td>
      <td>9.846942e-01</td>
    </tr>
    <tr>
      <th>1012</th>
      <td>Compound:CID159324</td>
      <td>ENSG00000171862</td>
      <td>0.017702</td>
      <td>9.859012e-01</td>
      <td>0.000362</td>
      <td>9.848300e-01</td>
    </tr>
    <tr>
      <th>330</th>
      <td>Compound:CID46881063</td>
      <td>ENSG00000141646</td>
      <td>-0.013607</td>
      <td>9.895265e-01</td>
      <td>0.000353</td>
      <td>9.851108e-01</td>
    </tr>
    <tr>
      <th>1025</th>
      <td>Compound:NO_ONTOLOGY~CIL55</td>
      <td>ENSG00000141510</td>
      <td>0.016883</td>
      <td>9.865703e-01</td>
      <td>0.000274</td>
      <td>9.868151e-01</td>
    </tr>
    <tr>
      <th>380</th>
      <td>Compound:CID579114</td>
      <td>ENSG00000171862</td>
      <td>-0.014674</td>
      <td>9.883263e-01</td>
      <td>0.000253</td>
      <td>9.873082e-01</td>
    </tr>
    <tr>
      <th>1350</th>
      <td>Compound:CID72199292</td>
      <td>ENSG00000141646</td>
      <td>0.013329</td>
      <td>9.894519e-01</td>
      <td>0.000249</td>
      <td>9.874124e-01</td>
    </tr>
    <tr>
      <th>1135</th>
      <td>Compound:CID446155</td>
      <td>ENSG00000147889</td>
      <td>-0.015256</td>
      <td>9.878624e-01</td>
      <td>0.000245</td>
      <td>9.875175e-01</td>
    </tr>
    <tr>
      <th>1825</th>
      <td>Compound:CID44607531</td>
      <td>ENSG00000147889</td>
      <td>-0.013057</td>
      <td>9.896183e-01</td>
      <td>0.000243</td>
      <td>9.875749e-01</td>
    </tr>
    <tr>
      <th>1575</th>
      <td>Compound:CID16741245</td>
      <td>ENSG00000147889</td>
      <td>0.015907</td>
      <td>9.873437e-01</td>
      <td>0.000241</td>
      <td>9.876212e-01</td>
    </tr>
    <tr>
      <th>802</th>
      <td>Compound:NO_ONTOLOGY~BRD-A02303741</td>
      <td>ENSG00000141646</td>
      <td>0.018543</td>
      <td>9.852809e-01</td>
      <td>0.000229</td>
      <td>9.879303e-01</td>
    </tr>
    <tr>
      <th>850</th>
      <td>Compound:NO_ONTOLOGY~BRD-K55116708</td>
      <td>ENSG00000141646</td>
      <td>0.016203</td>
      <td>9.871452e-01</td>
      <td>0.000214</td>
      <td>9.883333e-01</td>
    </tr>
    <tr>
      <th>742</th>
      <td>Compound:CID123631</td>
      <td>ENSG00000141646</td>
      <td>0.017328</td>
      <td>9.862423e-01</td>
      <td>0.000205</td>
      <td>9.885847e-01</td>
    </tr>
    <tr>
      <th>1144</th>
      <td>Compound:CHEMBL560895</td>
      <td>ENSG00000171862</td>
      <td>0.012277</td>
      <td>9.902289e-01</td>
      <td>0.000145</td>
      <td>9.903886e-01</td>
    </tr>
    <tr>
      <th>45</th>
      <td>Compound:NO_ONTOLOGY~BRD-K13185470</td>
      <td>ENSG00000171862</td>
      <td>0.013220</td>
      <td>9.895113e-01</td>
      <td>0.000101</td>
      <td>9.919973e-01</td>
    </tr>
    <tr>
      <th>1958</th>
      <td>Compound:CID9868037</td>
      <td>ENSG00000171862</td>
      <td>0.008969</td>
      <td>9.928662e-01</td>
      <td>0.000084</td>
      <td>9.926813e-01</td>
    </tr>
    <tr>
      <th>661</th>
      <td>Compound:NO_ONTOLOGY~NPC-26</td>
      <td>ENSG00000141510</td>
      <td>0.008456</td>
      <td>9.932614e-01</td>
      <td>0.000073</td>
      <td>9.932054e-01</td>
    </tr>
    <tr>
      <th>277</th>
      <td>Compound:CID11626927</td>
      <td>ENSG00000171862</td>
      <td>0.005134</td>
      <td>9.959158e-01</td>
      <td>0.000030</td>
      <td>9.956463e-01</td>
    </tr>
    <tr>
      <th>1355</th>
      <td>Compound:CID462382</td>
      <td>ENSG00000147889</td>
      <td>0.005403</td>
      <td>9.957119e-01</td>
      <td>0.000026</td>
      <td>9.959135e-01</td>
    </tr>
    <tr>
      <th>1392</th>
      <td>Compound:CID24970400</td>
      <td>ENSG00000171862</td>
      <td>-0.004458</td>
      <td>9.964520e-01</td>
      <td>0.000021</td>
      <td>9.963606e-01</td>
    </tr>
    <tr>
      <th>1164</th>
      <td>Compound:CID49846579</td>
      <td>ENSG00000171862</td>
      <td>0.004761</td>
      <td>9.962129e-01</td>
      <td>0.000016</td>
      <td>9.967788e-01</td>
    </tr>
    <tr>
      <th>987</th>
      <td>Compound:CID12003241</td>
      <td>ENSG00000147889</td>
      <td>-0.003325</td>
      <td>9.973544e-01</td>
      <td>0.000010</td>
      <td>9.974286e-01</td>
    </tr>
    <tr>
      <th>448</th>
      <td>Compound:NO_ONTOLOGY~BRD-K03911514</td>
      <td>ENSG00000171862</td>
      <td>-0.003166</td>
      <td>9.974846e-01</td>
      <td>0.000009</td>
      <td>9.976415e-01</td>
    </tr>
    <tr>
      <th>157</th>
      <td>Compound:CHEMBL3120215</td>
      <td>ENSG00000171862</td>
      <td>-0.001394</td>
      <td>9.988901e-01</td>
      <td>0.000001</td>
      <td>9.990587e-01</td>
    </tr>
    <tr>
      <th>69</th>
      <td>Compound:NO_ONTOLOGY~methylstat</td>
      <td>ENSG00000171862</td>
      <td>-0.001249</td>
      <td>9.990066e-01</td>
      <td>0.000001</td>
      <td>9.991234e-01</td>
    </tr>
  </tbody>
</table>
<p>1977 rows × 6 columns</p>
</div>




```python

```
