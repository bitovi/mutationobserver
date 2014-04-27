# mutationobserver

This repository includes a collection of MutationObserver polyfills so that you can use MutationObserver in all browsers (>= IE8). The browser breakdown is:

* IE8: jQuery polyfill
* IE9 and IE10: Mutation Events polyfill
* IE10, Chrome, Safari, Firefox, Opera: Native MutationObserver

# Installation

This polyfill is available from [Bower](http://bower.io/):

```shell
bower install mutationobserver
```

# Usage

This polyfill uses [Steal](https://github.com/bitovi/steal) so the best way to use it is to steal the main `mutationobserver.js` file which will return a MutationObserver constructor that you can use:

```javascript
steal("mutationobserver", function(Observer) {
	var observer = new Observer(function(mutations) {
		console.log(mutations);
	});

	observer.observe($("body")[0], {
		attributes: true,
		childList: true
	});
});
```

# Options support

| Feature               | Native        | Events Polyfill  | jQuery Polyfill  |
| --------------------- |:-------------:| ----------------:| ----------------:|
| childList             | &#x2713;      | &#x2713;         | &#x2713;         |
| attributes            | &#x2713;      | &#x2713;         | &#x2713;         |
| characterData         | &#x2713;      | &#x2713;         | &#x2717;         |
| subtree               | &#x2713;      | &#x2713;         | &#x2713;         |
| attributeOldValue     | &#x2713;      | &#x2713;         | &#x2713;         |
| characterDataOldValue | &#x2713;      | &#x2713;         | &#x2717;         |
| attributeFilter       | &#x2713;      | &#x2713;         | &#x2713;         |

jQuery has no way to manipulate a CharacterData's data property, so there is no practical way to do this. Most commonly people manipulate text content using `text()` which would result in new TextNodes anyways.

# Development

To contribute first clone the repository then run `bower install` which will install the development dependencies (just QUnit). Then navigate to `test/test.html` to see the tests. If you find a bug create a test in one of the appropriate files:

1. `attributes_test.js` is for the "attributes" event.
2. `childlist_test.js` is for the "childList" event.
3. `mutationobserver_test.js` is for generic tests that make sure the API is fully supported.

# License

The Mutation Events polyfill is taken from the [Polymer Project](https://github.com/Polymer/MutationObservers) and has a BSD license. 

Otherwise this project is MIT licensed.
