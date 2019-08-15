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
conn = gripql.Connection("https://bmeg.io/api", credential_file="bmeg_credentials.json")
O = conn.graph("bmeg_rc2")
```

Look up a gene by its hugo symbol


```python
gids = list(O.query().V().hasLabel("Gene").has(gripql.eq("$.symbol", "BRCA1")).render("_gid"))
```

    [INFO]	2019-07-26 20:44:57,342	1 results received in 0 seconds


Find some of the Gene Ontology terms the gene is linked to


```python
for ent in O.query().V(gids).out("gene_ontology_terms").limit(10):
    print(ent.gid, ent.data.definition)
```

    [INFO]	2019-07-26 20:46:07,469	10 results received in 0 seconds


    GeneOntologyTerm:GO:0003684 Interacting selectively and non-covalently with damaged DNA.
    GeneOntologyTerm:GO:0004842 Catalysis of the transfer of ubiquitin from one protein to another via the reaction X-Ub + Y --> Y-Ub + X, where both X-Ub and Y-Ub are covalent linkages.
    GeneOntologyTerm:GO:0000151 A protein complex that includes a ubiquitin-protein ligase and enables ubiquitin protein ligase activity. The complex also contains other proteins that may confer substrate specificity on the complex.
    GeneOntologyTerm:GO:0000729 The 5' to 3' exonucleolytic resection of the DNA at the site of the break to form a 3' single-strand DNA overhang.
    GeneOntologyTerm:GO:0000724 The error-free repair of a double-strand break in DNA in which the broken DNA molecule is repaired using homologous sequences. A strand in the broken DNA searches for a homologous region in an intact chromosome to serve as the template for DNA synthesis. The restoration of two intact DNA molecules results in the exchange, reciprocal or nonreciprocal, of genetic material between the intact DNA molecule and the broken DNA molecule.
    GeneOntologyTerm:GO:0003713 A protein or a member of a complex that interacts specifically and non-covalently with a DNA-bound DNA-binding transcription factor to activate the transcription of specific genes. Coactivators often act by altering chromatin structure and modifications. For example, one class of transcription coregulators modifies chromatin structure through covalent modification of histones. A second ATP-dependent class modifies the conformation of chromatin. Another type of coregulator activity is the bridging of a DNA-binding transcription factor to the basal transcription machinery. The Mediator complex, which bridges transcription factors and RNA polymerase, is also a transcription coactivator.
    GeneOntologyTerm:GO:0000800 A proteinaceous core found between sister chromatids during meiotic prophase.
    GeneOntologyTerm:GO:0005515 Interacting selectively and non-covalently with any protein or protein complex (a complex of two or more proteins that may include other nonprotein molecules).
    GeneOntologyTerm:GO:0003677 Any molecular function by which a gene product interacts selectively and non-covalently with DNA (deoxyribonucleic acid).
    GeneOntologyTerm:GO:0003723 Interacting selectively and non-covalently with an RNA molecule or a portion thereof.

