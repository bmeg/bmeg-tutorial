---
title: Matrix
menu:
  main:
    parent: Queries
    weight: 4
---


Using BMEG to get matrix data


```
import ophion
import pandas
import json
import sys
from bmeg.ml_schema_pb2 import Model
from google.protobuf import json_format
import pandas
from scipy import stats
from sklearn.linear_model import LinearRegression, LogisticRegression
import numpy as np
```


# Download RNA-Seq for cohort:TCGA-READ

```
data = {}
for i in O.query().has("gid", "cohort:TCGA-READ").outgoing("hasSample").incoming("expressionFor").execute():
    if 'properties' in i and 'expressions' in i['properties']:
        data[i['gid']] = json.loads(i['properties']['expressions'])

expression_matrix = pandas.DataFrame(data).transpose().fillna(0.0)
```