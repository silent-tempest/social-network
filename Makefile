# ### The Use

# `$ make script-SCRIPT`      to bundle a static script.
# `$ make script-SCRIPT--min` to build a bundled and compressed static script.
# `$ make style-STYLE`        to bundle a static scss stylesheet.
# `$ make style-STYLE--min`   to build a bundled and compressed static scss stylesheet.
# `$ make lint--static`       to lint static scripts.
# `$ make lint`               to lint server scripts.

SCRIPTS_DIST := static/dist/scripts
SCRIPTS      := static/scripts

lint--static:
	node_modules/.bin/jshint --verbose --config static/.jshintrc $(SCRIPTS)

lint:
	node_modules/.bin/jshint --verbose .

script-%--min:
	@make --no-print-directory script-$*
	node_modules/.bin/uglifyjs -o $(SCRIPTS_DIST)/$(subst .js,.bundle.min.js,$*) $(SCRIPTS_DIST)/$(subst .js,.bundle.min.js,$*) -mc

script-%:
	@make --no-print-directory lint--static
	node_modules/.bin/browserify -o $(SCRIPTS_DIST)/$(subst .js,.bundle.min.js,$*) $(SCRIPTS)/$*

STYLES_DIST := static/dist/styles
STYLES      := static/styles

style-%--no-importer--min:
	cat $(STYLES)/$* | node_modules/.bin/node-sass --include-path node_modules --include-path static/styles --output-style compressed > $(STYLES_DIST)/$(subst .scss,.bundle.min.css,$*)

style-%--no-importer:
	cat $(STYLES)/$* | node_modules/.bin/node-sass --include-path node_modules --include-path static/styles > $(STYLES_DIST)/$(subst .scss,.bundle.min.css,$*)

style-%:
	node_modules/.bin/node-sass --include-path node_modules --include-path static/styles --importer node_modules/node-sass-once-importer/dist/cli.js -o $(STYLES_DIST) $(STYLES)/$*
	mv $(STYLES_DIST)/$(subst .scss,.css,$*) $(STYLES_DIST)/$(subst .scss,.bundle.min.css,$*)

style-%--min:
	node_modules/.bin/node-sass --include-path node_modules --include-path static/styles --importer node_modules/node-sass-once-importer/dist/cli.js -o $(STYLES_DIST) --output-style compressed $(STYLES)/$*
	mv $(STYLES_DIST)/$(subst .scss,.css,$*) $(STYLES_DIST)/$(subst .scss,.bundle.min.css,$*)
