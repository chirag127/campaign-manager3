const Lead = require('../models/lead.model');
const Campaign = require('../models/campaign.model');

// Get all leads for a user
exports.getLeads = async (req, res) => {
  try {
    // Find all campaigns owned by the user
    const campaigns = await Campaign.find({ owner: req.user.id }).select('_id');
    const campaignIds = campaigns.map(campaign => campaign._id);

    // Find all leads from those campaigns
    const leads = await Lead.find({ 'source.campaign': { $in: campaignIds } })
      .populate('source.campaign', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({ leads });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Server error while fetching leads' });
  }
};

// Get leads for a specific campaign
exports.getCampaignLeads = async (req, res) => {
  try {
    // Verify campaign belongs to user
    const campaign = await Campaign.findOne({
      _id: req.params.campaignId,
      owner: req.user.id
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Get leads for this campaign
    const leads = await Lead.find({ 'source.campaign': req.params.campaignId })
      .sort({ createdAt: -1 });

    res.status(200).json({ leads });
  } catch (error) {
    console.error('Get campaign leads error:', error);
    res.status(500).json({ message: 'Server error while fetching campaign leads' });
  }
};

// Get a single lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('source.campaign', 'name');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Verify the lead belongs to a campaign owned by the user
    const campaign = await Campaign.findOne({
      _id: lead.source.campaign,
      owner: req.user.id
    });

    if (!campaign) {
      return res.status(403).json({ message: 'Not authorized to access this lead' });
    }

    res.status(200).json({ lead });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ message: 'Server error while fetching lead' });
  }
};

// Update lead status
exports.updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Verify the lead belongs to a campaign owned by the user
    const campaign = await Campaign.findOne({
      _id: lead.source.campaign,
      owner: req.user.id
    });

    if (!campaign) {
      return res.status(403).json({ message: 'Not authorized to update this lead' });
    }

    // Update lead status
    lead.status = status;
    await lead.save();

    res.status(200).json({
      message: 'Lead status updated successfully',
      lead
    });
  } catch (error) {
    console.error('Update lead status error:', error);
    res.status(500).json({ message: 'Server error while updating lead status' });
  }
};

// Add notes to a lead
exports.addLeadNotes = async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes) {
      return res.status(400).json({ message: 'Notes are required' });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Verify the lead belongs to a campaign owned by the user
    const campaign = await Campaign.findOne({
      _id: lead.source.campaign,
      owner: req.user.id
    });

    if (!campaign) {
      return res.status(403).json({ message: 'Not authorized to update this lead' });
    }

    // Update lead notes
    lead.notes = notes;
    await lead.save();

    res.status(200).json({
      message: 'Lead notes updated successfully',
      lead
    });
  } catch (error) {
    console.error('Add lead notes error:', error);
    res.status(500).json({ message: 'Server error while adding lead notes' });
  }
};

// Export leads to CSV
exports.exportLeads = async (req, res) => {
  try {
    const { campaignId } = req.params;

    // If campaignId is provided, verify it belongs to the user
    if (campaignId) {
      const campaign = await Campaign.findOne({
        _id: campaignId,
        owner: req.user.id
      });

      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      // Get leads for this campaign
      const leads = await Lead.find({ 'source.campaign': campaignId })
        .sort({ createdAt: -1 });

      // Generate CSV data
      const csvData = generateCsvData(leads);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=leads-${campaignId}.csv`);
      res.status(200).send(csvData);
    } else {
      // Find all campaigns owned by the user
      const campaigns = await Campaign.find({ owner: req.user.id }).select('_id');
      const campaignIds = campaigns.map(campaign => campaign._id);

      // Find all leads from those campaigns
      const leads = await Lead.find({ 'source.campaign': { $in: campaignIds } })
        .populate('source.campaign', 'name')
        .sort({ createdAt: -1 });

      // Generate CSV data
      const csvData = generateCsvData(leads);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=all-leads.csv');
      res.status(200).send(csvData);
    }
  } catch (error) {
    console.error('Export leads error:', error);
    res.status(500).json({ message: 'Server error while exporting leads' });
  }
};

// Helper function to generate CSV data
function generateCsvData(leads) {
  const header = 'First Name,Last Name,Email,Phone,Source Platform,Status,Created At\n';

  const rows = leads.map(lead => {
    return `${lead.firstName},${lead.lastName},${lead.email},${lead.phone || ''},${lead.source.platform},${lead.status},${lead.createdAt}`;
  }).join('\n');

  return header + rows;
}
