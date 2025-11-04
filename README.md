# MyMotoLog - Motorcycle Maintenance Tracker

A simple and elegant application to track your motorcycle's maintenance history. Log service dates, repairs performed, and odometer readings to keep your bike in top condition. This app is built to be fast, responsive, and work offline, storing all your data securely in your browser's local storage.

## Features

- **Log Maintenance:** Easily add new service records with details like date, description, odometer reading, and motorcycle info.
- **View History:** See a clean, sorted list of all past maintenance.
- **AI Suggestions:** Get smart recommendations for your next service based on your bike's history and type, powered by the Gemini API.
- **Responsive Design:** Works beautifully on desktop, tablets, and mobile devices.
- **Offline First:** Your data is stored locally, so you can access and manage your logs even without an internet connection.
- **Simple & Fast:** A minimal, clean interface that loads quickly and is easy to use.

## Tech Stack

- **React:** For building the user interface.
- **TypeScript:** For type-safe JavaScript.
- **Tailwind CSS:** For styling the application.
- **Google Gemini API:** For the AI-powered service suggestions.
- **Local Storage:** For client-side data persistence.

## How to Deploy to GitHub Pages

You can host this application for free using GitHub Pages.

### Step 1: Create a GitHub Repository

1.  Go to your GitHub account and create a **new public repository**. Let's call it `mymotolog`.

### Step 2: Push Your Code

1.  Initialize a Git repository in your project's folder on your local machine.
    ```sh
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Add your new GitHub repository as the remote origin.
    ```sh
    # Replace <YOUR_USERNAME> and <YOUR_REPOSITORY> with your actual details
    git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git
    ```
3.  Push your code to the `main` branch.
    ```sh
    git branch -M main
    git push -u origin main
    ```

### Step 3: Enable GitHub Pages

1.  In your repository on GitHub, go to the **"Settings"** tab.
2.  In the left sidebar, click on **"Pages"**.
3.  Under the "Build and deployment" section:
    -   For "Source," select **"Deploy from a branch"**.
    -   For "Branch," choose `main` and `/ (root)`.
4.  Click **"Save"**.

GitHub will take a minute or two to build and deploy your site. Once it's ready, a link to your live application will appear at the top of the GitHub Pages settings page (e.g., `https://your-username.github.io/mymotolog`).

### Important Note on the API Key

The "AI Service Suggestion" feature relies on a Google Gemini API key from `process.env.API_KEY`. On a static hosting service like GitHub Pages, this environment variable will **not** be available, and the AI feature will not work.

**For security reasons, you must never hardcode your API key directly into your frontend code.**

To make the AI feature work in a production environment, you would need a more advanced setup, such as:
- A simple backend server (a "proxy") that securely stores the key and makes the API calls on behalf of your app.
- A serverless function (like Vercel Functions or AWS Lambda) to handle the API request.

However, the core functionality of your app—adding, viewing, and deleting maintenance records—will work perfectly on GitHub Pages right out of the box.
