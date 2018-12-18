react-component: $(public)
	echo Creating react component ..................
	cd provenance && npm install
	cd provenance && yarn build && yarn deploy

build: react-component
	hugo

test: react-component
	hugo server

clean:
	rm -rf public || true
