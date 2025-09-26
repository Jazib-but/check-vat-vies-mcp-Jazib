# 📋 GitHub Setup Instructions

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com/new)
2. Create a new repository:
   - **Repository name**: `check-vat-vies-mcp`
   - **Description**: "EU VAT Validation API with n8n integration and MCP support"
   - **Visibility**: Public (required for free GitHub Actions)
   - **DO NOT** initialize with README, .gitignore, or license (we already have them)

## Step 2: Push to GitHub

After creating the empty repository, run these commands:

```bash
# Add your GitHub repository as origin (replace 'yourusername' with your GitHub username)
git remote add origin https://github.com/yourusername/check-vat-vies-mcp.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Actions

GitHub Actions are enabled by default. After pushing, check:
1. Go to your repository → **Actions** tab
2. You should see two workflows:
   - **Build and Publish Docker Image** - Builds Docker image automatically
   - **Test API** - Runs tests on every push

## Step 4: Enable GitHub Packages (for Docker)

1. Go to repository **Settings** → **Actions** → **General**
2. Under "Workflow permissions", select:
   - **Read and write permissions**
   - **Allow GitHub Actions to create and approve pull requests**
3. Click **Save**

## Step 5: Set Up GitHub Pages (Optional)

For documentation hosting:
1. Go to **Settings** → **Pages**
2. Source: Deploy from a branch
3. Branch: `main` → `/docs` folder
4. Click **Save**

## Step 6: Configure Repository Settings

### Recommended Settings:
1. **Settings** → **General**:
   - ✅ Issues
   - ✅ Preserve this repository
   - ✅ Sponsorships

2. **Settings** → **Branches**:
   - Add branch protection rule for `main`:
     - ✅ Require pull request reviews
     - ✅ Require status checks (select your workflows)

## Step 7: Create First Release

1. Go to **Releases** → **Create a new release**
2. Tag version: `v1.0.0`
3. Release title: "Initial Release - VAT Validation API"
4. Description: Copy features from README
5. Click **Publish release**

This will trigger Docker image build with version tag.

## 🎉 Your Repository is Ready!

After setup, you'll have:
- ✅ Automated Docker builds on every push
- ✅ Docker images at: `ghcr.io/yourusername/check-vat-vies-mcp`
- ✅ Automated testing with GitHub Actions
- ✅ Ready for deployment to Coolify, Railway, or Render

## 📦 Quick Deploy Links

After pushing to GitHub, you can use these:

### Deploy to Railway
```
https://railway.app/template/deploy?template=https://github.com/yourusername/check-vat-vies-mcp
```

### Deploy to Render
```
https://render.com/deploy?repo=https://github.com/yourusername/check-vat-vies-mcp
```

### Docker Pull
```bash
docker pull ghcr.io/yourusername/check-vat-vies-mcp:latest
```

## 🔧 Troubleshooting

### If Docker build fails:
1. Check **Actions** tab for error logs
2. Ensure Dockerfile.api is in repository root
3. Verify workflow permissions are set correctly

### If you need to update repository URL in README:
```bash
# Update README badges and links
sed -i 's/jazib/yourusername/g' README.md
git add README.md
git commit -m "docs: Update repository URLs"
git push
```

## 📝 Next Steps

1. **Star** your repository to increase visibility
2. **Watch** for updates and issues
3. **Fork** to contribute improvements
4. Share with the community!

## 🚀 Deployment Options

Once on GitHub, you can deploy to:

1. **Coolify**: Follow [COOLIFY_DEPLOYMENT.md](COOLIFY_DEPLOYMENT.md)
2. **Railway**: Click the Railway deploy button in README
3. **Render**: Click the Render deploy button in README
4. **Any Docker host**: Use the GitHub Container Registry image

---

Need help? Check the [Issues](https://github.com/yourusername/check-vat-vies-mcp/issues) section!