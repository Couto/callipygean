WATCH=""
REPORTER="nyan"

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
	@./node_modules/.bin/serve &

server-stop:
	@kill $$(ps -ef | grep "node ./node_modules/.bin/serve" | grep -v grep | awk '{print $$2}')

min: clean
	@mkdir dist && touch dist/callipygean.min.js
	@./build/jpp.js lib/callipygean.js dist/callipygean.js | xargs ./node_modules/.bin/uglifyjs \
		--output dist/callipygean.min.js \
		--mangle-toplevel \
		--no-dead-code \
		--unsafe \
		--lift-vars

.PHONY: test
