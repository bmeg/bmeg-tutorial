---
title: Getting Started
menu:
  main:
    parent: Queries
    weight: 2
---


# Usage

Ophion is an API for making graph queries using structured data. Queries are defined using a series of step operations provided by Ophion. The python client wraps the construction of these queries in an intuitive python interface.

Let's go through the features currently supported in the Ophion python client.

## import

First, import the Ophion client and create a connection to an existing Ophion API (here we use the BMEG at OHSU):

```python
import ophion
O = ophion.Ophion('http://bmeg.io')
```
Now that we have an Ophion instance, we can use this to make all of our queries.

## finding a vertex

One of the first things you probably want to do is find some vertex out of all of the vertexes available in the system. In order to do this, we need to know something about the vertex we are looking for. To start, let's see if we can find a specific gene:

```python
O.query().has("symbol", "TP53").execute()
```

A couple things about this first and simplest query. We start with `O`, our Ophion instance connected to the BMEG, and create a new query with `.query()`. This query is now being constructed. You can chain along as many operations as you want, and nothing will actually get sent to the server until you call `.execute()`.

Once we make this query, we get a result:

```
[{u'gid': u'gene:TP53',
  u'label': u'Gene',
  u'properties': {u'accession': u'AF307851',
   u'chromosome': u'17p13.1',
   u'description': u'tumor protein p53',
   u'refseq': u'NM_000546',
   u'symbol': u'TP53',
   u'type': u'Gene'}}]
```

This represents the vertex we queried for above. All vertexes in the system will have a similar structure, basically:

* _gid_: This represents the global identifier for this vertex. In order to draw edges between different vertexes from different data sets we need an identifier that can be constructed from available data. Often, the `gid` will be the field that you query on as a starting point for a traversal.
* _label_: The label represents the type of the vertex. All vertexes with a given label will share many property keys and edge labels, and form a logical group within the system.
* _properties_: This is where all the data goes. `properties` can be an arbitrary map, and these properties can be referenced during traversals.

You can also do a `has` query with a list of items using `O.within([...])` (other conditions exist, see the `Conditions` section below):

```python
O.query().has("symbol", O.within(["TP53", "BRCA1"])).execute()
```

This returns both Gene vertexes:

```
[{u'gid': u'gene:TP53',
  u'label': u'Gene',
  u'properties': {u'accession': u'AF307851',
   u'chromosome': u'17p13.1',
   u'description': u'tumor protein p53',
   u'refseq': u'NM_000546',
   u'symbol': u'TP53',
   u'type': u'Gene'}},
 {u'gid': u'gene:BRCA1',
  u'label': u'Gene',
  u'properties': {u'accession': u'U14680',
   u'chromosome': u'17q21.31',
   u'description': u'BRCA1, DNA repair associated',
   u'refseq': u'NM_007294',
   u'symbol': u'BRCA1',
   u'type': u'Gene'}}]
```
