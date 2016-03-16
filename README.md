[![Coverage Status](https://coveralls.io/repos/github/tmillner/spelledright/badge.svg?branch=master)](https://coveralls.io/github/tmillner/spelledright?branch=master) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/tmillner/spelledright/trend.png)](https://bitdeli.com/free "Bitdeli Badge") [![npm version](https://badge.fury.io/js/spelledright.svg)](https://badge.fury.io/js/spelledright)
## spelledright 

This project is a js library used to facilitate spell checks on XML, HTML pages in English. It wraps around [cfinke/Typo.js](https://github.com/cfinke/Typo.js). 
You can directly take the spelledright.js file and add it to your project.


#### The Mechanism
The way it works is by:

- 1) Parsing all children under a specified XML Node. 
- 2) Gathering all elements innertext 
- 3) Going throws the gat
hered innertext and (logically) breaking it up into words
- 4) Performing a spelling check on each word according to the desired options config

#### Example Usage 
```js
// 1) Load a page using a UI test driver ex.
// selenium-webdriver (https://www.npmjs.com/package/selenium-webdriver)
let driver = new webdriver.Builder().forBrowser('firefox').build();
driver.get(URL).then(() => {
  // 2) Get the target node to perform checks on the target children
  return driver.executeScript(`
    return document.getElementsByTagName('body')[0];
  `);
}).then(node => {
  // 3) Return the inner HTML (Library initialization as string node is supported)
  return node.getInnerHtml();
}).then(inner => {
  // 4) Use the library with your asserts, or logs
  let spelledright = new SpelledRight(inner, {
    ignoreCase: false,
    ignoreComments: true,
    whitelist: [/^[A-Z]+$/ /* All caps letters */]
  });
  console.log('Misspellings are: ' +
    JSON.stringify(spelledright.getMisspellings()));
  return driver.quit();
})
```
**Note** See the spec files for concrete examples.


#### Additional Usage
To run this project locally, or contribute:

- 1) `npm install` Make sure everything is installed.
- 2)`grunt babel` Convert es6 files to the js counterparts.
- 3) `npm run-script unittest && npm run-script perftest` Make sure tests are working.
- 4) `grunt watch` Anytime before developing. *Note: The project is linted extend from google.*
- 5) Develop!
- 6) Don't forget to add tests and test it out! Let's aim to keep coverage >= 93%
 Performance benchmarks should be roughly: 
  - DETAILED_PAGE_BENCHMARK: 1040.511ms
  - SIMPLE_PAGE_BENCHMARK: 752.908ms
- 7) `npm build` To ensure everything is in working order.
- 8) Now we're talking, make a PR upstream.
