---
title: Traversal
menu:
  main:
    parent: Queries
    weight: 3
---


## Traversing the Graph

Once you are on a vertex, you can travel through that vertex's edges to find the vertexes it is connected to. Sometimes you don't even need to go all the way to the next vertex, the information on the edge between them may be sufficient.

Edges in the graph are directional, so there are both incoming and outgoing edges from each vertex, leading to other vertexes in the graph. Edges also have a _label_, which distinguishes the kind of connections different vertexes can have with one another.

Starting with gene TP53, and see what kind of other vertexes it is connected to.

```python
O.query().V().where(aql.eq("$.label", "Gene")).where(aql.eq("symbol", "TP53")).both()
```

Here we have introduced a couple of new steps. The first is `.out()`. This starts from wherever you are in the graph at the moment and travels out along all the outgoing edges.

By the time we call `.label()`, we are on these associated vertexes. `label` just gets the label of the vertex and ignores all the other properties.

At this point we have a bunch of labels. Now we call `.groupCount()` on these labels to get a tally of what kinds of vertexes our original TP53 gene is connected to.

```
[{u'Pubmed': 3}]
```

In the other direction:

```python
O.query().has("symbol", "TP53").incoming().label().groupCount()
```

Here we have swapped out `outgoing` for `incoming`, and it turns out that there are a lot more things pointing at TP53 than there are pointing away:

```
[{u'CNASegment': 708,
  u'GeneDatabase': 12,
  u'Variant': 8245,
  u'type': 1}]
```

So, there are 708 copy number segments, 12 gene databases, and 8245 variants. Also, one thing called "type".

As you can see, this is a good way to explore the graph and construct a good traversal as you go along.
