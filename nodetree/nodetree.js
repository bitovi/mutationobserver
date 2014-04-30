steal("jquery", function($) {
	
	function NodeTree() {
		this.root = [];
	}

	$.extend(NodeTree.prototype, {

		/**
		 * Add an element to the tree
		 */
		insert: function(element) {
			this.traverse(this.root, element);
		},

		traverse: function(arr, element) {
			var length = arr.length;
			var start = Math.ceil(length / 2);
			var foundElement = arr[start];

			var relation = element.compare(foundElement);

			if(relation & 2) {
				// foundElement procedes element
			} else if(relation & 4) {
				// element procedes foundElement
			} else if(relation & 8) {
				// foundElement contains element

			} else if(relation & 16) {
				// element contains foundElement
			}

		}

	});

	return NodeTree;

});
