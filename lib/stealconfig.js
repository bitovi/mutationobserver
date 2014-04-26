steal.config({
	map: {
		"*": {
			"jquery/jquery.js" : "jquery"
		}
	},
	paths: {
		"jquery": "mutationobserver/lib/jquery.1.10.2.js"
	},
	shim : {
		jquery: {
			exports: "jQuery"
		}
	},
	ext: {
		js: "js",
	},
	root: steal.config('root').join('../../')
})
