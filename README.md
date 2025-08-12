## SMTP server setup

# GitHub Image Uploads (Optional)

This project can upload project images directly to a GitHub repository via the server API. This keeps your site static while letting you add images from the Admin panel.

## Configure

1. Create a GitHub Personal Access Token with repo scope.
2. Set these environment variables for the API server (locally in `.env`, on Vercel as Project Env Vars):

```
GITHUB_UPLOAD_ENABLED=true
GITHUB_OWNER=your-github-username-or-org
GITHUB_REPO=your-assets-repo
GITHUB_BRANCH=main
GITHUB_BASE_PATH=public/images/projects
GITHUB_TOKEN=ghp_xxx
GITHUB_COMMITTER_NAME=Website Uploader
GITHUB_COMMITTER_EMAIL=you@example.com
STORAGE_DRIVER=github # or local
ADMIN_API_TOKEN=super-secret-admin-token
```

Notes:
- Use a separate repository for assets if you don’t want commits in your code repo.
- The server will fall back to local disk storage if `GITHUB_UPLOAD_ENABLED` is not `true` or variables are missing.
- Uploaded images are returned as `https://raw.githubusercontent.com/...` URLs and are saved into your `data/projects.json` when you save the project.

## Image validation & optimization

- Server validates image type (JPEG, PNG, WebP, GIF) and max size (10MB)
- Images are auto-optimized and converted to WebP using `sharp`
- Admin requests to image endpoints can require `Authorization: Bearer <ADMIN_API_TOKEN>` if set

## Run locally

```
npm run dev:all
```

## Deploy

- Deploy the frontend as usual.
- Deploy the API server with the same environment variables. If using a single deployment, ensure the Node server runs and is reachable by the frontend at `/api/*`.
- Set `VITE_ADMIN_API_TOKEN` in your frontend environment; it will be sent as `Authorization: Bearer` for Admin image actions.

Create a `.env` file at the project root with:

```
SMTP_MAIL=
SMTP_PASSWORD=
SMTP_HOST=
SMTP_PORT=
TO_EMAIL=your_destination_email@example.com
```

Start dev with both servers:

```
npm run dev:all
```
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/b6c98d78-a4e4-436b-b111-d16b576f96b4

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b6c98d78-a4e4-436b-b111-d16b576f96b4) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b6c98d78-a4e4-436b-b111-d16b576f96b4) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
