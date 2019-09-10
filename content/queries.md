---
title: Traversal
---

#  Schema Graph Traversal Tutorial
Compiled: August 26, 2019 using schema bmeg_rc2

Graph traversal is the movement within a graph from one node (vertex) or edge to another. When doing graph traversal, there are two important things to keep in mind:

1)  The structure and composition of the graph  
2) The commands we use to move around within it

In order to use BMEG, doing graph traversal is an important step— ***without it you can not access the data you want***. In this tutorial, we will look at an example BMEG schema graph and some of its vertices and edges, and we will define some of the key operations we need to use when we move within the schema.



#### Part 1: Understanding Schema Layout and Content

![](https://lh6.googleusercontent.com/cs_gZNfc1LEkSjSSxOjjS_9mD7Qze1_c8NaGdNQKbMDTRIwEENfHuSMz-nHaVYlXIO0qqc2zag1B5piOXU4G0EBtGKSJyU3Nnj9mK6kavGw5iXVqnXvotqPGVtHh5OBLOpDxzEHV)
Take a few minutes to read some of the different vertices (nodes) and edges. When you seek data from BMEG, you will query from here, so being familiar with the graph is a good fist step.

The two main parts of the BMEG schema graph are the vertices and edges. Most of the data is stored within the vertices. And when we query BMEG, our goal is to acquire that data.

All the vertices have a common orientation that includes three main parts:
- **Gid** - a global identifier of each vertex. The gid will often be the field where you start your traversal.
- **Label** - tells us about the type of the vertex. Vertices of the same type have similar property keys and edge labels, and they form a logical group within the system.

- **Data** - this is the place where all the data resides.

Go  <a href="https://bmegio.ohsu.edu/explore/schema" target="_blank" >here</a> to see the current schema. When you click on a specific vertex, more information (including the three main elements of each vertex) will appear below the graph.

#### Part 2: Getting introduced to  traversal operations



Before we jump into using gripql operations, it would be beneficial to look at an example code that is written to perform traversal of a BMEG schema graph. We will analyze the role of each operation. If you are familiar with the code and what it does, you can skip this part and move onto the next section.




##### Part 2.1: Understanding operations using code


``` python
p = []

# Start query at vertex and look for labels starting with Project

for row in G.query().V().hasLabel("Project"):

if row.data.project_id.startswith("CCLE"):

p.append(row.gid)
```

``` python
# Traverse through schema nodes

q = G.query().V(p).out("cases").as_("CASE").out("samples").out("aliquots").out("drug_response").as_("DRUGRESP").out("compounds").as_("COMP")

# Render node properties of interest (cell line, drug, EC50 value)

q = q.render(["$CASE._data.case_id", "$COMP._gid", "$DRUGRESP._data.ec50"])
```



When we look at this code, there are two main things to consider.

1. The node and the edges we go through

-   In the first code we see that we start our query from a vertex. That vertex is called (or has the label) “project”. Within that vertex, we specifically look for a dataset that starts with “CCLE”. Through this step, we are filtering down our data.

-   In the second code chunk, we move from one node to another until we have carried all the data we need for our analysis. We go through nodes such as “cases”, “samples”,  “aliquots” "drug_response" and "compounds".

- The three specific datasets we wanted to get were 1) drug name 2) which cell line the drug was tested on and 3) what the drug response was (EC50). However, getting exactly the data we want isn't always a straight forward path. That's why we went through extra vertices—to find a path to the data we want. This point is better illustrated in the part of the code where we render the data we have obtained. From the "case" vertex, we were able to grab case_id data i.e cell line information. From the "compounds" vertex, we got information on drug names. And lastly,nfrom the "drug_response vertex, we got drug response data. Because in the current schema there is no directly connecting edge between "case" and "drug_response", we went through "samples" and "aliquots" to get to where we want. This is why it is important to be familiar with the schema landscape and the operations we use to get around within it.  

2. The operations we use to get there.

Operations:

  - **G.query()** - everytime you see query, it means we are seeking data. The G that is placed before ```.query()``` is a way of establishing a connection to the BMEG server. So G.query is a way of seeking data from BMEG.
  - **.V()** - when we use this, we are starting our query from a vertex.

- **.E()** - here we are starting our query from an edge.
 - **.hasLabel()** - this command is used as a filtering mechanism. For example, in the case of how it was used in the code above, we used it to only filter out data that has the label “Project”.

