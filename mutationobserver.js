steal("mutationobserver/jquery", "mutationobserver/mutationevent", function(jObserver, EventObserver) {

	if(window.MutationObserver) {
		return window.MutationObserver;
	} else if(window.MutationEvent) {
		return EventObserver;
	} else {
		return jObserver;
	}

});
