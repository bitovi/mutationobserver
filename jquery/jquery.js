// # jQuery MutationObserver
//
// This implements `MutationObserver` for older browers that do not support
// native MutationObservers or Mutation Events.

steal("jquery", "mutationobserver/setimmediate", "mutationobserver/nodetree", function($, setImmediate) {

	if(window.MutationObserver || window.MutationEvent) {
		return;
	}

	// Feature detect which domManip we are using.
	// Handles insertions, like `append`, `insertBefore`, etc.
	var oldDomManip = $.fn.domManip;
	$.fn.domManip = function () {
		var addedNodes = [];
		var num = arguments.length;
		var callback = arguments[num - 1];
		
		// Get all of the nodes that have been added
		arguments[num - 1] = function(elem) {
			// If it's a DocumentFragment, get the fragment's children
			if(elem.nodeType === 11) {
				$(elem).children().each(function(i, innerelem) {
					addedNodes.push(innerelem);
				});
			} else {
				addedNodes.push(elem);
			}
			return callback.apply(this, arguments);
		};

		var ret = oldDomManip.apply(this, arguments);

		// Traverse to inform parents of the event.
		if(addedNodes.length) {
			traverse($(addedNodes[0]), "canChildList", handleChildList, {
				addedNodes: addedNodes
			});
		}

		return ret;
	};

	// Handles removes like `remove` and `empty`
	var oldClean = $.cleanData;
	$.cleanData = function (elems) {
		$.each(elems, function(i, element) {
			traverse($(element), "canChildList", handleChildList, {
				removedNodes: [element]
			});
		});

		oldClean(elems);
	};

	// Helper for the 2 different `attr` methods, just checks to see if the element
	// has a mutationobservation, and if so calls the appropriate handler.
	var triggerAttributes = function(el, attrName, oldValue) {
		var $el = $(el);
		var data = $el.data("canAttribute");
		var event = {
			target: el,
			attributeName: attrName,
			oldValue: oldValue
		};
		
		if(data) {
			handleAttributes(el, el, data, event);
		}

		traverse($el, "canAttribute", handleAttributes, event);
	};

	// Wrapper for jQuery's `attr` method, determines whether the value has changed
	// and if so triggers the attributes mutation event.
	var oldAttr = $.attr;
	$.attr = function (el, attrName) {
		var oldValue, newValue;
		if (arguments.length >= 3) {
			oldValue = oldAttr.call(this, el, attrName);
		}
		var res = oldAttr.apply(this, arguments);
		if (arguments.length >= 3) {
			newValue = oldAttr.call(this, el, attrName);
		}
		if (newValue !== oldValue) {
			triggerAttributes(el, attrName, oldValue);
		}
		return res;
	};
	var oldRemove = $.removeAttr;
	$.removeAttr = function (el, attrName) {
		var oldValue = oldAttr.call(this, el, attrName),
			res = oldRemove.apply(this, arguments);

		if (oldValue != null) {
			triggerAttributes(el, attrName, oldValue);
		}
		return res;
	};

	// Traverse a node looking for `name` data to which we'll call `fn`. This is
	// how we know if an element's parents are interested in its mutations and if
	// a mutation event will be queued on the observer.
	var traverse = function(element, name, fn, event) {
		var parent = element.parent();

		while(parent && parent.length) {
			var data = parent.data(name);

			if(data) {
				fn(parent[0], element[0], data, event);
			}

			parent = parent.parent();
		}
	};

	// Handles queueing of "attributes" mutation event for a given element
	var handleAttributes = function(element, target, data, event) {
		var observer = data.observer;
		var options = data.options;

		// If we're not observing subtrees, then make sure that the target
		// element is the element of this observation.
		if(!options.subtree && element !== target) {
			return;
		}

		// If using attribute filters, make sure this is an attribute
		// that we care about.
		if(options.attributeFilter &&
			 $.inArray(event.attributeName, options.attributeFilter) === -1) {
			return;
		}

		event.type = "attributes";

		// If this observation doesn't care about oldValue, don't send that
		// as part of the event.
		if(!options.attributeOldValue) {
			delete event.oldValue;
		}
		observer._queue(event);
	};

	// Handles queuing up the mutation event for a given element that is interested
	// in "childList" type of mutations, obeying what options are applicable for
	// this given observation.
	var handleChildList = function(element, target, data, event) {
		var observer = data.observer;
		var options = data.options;

		// If we are not observing `subtree` then the `child` must be
		// a direct child of `element`.
		if(!options.subtree && target.parentNode !== element) {
			return;
		}

		// Set event properties
		event.type = "childList";
		// The target is the parent of the inserted node.
		event.target = target.parentNode;

		observer._queue(event);
	};

	/**
	 * @constructor jMutationObserver
	 * @hide
	 *
	 * @description `jMutationObserver` is an object that allows users to observe
	 * elements for mutations such as attributes changing, or child elements being
	 * added/removed.
	 *
	 * @signature `new MutationObserver(callback(mutations) )`
	 *
	 * @param {Function} callback A callback that will be called when mutations occur
	 *
	 * @return {MutationObserver} A MutationObserver-like object
	 *
	 * @body
	 *
	 * A MutationObserver is a special type of object that is able to observe
	 * HTMLElements and report on mutations that happen to them. Using a MutationObserver
	 * allows you to create special behavior in response to DOM changes. You use
	 * MutationObserver by calling the constructor with a callback function that will
	 * be called when mutations occur on the elements that have been set up
	 * in `observe`.
	 *
	 * ## Example
	 *
	 * Let's say you wanted to observe changes to an element's attributes.
	 *
	 *     var observer = new MutationObserver(function(mutations) {
	 *       can.each(mutations, function(mutation) {
	 *         var type = mutation.type;
	 *         var target = mutation.target;
	 *         var attrName = mutation.attributeName;
	 *         var oldValue = mutation.oldValue;
	 *       });
	 *     });
	 *
	 *     observer.observe(element, {
	 *       attributes: true
	 *     });
	 * 
	 */
	function jMutationObserver(callback) {
		this._callback = callback;
		this._mutations = [];
		this._bound = [];
	}

	$.extend(jMutationObserver.prototype, {

		/**
		 * @method observe
		 * @hide
		 *
		 * Observe an element with a set of options to control what type of observations
		 * you are interested in.
		 *
		 * ## Types
		 *
		 * There are 2 major groups of observations that a MutationObserver can do.
		 *
		 * ### attributes
		 *
		 * Setting `attributes: true` on the MutationObserverInit options to observer
		 * changes to attributes on the provided element. If you are also interested
		 * in knowing the previous value (when an attribute changes) then also set
		 * `attributesOldValue` to true.
		 *
		 * ### childList
		 *
		 * Setting `childList: true` will observe changes to the element's child nodes.
		 * That could either be nodes being added to the element, or nodes being removed
		 * from the element.
		 *
		 * For each mutation there will either be an array of `addedNodes` or an
		 * array of `removedNodes` that contains each node that was added/removed.
		 *
		 * @param {HTMLElement} element The element to observe
		 * @param {MutationObserverInit} options Init options for this observation
		 */
		observe: function(element, options) {
			var $element = $(element);

			// This is the jQuery data we will be attaching to the element
			var data = {
				observer: this,
				options: options
			};

			// If we aren't already observing this, mark it as so. Otherwise remove
			// the data we previously added to the element so that they will be replaced
			// by the new options passed into `observe`.
			if(this._observing(element)) {
				$element.removeData("canAttribute");
				$element.removeData("canChildList");
			} else {
				this._bound.push($element);
			}

			// For the `attributes` type of observation.
			if(options.attributes) {
				$element.data("canAttribute", data);
			}

			// For the `childList` type of observation.
			if(options.childList) {
				$element.data("canChildList", data);
			}
		},

		/**
		 * @method disconnect
		 * @hide
		 *
		 * Disconnect all observations from this MutationObserver. This will prevent
		 * any further mutations from causing the MutationObserver's callback from
		 * being called.
		 */
		disconnect: function() {
			var bound = this._bound;
			this._bound = [];

			$.each(bound, function(i, element) {
				element.removeData("canAttribute");
				element.removeData("canChildList");
			});
		},

		/**
		 * @method takeRecords
		 * @hide
		 *
		 * Takes the current mutations that have not been fired and empties the queue.
		 * This is useful if you are making mutations in a script and want to know
		 * what type of mutation events it is created by do not want to find out in the
		 * callback (which will not be fired until the next event loop).
		 *
		 * ## Example
		 *
		 *     var observer = new MutationObserver(function(){});
		 *
		 *     observer.observe(element, {
		 *       attributes: true
		 *     });
		 *
		 *     $(element).attr("foo", "bar");
		 *
		 *     var records = observer.takeRecords();
		 *     var mutation = records[0];
		 *
		 *     mutation.attributeName === "foo";
		 *
		 * @return {Array} An array of mutations
		 */
		takeRecords: function() {
			var mutations = this._mutations;
			this._mutations = [];
			return mutations;
		},

		/**
		 * @method _observing
		 * @hide
		 *
		 * Determines if an element is already being observed. Per the spec, the element
		 * can only be observed once per MutationObserver.
		 *
		 * @param {HTMLElement} element
		 * @return {Boolean} True if the element is already being observed
		 */
		_observing: function(element) {
			var bound = this._bound;

			for(var i = 0, len = bound.length; i < len; i++) {
				if(bound[i][0] === element) {
					return true;
				}
			}

			return false;
		},

		/**
		 * @method _queue
		 * @hide
		 *
		 * Queue a mutation to be called again the Observer's callback.
		 * Pushes the mutation into an array so that if there are multiple mutations
		 * that occur before the end of the event loop, all of those mutations will
		 * be called into the callback.
		 *
		 * @param {Object} event The mutation that will be called
		 */
		_queue: function(event) {
			this._mutations.push(event);

			if(this._mutations.length === 1) {
				var self = this;

				setImmediate(function() {
					var mutations = self._mutations;
					self._mutations = [];

					if(mutations.length) {
						self._callback(mutations);
					}
				});
			}
		}

	});

	return jMutationObserver;
});
