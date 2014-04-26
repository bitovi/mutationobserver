steal(function() {
  // We use setImmediate or postMessage for our future callback.
  var setImmediate = window.msSetImmediate || window.setImmediate;

	// From https://github.com/YuzuJS/setImmediate/blob/master/setImmediate.js
	// PostMessage is synchronous in IE8 so we don't want to use it.
	function canUsePostMessage() {
		// The test against `importScripts` prevents this implementation from being installed inside a web worker,
		// where `global.postMessage` means something completely different and can't be used for this purpose.

		if (!window.postMessage || window.importScripts) {
			return false;
		}

		var postMessageIsAsynchronous = true;
		var oldOnMessage = window.onmessage;
		window.onmessage = function () {
			postMessageIsAsynchronous = false;
		};
		window.postMessage("", "*");
		window.onmessage = oldOnMessage;

		return postMessageIsAsynchronous;
	}

  // Use post message to emulate setImmediate if an async version is available,
	// otherwise fallback to setTimeout
  if (!setImmediate) {

		if (canUsePostMessage()) {
			var setImmediateQueue = [];
			var sentinel = String(Math.random());
			var ael = window.addEventListener ? "addEventListener" : "attachEvent";
			window[ael]("message", function(e) {
				if (e.data === sentinel) {
					var queue = setImmediateQueue;
					setImmediateQueue = [];
					for(var i = 0, len = queue.length; i < len; i++) {
						queue[i]();
					}
				}
			});
			setImmediate = function(func) {
				setImmediateQueue.push(func);
				window.postMessage(sentinel, "*");
			};
		} else {
			setImmediate = function(func) {
				setTimeout(func, 0);
			};
		}
  }

	return setImmediate;
});
