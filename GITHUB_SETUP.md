# GitHub Setup Instructions for DingDong BMS

## Prerequisites
- GitHub account
- Git installed and configured
- SSH key or personal access token for GitHub

## Step 1: Create a New Repository on GitHub

1. Go to [GitHub.com](https://github.com)
2. Click the **+** icon in the top right corner
3. Select **New repository**
4. Fill in the details:
   - **Repository name:** `dingdong-bms`
   - **Description:** `A comprehensive Building Management System (BMS) built with Next.js, React, TypeScript, and SQLite`
   - **Visibility:** Public (or Private)
   - **Initialize with:** Leave all unchecked (we already have files)
5. Click **Create repository**

## Step 2: Add Remote and Push to GitHub

Get the HTTPS or SSH URL from your newly created repository (copy the URL).

### Using HTTPS (Simpler, but requires token every time)

```bash
cd c:\Users\Jesun\Downloads\Project\DingDong

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/dingdong-bms.git

# Rename default branch to main (optional but recommended)
git branch -M main

# Push to GitHub
git push -u origin main
```

### Using SSH (Recommended for frequent pushes)

```bash
cd c:\Users\Jesun\Downloads\Project\DingDong

# Add remote with SSH URL
git remote add origin git@github.com:YOUR_USERNAME/dingdong-bms.git

# Rename default branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 3: Verify Push was Successful

Go to your GitHub repository URL:
```
https://github.com/YOUR_USERNAME/dingdong-bms
```

You should see:
- ✅ All files and folders from the project
- ✅ README.md displayed as the main page
- ✅ Commit history with the initial commit
- ✅ License displayed
- ✅ Contributing guidelines accessible

## Step 4: Update Repository Settings (Optional)

### Add Repository Description
1. Go to your repository page
2. Click the **About** icon (gear icon on the right)
3. Add:
   - **Description:** Production-ready Building Management System
   - **Website:** (optional)
   - **Topics:** `building-management`, `nextjs`, `react`, `sqlite`, `typescript`

### Enable Features
1. Go to **Settings** tab
2. Under **Features:**
   - Enable **Discussions** (for community)
   - Enable **Issues** (for bug tracking)
   - Enable **Wiki** (for documentation)

### Add Collaborators (Optional)
1. Go to **Settings** > **Collaborators**
2. Add team members by their GitHub username

### Set Up Branch Protection (Optional)
1. Go to **Settings** > **Branches**
2. Add rule for main branch:
   - Require pull request reviews
   - Require status checks to pass
   - Include administrators

## Future Workflow

### Making Changes and Pushing

```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ...

# Stage and commit
git add .
git commit -m "feat(scope): description of changes"

# Push to GitHub
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
# - Go to repository
# - Click "Compare & pull request"
# - Fill in details
# - Submit PR
```

### Pulling Latest from GitHub

```bash
# Update from main branch
git pull origin main

# Or keep up with feature branches
git fetch origin
git merge origin/main
```

## Important File Locations for GitHub

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation (displayed on GitHub) |
| `CONTRIBUTING.md` | Contribution guidelines |
| `LICENSE` | MIT License for the project |
| `.gitignore` | Files to exclude from version control |
| `web/package.json` | Dependency list and build scripts |

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Push local repository to GitHub
3. ✅ Verify all files are there
4. ✅ Configure repository settings
5. 📝 Add additional documentation if needed
6. 🔗 Update repository URLs in files if needed
7. 📢 Share repository with your team
8. 🚀 Start collaborating!

## Troubleshooting

### "Repository not found" error
- Verify the repository URL is correct
- Check that you have write access
- If using SSH, ensure your SSH key is added to GitHub

### "Permission denied" error
- For HTTPS: You may need to use a personal access token instead of password
- For SSH: Verify your SSH key is added to your GitHub account

### "fatal: refusing to merge unrelated histories"
- This shouldn't happen with our setup, but if it does:
```bash
git pull origin main --allow-unrelated-histories
```

### Want to change the default branch
```bash
# Rename master to main locally
git branch -M main

# Push the new main branch
git push -u origin main

# Then on GitHub: Settings > Default branch, select "main"
```

## Resources

- [GitHub SSH Setup](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [Creating Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Collaborating](https://docs.github.com/en/pull-requests)

---

## Current Repository Status

✅ **Repository Initialized**
- Git repository created locally
- All files staged and committed
- Initial commit: `chore: initialize dingdong bms project with version 0.3.0`

📦 **Current Version: 0.3.0**

🔧 **Tech Stack:**
- Next.js 16.1.6
- React 19.2.3
- TypeScript 5
- SQLite (better-sqlite3)
- Tailwind CSS 4

🚀 **Ready for:**
- GitHub publication
- Team collaboration
- Community contributions
- Production deployment

---

*Created: February 20, 2026*
*For questions or issues, refer to CONTRIBUTING.md*
