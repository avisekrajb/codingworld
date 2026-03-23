const Visitor = require('../models/Visitor');

exports.trackVisitor = async (req, res) => {
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const cleanIp = clientIp.replace('::ffff:', '');
    
    console.log('Visitor IP:', cleanIp);

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingToday = visitor.todayVisitors.find(v => 
      v.ip === cleanIp && new Date(v.visitedAt) >= today && new Date(v.visitedAt) < tomorrow
    );

    if (!existingToday) {
      visitor.count += 1;
      visitor.todayVisitors.push({ 
        ip: cleanIp, 
        visitedAt: new Date() 
      });
      
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

    res.json({ success: true, count: visitor.count });
  } catch (error) {
    console.error('❌ Visitor tracking error:', error);
    res.status(500).json({ success: false, message: 'Failed to track visitor' });
  }
};

exports.getVisitorCount = async (req, res) => {
  try {
    const visitor = await Visitor.findOne();
    res.json({ success: true, count: visitor ? visitor.count : 0 });
  } catch (error) {
    console.error('Error getting visitor count:', error);
    res.status(500).json({ success: false, message: 'Failed to get visitor count' });
  }
};