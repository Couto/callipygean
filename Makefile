WATCH=""
REPORTER="nyan"

all: lint test min

lint:
	@./node_modules/.bin/jshint dist/callipygean.js

test: min
	@zsh -c "./node_modules/.bin/mocha -u bdd $(WATCH) --reporter $(REPORTER) ./test/**/*.test.js"

test-b:
	@$(min)
	@$(MAKE) lint
	@$(MAKE) server
	@open 'http://localhost:3000/test'

watch:
	$(MAKE) test WATCH="-w" REPORTER="min"

clean:
	@rm -r dist

jpp:
	@./build/jpp.js lib/callipygean.js | ./node_modules/.bin/js-beautify --jslint-happy - 
server:
	@if [[ $$(ps -ef | grep "node ./node_modules/.bin/serve" | grep -v grep | awk '{print $$2}') -gt 0 ]]; then \$(MAKE) server-stop; fi
	@./node_modules/.bin/serve > /dev/null &

server-stop:
	@kill $$(ps -ef | grep "node ./node_modules/.bin/serve" | grep -v grep | awk '{print $$2}')

min: clean
	@mkdir dist && touch dist/callipygean.min.js
	@$(MAKE) jpp > dist/callipygean.js
	@cat dist/callipygean.js | ./node_modules/.bin/uglifyjs \
		--output dist/callipygean.min.js \
		--mangle-toplevel \
		--no-dead-code \
		--unsafe \
		--lift-vars

.PHONY: test
