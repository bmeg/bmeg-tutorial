import React from 'react';
import logo from './logo.svg';
import './App.css';

import {gripql} from './gripql.js'

import * as d3 from "d3";

var EventGrid = function(params) {
	this.params = params;
}


EventGrid.prototype.render = function() {


	this.params.cols.sort( (x,y) => {
		var xEvent = getEvent(this.params.events, x.id, "gene1");
		var yEvent = getEvent(this.params.events, y.id, "gene1");
		if (xEvent && !yEvent) return -1;
		if (!xEvent && yEvent) return 1;
		return 0;
	})

	var gridData = gridGen(this.params.cols, this.params.rows, this.params.events);

	var grid = d3.select("#grid-div")
		.append("svg")
		.attr("width", this.params.width)
		.attr("height", this.params.height);

	var row = grid.selectAll(".row")
		.data(gridData)
		.enter().append("g")
		.attr("class", "row");

	var _params= this.params;

  var colSums = new Array(this.params.cols.length).fill(0)
	gridData.map( x => x.map( y => ( y.event ? 1 : 0) ) )
	.forEach( (x) => {
		x.forEach( (y,i) => { colSums[i] += y; } )
	})

  var rowSums = gridData.map( x => x.map( y => ( y.event ? 1 : 0) ).reduce( (i,j) => i+j ) );

	//Draw the grid
	var squares = row.selectAll(".square")
		.data(function(d) { return d; })
		.enter().append("rect")
		.attr("class","square")
		.attr("x", function(d) { return d.x; })
		.attr("y", function(d) { return d.y; })
		.attr("width", function(d) { return d.width; })
		.attr("height", function(d) { return d.height; })
		.style("fill", function(d) { return d.color; })
		.attr("transform", "translate(" + this.params.left + "," + this.params.top + ")")
		.style("stroke", "#222");

	// Define the div for the tooltip
	var div = d3.select("body").append("div")
	    .attr("class", "tooltip")
			.style("pointer-events", "none")
	    .style("opacity", 0);
	// Add tooltip
	squares.on("mouseover", function(d) {
      div.transition()
          .duration(200)
          .style("opacity", .9);
      div	.html(d.row + "<br/>" + d.col)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
  .on("mouseout", function(d) {
      div.transition()
          .duration(500)
          .style("opacity", 0);
  });

	var width = 25 * this.params.cols.length;
	var height = 25 * this.params.rows.length;

	//Create Row Axis
	var rowAxis = d3.axisLeft(
		//d3.scaleOrdinal().domain( rows.map( x => x.id ) ).range( d3.ticks(0, width, rows.length) )
		d3.scaleBand().domain( this.params.rows.map( x => x.id ) ).range( [0, height] )
	)
	grid.append("g")
		.attr("transform", "translate(" + this.params.left + "," + this.params.top + ")")
		.call(rowAxis)

	//create column axis
	var colAxis = d3.axisBottom(
		d3.scaleBand().domain( this.params.cols.map( x => x.id ) ).range( [0, width] )
	)
	grid.append("g")
	.attr("transform", "translate(" + (this.params.left) + "," + (this.params.top + height) + ")")
		.call( colAxis )
		.selectAll("text")
		.style("text-anchor", "start")
		.attr("transform", "rotate(90)translate(10,-12)")
		.style("font-size", 12)
		//.style("fill", "#000");

	//generate row count bar
	var countScale = d3.scaleBand().domain( this.params.rows.map( x => x.id ) ).range( [0, width] )
	var rowBars = rowSums.map( (x,i) => ({count:x, index:i, y:i*25}))
	console.log(rowSums)

	grid.selectAll(".rowHist")
		.data(rowBars)
		.attr("transform", "translate(" + this.params.left + "," + this.params.top + ")")
	 	.enter().append("rect")
		.attr("class","square")
		.style("fill", "steelblue")
		.attr("width", function(d) { return d.count * 10; })
		.attr("x", function(d) {return width + 2 + _params.left;} )
		.attr("y", function(d) { return d.y + 1; })
		.attr("height", function(d) { return 25 - 1; })
		.style("fill", "#000");

}

function gridXY( cell, cols, rows ) {
	var xpos = 0;
	var ypos = 0;
	rows.forEach( (x, i) => {
		if (x.id == cell.row) { ypos = 1 + i * 25; }
	} )
	cols.forEach( (x, i) => {
		if (x.id == cell.col) { xpos = 1 + i * 25; }
	} )
	return [xpos, ypos]
}

function getEvent(events, col, row) {
	var out = false
	events.forEach( x => {
		if (x.col == col && x.row == row) {
			out = true
		}
	})
	return out
}

function gridGen(cols, rows, events) {
	var data = new Array();
	var width = 25;
	var height = 25;

	// iterate for rows
	for (var row = 0; row < rows.length; row++) {
		data.push( new Array() );
		for (var column = 0; column < cols.length; column++) {
      var e = events.filter( x => (x.row == rows[row].id && x.col == cols[column].id) );
			var event = false;
			var color = "#fff";
			if (e.length > 0) {
				event = true;
				color = "#333";
			}
			var pos = gridXY( {col:cols[column].id, row:rows[row].id}, cols, rows )
			data[row].push({
				x: pos[0],
				y: pos[1],
				width: width,
				height: height,
        color: color,
				event: event,
				row: rows[row].id,
				col: cols[column].id
			})
		}
	}
	return data;
}

function App() {
	
  var cols = [
    {"id" : "TCGA-0000-01"},
    {"id" : "TCGA-0000-02"},
    {"id" : "TCGA-0000-03"},
    {"id" : "TCGA-0000-04"},
		{"id" : "TCGA-0000-05"},
		{"id" : "TCGA-0000-06"},
		{"id" : "TCGA-0000-07"}
  ]

  var rows = [
    {"id" : "gene1"},
    {"id" : "gene2"},
    {"id" : "gene3"},
    {"id" : "gene4"}
  ]

  var events = [
    {"col" : "TCGA-0000-01", "row" : "gene1" },
    {"col" : "TCGA-0000-01", "row" : "gene2" },
    {"col" : "TCGA-0000-02", "row" : "gene3" },
		{"col" : "TCGA-0000-03", "row" : "gene1" },
		{"col" : "TCGA-0000-04", "row" : "gene4" },
		{"col" : "TCGA-0000-05", "row" : "gene1" },
		{"col" : "TCGA-0000-06", "row" : "gene1" },
		{"col" : "TCGA-0000-07", "row" : "gene1" },
		{"col" : "TCGA-0000-07", "row" : "gene2" },
  ]

	var grid = new EventGrid({
		cols: cols,
		rows: rows,
		events: events,
		width: 500,
		height: 500,
		left: 50,
		top: 0
	})

	grid.render()


	/*
	gripql.query("test-data").V().hasLabel("Case")
	.out("samples").as_("a").out("aliquots").outE("somatic_variant")
	.as_("b").render(["$a._gid", "$b.ensembl_transcript"]).call()
	.then(function(data) {
		let newCols = [ ...new Set(data.map( x => x.render[0] )) ].map( (x) => ( {"id":x} ) )
		let newRows = [ ...new Set(data.map( x => x.render[1] )) ].map( (x) => ( {"id":x} ) )
		let newEvents = data.map( x => ( { "col":x.render[0], "row":x.render[1]  }) )

		var grid = new EventGrid({
			cols: newCols,
			rows: newRows,
			events: newEvents,
			width: 500,
			height: 500,
			left: 50,
			top: 0
		})

		grid.render()
	})
	*/


  return (
    <div></div>
  );
}

export default App;
