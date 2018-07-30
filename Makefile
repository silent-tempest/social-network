# ### The Use

# `$ make script-SCRIPT`     to bundle a static script.
# `$ make script-min-SCRIPT` to build a bundled and compressed static script.
# `$ make style-STYLE`       to bundle a static scss stylesheet.
# `$ make style-min-STYLE`   to build a bundled and compressed static scss stylesheet.
# `$ make lint`              to lint the server.
# `$ make lint-SCRIPT`       to lint a static script.

SCRIPTS_DIST := static/dist/scripts
SCRIPTS      := static/scripts

lint:
	node_modules/.bin/jshint --verbose .

lint-%:
	node_modules/.bin/jshint --verbose --config static/.jshintrc $(SCRIPTS)/$*

script-%:
	@make --no-print-directory lint-$*
	node_modules/.bin/browserify -o $(SCRIPTS_DIST)/$(subst .js,.bundle.js,$*) $(SCRIPTS)/$* -g [ babelify ]

script-min-%:
	@make --no-print-directory script-$*
	node_modules/.bin/uglifyjs -o $(SCRIPTS_DIST)/$(subst .js,.bundle.min.js,$*) $(SCRIPTS_DIST)/$(subst .js,.bundle.js,$*) -mc

STYLES_DIST := static/dist/styles
STYLES      := static/styles

style-%:
	cat $(STYLES)/$* | node_modules/.bin/node-sass --include-path node_modules --include-path static/styles > $(STYLES_DIST)/$(subst .scss,.bundle.css,$*)

style-min-%:
	@make --no-print-directory style-$*
	cat $(STYLES)/$* | node_modules/.bin/node-sass --include-path node_modules --include-path static/styles --output-style compressed > $(STYLES_DIST)/$(subst .scss,.bundle.min.css,$*)
