### This is the code that was used in the BMEG Beginner Tutorial. When a gmail account is created and a Google Colab document is formed, this code can be copied and pasted to it. Then a link to the Google Colab document needs to be pasted onto the BMEG tutorial document. There is a place in the BMEG Beginner Tutorial where it says "OPTION" and gives instructions on how to open the Google Colab page. That is where the link goes. 

```pip install gripql```
  
``` bash
# Make query using curl
curl -H "OauthEmail: <email>" -H "OauthAccessToken: <token>=" -H "OauthExpires: <length>" https://bmeg.io/api/v1/graph

# Create credential file
echo '{"OauthEmail":"<email>","OauthAccessToken":"<token>=","OauthExpires":<length>} ' > /tmp/bmeg_credentials.json
```

``` python
import gripql
import pandas as pd
import numpy as np
import os
```

``` python 
conn = gripql.Connection("https://bmeg.io/api", credential_file = '/tmp/bmeg_credentials.json')
G = conn.graph("bmeg_rc2") #specific schema version
```


``` python
p = []
# Start query at vertex and look for labels starting with Project
for row in G.query().V().hasLabel("Project"):
    if row.data.project_id.startswith("CCLE"):
        p.append(row.gid)
```

``` python
# Traverse through schema nodes
q = G.query().V(p).out("cases").as_("CASE").out("samples").out("aliquots").out("drug_response").as_("DRUGRESP").out("compounds").as_("COMP")

# Render node properties of interest (cell line, drug, EC50 value)
q = q.render(["$CASE._data.case_id", "$COMP._gid", "$DRUGRESP._data.ec50"])
```

``` python
data = {}
for row in q:
    # If cell line not in dict > add a new key to dict
    if row[0] not in data:
        data[row[0]] = { row[1] :  row[2] } 
    # If cell line already added to dict > add a new key to nested dict
    else:
        data[row[0]][row[1]] = row[2]
```

``` python
# Create pandas df
drugDF = pd.DataFrame(data)

# Sort rows by cell line name, sort cols by drug name 
drugDF = drugDF.sort_index().sort_index(axis=1) 
```

``` python
drugDF
```

``` python
# Save
output_path = "where-to-save-file"
ofn_drug = "name-of-drug-tsv"

os.chdir(output_path)
drugDF.to_csv(ofn_drug, sep="\t")
```
        
 
