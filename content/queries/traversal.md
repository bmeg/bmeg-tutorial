---
title: Traversal
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
O.query().V().where(aql.eq("_label", "Gene")).where(aql.eq("symbol", "TP53"))
```

## Conditions
Conditions are arguments to `.where()` that define selection conditions
### aql.eq(variable, value)
Returns rows where variable == value
```python
.where(aql.eq("symbol", "TP53"))
```

### aql.neq(variable, value)
Returns rows where variable != value
```python
.where(aql.neq("symbol", "TP53"))
```

### aql.gt(variable, value)
Returns rows where variable > value
```python
.where(aql.gt("age", 45))
```

### aql.lt(variable, value)
Returns rows where variable < value
```python
.where(aql.lt("age", 45))
```

### aql.gte(variable, value)
Returns rows where variable >= value
```python
.where(aql.gte("age", 45))
```

### aql.lte(variable, value)
Returns rows where variable <= value
```python
.where(aql.lte("age", 45))
```

### aql.in_(variable, value)
Returns rows where variable in value
```python
.where(aql.in_("symbol", ["TP53", "BRCA1"]))
```

### aql.contains(variable, value)
Returns rows where variable contains value
```python
.where(aql.in_("groups", "group1"))
```

Returns:
```
{"data" : {"groups" : ["group1", "group2"]}}
```

### aql.and_([conditions])
```python
.where(aql.and_( [aql.lte("age", 45), aql.gte("age", 35)] ))
```

### aql.or_([conditions])
```python
.where(aql.or_( [...] ))
```

### aql.not_(condition)

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

## .out()

## .both()

## .inEdge()

## .outEdge()

## .bothEdge()

# Aggregation

## .aggregate()

## .count()

## .distinct()
