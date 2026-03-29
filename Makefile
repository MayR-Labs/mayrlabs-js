.PHONY: help %-pg-setup %-yalc

help:
	@echo "Available commands:"
	@echo "  make <package>-pg-setup   - Setup playground for <package>"
	@echo "  make <package>-yalc       - Publish package to yalc"

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
