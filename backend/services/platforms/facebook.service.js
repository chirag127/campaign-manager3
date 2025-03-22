const axios = require('axios');
const User = require('../../models/user.model');

// Facebook Graph API base URL
const FACEBOOK_API_URL = 'https://graph.facebook.com/v18.0';

// Launch a campaign on Facebook
exports.launchCampaign = async (campaign, user) => {
  try {
    const { accessToken } = user.connectedPlatforms.facebook;
    const accountId = user.connectedPlatforms.facebook.accountId;

    // Find the Facebook platform in the campaign
    const facebookPlatform = campaign.platforms.find(p => p.name === 'facebook');
    if (!facebookPlatform) {
      throw new Error('Facebook platform not found in campaign');
    }

    // Prepare campaign data for Facebook API
    const campaignData = {
      name: campaign.name,
      objective: 'CONVERSIONS', // Default to conversions
      status: 'ACTIVE',
      special_ad_categories: [],
      daily_budget: facebookPlatform.budget.allocated * 100, // Convert to cents
      start_time: new Date(campaign.startDate).toISOString(),
      end_time: new Date(campaign.endDate).toISOString()
    };

    // Create campaign on Facebook
    const response = await axios.post(
      `${FACEBOOK_API_URL}/${accountId}/campaigns`,
      campaignData,
      {
        params: {
          access_token: accessToken
        }
      }
    );

    // Get the Facebook campaign ID
    const facebookCampaignId = response.data.id;

    // Create ad set (targeting)
    const adSetData = {
      name: `${campaign.name} - Ad Set`,
      campaign_id: facebookCampaignId,
      optimization_goal: 'CONVERSIONS',
      billing_event: 'IMPRESSIONS',
      bid_amount: 500, // Example bid amount in cents
      daily_budget: facebookPlatform.budget.allocated * 100, // Convert to cents
      targeting: {
        age_min: campaign.targetAudience.ageRange.min,
        age_max: campaign.targetAudience.ageRange.max,
        genders: mapGenders(campaign.targetAudience.gender),
        geo_locations: mapLocations(campaign.targetAudience.locations),
        interests: mapInterests(campaign.targetAudience.interests)
      },
      status: 'ACTIVE',
      start_time: new Date(campaign.startDate).toISOString(),
      end_time: new Date(campaign.endDate).toISOString()
    };

    const adSetResponse = await axios.post(
      `${FACEBOOK_API_URL}/${accountId}/adsets`,
      adSetData,
      {
        params: {
          access_token: accessToken
        }
      }
    );

    const adSetId = adSetResponse.data.id;

    // Create ads for each creative
    const adIds = [];
    for (const creative of campaign.creatives) {
      const adData = {
        name: `${campaign.name} - ${creative.title || 'Ad'}`,
        adset_id: adSetId,
        status: 'ACTIVE',
        creative: {
          title: creative.title,
          body: creative.description,
          image_url: creative.mediaUrl,
          call_to_action_type: mapCallToAction(creative.callToAction),
          link_url: creative.destinationUrl
        }
      };

      const adResponse = await axios.post(
        `${FACEBOOK_API_URL}/${accountId}/ads`,
        adData,
        {
          params: {
            access_token: accessToken
          }
        }
      );

      adIds.push(adResponse.data.id);
    }

    return {
      platformCampaignId: facebookCampaignId,
      adSetId,
      adIds
    };
  } catch (error) {
    console.error('Facebook launch campaign error:', error.response?.data || error.message);
    throw new Error(`Failed to launch campaign on Facebook: ${error.message}`);
  }
};

