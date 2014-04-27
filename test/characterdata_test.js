steal("jquery", "mutationobserver", "mutationobserver/jquery", function($, Observer, jObserver) {

	// If this is jQuery MutationObserver, do not run these tests.
	// The jQuery polyfill doesn't support characterData mutations.
	if(Observer === jObserver) {
		return;
	}

	module("characterData", {
		setup: function () {
			document.getElementById("qunit-test-area")
				.innerHTML = "";
		}
	});

	test("Modifying a TextNode's data", function() {
		var element = document.createElement("div");
		$(element).text("foo");
		var text = $(element).contents()[0];

		var observer = new Observer(function(){});

		observer.observe(text, {
			characterData: true
		});

		text.data = "bar";

		var records = observer.takeRecords();

		equal(records.length, 1, "There was one mutation");
		equal(records[0].type, "characterData", "The mutation was characterData");
		equal(records[0].target, text, "The mutated node was text");
	});

	test("characterDataOldValue", function() {
		var element = document.createElement("div");
		$(element).text("foo");
		var text = $(element).contents()[0];

		var observer = new Observer(function(){});

		observer.observe(text, {
			characterData: true,
			characterDataOldValue: true
		});

		// Change the character data
		text.data = "bar";

		var records = observer.takeRecords();

		// Assertions
		equal(records.length, 1, "There was one mutation");
		equal(records[0].type, "characterData", "The mutation was characterData");
		equal(records[0].target, text, "The mutated node was text");
		equal(records[0].oldValue, "foo", "The oldValue is included");
	});
});
