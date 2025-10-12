const mongoose = require('mongoose');
require('dotenv').config();

async function updateNGOsWithTags() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const NGOSchema = new mongoose.Schema({
      organizationName: String,
      category: String,
      needs: [String],
      address: {
        city: String,
        state: String
      },
      tags: [String]
    });

    const NGO = mongoose.model('NGO', NGOSchema);
    const ngos = await NGO.find({});
    
    console.log(`Found ${ngos.length} NGOs to update`);
    
    for (const ngo of ngos) {
      const tags = [];
      
      if (ngo.category) {
        tags.push(ngo.category.toLowerCase().replace(/\s+/g, '-'));
      }
      
      if (ngo.needs && Array.isArray(ngo.needs)) {
        ngo.needs.forEach(need => {
          if (need && typeof need === 'string') {
            tags.push(need.toLowerCase().replace(/\s+/g, '-'));
          }
        });
      }
      
      if (ngo.address) {
        if (ngo.address.city) {
          tags.push(ngo.address.city.toLowerCase().replace(/\s+/g, '-'));
        }
        if (ngo.address.state) {
          tags.push(ngo.address.state.toLowerCase().replace(/\s+/g, '-'));
        }
      }
      
      const uniqueTags = [...new Set(tags.filter(tag => tag && tag.length > 0))];
      
      await NGO.findByIdAndUpdate(ngo._id, { tags: uniqueTags });
      console.log(`Updated tags for: ${ngo.organizationName}`);
    }
    
    await mongoose.connection.close();
    console.log('All NGOs updated with tags!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateNGOsWithTags();
