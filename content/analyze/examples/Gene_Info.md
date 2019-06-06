---
title: Gene Info
weight: 30
authors:
- kellrott
tags:
- ccle
- drug response
created_at: 2018-05-09
updated_at: 2018-05-09
tldr: Look up gene ontology information and references
---

```python
import gripql
conn = gripql.Connection("https://bmeg.io/api", credential_file="/tmp/bmeg_credentials.json")
O = conn.graph("bmeg_rc1_2")
```

Look up a gene by its hugo symbol


```python
gids = list(O.query().V().hasLabel("Gene").has(gripql.eq("$.symbol", "BRCA1")).render("_gid"))
```

    [INFO]	2019-03-11 15:49:09,362	1 results received in 0 seconds


Find some of the Gene Ontology terms the gene is linked to


```python
for ent in O.query().V(gids).in_("GeneOntologyAnnotation").limit(10):
    print(ent.gid, ent.data)
```

    [INFO]	2019-03-11 16:32:55,385	10 results received in 0 seconds


    GO:0005515 <AttrDict({'definition': 'Interacting selectively and non-covalently with any protein or protein complex (a complex of two or more proteins that may include other nonprotein molecules).', 'go_id': 'GO:0005515', 'name': 'protein binding', 'namespace': 'molecular_function', 'synonym': ['glycoprotein binding', 'protein amino acid binding'], 'xref': ['reactome:R-HSA-170835', 'reactome:R-HSA-170846', 'reactome:R-HSA-3645786', 'reactome:R-HSA-3656484', 'reactome:R-HSA-3702153', 'reactome:R-HSA-3713560']})>
    GO:0005654 <AttrDict({'definition': 'That part of the nuclear content other than the chromosomes or the nucleolus.', 'go_id': 'GO:0005654', 'name': 'nucleoplasm', 'namespace': 'cellular_component', 'synonym': [], 'xref': ['NIF_Subcellular:sao661522542', 'Wikipedia:Nucleoplasm']})>
    GO:0005737 <AttrDict({'definition': 'All of the contents of a cell excluding the plasma membrane and nucleus, but including other subcellular structures.', 'go_id': 'GO:0005737', 'name': 'cytoplasm', 'namespace': 'cellular_component', 'synonym': [], 'xref': ['Wikipedia:Cytoplasm']})>
    GO:0006359 <AttrDict({'definition': 'Any process that modulates the frequency, rate or extent of transcription mediated by RNA ploymerase III.', 'go_id': 'GO:0006359', 'name': 'regulation of transcription by RNA polymerase III', 'namespace': 'biological_process', 'synonym': ['regulation of transcription from Pol III promoter', 'regulation of transcription from RNA polymerase III promoter'], 'xref': []})>
    GO:0008630 <AttrDict({'definition': 'A series of molecular signals in which an intracellular signal is conveyed to trigger the apoptotic death of a cell. The pathway is induced by the detection of DNA damage, and ends when the execution phase of apoptosis is triggered.', 'go_id': 'GO:0008630', 'name': 'intrinsic apoptotic signaling pathway in response to DNA damage', 'namespace': 'biological_process', 'synonym': ['DNA damage response, signal transduction resulting in induction of apoptosis'], 'xref': []})>
    GO:0031436 <AttrDict({'definition': 'A heterodimeric complex comprising BRCA1 and BARD1, which possesses ubiquitin ligase activity and is involved in genome maintenance, possibly by functioning in surveillance for DNA damage.', 'go_id': 'GO:0031436', 'name': 'BRCA1-BARD1 complex', 'namespace': 'cellular_component', 'synonym': [], 'xref': []})>
    GO:0019899 <AttrDict({'definition': 'Interacting selectively and non-covalently with any enzyme.', 'go_id': 'GO:0019899', 'name': 'enzyme binding', 'namespace': 'molecular_function', 'synonym': [], 'xref': []})>
    GO:0044212 <AttrDict({'definition': 'Interacting selectively and non-covalently with a DNA region that regulates the transcription of a region of DNA, which may be a gene, cistron, or operon. Binding may occur as a sequence specific interaction or as an interaction observed only once a factor has been recruited to the DNA by other factors.', 'go_id': 'GO:0044212', 'name': 'transcription regulatory region DNA binding', 'namespace': 'molecular_function', 'synonym': ['regulatory region DNA binding'], 'xref': []})>
    GO:0050681 <AttrDict({'definition': 'Interacting selectively and non-covalently with an androgen receptor.', 'go_id': 'GO:0050681', 'name': 'androgen receptor binding', 'namespace': 'molecular_function', 'synonym': ['AR binding'], 'xref': []})>
    GO:0051573 <AttrDict({'definition': 'Any process that stops, prevents, or reduces the frequency, rate or extent of the covalent addition of a methyl group to the lysine at position 9 of histone H3.', 'go_id': 'GO:0051573', 'name': 'negative regulation of histone H3-K9 methylation', 'namespace': 'biological_process', 'synonym': ['down regulation of histone H3-K9 methylation', 'down-regulation of histone H3-K9 methylation', 'downregulation of histone H3-K9 methylation', 'inhibition of histone H3-K9 methylation'], 'xref': []})>



```python

```
