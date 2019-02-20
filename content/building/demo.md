---
title: Demo
---

# Interactive queries


{{< code file="curl-example">}}curl{{% curl-token %}} {{%api_url%}}api/v1/graph{{< /code >}}

<br/>

{{< code file="python-example.html">}}wget {{%api_url%}}_token.json -O ~/bmeg_credentials.json
GRIP_CREDENTIAL_FILE=~/bmeg_credentials.json python
from gripql.graph import Graph
g = Graph(url='{{%api_url%}}api', graph='bmeg_test')
g.listIndices()
{{< /code >}}
