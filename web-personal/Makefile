build: clean
	(cd ../lib; make build)
	npm install
	npx tsc

run: build
	node dist/index.js

clean:
	(cd ../lib; rm -rf dist)
	rm -rf node_modules
	rm -rf dist

build-docker:

