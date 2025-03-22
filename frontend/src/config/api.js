// API configuration
export const API_URL = 'http://localhost:5000';

// Platform OAuth URLs
export const PLATFORM_AUTH_URLS = {
  facebook: 'https://www.facebook.com/v18.0/dialog/oauth',
  google: 'https://accounts.google.com/o/oauth2/v2/auth',
  youtube: 'https://accounts.google.com/o/oauth2/v2/auth', // YouTube uses Google OAuth
  linkedin: 'https://www.linkedin.com/oauth/v2/authorization',
  twitter: 'https://api.twitter.com/oauth/authenticate',
  snapchat: 'https://accounts.snapchat.com/login/oauth2/authorize',
  instagram: 'https://api.instagram.com/oauth/authorize'
};

// Platform OAuth client IDs
export const PLATFORM_CLIENT_IDS = {
  facebook: process.env.FACEBOOK_APP_ID,
  google: process.env.GOOGLE_CLIENT_ID,
  youtube: process.env.GOOGLE_CLIENT_ID, // YouTube uses Google OAuth
  linkedin: process.env.LINKEDIN_CLIENT_ID,
  twitter: process.env.TWITTER_API_KEY,
  snapchat: process.env.SNAPCHAT_CLIENT_ID,
  instagram: process.env.INSTAGRAM_APP_ID
};

// Platform OAuth redirect URIs
export const PLATFORM_REDIRECT_URIS = {
  facebook: `${API_URL}/auth/facebook/callback`,
  google: `${API_URL}/auth/google/callback`,
  youtube: `${API_URL}/auth/youtube/callback`,
  linkedin: `${API_URL}/auth/linkedin/callback`,
  twitter: `${API_URL}/auth/twitter/callback`,
  snapchat: `${API_URL}/auth/snapchat/callback`,
  instagram: `${API_URL}/auth/instagram/callback`
};

// Platform OAuth scopes
export const PLATFORM_SCOPES = {
  facebook: 'ads_management,ads_read',
  google: 'https://www.googleapis.com/auth/adwords',
  youtube: 'https://www.googleapis.com/auth/youtube',
  linkedin: 'r_ads,w_ads',
  twitter: 'ads:read,ads:write',
  snapchat: 'snapchat-marketing-api',
  instagram: 'ads_management,instagram_basic,instagram_content_publish'
};
