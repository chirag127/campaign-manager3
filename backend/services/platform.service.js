// Platform service for handling API integrations with ad platforms

// Import platform-specific services
const facebookService = require('./platforms/facebook.service');
const googleService = require('./platforms/google.service');
const youtubeService = require('./platforms/youtube.service');
const linkedinService = require('./platforms/linkedin.service');
const twitterService = require('./platforms/twitter.service');
const snapchatService = require('./platforms/snapchat.service');
const instagramService = require('./platforms/instagram.service');

// Map platform names to their respective services
const platformServices = {
  facebook: facebookService,
  google: googleService,
  youtube: youtubeService,
  linkedin: linkedinService,
  twitter: twitterService,
  snapchat: snapchatService,
  instagram: instagramService
};

// Launch a campaign on a specific platform
exports.launchCampaign = async (platformName, campaign, user) => {
  try {
    const service = platformServices[platformName];
    if (!service) {
      throw new Error(`Unsupported platform: ${platformName}`);
    }

    // Check if user has connected this platform
    if (!user.connectedPlatforms[platformName].connected) {
      throw new Error(`User has not connected ${platformName} account`);
    }

    // Call platform-specific launch method
    return await service.launchCampaign(campaign, user);
  } catch (error) {
    console.error(`Error launching campaign on ${platformName}:`, error);
    throw error;
  }
};

// Pause a campaign on a specific platform
exports.pauseCampaign = async (platformName, platformCampaignId, user) => {
  try {
    const service = platformServices[platformName];
    if (!service) {
      throw new Error(`Unsupported platform: ${platformName}`);
    }

    // Check if user has connected this platform
    if (!user.connectedPlatforms[platformName].connected) {
      throw new Error(`User has not connected ${platformName} account`);
    }

    // Call platform-specific pause method
    return await service.pauseCampaign(platformCampaignId, user);
  } catch (error) {
    console.error(`Error pausing campaign on ${platformName}:`, error);
    throw error;
  }
};

// Resume a campaign on a specific platform
exports.resumeCampaign = async (platformName, platformCampaignId, user) => {
  try {
    const service = platformServices[platformName];
    if (!service) {
      throw new Error(`Unsupported platform: ${platformName}`);
    }

    // Check if user has connected this platform
    if (!user.connectedPlatforms[platformName].connected) {
      throw new Error(`User has not connected ${platformName} account`);
    }

    // Call platform-specific resume method
    return await service.resumeCampaign(platformCampaignId, user);
  } catch (error) {
    console.error(`Error resuming campaign on ${platformName}:`, error);
    throw error;
  }
};

// Get campaign performance data from a specific platform
exports.getCampaignPerformance = async (platformName, platformCampaignId, user) => {
  try {
    const service = platformServices[platformName];
    if (!service) {
      throw new Error(`Unsupported platform: ${platformName}`);
    }

    // Check if user has connected this platform
    if (!user.connectedPlatforms[platformName].connected) {
      throw new Error(`User has not connected ${platformName} account`);
    }

    // Call platform-specific get performance method
    return await service.getCampaignPerformance(platformCampaignId, user);
  } catch (error) {
    console.error(`Error getting campaign performance from ${platformName}:`, error);
    throw error;
  }
};

// Connect user account to a specific platform
exports.connectPlatform = async (platformName, authCode, user) => {
  try {
    const service = platformServices[platformName];
    if (!service) {
      throw new Error(`Unsupported platform: ${platformName}`);
    }

    // Call platform-specific connect method
    return await service.connectAccount(authCode, user);
  } catch (error) {
    console.error(`Error connecting to ${platformName}:`, error);
    throw error;
  }
};

// Disconnect user account from a specific platform
exports.disconnectPlatform = async (platformName, user) => {
  try {
    const service = platformServices[platformName];
    if (!service) {
      throw new Error(`Unsupported platform: ${platformName}`);
    }

    // Call platform-specific disconnect method
    return await service.disconnectAccount(user);
  } catch (error) {
    console.error(`Error disconnecting from ${platformName}:`, error);
    throw error;
  }
};
