spelledright
===============

This project is a js library used to facilitate spell checks on HTML pages


### The Mechanism
The way it works is by:

- 1) Parsing non-hidden textual DOM elements under `<body>`. 
- 2) Gathering all elements innertext
- 3) Splitting it up then running the api on the innertexts


### Example Usage
- I load a page using a UI test driver, once the page loads, I invoke the spell check 
