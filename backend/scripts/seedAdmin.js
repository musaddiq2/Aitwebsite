import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';
import RefreshToken from '../models/RefreshToken.model.js';

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/aitplatform');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@test.com' });
    if (existingAdmin) {
      console.log('Admin user already exists. Deleting old admin...');
      await User.deleteOne({ email: 'admin@test.com' });
      await RefreshToken.deleteMany({ userId: existingAdmin._id });
    }

    // Create test admin user
    const admin = await User.create({
      email: 'admin@test.com',
      password: 'admin123', // Will be hashed automatically
      firstName: 'Admin',
      lastName: 'User',
      phone: '1234567890',
      role: 'admin',
      status: 'Active',
      isDeleted: false
    });

    // Verify the user was created
    const createdUser = await User.findOne({ email: 'admin@test.com' }).select('+password');
    if (!createdUser) {
      throw new Error('Failed to verify admin user creation');
    }

    console.log('✅ Test Admin User Created Successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@test.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: Admin');
    console.log(`📊 Status: ${createdUser.status}`);
    console.log(`🆔 User ID: ${createdUser._id}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\nYou can now login with these credentials.');

    // Close connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

// Run the seed function
seedAdmin();

