const fs = require('fs');
const path = require('path');

const stateFile = path.join(__dirname, '../state/state.json');
const indexFile = path.join(__dirname, '../public/index.html');

let state = fs.readFileSync(stateFile, 'utf-8');

// Read HTML file
let html = fs.readFileSync(indexFile, 'utf-8');
html = html.replace(
  /<script id="state" type="application\/json">[\s\S]*?<\/script>/,
  `<script id="state" type="application/json">${state}</script>`
);

// Write the updated HTML back to the file
fs.writeFileSync(indexFile, html, 'utf-8');

console.log('Embedded JSON data into HTML');
