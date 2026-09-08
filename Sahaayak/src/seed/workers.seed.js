const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

const workers = [
  {
    name: "Ramesh Kumar",
    email: "ramesh@gmail.com",
    phone: "9000000001",
    password: "545454",
    role: "worker",
    language: "en",
    occupation: "Electrician",
    skills: [
      "Fan Installation",
      "Switch & Socket Repair",
      "Wiring",
      "Electrical Maintenance",
    ],
    age: 34,
    location: {
      type: "Point",
      coordinates: [77.5946, 12.9716],
      state: "Karnataka",
      city: "Bengaluru",
      address: "MG Road, Bengaluru",
    },
    isVerified: true,
  },

  {
    name: "Suresh Yadav",
    email: "suresh@gmail.com",
    phone: "9000000002",
    password: "545454",
    role: "worker",
    language: "hi",
    occupation: "Plumber",
    skills: [
      "Pipe Repair",
      "Tap Repair",
      "Leakage Repair",
      "Bathroom Plumbing",
    ],
    age: 38,
    location: {
      type: "Point",
      coordinates: [77.5965, 12.975],
      state: "Karnataka",
      city: "Bengaluru",
      address: "Brigade Road, Bengaluru",
    },
    isVerified: true,
  },

  {
    name: "Mohan Lal",
    email: "mohan@gmail.com",
    phone: "9000000003",
    password: "545454",
    role: "worker",
    language: "hi",
    occupation: "Carpenter",
    skills: [
      "Furniture Repair",
      "Woodwork",
      "Door Repair",
      "Furniture Assembly",
    ],
    age: 42,
    location: {
      type: "Point",
      coordinates: [77.591, 12.968],
      state: "Karnataka",
      city: "Bengaluru",
      address: "Shivajinagar, Bengaluru",
    },
    isVerified: true,
  },

  {
    name: "Vijay Singh",
    email: "vijay@gmail.com",
    phone: "9000000004",
    password: "545454",
    role: "worker",
    language: "hi",
    occupation: "Painter",
    skills: [
      "Wall Painting",
      "Interior Painting",
      "Exterior Painting",
      "Wall Finishing",
    ],
    age: 36,
    location: {
      type: "Point",
      coordinates: [77.588, 12.974],
      state: "Karnataka",
      city: "Bengaluru",
      address: "Malleshwaram, Bengaluru",
    },
    isVerified: true,
  },

  {
    name: "Sunita Devi",
    email: "sunita@gmail.com",
    phone: "9000000005",
    password: "545454",
    role: "worker",
    language: "hi",
    occupation: "Cleaner",
    skills: [
      "Home Cleaning",
      "Deep Cleaning",
      "Kitchen Cleaning",
      "Bathroom Cleaning",
    ],
    age: 32,
    location: {
      type: "Point",
      coordinates: [77.598, 12.969],
      state: "Karnataka",
      city: "Bengaluru",
      address: "Indiranagar, Bengaluru",
    },
    isVerified: true,
  },

  {
    name: "Imran Khan",
    email: "imran@gmail.com",
    phone: "9000000006",
    password: "545454",
    role: "worker",
    language: "hi",
    occupation: "AC & Refrigeration",
    skills: [
      "AC Repair",
      "AC Installation",
      "AC Maintenance",
      "Cooling System Repair",
    ],
    age: 35,
    location: {
      type: "Point",
      coordinates: [77.601, 12.972],
      state: "Karnataka",
      city: "Bengaluru",
      address: "Koramangala, Bengaluru",
    },
    isVerified: true,
  },

  {
    name: "Ankit Verma",
    email: "ankit@gmail.com",
    phone: "9000000007",
    password: "545454",
    role: "worker",
    language: "en",
    occupation: "Appliance Repair",
    skills: [
      "Appliance Repair",
      "Washing Machine Repair",
      "Refrigerator Repair",
      "General Maintenance",
    ],
    age: 31,
    location: {
      type: "Point",
      coordinates: [77.585, 12.978],
      state: "Karnataka",
      city: "Bengaluru",
      address: "Rajajinagar, Bengaluru",
    },
    isVerified: true,
  },

  {
    name: "Rajesh Patel",
    email: "rajesh@gmail.com",
    phone: "9000000008",
    password: "545454",
    role: "worker",
    language: "hi",
    occupation: "Mason",
    skills: [
      "Masonry Work",
      "Brickwork",
      "Wall Repair",
      "Construction Work",
    ],
    age: 45,
    location: {
      type: "Point",
      coordinates: [77.603, 12.968],
      state: "Karnataka",
      city: "Bengaluru",
      address: "Jayanagar, Bengaluru",
    },
    isVerified: true,
  },

  {
    name: "Neha Sharma",
    email: "neha@gmail.com",
    phone: "9000000009",
    password: "545454",
    role: "worker",
    language: "en",
    occupation: "Gardener",
    skills: [
      "Gardening",
      "Lawn Maintenance",
      "Plant Care",
      "Garden Cleaning",
    ],
    age: 29,
    location: {
      type: "Point",
      coordinates: [77.59, 12.982],
      state: "Karnataka",
      city: "Bengaluru",
      address: "Sadashivanagar, Bengaluru",
    },
    isVerified: true,
  },

  {
    name: "Deepak Sharma",
    email: "deepak@gmail.com",
    phone: "9000000010",
    password: "545454",
    role: "worker",
    language: "en",
    occupation: "Electrician",
    skills: [
      "Fan Installation",
      "Switch & Socket Repair",
      "Wiring",
      "Electrical Maintenance",
    ],
    age: 39,
    location: {
      type: "Point",
      coordinates: [77.597, 12.976],
      state: "Karnataka",
      city: "Bengaluru",
      address: "Ulsoor, Bengaluru",
    },
    isVerified: true,
  },
];

async function seedWorkers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Remove existing demo workers so the script can safely be rerun
    const emails = workers.map((worker) => worker.email);

    await User.deleteMany({
      email: { $in: emails },
    });

    console.log("Old demo workers removed");

    // Hash password for every worker
    const hashedPassword = await bcrypt.hash("545454", 10);

    const workersToInsert = workers.map((worker) => ({
      ...worker,
      password: hashedPassword,
    }));

    const createdWorkers = await User.create(workersToInsert);

    console.log(
      `Successfully created ${createdWorkers.length} workers`
    );

    console.log("\nWorker accounts:");

    createdWorkers.forEach((worker) => {
      console.log(
        `${worker.name} | ${worker.email} | password: 545454 | ${worker.occupation}`
      );
    });

    console.log("\nWorker seeding completed.");
  } catch (error) {
    console.error("Worker seed failed:");
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  }
}

seedWorkers();