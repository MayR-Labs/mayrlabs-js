GENESIS_PG_NAME=genesis-pg
GENESIS_PKG_NAME=@mayrlabs/setup-project
GENESIS_PATH=./../../packages/setup-project

.PHONY: init-genesis-pg

setup-genesis-pg:
	@echo "Initialising npm"
	@cd $(GENESIS_PG_NAME) && npm init -y
	@echo "Installing dependencies"
	@cd $(GENESIS_PG_NAME) && npm install "$(GENESIS_PKG_NAME)@file:$(GENESIS_PATH)"

recreate-genesis-pg:
	@echo "Recreating installation"
	@rm -rf $(GENESIS_PG_NAME) && @mkdir $(GENESIS_PG_NAME)
	@$(MAKE) setup-genesis-pg

reset-genesis-pg:
	@echo "Cleaning $(GENESIS_PG_NAME)..."
	@cd $(GENESIS_PG_NAME) && rm -rf ./*
	@$(MAKE) setup-genesis-pg
