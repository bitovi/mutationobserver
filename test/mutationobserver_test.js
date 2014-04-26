steal("jquery", "mutationobserver", function($, Observer) {
	module("mutationobserver", {
		setup: function () {
			document.getElementById("qunit-test-area")
				.innerHTML = "";
		}
	});

	test("Disconnecting will prevent further mutations from being observed", function() {
		var element = document.createElement("div");
		var child = document.createElement("span");
		var timeout;

		var observer = new Observer(function() {
			clearTimeout(timeout);

			// We shouldn't get this callback because we disconnected before the mutation
			ok(false, "Received an observation after disconnecting had occurred");
			start();
		});

		observer.observe(element, {
			childList: true
		});

		$("#qunit-test-area").append(element);

		// Disconnect
		observer.disconnect();

		// Insert the child
		$(element).append(child);

		timeout = setTimeout(function() {
			clearTimeout(timeout);
			ok(true);
			start();
		}, 5);

		stop();
	});

	test("Observing multiple elements should work", function() {
		var element1 = document.createElement("div");
		var element2 = document.createElement("div");

		var observer = new Observer(function(mutations) {

			// There should be 2 mutations
			equal(mutations.length, 2);

			equal(mutations[0].target, element1);
			equal(mutations[1].target, element2);
			
			start();
		});

		observer.observe(element1, {
			attributes: true
		});

		observer.observe(element2, {
			attributes: true
		});

		$("#qunit-test-area").append(element1).append(element2);

		$.attr(element1, "foo", "bar");
		$.attr(element2, "baz", "qux");

		stop();
	});

	test("Calling observe on the same element should only result in 1 event", function() {
		var element = document.createElement("div");

		var observer = new Observer(function(mutations) {

			// There should only be 1 mutations
			equal(mutations.length, 1);

			start();
		});

		observer.observe(element, {
			attributes: true
		});

		// Do the same observation again
		observer.observe(element, {
			attributes: true
		});

		$("#qunit-test-area").append(element);

		$.attr(element, "foo", "bar");

		stop();
	});

	test("Observing on the same node should update the options", function() {
		var div = document.createElement('div');
		var observer = new Observer(function() {});
		observer.observe(div, {
			attributes: true,
			attributeFilter: ['a']
		});
		observer.observe(div, {
			attributes: true,
			attributeFilter: ['b']
		});

		$.attr(div, "a", "A");
		$.attr(div, "b", "B");

		var records = observer.takeRecords();

		equal(records.length, 1);
		equal(records[0].attributeName, "b");
	});

	test("takeRecords should return the event that has yet to be called.", function() {
		var element = document.createElement("div");

		var observer = new Observer(function(){});

		observer.observe(element, {
			attributes: true
		});

		$("#qunit-test-area").append(element);

		$.attr(element, "foo", "bar");

		var mutations = observer.takeRecords();
		var mutation = mutations[0];

		equal(mutations.length, 1);
		equal(mutation.type, "attributes");
		equal(mutation.target, element);
		equal(mutation.attributeName, "foo");
	});

});