// Pause a campaign on Facebook
exports.pauseCampaign = async (platformCampaignId, user) => {
  try {
    const { accessToken } = user.connectedPlatforms.facebook;

    // Update campaign status to PAUSED
    await axios.post(
      `${FACEBOOK_API_URL}/${platformCampaignId}`,
      {
        status: 'PAUSED'
      },
      {
        params: {
          access_token: accessToken
        }
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Facebook pause campaign error:', error.response?.data || error.message);
    throw new Error(`Failed to pause campaign on Facebook: ${error.message}`);
  }
};

// Resume a campaign on Facebook
exports.resumeCampaign = async (platformCampaignId, user) => {
  try {
    const { accessToken } = user.connectedPlatforms.facebook;

    // Update campaign status to ACTIVE
    await axios.post(
      `${FACEBOOK_API_URL}/${platformCampaignId}`,
      {
        status: 'ACTIVE'
      },
      {
        params: {
          access_token: accessToken
        }
      }
    );

    return { success: true };
  } catch (error) {
    console.error('Facebook resume campaign error:', error.response?.data || error.message);
    throw new Error(`Failed to resume campaign on Facebook: ${error.message}`);
  }
};

// Get campaign performance data from Facebook
exports.getCampaignPerformance = async (platformCampaignId, user) => {
  try {
    const { accessToken } = user.connectedPlatforms.facebook;

    // Get campaign insights
    const response = await axios.get(
      `${FACEBOOK_API_URL}/${platformCampaignId}/insights`,
      {
        params: {
          fields: 'impressions,clicks,spend,cpc,ctr,conversions,cost_per_conversion',
          access_token: accessToken
        }
      }
    );

    const insights = response.data.data[0] || {};

    return {
      impressions: parseInt(insights.impressions) || 0,
      clicks: parseInt(insights.clicks) || 0,
      conversions: parseInt(insights.conversions) || 0,
      costPerClick: parseFloat(insights.cpc) || 0,
      costPerConversion: parseFloat(insights.cost_per_conversion) || 0,
      ctr: parseFloat(insights.ctr) || 0
    };
  } catch (error) {
    console.error('Facebook get performance error:', error.response?.data || error.message);
    throw new Error(`Failed to get campaign performance from Facebook: ${error.message}`);
  }
};

// Connect user account to Facebook
exports.connectAccount = async (authCode, user) => {
  try {
    // Exchange auth code for access token
    const tokenResponse = await axios.get(
      'https://graph.facebook.com/v18.0/oauth/access_token',
      {
        params: {
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          redirect_uri: `${process.env.FRONTEND_URL}/auth/facebook/callback`,
          code: authCode
        }
      }
    );

    const { access_token, expires_in } = tokenResponse.data;

    // Get user's ad accounts
    const accountsResponse = await axios.get(
      `${FACEBOOK_API_URL}/me/adaccounts`,
      {
        params: {
          fields: 'id,name,account_status',
          access_token
        }
      }
    );

    // Use the first active ad account
    const adAccount = accountsResponse.data.data.find(account => account.account_status === 1);
    if (!adAccount) {
      throw new Error('No active Facebook ad account found');
    }

    // Update user's Facebook connection info
    await User.findByIdAndUpdate(user.id, {
      'connectedPlatforms.facebook': {
        connected: true,
        accessToken: access_token,
        tokenExpiry: new Date(Date.now() + expires_in * 1000),
        accountId: adAccount.id
      }
    });

    return {
      success: true,
      accountId: adAccount.id,
      accountName: adAccount.name
    };
  } catch (error) {
    console.error('Facebook connect account error:', error.response?.data || error.message);
    throw new Error(`Failed to connect Facebook account: ${error.message}`);
  }
};

// Disconnect user account from Facebook
exports.disconnectAccount = async (user) => {
  try {
    // Revoke access token if available
    const { accessToken } = user.connectedPlatforms.facebook;
    if (accessToken) {
      try {
        await axios.delete(
          `${FACEBOOK_API_URL}/me/permissions`,
          {
            params: {
              access_token: accessToken
            }
          }
        );
      } catch (revokeError) {
        console.error('Error revoking Facebook token:', revokeError);
        // Continue with disconnection even if revocation fails
      }
    }

    // Update user's Facebook connection info
    await User.findByIdAndUpdate(user.id, {
      'connectedPlatforms.facebook': {
        connected: false,
        accessToken: null,
        refreshToken: null,
        tokenExpiry: null,
        accountId: null
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Facebook disconnect account error:', error);
    throw new Error(`Failed to disconnect Facebook account: ${error.message}`);
  }
};

// Helper functions for mapping campaign data to Facebook format

function mapGenders(genders) {
  const genderMap = {
    male: 1,
    female: 2
  };

  return genders.map(gender => genderMap[gender] || 0).filter(g => g > 0);
}

function mapLocations(locations) {
  const result = {
    countries: [],
    regions: [],
    cities: []
  };

  locations.forEach(location => {
    if (location.country) {
      result.countries.push(location.country);
    }
    if (location.state) {
      result.regions.push({ key: location.state });
    }
    if (location.city) {
      result.cities.push({ key: location.city });
    }
  });

  return result;
}

function mapInterests(interests) {
  return interests.map(interest => ({
    id: interest,
    name: interest
  }));
}

function mapCallToAction(callToAction) {
  const ctaMap = {
    'Learn More': 'LEARN_MORE',
    'Sign Up': 'SIGN_UP',
    'Download': 'DOWNLOAD',
    'Shop Now': 'SHOP_NOW',
    'Book Now': 'BOOK_TRAVEL',
    'Contact Us': 'CONTACT_US',
    'Apply Now': 'APPLY_NOW',
    'Subscribe': 'SUBSCRIBE'
  };

  return ctaMap[callToAction] || 'LEARN_MORE';
}
