const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coding-world';

async function fixTextIndex() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('projects');

    // Check if collection exists
    const collections = await db.listCollections({ name: 'projects' }).toArray();
    
    if (collections.length === 0) {
      console.log('📚 Projects collection does not exist yet. Nothing to fix.');
      process.exit(0);
    }

    // List all indexes
    const indexes = await collection.indexes();
    console.log('\n📊 Current indexes:');
    indexes.forEach(idx => {
      console.log(`  - ${idx.name}:`, JSON.stringify(idx.key));
    });

    // Find and drop text indexes
    let droppedCount = 0;
    for (const index of indexes) {
      // Check if it's a text index (has any field with "text" value)
      const isTextIndex = Object.values(index.key).some(v => v === 'text');
      
      if (isTextIndex) {
        console.log(`\n⚠️ Found text index: ${index.name}`);
        try {
          await collection.dropIndex(index.name);
          console.log(`✅ Dropped index: ${index.name}`);
          droppedCount++;
        } catch (dropError) {
          console.error(`❌ Failed to drop index ${index.name}:`, dropError.message);
        }
      }
    }

    if (droppedCount === 0) {
      console.log('\n✨ No text indexes found. Your collection is clean!');
    } else {
      console.log(`\n✅ Successfully dropped ${droppedCount} text index(es)`);
      
      // Verify indexes after cleanup
      const remainingIndexes = await collection.indexes();
      console.log('\n📊 Remaining indexes:');
      remainingIndexes.forEach(idx => {
        console.log(`  - ${idx.name}:`, JSON.stringify(idx.key));
      });
    }

    // Create recommended indexes if they don't exist
    console.log('\n🔧 Creating recommended indexes...');
    
    const existingIndexNames = (await collection.indexes()).map(idx => idx.name);
    
    const recommendedIndexes = [
      { name: 'title_1', key: { title: 1 } },
      { name: 'createdAt_-1', key: { createdAt: -1 } },
      { name: 'isActive_1', key: { isActive: 1 } },
      { name: 'tags_1', key: { tags: 1 } }
    ];

    for (const idx of recommendedIndexes) {
      if (!existingIndexNames.includes(idx.name)) {
        try {
          await collection.createIndex(idx.key, { name: idx.name });
          console.log(`✅ Created index: ${idx.name}`);
        } catch (createError) {
          console.error(`❌ Failed to create index ${idx.name}:`, createError.message);
        }
      } else {
        console.log(`⏭️ Index already exists: ${idx.name}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

fixTextIndex();