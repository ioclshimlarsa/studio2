# Deployment Guide: Connecting to Firebase on Vercel

This guide provides step-by-step instructions to generate a Firebase service account key and configure it as environment variables in your Vercel project. This is necessary for your deployed application to securely connect to and authenticate with your Firestore database on the server.

## Step 1: Navigate to the Google Cloud Console

Your Firebase project is also a Google Cloud project. You need to access it through the Google Cloud Console to manage service accounts.

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Make sure you are logged in with the same Google account you use for your Firebase project.
3.  At the top of the page, click the project dropdown menu. Select the project that corresponds to your Firebase project (the project ID is `campconnect-punjab`).

## Step 2: Create a Service Account

A service account is a special type of Google account intended to represent a non-human user (like your Vercel deployment) that needs to authenticate and be authorized to access data in Google Cloud APIs.

1.  With your project selected, open the navigation menu (the "hamburger" icon ☰) in the top-left corner.
2.  Go to **IAM & Admin** > **Service Accounts**.
3.  Click **+ CREATE SERVICE ACCOUNT** at the top of the page.
4.  **Service account details**:
    *   **Service account name**: Give it a descriptive name, like `Vercel Deployer` or `App Server`.
    *   **Service account ID**: This will be automatically generated based on the name. You can leave it as is.
    *   **Description**: Add an optional description, such as "Service account for Vercel deployment to access Firestore".
    *   Click **CREATE AND CONTINUE**.
5.  **Grant this service account access to project**:
    *   Click the **Select a role** dropdown.
    *   Search for and select the role **Cloud Datastore User**. This role provides the necessary permissions for your app to read from and write to Firestore.
    *   Click **CONTINUE**.
6.  **Grant users access to this service account**: You can skip this section. Click **DONE**.

You will now see your new service account in the list.

## Step 3: Generate a JSON Key

The key is a JSON file containing the credentials your application will use to authenticate as the service account.

1.  In the list of service accounts, find the one you just created.
2.  Click the three-dot menu (⋮) under the **Actions** column for that service account.
3.  Select **Manage keys**.
4.  Click **ADD KEY** > **Create new key**.
5.  Choose **JSON** as the key type and click **CREATE**.
6.  A JSON file will be automatically downloaded to your computer. **Treat this file like a password. It is highly sensitive and should not be shared or committed to your git repository.**

## Step 4: Add Environment Variables to Vercel

Now, you will take the values from the downloaded JSON file and add them as environment variables to your Vercel project.

1.  Open the downloaded JSON file in a text editor. It will look something like this:
    ```json
    {
      "type": "service_account",
      "project_id": "your-project-id",
      "private_key_id": "some_long_id",
      "private_key": "-----BEGIN PRIVATE KEY-----\nVERY_LONG_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
      "client_email": "your-service-account-name@your-project-id.iam.gserviceaccount.com",
      "client_id": "some_long_id",
      ...
    }
    ```
2.  Go to your project's dashboard on the [Vercel website](https://vercel.com).
3.  Navigate to the **Settings** tab.
4.  Select **Environment Variables** from the side menu.
5.  You will need to add three new environment variables. For each one, click **Add New** and enter the following:

    *   **Variable 1: Project ID**
        *   **Name**: `FIREBASE_PROJECT_ID`
        *   **Value**: Copy the `project_id` value from your JSON file (e.g., `campconnect-punjab`).

    *   **Variable 2: Client Email**
        *   **Name**: `FIREBASE_CLIENT_EMAIL`
        *   **Value**: Copy the `client_email` value from your JSON file.

    *   **Variable 3: Private Key**
        *   **Name**: `FIREBASE_PRIVATE_KEY`
        *   **Value**: Copy the entire `private_key` value from your JSON file. **Important:** You must copy everything, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts, and ensure it is pasted exactly as it appears.

6.  Ensure that all three variables are available for all environments (Production, Preview, and Development).
7.  Click **Save**.

## Step 5: Redeploy Your Application

After adding the environment variables, you need to redeploy your application for the changes to take effect.

1.  Go to the **Deployments** tab in your Vercel project.
2.  Find the most recent deployment, click the three-dot menu (⋮), and select **Redeploy**.

Your new deployment will now have the correct credentials to connect to Firestore, and the `5 NOT_FOUND` error should be resolved.