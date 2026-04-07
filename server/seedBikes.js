import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bike from './models/bikeModel.js';
import User from './models/User.js';

dotenv.config();

const dummyBikes = [
  {
    name: "Honda CG 125",
    brand: "Honda",
    city: "Lahore",
    rentPerDay: 1500,
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
  },
  {
    name: "Yamaha YBR 125G",
    brand: "Yamaha",
    city: "Karachi",
    rentPerDay: 2000,
    image: "https://images.unsplash.com/photo-1558981001-1995369a39a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
  },
  {
    name: "Suzuki GS 150",
    brand: "Suzuki",
    city: "Islamabad",
    rentPerDay: 1800,
    image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
  },
  {
    name: "CD 70 Dream",
    brand: "Honda",
    city: "Faisalabad",
    rentPerDay: 800,
    image: "https://plus.unsplash.com/premium_photo-1664303358055-1f9e9dfaf782?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 4.2,
  },
  {
    name: "Benelli TNT 25",
    brand: "Benelli",
    city: "Lahore",
    rentPerDay: 3500,
    image: "https://images.unsplash.com/photo-1590518776366-02e0717b96e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
  }
];

const seedBikes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rideRent');
    console.log('Connected to MongoDB');

    // Find our provider account mapped from earlier
    const provider = await User.findOne({ email: 'provider@example.com' });
    
    if (!provider) {
      console.error("Provider account not found. Please run seedUsers.js first.");
      process.exit(1);
    }

    console.log(`Found provider: ${provider.name} (${provider._id})`);

    // Prepare bikes with provider ID attached
    const bikesToInsert = dummyBikes.map(bike => ({
      ...bike,
      provider: provider._id
    }));

    // Insert to DB
    const insertedBikes = await Bike.insertMany(bikesToInsert);
    
    console.log(`Successfully seeded ${insertedBikes.length} dummy bikes tied to provider.`);
    process.exit(0);

  } catch (error) {
    console.error('Error seeding bikes:', error);
    process.exit(1);
  }
};

seedBikes();
