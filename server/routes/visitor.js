const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// Track unique visitors (public)
router.get('/track', async (req, res) => {
  try {
    // Get client IP address
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    // Clean up IPv6 format if needed
    const cleanIp = clientIp.replace('::ffff:', '');
    
    console.log('Visitor IP:', cleanIp);

    // Find or create visitor record
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = new Visitor({ 
        count: 1,
        todayVisitors: [{ ip: cleanIp, visitedAt: new Date() }]
      });
      await visitor.save();
      console.log('Created new visitor record, count: 1');
      return res.json({ success: true, count: 1 });
    }

    // Check if this IP has visited today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if IP exists in today's visitors
    const existingToday = visitor.todayVisitors.find(v => 
      v.ip === cleanIp && new Date(v.visitedAt) >= today && new Date(v.visitedAt) < tomorrow
    );

    if (!existingToday) {
      // New unique visitor today
      visitor.count += 1;
      visitor.todayVisitors.push({ 
        ip: cleanIp, 
        visitedAt: new Date() 
      });
      
      // Clean up old visitors (keep last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      visitor.todayVisitors = visitor.todayVisitors.filter(v => 
        new Date(v.visitedAt) >= thirtyDaysAgo
      );
      
      await visitor.save();
      console.log('New unique visitor, total count:', visitor.count);
    } else {
      console.log('Returning visitor from today, total count:', visitor.count);
    }

    res.json({ 
      success: true, 
      count: visitor.count 
    });

  } catch (error) {
    console.error('❌ Visitor tracking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to track visitor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get visitor count (public)
router.get('/count', async (req, res) => {
  try {
    const visitor = await Visitor.findOne();
    res.json({ 
      success: true, 
      count: visitor ? visitor.count : 0 
    });
  } catch (error) {
    console.error('Error getting visitor count:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get visitor count' 
    });
  }
});

module.exports = router;