const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaign.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all campaign routes
router.use(authMiddleware.authenticate);

// Get all campaigns
router.get('/', campaignController.getCampaigns);

// Create a new campaign
router.post('/', campaignController.createCampaign);

// Get a single campaign by ID
router.get('/:id', campaignController.getCampaignById);

// Update a campaign
router.put('/:id', campaignController.updateCampaign);

// Delete a campaign
router.delete('/:id', campaignController.deleteCampaign);

// Launch a campaign
router.post('/:id/launch', campaignController.launchCampaign);

// Pause a campaign
router.post('/:id/pause', campaignController.pauseCampaign);

// Resume a campaign
router.post('/:id/resume', campaignController.resumeCampaign);

// Sync campaign data
router.post('/:id/sync', campaignController.syncCampaignData);

module.exports = router;
