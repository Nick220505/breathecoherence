#!/bin/bash

# Git Deployment Scripts
# Usage: ./scripts/git-deploy.sh [command]
# Commands:
#   full    - Deploy dev → stg → main (full deployment)
#   staging - Deploy dev → stg only (staging deployment)

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Emojis for better visual feedback
ROCKET="🚀"
ARROW="🔄"
CHECK="✅"
POINT="📍"
PUSH="📤"
CHART="📊"

# Function to print colored output
print_step() {
    echo -e "${BLUE}${1}${NC}"
}

print_success() {
    echo -e "${GREEN}${1}${NC}"
}

print_info() {
    echo -e "${YELLOW}${1}${NC}"
}

# Function to get current branch
get_current_branch() {
    git branch --show-current
}

# Function to ensure we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}Error: Not in a git repository${NC}"
        exit 1
    fi
}

# Function to check if branch exists
check_branch_exists() {
    local branch=$1
    if ! git show-ref --verify --quiet refs/heads/$branch; then
        echo -e "${RED}Error: Branch '$branch' does not exist${NC}"
        exit 1
    fi
}

# Function for full deployment: dev → stg → main
deploy_full() {
    local current_branch=$(get_current_branch)
    
    print_step "${ROCKET} Starting full deployment flow: dev → stg → main"
    print_info "${POINT} Current branch: $current_branch"
    echo ""
    
    # Check if required branches exist
    check_branch_exists "dev"
    check_branch_exists "stg"
    check_branch_exists "main"
    
    # Step 1: dev → stg
    print_step "${ARROW} Step 1: Switching to stg and merging dev..."
    git checkout stg
    git merge dev
    print_step "${PUSH} Pushing stg..."
    git push origin stg
    echo ""
    
    # Step 2: stg → main
    print_step "${ARROW} Step 2: Switching to main and merging stg..."
    git checkout main
    git merge stg
    print_step "${PUSH} Pushing main..."
    git push origin main
    echo ""
    
    # Step 3: Return to dev
    print_step "${ARROW} Step 3: Returning to dev..."
    git checkout dev
    echo ""
    
    print_success "${CHECK} Full deployment complete!"
    print_success "${CHART} All branches synchronized: dev → stg → main"
}

# Function for staging deployment: dev → stg
deploy_staging() {
    local current_branch=$(get_current_branch)
    
    print_step "${ROCKET} Starting staging deployment: dev → stg"
    print_info "${POINT} Current branch: $current_branch"
    echo ""
    
    # Check if required branches exist
    check_branch_exists "dev"
    check_branch_exists "stg"
    
    # Step 1: dev → stg
    print_step "${ARROW} Step 1: Switching to stg and merging dev..."
    git checkout stg
    git merge dev
    print_step "${PUSH} Pushing stg..."
    git push origin stg
    echo ""
    
    # Step 2: Return to dev
    print_step "${ARROW} Step 2: Returning to dev..."
    git checkout dev
    echo ""
    
    print_success "${CHECK} Staging deployment complete!"
    print_success "${CHART} Changes deployed: dev → stg"
}

# Function to show usage
show_usage() {
    echo "Git Deployment Scripts"
    echo ""
    echo "Usage: ./scripts/git-deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  full     Deploy dev → stg → main (full production deployment)"
    echo "  staging  Deploy dev → stg only (staging deployment)"
    echo "  help     Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./scripts/git-deploy.sh full     # Full deployment to production"
    echo "  ./scripts/git-deploy.sh staging  # Deploy to staging only"
}

# Main script logic
main() {
    check_git_repo
    
    case "${1:-}" in
        "full")
            deploy_full
            ;;
        "staging")
            deploy_staging
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        "")
            echo -e "${RED}Error: No command specified${NC}"
            echo ""
            show_usage
            exit 1
            ;;
        *)
            echo -e "${RED}Error: Unknown command '$1'${NC}"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

# Run the main function with all arguments
main "$@"
