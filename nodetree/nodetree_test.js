steal("jquery", "./nodetree.js", function($, NodeTree) {
	module("nodetree", {
		setup: function () {
			document.getElementById("qunit-test-area")
				.innerHTML = "";
		}
	});


	test("Inserts children into the right spot", function() {
		var tree = new NodeTree();
		var element = $("<div>");
		element.html("<ul><li><span id='inner'><b></b></span></li></ul>");
		$("#qunit-test-area").append(element);
		var child = $("#inner");

		// Insert the root element.
		tree.insert(element);

		equal(tree.children.length, 1, "The root should have 1 element.");
		equal(tree.children[0].element, element, "The first element is our outer div");

		// Insert the child
		tree.insert(child);

		equal(tree.children[0].children.length, 1, "The first element should have 1 child.");
		equal(tree.children[0].children[0].element, child, "The inner element is child.");
	});

	test("Inserts children with multiple nestings", function() {
		var tree = new NodeTree();
		var element = $("<div>");
		element.html("<ul><li><span id='inner'><b></b></span></li></ul>");
		var qta = $("#qunit-test-area");
		qta.append(element);
		var li = qta.find("li");
		var inner = qta.find("#inner");

		// Insert the root element.
		tree.insert(element);

		// Insert the list item
		tree.insert(li);

		// Insert the inner child
		tree.insert(inner);


		equal(tree.children[0].children.length, 1, "The first element should have 1 child.");
		equal(tree.children[0].children[0].element, li, "The inner element is li.");
		equal(tree.children[0].children[0].children.length, 1, "The li element has 1 child");
		equal(tree.children[0].children[0].children[0].element, inner, "The li element contains the child #inner");

	});

	test("Inserts parents into the right spot", function() {
		var tree = new NodeTree();
		var element = $("<div>");
		element.html("<ul><li><span id='inner'><b></b></span></li></ul>");
		$("#qunit-test-area").append(element);
		var child = $("#inner");

		// First insert the child element
		tree.insert(child);

		// Now insert the root element.
		tree.insert(element);

		// Element should be at the root level now
		equal(tree.children.length, 1, "The root should have 1 element.");
		equal(tree.children[0].element, element, "The first element is our outer div");

		equal(tree.children[0].children.length, 1, "The first element should have 1 child.");
		equal(tree.children[0].children[0].element, child, "The inner element is child.");

	});

	test("Inserting an adjacent node", function() {
		var tree = new NodeTree();
		var one = $("<div id='one'></div>");
		var two = $("<div id='two'></div>");
		var three = $("<div id='three'></div>");
		$("#qunit-test-area").append(one).append(two).append(three);

		// Insert the first element.
		tree.insert(one);

		// Insert the second element
		tree.insert(two);

		// Insert the third element
		tree.insert(three);

		equal(tree.children.length, 3, "The root should have 3 elements");
		equal(tree.children[0].element, one, "The first element is one");
		equal(tree.children[1].element, two, "The second element is two");
		equal(tree.children[2].element, three, "The third element is three");
	});

	test("Inserting an adjacent node in the middle", function() {
		var tree = new NodeTree();
		var one = $("<div id='one'></div>");
		var two = $("<div id='two'></div>");
		var three = $("<div id='three'></div>");
		$("#qunit-test-area").append(one).append(two).append(three);

		// Insert the first element.
		tree.insert(one);

		// Insert the third element
		tree.insert(three);

		// Insert the second element
		tree.insert(two);

		equal(tree.children.length, 3, "The root should have 3 elements");
		equal(tree.children[0].element, one, "The first element is one");
		equal(tree.children[1].element, two, "The second element is two");
		equal(tree.children[2].element, three, "The third element is three");
	});


});
