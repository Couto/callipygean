WATCH=""
REPORTER="spec"

all: lint test min

lint:
	@./node_modules/.bin/jslint dist/callipygean.js

test: min
	@zsh -c "./node_modules/.bin/mocha -u bdd $(WATCH) --reporter $(REPORTER) ./test/**/*.test.js"

test-b:
	@$(min)
	@$(MAKE) lint
	@$(MAKE) server &
	@open 'http://localhost:8000/test'

watch:
	$(MAKE) test WATCH="-w" REPORTER="min"

clean:
	@rm -r dist

jpp:
	@./build/jpp.js lib/callipygean.js

server:
	@python -m SimpleHTTPServer &

server-stop:
	@ps | grep "python -m" | egrep -o -e "^[0-9]+" | xargs kill

min: clean
	@mkdir dist && touch dist/callipygean.min.js
	@./build/jpp.js lib/callipygean.js dist/callipygean.js | xargs ./node_modules/.bin/uglifyjs \
		--output dist/callipygean.min.js \
		--mangle-toplevel \
		--no-dead-code \
		--unsafe \
		--lift-vars

.PHONY: test
