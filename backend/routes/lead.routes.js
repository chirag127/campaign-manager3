const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all lead routes
router.use(authMiddleware.authenticate);

// Get all leads
router.get('/', leadController.getLeads);

// Get leads for a specific campaign
router.get('/campaign/:campaignId', leadController.getCampaignLeads);

// Get a single lead by ID
router.get('/:id', leadController.getLeadById);

// Update lead status
router.patch('/:id/status', leadController.updateLeadStatus);

// Add notes to a lead
router.patch('/:id/notes', leadController.addLeadNotes);

// Export all leads to CSV
router.get('/export', leadController.exportLeads);

// Export campaign leads to CSV
router.get('/export/campaign/:campaignId', leadController.exportLeads);

module.exports = router;
