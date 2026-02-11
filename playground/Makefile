GENESIS_PG_NAME=genesis-pg
GENESIS_PKG_NAME=@mayrlabs/setup-project

.PHONY: init-genesis-pg

init-genesis-pg:
	@echo "Removing old installation"
	@rm -rf $(GENESIS_PG_NAME)
	@echo "Creating new folder"
	@mkdir $(GENESIS_PG_NAME)
	@echo "Initialising npm"
	@cd $(GENESIS_PG_NAME) && npm init -y
	@echo "Installing dependencies"
# 	@cd $(GENESIS_PG_NAME) && npm install $(GENESIS_PKG_NAME)@workspace:*
