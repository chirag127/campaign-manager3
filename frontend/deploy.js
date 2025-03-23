/**
 * Deployment script for Campaign Manager frontend
 *
 * This script prepares the React Native (Expo) app for deployment.
 * It can be used to build for Android, iOS, or web.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  // Deployment target (android, ios, web)
  target: process.env.DEPLOY_TARGET || 'all',

  // Application name
  appName: process.env.APP_NAME || 'CampaignManager',

  // Environment
  environment: process.env.NODE_ENV || 'production',

  // API URL for production
  apiUrl: process.env.API_URL || 'https://campaign-manager-api.herokuapp.com',

  // Expo account
  expoUsername: process.env.EXPO_USERNAME,
  expoPassword: process.env.EXPO_PASSWORD
};

// Ensure Expo CLI is installed
try {
  execSync('expo --version', { stdio: 'ignore' });
} catch (error) {
  console.error('Expo CLI is not installed. Please install it with: npm install -g expo-cli');
  process.exit(1);
}

// Update API URL for production
console.log('Updating API URL for production...');
const apiConfigPath = path.join(__dirname, 'src', 'config', 'api.js');
let apiConfig = fs.readFileSync(apiConfigPath, 'utf8');
apiConfig = apiConfig.replace(/export const API_URL = .*?;/, `export const API_URL = '${config.apiUrl}';`);
fs.writeFileSync(apiConfigPath, apiConfig);
console.log(`API URL updated to: ${config.apiUrl}`);

// Update app.json for Expo
console.log('Updating app.json for Expo...');
const appJsonPath = path.join(__dirname, 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));

// Update app name and version
appJson.expo.name = config.appName;
appJson.expo.version = process.env.npm_package_version || '1.0.0';

// Update Android package name
if (appJson.expo.android) {
  appJson.expo.android.package = `com.campaignmanager.${config.appName.toLowerCase().replace(/\s/g, '')}`;
}

// Update iOS bundle identifier
if (appJson.expo.ios) {
  appJson.expo.ios.bundleIdentifier = `com.campaignmanager.${config.appName.toLowerCase().replace(/\s/g, '')}`;
}

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
console.log('app.json updated successfully.');

// Build the app
console.log('Building the app...');

// Login to Expo if credentials are provided
if (config.expoUsername && config.expoPassword) {
  console.log('Logging in to Expo...');
  execSync(`npx expo login -u ${config.expoUsername} -p ${config.expoPassword}`);
}

// Build for the specified target
if (config.target === 'android' || config.target === 'all') {
  console.log('Building for Android...');
  execSync('npx expo build:android', { stdio: 'inherit' });
}

if (config.target === 'ios' || config.target === 'all') {
  console.log('Building for iOS...');
  execSync('npx expo build:ios', { stdio: 'inherit' });
}

if (config.target === 'web' || config.target === 'all') {
  console.log('Building for Web...');
  execSync('npx expo build:web', { stdio: 'inherit' });

  console.log(`
Web build completed. The build is available in the 'web-build' directory.
You can deploy this directory to any static hosting service like:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Firebase Hosting
`);
}

console.log('Deployment preparation complete!');

// Provide instructions for publishing to Expo
console.log(`
To publish your app to Expo, run:
npx expo publish

To submit your app to app stores:
1. For Android: Upload the APK/AAB from your Expo build to the Google Play Console
2. For iOS: Submit the IPA from your Expo build to the App Store Connect

For more information, visit:
https://docs.expo.dev/distribution/app-stores/
`);
