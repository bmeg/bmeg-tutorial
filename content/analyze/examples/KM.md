---
title: Kaplan Meier
draft: True
authors:
- kellrott
tags:
- tcga
created_at: 2018-05-10
updated_at: 2018-05-10
tldr: Make Kaplan Meier curves using TCGA data
---

```python
%matplotlib inline
```


```python
from lifelines import KaplanMeierFitter
import pandas
import gripql
conn = gripql.Connection("http://grip.compbio.ohsu.edu")
O = conn.graph("bmeg_rc1_2")
```


```python
q = O.query().V("Project:TCGA-BRCA").in_("InProject")

print(list(q.limit(2)))

```

    [INFO]	2019-02-22 09:16:18,985	2 results received in 0 seconds


    [<AttrDict({'gid': 'Case:6412854a-f874-469e-9d1f-8bd3ae5bd41d', 'label': 'Case', 'data': {'case_id': '6412854a-f874-469e-9d1f-8bd3ae5bd41d', 'gdc_attributes': {'demographic': {'created_datetime': None, 'demographic_id': '28997563-c9b6-5c32-903e-28e75f989979', 'ethnicity': 'not reported', 'gender': 'female', 'race': 'not reported', 'state': 'released', 'submitter_id': 'TCGA-A8-A08R_demographic', 'updated_datetime': '2018-09-06T13:49:20.245333-05:00', 'year_of_birth': 1956, 'year_of_death': None}, 'diagnoses': [{'age_at_diagnosis': 19298, 'classification_of_tumor': 'not reported', 'created_datetime': None, 'days_to_birth': -19298, 'days_to_death': None, 'days_to_last_follow_up': 30, 'days_to_last_known_disease_status': None, 'days_to_recurrence': None, 'diagnosis_id': 'f22329f5-b763-5fce-b311-69dad473af6d', 'last_known_disease_status': 'not reported', 'morphology': '8500/3', 'primary_diagnosis': 'Infiltrating duct carcinoma, NOS', 'prior_malignancy': 'not reported', 'progression_or_recurrence': 'not reported', 'site_of_resection_or_biopsy': 'Breast, NOS', 'state': 'released', 'submitter_id': 'TCGA-A8-A08R_diagnosis', 'tissue_or_organ_of_origin': 'Breast, NOS', 'treatments': [{'created_datetime': None, 'state': 'released', 'submitter_id': 'TCGA-A8-A08R_treatment', 'therapeutic_agents': None, 'treatment_id': 'c4762fb7-f2d9-5816-88da-8959f56f7297', 'treatment_intent_type': None, 'treatment_or_therapy': None, 'updated_datetime': '2018-09-06T13:49:20.245333-05:00'}], 'tumor_grade': 'not reported', 'tumor_stage': 'stage iib', 'updated_datetime': '2018-09-06T13:49:20.245333-05:00', 'vital_status': 'alive'}], 'disease_type': 'Ductal and Lobular Neoplasms', 'primary_site': 'Breast', 'project': {'dbgap_accession_number': None, 'disease_type': ['Adnexal and Skin Appendage Neoplasms', 'Basal Cell Neoplasms', 'Adenomas and Adenocarcinomas', 'Cystic, Mucinous and Serous Neoplasms', 'Epithelial Neoplasms, NOS', 'Squamous Cell Neoplasms', 'Fibroepithelial Neoplasms', 'Ductal and Lobular Neoplasms', 'Complex Epithelial Neoplasms'], 'name': 'Breast Invasive Carcinoma', 'primary_site': ['Breast'], 'program': {'dbgap_accession_number': 'phs000178', 'name': 'TCGA', 'program_id': 'b80aa962-9650-5110-b3eb-bd087da808db'}, 'project_id': 'TCGA-BRCA', 'releasable': False, 'released': True, 'state': 'open'}, 'summary': {'data_categories': [{'data_category': 'Transcriptome Profiling', 'file_count': 5}, {'data_category': 'Copy Number Variation', 'file_count': 5}, {'data_category': 'Simple Nucleotide Variation', 'file_count': 16}, {'data_category': 'DNA Methylation', 'file_count': 1}, {'data_category': 'Clinical', 'file_count': 10}, {'data_category': 'Sequencing Reads', 'file_count': 4}, {'data_category': 'Biospecimen', 'file_count': 15}], 'experimental_strategies': [{'experimental_strategy': 'miRNA-Seq', 'file_count': 3}, {'experimental_strategy': 'WXS', 'file_count': 18}, {'experimental_strategy': 'Diagnostic Slide', 'file_count': 1}, {'experimental_strategy': 'RNA-Seq', 'file_count': 4}, {'experimental_strategy': 'Genotyping Array', 'file_count': 5}, {'experimental_strategy': 'Tissue Slide', 'file_count': 2}, {'experimental_strategy': 'Methylation Array', 'file_count': 1}], 'file_count': 56, 'file_size': 49626941422}}}})>, <AttrDict({'gid': 'Case:5c8983f2-9788-4dfa-971c-3ec457b6166e', 'label': 'Case', 'data': {'case_id': '5c8983f2-9788-4dfa-971c-3ec457b6166e', 'gdc_attributes': {'demographic': {'created_datetime': None, 'demographic_id': 'a47d87fc-196c-5d24-86a2-90f165aa83b5', 'ethnicity': 'not hispanic or latino', 'gender': 'female', 'race': 'black or african american', 'state': 'released', 'submitter_id': 'TCGA-A2-A0CL_demographic', 'updated_datetime': '2018-09-06T13:49:20.245333-05:00', 'year_of_birth': 1969, 'year_of_death': None}, 'diagnoses': [{'age_at_diagnosis': 13556, 'classification_of_tumor': 'not reported', 'created_datetime': None, 'days_to_birth': -13556, 'days_to_death': None, 'days_to_last_follow_up': 3015, 'days_to_last_known_disease_status': None, 'days_to_recurrence': None, 'diagnosis_id': '1ae80483-c3e1-59b1-858d-01b68c3581a2', 'last_known_disease_status': 'not reported', 'morphology': '8500/3', 'primary_diagnosis': 'Infiltrating duct carcinoma, NOS', 'prior_malignancy': 'not reported', 'progression_or_recurrence': 'not reported', 'site_of_resection_or_biopsy': 'Breast, NOS', 'state': 'released', 'submitter_id': 'TCGA-A2-A0CL_diagnosis', 'tissue_or_organ_of_origin': 'Breast, NOS', 'treatments': [{'created_datetime': None, 'state': 'released', 'submitter_id': 'TCGA-A2-A0CL_treatment', 'therapeutic_agents': None, 'treatment_id': '04b576e0-97a0-5b68-bf26-cdd790e155fa', 'treatment_intent_type': None, 'treatment_or_therapy': None, 'updated_datetime': '2018-09-06T13:49:20.245333-05:00'}], 'tumor_grade': 'not reported', 'tumor_stage': 'stage iiia', 'updated_datetime': '2018-09-06T13:49:20.245333-05:00', 'vital_status': 'alive'}], 'disease_type': 'Ductal and Lobular Neoplasms', 'primary_site': 'Breast', 'project': {'dbgap_accession_number': None, 'disease_type': ['Adnexal and Skin Appendage Neoplasms', 'Basal Cell Neoplasms', 'Adenomas and Adenocarcinomas', 'Cystic, Mucinous and Serous Neoplasms', 'Epithelial Neoplasms, NOS', 'Squamous Cell Neoplasms', 'Fibroepithelial Neoplasms', 'Ductal and Lobular Neoplasms', 'Complex Epithelial Neoplasms'], 'name': 'Breast Invasive Carcinoma', 'primary_site': ['Breast'], 'program': {'dbgap_accession_number': 'phs000178', 'name': 'TCGA', 'program_id': 'b80aa962-9650-5110-b3eb-bd087da808db'}, 'project_id': 'TCGA-BRCA', 'releasable': False, 'released': True, 'state': 'open'}, 'summary': {'data_categories': [{'data_category': 'Transcriptome Profiling', 'file_count': 5}, {'data_category': 'Copy Number Variation', 'file_count': 5}, {'data_category': 'Simple Nucleotide Variation', 'file_count': 16}, {'data_category': 'DNA Methylation', 'file_count': 1}, {'data_category': 'Clinical', 'file_count': 10}, {'data_category': 'Sequencing Reads', 'file_count': 4}, {'data_category': 'Biospecimen', 'file_count': 15}], 'experimental_strategies': [{'experimental_strategy': 'miRNA-Seq', 'file_count': 3}, {'experimental_strategy': 'WXS', 'file_count': 18}, {'experimental_strategy': 'Diagnostic Slide', 'file_count': 1}, {'experimental_strategy': 'RNA-Seq', 'file_count': 4}, {'experimental_strategy': 'Genotyping Array', 'file_count': 5}, {'experimental_strategy': 'Tissue Slide', 'file_count': 2}, {'experimental_strategy': 'Methylation Array', 'file_count': 1}], 'file_count': 56, 'file_size': 45891767846}}}})>]



```python

```




    <matplotlib.axes._subplots.AxesSubplot at 0x110c5f810>




![png](KM_files/KM_4_1.png)



```python

```
