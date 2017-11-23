---
title: Schema
menu:
  main:
    parent: Building Graph
    weight: 1
---

# Data Schema

Schemas for data in the BMEG are described using [ProtoBuffer](https://developers.google.com/protocol-buffers/)

## Schemas Used

 - [GA4GH Variants](https://github.com/ga4gh/ga4gh-schemas/blob/master/src/main/proto/ga4gh/variants.proto)
 - [GA4GH Genotype2Phenotype](https://github.com/ga4gh/ga4gh-schemas/blob/master/src/main/proto/ga4gh/genotype_phenotype.proto)
 - [BMEG Clinical data](https://github.com/biostream/clinical-schema/blob/master/clinical.proto)
 - [BMEG PFAM](https://github.com/biostream/pfam-schema/blob/master/pfam.proto)
 - [BMEG RNA Expression](https://github.com/biostream/rna-schema/blob/master/rna.proto)
 - [BMEG CNA Events](https://github.com/biostream/genome-schema/blob/master/cna.proto)
 - [BMEG Genome Description](https://github.com/biostream/genome-schema/blob/master/genome.proto)
 - [BMEG Phenotype and Drug Response](https://github.com/biostream/phenotype-schema/blob/master/phenotype.proto)
 - [BMEG PubMed](https://github.com/biostream/nlp-schema/blob/master/nlp.proto)
 - [BMEG Pathway](https://github.com/biostream/pathway-schema/blob/master/pathway.proto)
 
 
## Example Schema: Drug Response Data
```
message ResponseSummary {
  enum SummaryType {
    UNKNOWN = 0;
    EC50 = 1;
    IC50 = 2;
    LD50 = 3;
    GR50 = 4;
    AMAX = 5;
    AUC = 6;
    ACTIVITY_AREA = 7;
    RMSE = 8;
  }

  SummaryType type = 1;
  double value = 2;
  string unit = 3;
}

message CompoundElement {
  string compound = 1;
  double ratio = 3;
}

message ResponseCurve {
  enum ResponseType {
    UNKNOWN = 0;
    GROWTH = 1;
    ACTIVITY = 2;
  }

  string gid = 1;
  ResponseType responseType = 2;
  repeated DoseResponse values = 3;
  double growthStandard = 4;
  repeated CompoundElement compounds = 5;
  string sample = 6;
  repeated ResponseSummary summary = 7;
  repeated double controls = 8;
  repeated double blanks = 9;
}
```