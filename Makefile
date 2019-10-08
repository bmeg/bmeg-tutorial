react-component: $(public)
	@echo Creating provenance react component ..................
	cd provenance && yarn install
	cd provenance && yarn build && yarn deploy
	@echo Creating schema-viewer react component ..................
	cd schema-viewer && yarn install
	cd schema-viewer && yarn build && yarn deploy

build: react-component
	hugo

test: react-component
	hugo server

clean:
	rm -rf public || true
