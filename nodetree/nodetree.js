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

			this._insert(element, this);
		},

		_insert: function(element, parent) {
			var tree = parent.children;
			var left = 0;
			var right = tree.length - 1;
			var middle, leaf, relation;

			while (left <= right) {
				middle = (right + left) >> 1;
				leaf = tree[middle];
				relation = element.compare(leaf.element);

				// leaf contains element
				if(relation & 8) {
					if(!leaf.children) {
						this.__insert(element, leaf, 0);
						return;
					}
					tree = leaf.children;
					parent = leaf;
					left = 0;
					right = tree.length - 1;
				}
				// element contains leaf
				else if(relation & 16) {
					// Remove the child and place the element in its place
					tree.splice(middle, 1, {
						element: element,
						children: [leaf]
					});
					return;
				}
				// leaf procedes element
				else if(relation & 2) {
					left = middle + 1;
					leaf = tree[left];
					relation = leaf && element.compare(leaf.element);
					if(!leaf || relation & 4) {
						this.__insert(element, parent, middle + 1);
						return;
					}
				}
				// element procedes leaf
				else if(relation & 4) {
					
					right = middle - 1;

					console.log("element procedes found");
				}

				//return;
			}
		},

		__insert: function(child, parent, index) {
			if(!parent.children) {
				parent.children = [];
			}

			parent.children.splice(index, 0, {
				element: child
			});
		}

	});

	return NodeTree;

});
