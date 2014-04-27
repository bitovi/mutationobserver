steal("mutationobserver/jquery", "mutationobserver/mutationevent", function(jObserver, EventObserver) {

	return jObserver;

	if(window.MutationObserver) {
		return window.MutationObserver;
	} else if(window.MutationEvent) {
		return EventObserver;
	} else {
		return jObserver;
	}

});
