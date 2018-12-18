---
title: Traversal
sidebar: true

menu:
  main:
    parent: Queries
    weight: 3
---

# Starting Traversal
## .V([ids])
Start query from Vertex

```python
O.query().V()
```
Returns all vertices in graph

```python
O.query().V("vertex1")
```
Returns:
```json
{"gid" : "vertex1", "label":"TestVertex", "data":{}}
```

## .E()
Start query from Edge

```python
O.query().E()
```
Returns all edges in graph

# Filtering
## .where()
Filter elements using conditional statements

```python
O.query().V().where(gripql.eq("_label", "Gene")).where(gripql.eq("symbol", "TP53"))
```

## Conditions
Conditions are arguments to `.where()` that define selection conditions
### gripql.eq(variable, value)
Returns rows where variable == value
```python
.where(gripql.eq("symbol", "TP53"))
```

### gripql.neq(variable, value)
Returns rows where variable != value
```python
.where(gripql.neq("symbol", "TP53"))
```

### gripql.gt(variable, value)
Returns rows where variable > value
```python
.where(gripql.gt("age", 45))
```

### gripql.lt(variable, value)
Returns rows where variable < value
```python
.where(gripql.lt("age", 45))
```

### gripql.gte(variable, value)
Returns rows where variable >= value
```python
.where(gripql.gte("age", 45))
```

### gripql.lte(variable, value)
Returns rows where variable <= value
```python
.where(gripql.lte("age", 45))
```

### gripql.in_(variable, value)
Returns rows where variable in value
```python
.where(gripql.in_("symbol", ["TP53", "BRCA1"]))
```

### gripql.contains(variable, value)
Returns rows where variable contains value
```python
.where(gripql.in_("groups", "group1"))
```

Returns:
```
{"data" : {"groups" : ["group1", "group2"]}}
```

### gripql.and_([conditions])
```python
.where(gripql.and_( [gripql.lte("age", 45), gripql.gte("age", 35)] ))
```

### gripql.or_([conditions])
```python
.where(gripql.or_( [...] ))
```

### gripql.not_(condition)

# Output
## .mark(name)
Store current row for future reference
```python
O.query().V().mark("a").out().mark("b")
```

## .select([names])
Output previously marked elements

## .limit(count)
Limit number of total output rows

## .offset(count)
Start return after offset

## .render(template)
Render current selection into arbitrary data structure

# Traversing the graph

## .in_()
Following incoming edges. Optional argument is the edge label (or list of labels) that should be followed. If no argument is provided, all incoming edges.

## .out()
Following outgoing edges. Optional argument is the edge label (or list of labels) that should be followed. If no argument is provided, all outgoing edges.

## .both()
Following all edges (both in and out). Optional argument is the edge label (or list of labels) that should be followed.

## .inEdge()
Following incoming edges, but return the edge as the next element. This can be used to inspect edge properties. Optional argument is the edge label (or list of labels) that should be followed. To return back to a vertex, use `.in_` or `.out`

## .outEdge()
Following outgoing edges, but return the edge as the next element. This can be used to inspect edge properties. Optional argument is the edge label (or list of labels) that should be followed. To return back to a vertex, use `.in_` or `.out`

## .bothEdge()
Following all edges, but return the edge as the next element. This can be used to inspect edge properties. Optional argument is the edge label (or list of labels) that should be followed. To return back to a vertex, use `.in_` or `.out`


# Aggregation

## .aggregate()
Return aggregate counts of field. This can be run at the graph level, without using the `.query()` method to start a traversal, ie
```
O.aggregate(gripql.term("test-agg", "Person", "name"))
```
Where `test-agg` is the name of the aggrigation, `Person` is the vertex label type and `name` is the field.

```
O.query().V("1").out().aggregate(gripql.histogram("traversal-agg", "Person", "age", 5))
```
Starts on vertex `1`, goes out and then creates a histogram named `traversal-agg` across the `age` field in the `Person` vertices.

## .count()
Return the total count of elements

## .distinct()
Only return distinct elements. Argument can JSON path to define what elements are used to identify uniqueness.
