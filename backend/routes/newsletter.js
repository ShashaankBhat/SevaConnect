// routes/newsletter.js
const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    let subscriber = await Newsletter.findByEmail(email);

    if (subscriber) {
      if (subscriber.unsubscribed_at) {
        await subscriber.resubscribe();
        return res.status(200).json({
          success: true,
          message: 'You have been resubscribed to the newsletter'
        });
      } else {
        return res.status(409).json({
          success: false,
          message: 'Email is already subscribed'
        });
      }
    }

    subscriber = await Newsletter.create({ email });

    return res.status(201).json({
      success: true,
      message: 'Subscribed successfully',
      data: {
        email: subscriber.email,
        subscribed_at: subscriber.subscribed_at
      }
    });

  } catch (error) {
    console.error('Newsletter Subscription Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message || 'Unknown error'
    });
  }
});

// Unsubscribe endpoint
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const subscriber = await Newsletter.findByEmail(email);

    if (!subscriber || subscriber.unsubscribed_at) {
      return res.status(404).json({
        success: false,
        message: 'Email not found or already unsubscribed'
      });
    }

    await subscriber.unsubscribe();

    return res.status(200).json({
      success: true,
      message: 'Unsubscribed successfully',
      data: {
        email: subscriber.email,
        unsubscribed_at: subscriber.unsubscribed_at
      }
    });

  } catch (error) {
    console.error('Newsletter Unsubscribe Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message || 'Unknown error'
    });
  }
});

module.exports = router;
