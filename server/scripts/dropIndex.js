const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coding-world';

async function dropTextIndex() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('projects');
    
    // List all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(i => i.name));

    // Try to drop the text index
    try {
      await collection.dropIndex('title_text_tags_text');
      console.log('✅ Successfully dropped index: title_text_tags_text');
    } catch (err) {
      console.log('⚠️ Index not found or already dropped:', err.message);
    }

    // Verify indexes after dropping
    const remainingIndexes = await collection.indexes();
    console.log('Remaining indexes:', remainingIndexes.map(i => i.name));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

dropTextIndex();