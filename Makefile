%:
	node_modules/browserify/bin/cmd.js -o static/build/$@.js static/scripts/$@.js
	# node_modules/uglify-js/bin/uglifyjs -o static/build/$@.min.js static/build/$@.js
