const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coding-world';

async function forceDropTextIndex() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📚 All collections:');
    collections.forEach(col => console.log(`  - ${col.name}`));

    // Check if projects collection exists
    const projectsCollection = collections.find(col => col.name === 'projects');
    
    if (!projectsCollection) {
      console.log('\n📚 Projects collection does not exist. Creating it now...');
      await db.createCollection('projects');
      console.log('✅ Projects collection created');
    }

    const collection = db.collection('projects');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('\n📊 Current indexes:');
    indexes.forEach(idx => {
      console.log(`  - ${idx.name}:`, JSON.stringify(idx.key));
    });

    // Method 1: Try to drop by specific name
    const textIndexNames = ['title_text_tags_text', 'title_text', 'tags_text', 'text'];
    
    for (const indexName of textIndexNames) {
      try {
        await collection.dropIndex(indexName);
        console.log(`✅ Dropped index: ${indexName}`);
      } catch (error) {
        // Ignore error if index doesn't exist
        console.log(`ℹ️ Index ${indexName} not found`);
      }
    }

    // Method 2: Find and drop any text index
    for (const index of indexes) {
      // Check if it's a text index (has any field with value "text")
      const isTextIndex = Object.values(index.key).some(v => v === 'text');
      
      if (isTextIndex) {
        console.log(`\n⚠️ Found text index: ${index.name}`);
        try {
          await collection.dropIndex(index.name);
          console.log(`✅ Successfully dropped index: ${index.name}`);
        } catch (error) {
          console.error(`❌ Failed to drop index ${index.name}:`, error.message);
          
          // Method 3: If drop fails, try to drop all indexes and recreate
          console.log('\n⚠️ Trying alternative method - dropping all indexes except _id...');
          try {
            // Get all indexes except _id
            const indexesToDrop = indexes
              .filter(idx => idx.name !== '_id_')
              .map(idx => idx.name);
            
            for (const idxName of indexesToDrop) {
              try {
                await collection.dropIndex(idxName);
                console.log(`✅ Dropped index: ${idxName}`);
              } catch (dropError) {
                console.log(`❌ Failed to drop ${idxName}:`, dropError.message);
              }
            }
          } catch (bulkError) {
            console.error('❌ Bulk drop failed:', bulkError.message);
          }
        }
      }
    }

    // Method 4: If all else fails, drop and recreate the collection
    const shouldDropCollection = indexes.some(idx => Object.values(idx.key).some(v => v === 'text'));
    
    if (shouldDropCollection) {
      console.log('\n⚠️ Text index still present. Attempting to drop and recreate collection...');
      
      const answer = await askUser('Do you want to drop the entire projects collection? This will DELETE ALL PROJECTS! (yes/no): ');
      
      if (answer.toLowerCase() === 'yes') {
        await collection.drop();
        console.log('✅ Projects collection dropped');
        
        await db.createCollection('projects');
        console.log('✅ Projects collection recreated');
      } else {
        console.log('⏭️ Skipping collection drop');
      }
    }

    // Verify indexes after cleanup
    const finalIndexes = await collection.indexes();
    console.log('\n📊 Final indexes after cleanup:');
    finalIndexes.forEach(idx => {
      console.log(`  - ${idx.name}:`, JSON.stringify(idx.key));
    });

    // Check if any text indexes remain
    const remainingTextIndex = finalIndexes.some(idx => Object.values(idx.key).some(v => v === 'text'));
    
    if (remainingTextIndex) {
      console.log('\n❌ WARNING: Text indexes still present!');
    } else {
      console.log('\n✅ SUCCESS: No text indexes found. Your collection is clean!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Helper function to ask user for input
function askUser(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    readline.question(question, answer => {
      readline.close();
      resolve(answer);
    });
  });
}

forceDropTextIndex();