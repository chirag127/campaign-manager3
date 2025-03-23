/**
 * Deployment script for Campaign Manager backend
 *
 * This script prepares the backend for deployment to a cloud platform.
 * It can be used with platforms like Heroku, AWS, or Google Cloud.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  // Deployment target (heroku, aws, gcp)
  target: process.env.DEPLOY_TARGET || 'heroku',

  // Application name
  appName: process.env.APP_NAME || 'campaign-manager-api',

  // Environment
  environment: process.env.NODE_ENV || 'production',

  // Files to include in deployment
  includeFiles: [
    'package.json',
    'package-lock.json',
    'server.js',
    '.env.example',
    'README.md',
    'controllers/**',
    'models/**',
    'routes/**',
    'services/**',
    'middleware/**',
    'config/**',
    'utils/**'
  ],

  // Files to exclude from deployment
  excludeFiles: [
    'node_modules',
    '.env',
    '.git',
    'deploy.js',
    '*.log',
    'tmp/**'
  ]
};

// Create deployment directory
const deployDir = path.join(__dirname, 'deploy');
if (fs.existsSync(deployDir)) {
  console.log('Cleaning up previous deployment directory...');
  fs.rmSync(deployDir, { recursive: true, force: true });
}

fs.mkdirSync(deployDir, { recursive: true });
console.log('Created deployment directory:', deployDir);

// Copy files to deployment directory
console.log('Copying files to deployment directory...');
config.includeFiles.forEach(pattern => {
  const sourcePath = path.join(__dirname, pattern);

  // Check if the pattern is a directory or file
  if (fs.existsSync(sourcePath)) {
    const stats = fs.statSync(sourcePath);

    if (stats.isDirectory()) {
      // Copy directory
      const targetDir = path.join(deployDir, pattern);
      fs.mkdirSync(targetDir, { recursive: true });

      const files = fs.readdirSync(sourcePath);
      files.forEach(file => {
        const sourceFile = path.join(sourcePath, file);
        const targetFile = path.join(targetDir, file);

        if (fs.statSync(sourceFile).isFile()) {
          fs.copyFileSync(sourceFile, targetFile);
        }
      });
    } else if (stats.isFile()) {
      // Copy file
      const targetFile = path.join(deployDir, pattern);
      const targetDir = path.dirname(targetFile);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      fs.copyFileSync(sourcePath, targetFile);
    }
  }
});

// Create production .env file
console.log('Creating production environment file...');
const envExample = fs.readFileSync(path.join(__dirname, '.env.example'), 'utf8');
const prodEnv = envExample.replace(/=.*/g, '='); // Clear all values

fs.writeFileSync(path.join(deployDir, '.env'), prodEnv);
console.log('Created .env file. You will need to set the environment variables on your deployment platform.');

// Create deployment package
console.log('Creating deployment package...');
if (config.target === 'heroku') {
  // For Heroku, we'll create a Git repository
  process.chdir(deployDir);
  execSync('git init');
  execSync('git add .');
  execSync('git commit -m "Deployment package"');

  console.log(`
Deployment package created for Heroku.
To deploy to Heroku, run the following commands:

cd ${deployDir}
heroku create ${config.appName}
git push heroku master

Don't forget to set environment variables:
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
...and other required environment variables
`);
} else if (config.target === 'aws') {
  // For AWS, we'll create a zip file
  process.chdir(deployDir);
  execSync('zip -r ../deploy.zip .');

  console.log(`
Deployment package created for AWS.
The deployment package is available at: ${path.join(__dirname, 'deploy.zip')}

You can upload this file to AWS Elastic Beanstalk or AWS Lambda.
Don't forget to set environment variables in the AWS console.
`);
} else if (config.target === 'gcp') {
  // For GCP, we'll prepare for app.yaml
  const appYaml = `runtime: nodejs16
env: standard
instance_class: F1

env_variables:
  NODE_ENV: "production"
  # Add other environment variables here

handlers:
  - url: /.*
    script: auto
`;

  fs.writeFileSync(path.join(deployDir, 'app.yaml'), appYaml);

  console.log(`
Deployment package created for Google Cloud Platform.
The deployment package is available at: ${deployDir}

To deploy to GCP App Engine, run:
cd ${deployDir}
gcloud app deploy

Don't forget to update the app.yaml file with your environment variables.
`);
} else {
  console.log(`
Deployment package created for generic use.
The deployment package is available at: ${deployDir}

You can deploy this directory to your preferred hosting platform.
Don't forget to set environment variables on your platform.
`);
}

console.log('Deployment preparation complete!');
