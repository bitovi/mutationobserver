steal("jquery", "mutationobserver", function($, Observer) {
	module("childList", {
		setup: function () {
			document.getElementById("qunit-test-area")
				.innerHTML = "";
		}
	});

	test("It observes children being inserted", function() {
		var element = document.createElement("div");
		var child = document.createElement("span");

		var observer = new Observer(function(mutations) {
			var mutation = mutations[0];

			equal(mutations.length, 1);
			equal(mutation.type, "childList");
			equal(mutation.target, element);
			equal(mutation.addedNodes.length, 1);
			equal(mutation.addedNodes[0], child);
			start();
		});

		observer.observe(element, {
			childList: true
		});

		$("#qunit-test-area").append(element);

		// Insert the child
		$(element).append(child);
		stop();
	});

	test("It observes children being removed", function() {
		var element = document.createElement("div");
		var child = document.createElement("span");
		$(element).append(child);

		var observer = new Observer(function(mutations) {
			var mutation = mutations[0];

			equal(mutations.length, 1);
			equal(mutation.type, "childList");
			equal(mutation.target, element);
			equal(mutation.removedNodes.length, 1);
			equal(mutation.removedNodes[0], child);
			start();
		});

		observer.observe(element, {
			childList: true
		});

		$("#qunit-test-area").append(element);
		$(child).remove();

		stop();
	});

	test("It observes nested children being removed using subtree", function() {
		var element = document.createElement("ul");
		var second = document.createElement("li");
		var third = document.createElement("div");

		$(second).append(third);
		$(element).append(second);
		$("#qunit-test-area").append(element);

		var observer = new Observer(function(mutations) {
			var mutation = mutations[0];

			equal(mutations.length, 1);
			equal(mutation.type, "childList");
			equal(mutation.removedNodes[0], third);

			start();
		});

		observer.observe(element, {
			childList: true,
			subtree: true
		});

		$(third).remove();

		stop();
	});

	test("It doesn't observes nested children being removed without subtree option", function() {
		var element = document.createElement("ul");
		var second = document.createElement("li");
		var third = document.createElement("div");
		var timeout;

		$(second).append(third);
		$(element).append(second);

		var observer = new Observer(function(mutations) {
			clearTimeout(timeout);

			// We shouldn't get here
			ok(false, "Shouldn't call childList on a nested element without subtree option");

			start();
		});

		observer.observe(element, {
			childList: true
		});

		$("#qunit-test-area").append(element);
		$(third).remove();

		// Wait 5ms, observation would have been called by then.
		timeout = setTimeout(function() {
			clearTimeout(timeout);
			ok(true);
			start();
		}, 5);

		stop();
	});
});