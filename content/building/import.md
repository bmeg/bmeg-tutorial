---
title: Data Import
menu:
  main:
    parent: Building Graph
    weight: 2
---


# Data Import

All data import is done via [CWL](http://www.commonwl.org) wrapped docker containers.

# Write the schema
From [BMEG Phenotype Schema](https://github.com/biostream/phenotype-schema/blob/master/phenotype.proto)
```
message GeneOntologyTerm {
  string id = 1;
  string name = 2;
  string namespace = 3;
  string definition = 4;
  string comment = 5;
  repeated string synonym = 6;
  repeated string is_a = 7;
  repeated string alt_id = 8;
  repeated string subset = 9;
  repeated string xref = 10;
  bool is_obsolete = 11;
  repeated string consider = 12;
}
```

# Create Python code based on the schema
```
protoc \
-I . -I ../ga4gh-schemas/src/main/proto/ \
--python_out=../ \
phenotype.proto
```

## Write a converter script

```
#!/usr/bin/env python

import re
import sys
import json
import phenotype_pb2
from google.protobuf import json_format

re_section = re.compile(r'^\[(.*)\]')
re_field = re.compile(r'^(\w+): (.*)$')

def obo_parse(handle):

    rec = None
    for line in handle:
        res = re_section.search(line)
        if res:
            if rec is not None:
                yield rec
            rec = None
            if res.group(1) == "Term":
                rec = {"type":res.group(1)}
        else:
            if rec is not None:
                res = re_field.search(line)
                if res:
                    key = res.group(1)
                    val = res.group(2)
                    val = val.split(" ! ")[0]
                    if key in rec:
                        rec[key].append(val)
                    else:
                        rec[key] = [val]

    if rec is not None:
        yield rec

def unquote(s):
    res = re.search(r'"(.*)"', s)
    if res:
        return res.group(1)
    return s

def message_to_json(message):
    msg = json_format.MessageToDict(message, preserving_proto_field_name=True)
    return json.dumps(msg)

if __name__ == "__main__":

    with open(sys.argv[1]) as handle:
        for rec in obo_parse(handle):
            go = phenotype_pb2.GeneOntologyTerm()
            go.id = rec['id'][0]
            go.name = rec['name'][0]
            go.namespace = rec['namespace'][0]
            go.definition = unquote(rec['def'][0])
            if 'synonym' in rec:
                for i in rec['synonym']:
                    go.synonym.append(unquote(i))
            if 'is_a' in rec:
                for i in rec['is_a']:
                    go.is_a.append(i)
            if 'xref' in rec:
                for i in rec['xref']:
                    go.xref.append(i.split(" ")[0])
            print message_to_json(go)
```

## Declare Docker
```
FROM python:2.7
RUN pip install protobuf
COPY *.py /opt/
COPY ga4gh/*.py /opt/ga4gh/
```


## Write CWL Wrapper

```

cwlVersion: v1.0
class: CommandLineTool
hints:
  DockerRequirement:
    dockerPull: go-transform:latest

baseCommand:
  - python
  - /opt/go_obo2schema.py

inputs:
  OBO:
    type: File
    inputBinding:
      position: 1

outputs:
  GO_JSON:
    type: stdout

stdout: go.json
```