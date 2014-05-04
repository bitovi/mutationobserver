steal("jquery", "jquerypp/dom/compare", function($) {
	
	function NodeTree() {
		this.children = [];
	}

	$.extend(NodeTree.prototype, {

		/**
		 * Add an element to the tree
		 */
		insert: function(element) {
			// If there are no elements, insert this as the root
			if(this.children.length === 0) {
				this.children.push({
					element: element
				});
				return;
			}

			this._insert(element, this.children, this);
		},

		/**
		 * Add an element to the tree
		 */
		_insert: function(element, tree, parent) {
			var len = tree.length;
			var found;

			for(var i = 0; i < len; i++) {
				found = tree[i];

				var relation = element.compare(found.element);

				// found contains element
				// Insert element as a child of found
				if(relation & 8) {
					// If there are children
					if(found.children) {
						this._insert(element, found.children, found);
					} else {
						this.__insert({
							element: element
						}, found);
					}
				}
				// element contains found
				else if(relation & 16) {
					var node = {
						element: element
					};
					this.__insert(found, node);

					// Insert the new node to the correct spot
					tree.splice(i, 1, node);
				}
				// found procedes element
				else if(relation & 2) {

					console.log("found procedes element");
				}
				// element procedes foundElement
				else if(relation & 4) {
					console.log("element procedes found");
				}
			}

		},

		__insert: function(child, parent) {
			if(!parent.children) {
				parent.children = [];
			}

			parent.children.push(child);
		}

	});

	return NodeTree;

});
