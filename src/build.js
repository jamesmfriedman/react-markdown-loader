'use strict';

const camelize = require('camelize');
const except = require('except');

/**
 * @typedef HTMLObject
 * @type {Object}
 * @property {String} html    - HTML parsed from markdown
 * @property {Object} imports - Map of dependencies
 */

/**
 * Builds the React Component from markdown content
 * with its dependencies
 * @param   {HTMLObject} markdown - HTML and imports
 * @returns {String}              - React Component
 */
module.exports = function build(markdown) {
  let doImports = '';
  const imports = markdown.attributes.imports || {};
  let inSource = false;

  const importRegex = /import(?:["'\s]*([\w*{}\n, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*/g;

  const jsx = markdown.html
    .replace(/class=/g, 'className=')
    .replace(/spellcheck=".+?"/g, '')
    .replace(importRegex, v => {
      if (v.includes('<')) {
        return v;
      } else {
        doImports += v + '\n';
        return '';
      }
    });

  const frontMatterAttributes = except(markdown.attributes, 'imports');

  // eslint-disable-next-line no-restricted-syntax
  for (const variable in imports) {
    // eslint-disable-next-line no-prototype-builtins
    if (imports.hasOwnProperty(variable)) {
      doImports += `import ${variable} from '${imports[variable]}';\n`;
    }
  }

  doImports = [...new Set(doImports.match(importRegex))].reduce((acc, val) => {
    const parts = val.split(' from ');
    const module = parts[1]
      .replace(/'/g, '')
      .replace(/"/g, '')
      .replace(/;/g, '');
    acc[module] = acc[module] || [];
    const vars = parts[0]
      .replace('import', '')
      .replace(/\{/g, '')
      .replace(/\}/g, '')
      .split(',')
      .map(v => v.trim());

    acc[module] = acc[module].concat(vars);
    return acc;
  }, {});

  doImports = Object.entries(doImports)
    .map(([module, vars]) => {
      if (vars.length === 1 && vars[0].startsWith('*')) {
        return `import ${[...new Set(vars)]} from '${module}';`;
      }
      return `import {${[...new Set(vars)]}} from '${module}';`;
    })
    .join('\n');

  return `
import React from 'react';
${doImports}

export const attributes = ${JSON.stringify(camelize(frontMatterAttributes))};
export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {};
  }
  render() {
    return (
      <div>
        ${jsx}
      </div>
    );
  }
};`;
};
