const mongoose = require('mongoose');
require('dotenv').config();

async function createAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password: String,
      name: String,
      phone: String,
      role: String,
      isVerified: Boolean
    }));

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@sevaconnect.com' });
    if (!existingAdmin) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const adminUser = new User({
        email: 'admin@sevaconnect.com',
        password: hashedPassword,
        name: 'Platform Administrator',
        phone: '0000000000',
        role: 'admin',
        isVerified: true
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdminUser();
