# Git Deployment Scripts

This directory contains deployment automation scripts for the project's Git workflow.

## 📁 Files

- `git-deploy.sh` - Main deployment script with multiple commands
- `README.md` - This documentation file

## 🚀 Usage

### Prerequisites

- Git installed on your machine
- Bash shell (available on Linux, macOS, and Windows with Git Bash)
- Access to the repository with `dev`, `stg`, and `main` branches

### Commands

#### Full Deployment (dev → stg → main)

```bash
./scripts/git-deploy.sh full
```

This command:

1. Switches to `stg` branch
2. Merges `dev` into `stg`
3. Pushes `stg` to remote
4. Switches to `main` branch
5. Merges `stg` into `main`
6. Pushes `main` to remote
7. Returns to `dev` branch

#### Staging Deployment (dev → stg)

```bash
./scripts/git-deploy.sh staging
```

This command:

1. Switches to `stg` branch
2. Merges `dev` into `stg`
3. Pushes `stg` to remote
4. Returns to `dev` branch

#### Help

```bash
./scripts/git-deploy.sh help
```

Shows usage information and available commands.

## 🛡️ Safety Features

- **Error handling**: Script stops on any Git command failure
- **Branch validation**: Checks that required branches exist before proceeding
- **Repository validation**: Ensures you're in a Git repository
- **Visual feedback**: Clear progress indicators and colored output
- **Safe merges**: Only performs fast-forward merges

## 🎨 Output Features

- **Colored output**: Different colors for steps, success, and errors
- **Emojis**: Visual indicators for different types of operations
- **Progress tracking**: Clear indication of current step
- **Status reporting**: Shows current branch and final status

## 📋 Examples

### Deploy to staging for testing

```bash
./scripts/git-deploy.sh staging
```

### Deploy to production (full pipeline)

```bash
./scripts/git-deploy.sh full
```

### Get help

```bash
./scripts/git-deploy.sh help
```

## 🔧 Setup on New Machine

1. Clone the repository
2. Navigate to the project root
3. Make the script executable (if needed):
   ```bash
   chmod +x scripts/git-deploy.sh
   ```
4. Run the desired deployment command

## 📝 Notes

- The script always returns you to the `dev` branch after completion
- All changes are pushed to the remote repository automatically
- The script uses fast-forward merges only for safety
- If any step fails, the script will stop and show an error message

## 🤝 Contributing

When modifying the deployment scripts:

1. Test thoroughly on a development branch
2. Ensure backward compatibility
3. Update this README if adding new features
4. Follow the existing code style and error handling patterns
