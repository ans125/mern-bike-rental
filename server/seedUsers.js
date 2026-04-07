import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rideRent');
    console.log('Connected to MongoDB');

    const usersToCreate = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        passwordRaw: 'anas123',
        role: 'admin',
        isApproved: true,
      },
      {
        name: 'Provider User',
        email: 'provider@example.com',
        passwordRaw: 'anas123',
        role: 'provider',
        isApproved: true,
      },
      {
        name: 'Normal User',
        email: 'user@example.com',
        passwordRaw: 'anas123',
        role: 'user',
        isApproved: true,
      }
    ];

    for (const u of usersToCreate) {
      const existingUser = await User.findOne({ email: u.email });
      if (existingUser) {
        console.log(`User ${u.email} already exists`);
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(u.passwordRaw, salt);

        await User.create({
          name: u.name,
          email: u.email,
          password: hashedPassword,
          role: u.role,
          isApproved: u.isApproved,
        });
        console.log(`Created user ${u.email} with role ${u.role}`);
      }
    }

    console.log('Seeding complete. Exiting.');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedUsers();
