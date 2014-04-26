steal("jquery", "mutationobserver", function($, Observer) {
	module("attributes", {
		setup: function () {
			document.getElementById("qunit-test-area")
				.innerHTML = "";
		}
	});

	test("It observes attributes being added", function() {
		var element = document.createElement("div");

		var observer = new Observer(function(mutations) {
			var mutation = mutations[0];

			equal(mutations.length, 1);
			equal(mutation.type, "attributes");
			equal(mutation.target, element);
			equal(mutation.attributeName, "foo");
			start();
		});

		observer.observe(element, {
			attributes: true
		});

		$("#qunit-test-area").append(element);
		$.attr(element, "foo", "bar");

		stop();
	});

	test("It observes attributes being modified", function() {
		var element = document.createElement("div");
		$.attr(element, "foo", "bar");

		var observer = new Observer(function(mutations) {
			var mutation = mutations[0];

			equal(mutations.length, 1);
			equal(mutation.type, "attributes");
			equal(mutation.oldValue, "bar");

			start();
		});

		observer.observe(element, {
			attributes: true,
			attributeOldValue: true
		});

		$("#qunit-test-area").append(element);
		$.attr(element, "foo", "baz");

		stop();
	});

	test("It observes attributes being removed", function() {
		var element = document.createElement("div");
		$.attr(element, "foo", "bar");

		var observer = new Observer(function(mutations) {
			var mutation = mutations[1];

			equal(mutations.length, 2);
			equal(mutation.type, "attributes");
			equal(mutation.attributeName, "foo");

			start();
		});

		observer.observe(element, {
			attributes: true,
			attributeOldValue: true
		});

		$("#qunit-test-area").append(element);
		$.removeAttr(element, "foo");

		stop();
	});

	test("Subtree attributes changing", function() {
		var element = document.createElement("div");
		var child = document.createElement("span");
		$.attr(child, "foo", "bar");
		$(element).append(child);

		var observer = new Observer(function(mutations) {
			var mutation = mutations[0];

			equal(mutations.length, 1);
			equal(mutation.type, "attributes");
			equal(mutation.oldValue, "bar");
			equal(mutation.target, child);

			start();
		});

		observer.observe(element, {
			attributes: true,
			attributeOldValue: true,
			subtree: true
		});

		$("#qunit-test-area").append(element);
		$.attr(child, "foo", "baz");

		stop();
	});

	test("Descentant attributes shouldn't trigger if subtree is not true", function() {
		var element = document.createElement("div");
		var child = document.createElement("span");
		$.attr(child, "foo", "bar");
		$(element).append(child);
		var timeout;

		var observer = new Observer(function() {
			clearTimeout(timeout);
			ok(false, "We shouldn't have gotten here.");

			start();
		});

		observer.observe(element, {
			attributes: true,
			attributeOldValue: true
			// We are not observing subtree this time
		});

		$("#qunit-test-area").append(element);
		$.attr(child, "foo", "baz");

		// Wait 5ms and then things should be ok
		timeout = setTimeout(function() {
			ok(!!timeout, "Timeout still exists because not cleared in mutation callback");
			clearTimeout(timeout);
			start();
		}, 5);

		stop();
	});

	test("It has support for attribute filters", function() {
		var element = document.createElement("div");
		$.attr(element, "foo", "bar");

		var observer = new Observer(function(mutations) {
			var mutation = mutations[0];

			// There should only be 1 mutation
			equal(mutations.length, 1);
			equal(mutation.attributeName, "class");

			start();
		});

		observer.observe(element, {
			attributes: true,
			attributeFilter: ["class"]
		});

		$("#qunit-test-area").append(element);

		// This shouldn't be observed
		$.attr(element, "foo", "baz");
		
		// But this should
		$.attr(element, "class", "some-class");

		stop();
	});

});
