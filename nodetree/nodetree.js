steal("jquery", "jquerypp/dom/compare", function($) {
	
	function NodeTree() {
		this.children = [];
	}

	$.extend(NodeTree.prototype, {

		/**
		 * Add an element to the tree
		 */
		insert: function(element, parent) {
			parent = parent || this;

			// If there are no elements, insert this as the root
			if(parent.children.length === 0) {
				var node;
				if(!(element instanceof $)) {
					node = element;
				} else {
					node = { element: element };
				}

				parent.children.push(node);
				return;
			}

			this._insert(element, parent);
		},

		_insert: function(element, parent) {
			var tree = parent.children;
			var left = 0;
			var right = tree.length - 1;
			var middle, leaf, node, relation, inParent;

			// Because we use recursion, element might be a Node
			if(!(element instanceof $)) {
				node = element;
				element = node.element;
			}

			while (left <= right) {
				middle = (right + left) >> 1;
				leaf = tree[middle];
				relation = element.compare(leaf.element);

				// leaf is element
				if(relation === 0) {
					left++;
					continue;
				}
				// leaf contains element
				else if(relation & 8) {
					if(!leaf.children) {
						this.__insert(node || element, leaf, 0);
						return;
					}
					tree = leaf.children;
					parent = leaf;
					left = 0;
					right = tree.length - 1;
				}
				// element contains leaf
				else if(relation & 16) {
					if(!node) {
						node = {
							element: element,
							children: []
						};
					} else if(!node.children) {
						node.children = [];
					}
					// Insert the leaf into the node
					this.insert(leaf, node);

					if(!inParent) {
						// Insert the node into the tree
						tree.splice(middle, 1, node);
						inParent = true;
					} else {
						tree.splice(middle, 1);
					}

					left++;
					right = tree.length - 1;
					continue;
				}
				// leaf procedes element
				else if(relation & 2) {
					left = middle + 1;
					leaf = tree[left];
					relation = leaf && element.compare(leaf.element);
					if(!leaf || relation & 4) {
						node = this.__insert(node || element, parent, middle + 1);
						inParent = true;

						continue;
					}
				}
				// element procedes leaf
				else if(relation & 4) {
					right = middle - 1;
					leaf = tree[right];
					relation = leaf && element.compare(leaf.element);
					if(!leaf || relation & 2) {
						node = this.__insert(node || element, parent, middle - 1);
						inParent = true;

						left--;
						right = tree.length - 1;
						continue;
					}
				} else {
					return;
				}
			}
		},

		__insert: function(child, parent, index) {
			if(!parent.children) {
				parent.children = [];
			}

			var node = !(child instanceof $) ? child : {
				element: child
			};

			parent.children.splice(index, 0, node);
			return node;
		}

	});

	return NodeTree;

});