- **.out()** - this command takes us out of a vertex through an outgoing edge and makes us enter the next vertex.

- **.render(list-of-data-you-want)** - this command is used to release the data we have carried over to this point.

- **.as_()**- is a mechanism to name a dataset with a name we want to give it. Also, it means store current row for future reference.
- **.append** - brings out the data that has been queried.  

 ##### Part 2.2: Understanding Traversal Commands

If you understand how the code above is able to query for and filter data, you can move into creating your own code to query BMEG for your own downstream analysis. <a href="https://bmeg.github.io/grip/docs/queries/operations/" target="_blank" > This link</a> takes you to a page with a list of different gripql commands you can use.

>Here, I have grouped most of the commands in categories based on their functionality:
>
>***A. Commands we use to start a traversal:***
>``.V([ids])`` ``.E([ids])``
>
>***B. Commands we use to continue traversal through the graph; going in and out of nodes and edges:***
>
>`` .in_(), inV()`` ``.out(), .outV()``     ``.both(), .bothV()``  ``.inE()``   `` .outE()``    ``.bothE()``
>
>***C. Commands that filter data:***
>
>``.has()``   ``gripql.eq(variable, value)``    ``gripql.gt(variable, value)``    ``gripql.lt(variable, value)``    ``gripql.gte(variable, value)``    ``gripql.lte(variable, value)``  ``gripql.within(variable, value)``   ``gripql.contains(variable, value)`` ``gripql.and_([conditions])``  ``gripql.or_([conditions])`` ``gripql.not_(condition)``
>
>***D. Commands that help us save, limit, render, put a range on, include and exclude information of outputs:***
>
>``.as_(name)``  ``.select([names])`` ``.limit(count)`` ``.skip(count)`` ``.range(start, stop)`` ``.fields([fields])`` ``.render(template)`` ``.aggregate([aggregations])``
>
>***E. Commands that help us aggregate data sets:***
>
>``.gripql.term(name, field, size)`` `` .gripql.histogram(name, field, interval)``  ``.gripql.percentile(name, field, percents=[])``  ``.count()``  ``.distinct([fields])``

To learn in depth the definitions of the commands and what they do, please go to the gripql operations page right <a href="https://bmeg.github.io/grip/docs/queries/operations/" target="_blank" >here</a>.

To go back to the main tutorial, click this link.

If you have any questions, comments, or concerns, contact us through <a href="https://gitter.im/bmeg/" target="_blank" >Gitter</a>  and/or <a href="https://github.com/bmeg/" target="_blank" >GitHub</a>.


# Commands
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

## .hasLabel
Select vertices of a particular type
```python
O.query().V().hasLabel("Gene")
```

## .has()
Filter elements using conditional statements

```python
O.query().V().hasLabel("Gene").where(gripql.eq("symbol", "TP53"))
```

## Conditions
Conditions are arguments to `.has()` that define selection conditions
### gripql.eq(variable, value)
Returns rows where variable == value
```python
.has(gripql.eq("symbol", "TP53"))
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

## .inE()
Following incoming edges, but return the edge as the next element. This can be used to inspect edge properties. Optional argument is the edge label (or list of labels) that should be followed. To return back to a vertex, use `.in_` or `.out`

## .outE()
Following outgoing edges, but return the edge as the next element. This can be used to inspect edge properties. Optional argument is the edge label (or list of labels) that should be followed. To return back to a vertex, use `.in_` or `.out`

## .bothE()
Following all edges, but return the edge as the next element. This can be used to inspect edge properties. Optional argument is the edge label (or list of labels) that should be followed. To return back to a vertex, use `.in_` or `.out`


# Aggregation

## .aggregate()
Return aggregate counts of field. This can be run at the graph level, without using the `.query()` method to start a traversal, ie
```
O.query().hasLabel("Person").aggregate(gripql.term("test-agg", "name"))
```
Where `test-agg` is the name of the aggrigation, `Person` is the vertex label type and `name` is the field.

```
O.query().V("1").out().aggregate(gripql.histogram("traversal-agg", "age", 5))
```
Starts on vertex `1`, goes out and then creates a histogram named `traversal-agg` across the `age` field in the `Person` vertices.

## .count()
Return the total count of elements

## .distinct()
Only return distinct elements. Argument can JSON path to define what elements are used to identify uniqueness.
