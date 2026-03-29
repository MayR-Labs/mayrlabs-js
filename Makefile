.PHONY: help %-pg-setup %-yalc %-build

help:
	@echo "Available commands:"
	@echo "  make <package>-pg-setup   - Setup playground for <package>"
	@echo "  make <package>-yalc       - Publish package to yalc"
	@echo "  make <package>-build      - Build package"

%-pg-setup:
	@echo "Setting up playground for $*..."
	@rm -rf playground/$*-pg
	@mkdir -p playground/$*-pg
	@cp -r playground/.setup/$*/* playground/$*-pg/
	@echo "Installing dependencies..."
	@cd playground/$*-pg && npm install
	@echo "Setup complete for $*"

%-yalc:
	@echo "Publishing $* to yalc..."
	@cd "packages/$*" && yalc publish

%-build:
	@echo "Building $*..."
	@cd "packages/$*" && npm run build
