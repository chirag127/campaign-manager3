# Campaign Manager App

A centralized platform for managing ad campaigns across multiple platforms (Facebook, Google, YouTube, LinkedIn, Twitter, Snapchat, Instagram).

## Features

- **Unified Dashboard**: View performance metrics across all connected ad platforms
- **Campaign Management**: Create, edit, pause, and resume campaigns across multiple platforms
- **Platform Integration**: Connect to major advertising platforms through their APIs
- **Performance Tracking**: Monitor impressions, clicks, conversions, and other key metrics
- **Budget Management**: Set and track budgets across platforms
- **Audience Targeting**: Define and manage target audiences for campaigns
- **Creative Management**: Upload and manage ad creatives for different platforms

## Tech Stack

### Frontend
- React Native (Expo)
- React Navigation
- React Native Paper (UI components)
- Axios (API requests)
- Expo WebBrowser (OAuth flows)
- React Native Chart Kit (data visualization)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication
- Platform-specific API integrations

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- Expo CLI (for mobile development)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/campaign-manager.git
   cd campaign-manager
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env
   ```
   Edit the `.env` file with your MongoDB connection string and other required variables.

4. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

5. Set up frontend environment:
   ```
   cp src/config/api.example.js src/config/api.js
   ```
   Edit the `api.js` file with your backend API URL and platform credentials.

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Start the frontend (in a new terminal):
   ```
   cd frontend
   npm start
   ```

3. For mobile development:
   - Install the Expo Go app on your mobile device
   - Scan the QR code from the terminal
   - Or run in a simulator/emulator with: `npm run android` or `npm run ios`

## Platform Integration

To connect with ad platforms, you'll need to create developer accounts and obtain API credentials:

- **Facebook/Instagram**: [Facebook for Developers](https://developers.facebook.com/)
- **Google/YouTube**: [Google Cloud Console](https://console.cloud.google.com/)
- **LinkedIn**: [LinkedIn Developers](https://www.linkedin.com/developers/)
- **Twitter**: [Twitter Developer Platform](https://developer.twitter.com/)
- **Snapchat**: [Snapchat Business](https://business.snapchat.com/)

Add your API credentials to the respective environment variables in both frontend and backend.

## Deployment

### Backend Deployment

Run the deployment script:
```
cd backend
node deploy.js
```

Follow the instructions provided by the script to deploy to your preferred platform (Heroku, AWS, GCP).

### Frontend Deployment

Run the deployment script:
```
cd frontend
node deploy.js
```

This will prepare builds for Android, iOS, and web. Follow the instructions to publish to app stores or web hosting.

## Testing

### Backend Tests
```
cd backend
npm test
```

### Frontend Tests
```
cd frontend
npm test
```

## Project Structure

```
campaign-manager/
├── backend/
│   ├── controllers/     # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   │   └── platforms/   # Platform-specific integrations
│   ├── middleware/      # Express middleware
│   ├── config/          # Configuration files
│   └── server.js        # Entry point
│
└── frontend/
    ├── src/
    │   ├── screens/     # App screens
    │   ├── components/  # Reusable components
    │   ├── navigation/  # Navigation configuration
    │   ├── context/     # React context providers
    │   ├── config/      # Configuration files
    │   └── utils/       # Utility functions
    ├── App.js           # Entry point
    └── app.json         # Expo configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Facebook Marketing API](https://developers.facebook.com/docs/marketing-apis/)
- [Google Ads API](https://developers.google.com/google-ads/api/docs/start)
- [LinkedIn Marketing API](https://docs.microsoft.com/en-us/linkedin/marketing/)
- [Twitter Ads API](https://developer.twitter.com/en/docs/twitter-ads-api)
- [Snapchat Marketing API](https://marketingapi.snapchat.com/docs/)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api/)
