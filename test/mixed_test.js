steal("jquery", "mutationobserver", function($, Observer) {
	module("mixed", {
		setup: function () {
			document.getElementById("qunit-test-area")
				.innerHTML = "";
		}
	});

	test("childList and attributes", function() {
		var element = document.createElement("div");
		var child = document.createElement("span");

		var observer = new Observer(function(){});

		observer.observe(element, {
			childList: true,
			attributes: true
		});

		$("#qunit-test-area").append(element);

		// Insert the child
		$(element).append(child);

		// Change an attribute
		$(element).attr("foo", "bar");

		var records = observer.takeRecords();

		equal(records.length, 2, "There were 2 mutations");

		// childList assertions
		equal(records[0].type, "childList", "The first mutation was childList");
		equal(records[0].addedNodes.length, 1, "There was one node added");
		equal(records[0].addedNodes[0], child, "The node added was child");

		// attributes assertions
		equal(records[1].type, "attributes", "The second mutation was attributes");
		equal(records[1].target, element, "The target was element");
		equal(records[1].attributeName, "foo", "The attribute that was added is foo");
	});



});
