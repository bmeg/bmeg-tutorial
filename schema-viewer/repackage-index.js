#!/usr/bin/env node
const cheerio = require('cheerio')
const fs = require('fs');
// reads generated index html and places scripts into hugo.tail

// read from: build/index.html
var data = fs.readFileSync('build/index.html', "utf8")

var index = cheerio.load(data);
const scripts = index.html('script');
const links = index.html('link[rel="stylesheet"][href*="schema"]');
// insert into: ../layouts/shortcodes/schema.html
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('../layouts/shortcodes/schema.html')
});
var is_comment = false;
var lines = []
lineReader.on('line', function (line) {
  if (line.indexOf('SCHEMA VIEWER INSERT START') > 0 )  {
    is_comment = true;
    lines.push(line)
    var now = new Date()
    lines.push(`<!-- inserted ${now.toISOString()} -->`);
    lines.push(links)
    lines.push(scripts)
  }
  if (line.indexOf('SCHEMA VIEWER INSERT END') > 0 )  {
    is_comment = false;
  }
  if (!is_comment) {
    lines.push(line)
  }
});
lineReader.on('close', function () {
  var file = fs.createWriteStream('../layouts/shortcodes/schema.html');
  file.on('error', function(err) { console.log(err) });
  lines.forEach(function(v) { file.write(v + '\n'); });
  file.end();
});
