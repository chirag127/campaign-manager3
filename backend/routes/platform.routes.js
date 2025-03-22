const express = require('express');
const router = express.Router();
const platformService = require('../services/platform.service');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all platform routes
router.use(authMiddleware.authenticate);

// Connect user account to a platform
router.post('/connect/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const { authCode } = req.body;

    if (!authCode) {
      return res.status(400).json({ message: 'Auth code is required' });
    }

    const result = await platformService.connectPlatform(platform, authCode, req.user);

    res.status(200).json({
      message: `Successfully connected to ${platform}`,
      ...result
    });
  } catch (error) {
    console.error(`Connect to ${req.params.platform} error:`, error);
    res.status(500).json({ message: `Error connecting to ${req.params.platform}: ${error.message}` });
  }
});

// Disconnect user account from a platform
router.post('/disconnect/:platform', async (req, res) => {
  try {
    const { platform } = req.params;

    const result = await platformService.disconnectPlatform(platform, req.user);

    res.status(200).json({
      message: `Successfully disconnected from ${platform}`,
      ...result
    });
  } catch (error) {
    console.error(`Disconnect from ${req.params.platform} error:`, error);
    res.status(500).json({ message: `Error disconnecting from ${req.params.platform}: ${error.message}` });
  }
});

module.exports = router;
