# ### The Use

# `$ make script-SCRIPT`      to bundle a static script.
# `$ make script-SCRIPT--min` to build a bundled and compressed static script.
# `$ make style-STYLE`        to bundle a static scss stylesheet.
# `$ make style-STYLE--min`   to build a bundled and compressed static scss stylesheet.
# `$ make lint`               to lint the server.
# `$ make lint-SCRIPT`        to lint a static script.

SCRIPTS_DIST := static/dist/scripts
SCRIPTS      := static/scripts

lint-%:
	node_modules/.bin/jshint --verbose --config static/.jshintrc $(SCRIPTS)/$*

lint:
	node_modules/.bin/jshint --verbose .

script-%--min:
	@make --no-print-directory script-$*
	node_modules/.bin/uglifyjs -o $(SCRIPTS_DIST)/$(subst .js,.bundle.min.js,$*) $(SCRIPTS_DIST)/$(subst .js,.bundle.min.js,$*) -mc

script-%:
	@make --no-print-directory lint-$*
	node_modules/.bin/browserify -o $(SCRIPTS_DIST)/$(subst .js,.bundle.min.js,$*) $(SCRIPTS)/$* -x qs

STYLES_DIST := static/dist/styles
STYLES      := static/styles

style-%--no-importer--cat--min:
	cat $(STYLES)/$* | node_modules/.bin/node-sass --include-path node_modules --include-path static/styles --output-style compressed > $(STYLES_DIST)/$(subst .scss,.bundle.min.css,$*)

style-%--no-importer--cat:
	cat $(STYLES)/$* | node_modules/.bin/node-sass --include-path node_modules --include-path static/styles > $(STYLES_DIST)/$(subst .scss,.bundle.min.css,$*)

style-%--importer:
	node_modules/.bin/node-sass --include-path node_modules --include-path static/styles --importer node_modules/node-sass-once-importer/dist/cli.js -o $(STYLES_DIST) $(STYLES)/$*
	mv $(STYLES_DIST)/$(subst .scss,.css,$*) $(STYLES_DIST)/$(subst .scss,.bundle.min.css,$*)

style-%--importer--min:
	node_modules/.bin/node-sass --include-path node_modules --include-path static/styles --importer node_modules/node-sass-once-importer/dist/cli.js -o $(STYLES_DIST) --output-style compressed $(STYLES)/$*
	mv $(STYLES_DIST)/$(subst .scss,.css,$*) $(STYLES_DIST)/$(subst .scss,.bundle.min.css,$*)
