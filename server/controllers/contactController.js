const Contact = require('../models/Contact');
const { sendContactConfirmation, sendContactReply } = require('../utils/emailService');

// Submit contact form
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Get client IP and user agent
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      metadata: {
        ip,
        userAgent,
        page: req.headers.referer || 'direct'
      }
    });

    // Send confirmation email
    await sendContactConfirmation({ name, email, subject, message });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { id: contact._id }
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// Get all contact messages (admin)
exports.getMessages = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = status ? { status } : {};
    
    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: messages,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};

// Reply to message (admin)
exports.replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    contact.status = 'replied';
    contact.reply = {
      message: replyMessage,
      repliedAt: new Date(),
      repliedBy: req.admin?.name || 'Admin'
    };
    await contact.save();

    // Send reply email
    await sendContactReply(contact, replyMessage);

    res.json({
      success: true,
      message: 'Reply sent successfully'
    });

  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply'
    });
  }
};

// Get contact statistics
exports.getContactStats = async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const pending = await Contact.countDocuments({ status: 'pending' });
    const replied = await Contact.countDocuments({ status: 'replied' });
    const resolved = await Contact.countDocuments({ status: 'resolved' });

    // Get last 7 days stats
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const count = await Contact.countDocuments({
        createdAt: { $gte: date, $lt: nextDate }
      });

      last7Days.push({
        date: date.toLocaleDateString(),
        count
      });
    }

    res.json({
      success: true,
      data: {
        total,
        pending,
        replied,
        resolved,
        last7Days
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics'
    });
  }
};