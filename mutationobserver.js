steal("mutationobserver/jquery", function(jObserver) {
	return jObserver;
});

/*steal('can/util/can.js', 
			'./mutation_event', function(can, Observer) {
	if(window.MutationObserver) {
		can.MutationObserver = MutationObserver;
	} else {
		can.MutationObserver = Observer;
	}

	return can.MutationObserver;
});*/
