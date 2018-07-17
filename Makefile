SOURCES := main.coffee
MAIN    := main.js

all: $(SOURCES) $(MAIN)

%.coffee:
	coffee -o static/scripts static/coffee/$@

$(MAIN):
	browserify -o static/build/$(MAIN) static/scripts/$(MAIN)
