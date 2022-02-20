# Echo colors
GREEN = \033[1;32m
RED = \033[1;31m
RESET = \033[0m

##@ General

# The help target prints out all targets with their descriptions organized
# beneath their categories. The categories are represented by '##@' and the
# target descriptions by '##'. The awk commands is responsible for reading the
# entire set of makefiles included in this invocation, looking for lines of the
# file as xyz: ## something, and then pretty-format the target and help. Then,
# if there's a line with ##@ something, that gets pretty-printed as a category.
# More info on the usage of ANSI control characters for terminal formatting:
# https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_parameters
# More info on the awk command:
# http://linuxcommand.org/lc3_adv_awk.php

.PHONY: help
help: ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Web app

.PHONY: wa-start
wa-start: ## Start the web application on localhost
	cd app/ && npm run start

##@ Smart contract

.PHONY: sc-build
sc-build: ## Build the smart contracts
	cd contract/ && npx hardhat compile
	@echo "$(GREEN)> contracts successfully compiled$(RESET)"

.PHONY: sc-deploy-local
sc-deploy-local: ## Deploy the Miniflix SubscriptionCards smart contract on localhost
	cd contract/ && npx hardhat run scripts/deploy.js
	@echo "$(GREEN)> contracts successfully deployed on localhost$(RESET)"

.PHONY: sc-deploy-mumbai
sc-deploy-mumbai: ## Deploy the Miniflix SubscriptionCards smart contract on polygon mumbai
	cd contract/ && npx hardhat run scripts/deploy.js --network polygon_mumbai
	@echo "$(GREEN)> contracts successfully deployed on poylgon mumbai$(RESET)"
	@echo "$(RED)> don't forget to verify the contracts using polygonscan!$(RESET)"
