const Campaign = require('../models/campaign.model');
const platformService = require('../services/platform.service');

// Create a new campaign
exports.createCampaign = async (req, res) => {
  try {
    const {
      name,
      description,
      budget,
      startDate,
      endDate,
      targetAudience,
      platforms,
      creatives
    } = req.body;

    // Create new campaign
    const campaign = new Campaign({
      name,
      description,
      budget,
      startDate,
      endDate,
      targetAudience,
      platforms,
      creatives,
      owner: req.user.id
    });

    await campaign.save();

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ message: 'Server error while creating campaign' });
  }
};

// Get all campaigns for a user
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ owner: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({ campaigns });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ message: 'Server error while fetching campaigns' });
  }
};

// Get a single campaign by ID
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      owner: req.user.id
    }).populate('leads');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.status(200).json({ campaign });
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ message: 'Server error while fetching campaign' });
  }
};

// Update a campaign
exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Update fields
    const {
      name,
      description,
      budget,
      startDate,
      endDate,
      status,
      targetAudience,
      platforms,
      creatives
    } = req.body;

    if (name) campaign.name = name;
    if (description) campaign.description = description;
    if (budget) campaign.budget = budget;
    if (startDate) campaign.startDate = startDate;
    if (endDate) campaign.endDate = endDate;
    if (status) campaign.status = status;
    if (targetAudience) campaign.targetAudience = targetAudience;
    if (platforms) campaign.platforms = platforms;
    if (creatives) campaign.creatives = creatives;

    await campaign.save();

    res.status(200).json({
      message: 'Campaign updated successfully',
      campaign
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ message: 'Server error while updating campaign' });
  }
};

// Delete a campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    await campaign.remove();

    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({ message: 'Server error while deleting campaign' });
  }
};

// Launch a campaign on selected platforms
exports.launchCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Update campaign status
    campaign.status = 'active';

    // Launch on each platform
    for (const platform of campaign.platforms) {
      try {
        // Call platform-specific service to launch campaign
        const result = await platformService.launchCampaign(
          platform.name,
          campaign,
          req.user
        );

        // Update platform status and ID
        platform.status = 'active';
        platform.platformCampaignId = result.platformCampaignId;
        platform.lastSynced = new Date();
      } catch (platformError) {
        console.error(`Error launching on ${platform.name}:`, platformError);
        platform.status = 'failed';
      }
    }

    await campaign.save();

    res.status(200).json({
      message: 'Campaign launched successfully',
      campaign
    });
  } catch (error) {
    console.error('Launch campaign error:', error);
    res.status(500).json({ message: 'Server error while launching campaign' });
  }
};

// Pause a campaign
exports.pauseCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Update campaign status
    campaign.status = 'paused';

    // Pause on each platform
    for (const platform of campaign.platforms) {
      if (platform.status === 'active') {
        try {
          // Call platform-specific service to pause campaign
          await platformService.pauseCampaign(
            platform.name,
            platform.platformCampaignId,
            req.user
          );

          // Update platform status
          platform.status = 'paused';
          platform.lastSynced = new Date();
        } catch (platformError) {
          console.error(`Error pausing on ${platform.name}:`, platformError);
        }
      }
    }

    await campaign.save();

    res.status(200).json({
      message: 'Campaign paused successfully',
      campaign
    });
  } catch (error) {
    console.error('Pause campaign error:', error);
    res.status(500).json({ message: 'Server error while pausing campaign' });
  }
};

// Resume a paused campaign
exports.resumeCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Update campaign status
    campaign.status = 'active';

    // Resume on each platform
    for (const platform of campaign.platforms) {
      if (platform.status === 'paused') {
        try {
          // Call platform-specific service to resume campaign
          await platformService.resumeCampaign(
            platform.name,
            platform.platformCampaignId,
            req.user
          );

          // Update platform status
          platform.status = 'active';
          platform.lastSynced = new Date();
        } catch (platformError) {
          console.error(`Error resuming on ${platform.name}:`, platformError);
        }
      }
    }

    await campaign.save();

    res.status(200).json({
      message: 'Campaign resumed successfully',
      campaign
    });
  } catch (error) {
    console.error('Resume campaign error:', error);
    res.status(500).json({ message: 'Server error while resuming campaign' });
  }
};

// Sync campaign performance data from platforms
exports.syncCampaignData = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Sync data from each platform
    for (const platform of campaign.platforms) {
      if (platform.status === 'active' || platform.status === 'paused') {
        try {
          // Call platform-specific service to get performance data
          const performanceData = await platformService.getCampaignPerformance(
            platform.name,
            platform.platformCampaignId,
            req.user
          );

          // Update platform performance data
          platform.performance = performanceData;
          platform.lastSynced = new Date();
        } catch (platformError) {
          console.error(`Error syncing data from ${platform.name}:`, platformError);
        }
      }
    }

    // Calculate total budget spent
    campaign.budget.spent = campaign.platforms.reduce(
      (total, platform) => total + (platform.budget.spent || 0),
      0
    );

    await campaign.save();

    res.status(200).json({
      message: 'Campaign data synced successfully',
      campaign
    });
  } catch (error) {
    console.error('Sync campaign data error:', error);
    res.status(500).json({ message: 'Server error while syncing campaign data' });
  }
};
