[![Coverage Status](https://coveralls.io/repos/github/tmillner/spelledright/badge.svg?branch=master)](https://coveralls.io/github/tmillner/spelledright?branch=master) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/tmillner/spelledright/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
## spelledright 

This project is a js library used to facilitate spell checks on XML, HTML pages in English. It wraps around [cfinke/Typo.js](https://github.com/cfinke/Typo.js).


#### The Mechanism
The way it works is by:

- 1) Parsing all children under a specified XML Node. 
- 2) Gathering all elements innertext 
- 3) Splitting it up then running the api on the innertexts
- 4) Marking misspelled words according to the options config


#### Example Usage
- I load a page using a UI test driver, once the page loads, I invoke the spell check 
