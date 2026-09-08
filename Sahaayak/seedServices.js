require("dotenv").config();
const mongoose = require("mongoose");
const Service = require("./src/models/Service");

const services = [
  {
    name: "Fan Installation",
    category: "Electrician",
    description: "Installation of ceiling and wall fans",
    basePrice: 300,
    estimatedDuration: 60,
  },
  {
    name: "Switch & Socket Repair",
    category: "Electrician",
    description: "Repair and replacement of switches and electrical sockets",
    basePrice: 200,
    estimatedDuration: 45,
  },
  {
    name: "Plumbing Repair",
    category: "Plumber",
    description: "General household plumbing repair",
    basePrice: 350,
    estimatedDuration: 60,
  },
  {
    name: "Tap & Pipe Repair",
    category: "Plumber",
    description: "Repair of leaking taps and household pipes",
    basePrice: 250,
    estimatedDuration: 45,
  },
  {
    name: "Furniture Repair",
    category: "Carpenter",
    description: "Repair and maintenance of household furniture",
    basePrice: 400,
    estimatedDuration: 90,
  },
  {
    name: "Wall Painting",
    category: "Painter",
    description: "Interior and exterior wall painting service",
    basePrice: 800,
    estimatedDuration: 180,
  },
  {
    name: "Home Cleaning",
    category: "Cleaner",
    description: "General household cleaning service",
    basePrice: 500,
    estimatedDuration: 120,
  },
  {
    name: "Appliance Repair",
    category: "Appliance Repair",
    description: "Repair of common household appliances",
    basePrice: 450,
    estimatedDuration: 90,
  },
  {
    name: "Masonry Work",
    category: "Mason",
    description: "Small household construction and masonry work",
    basePrice: 600,
    estimatedDuration: 120,
  },
  {
    name: "Gardening",
    category: "Gardener",
    description: "Garden maintenance and plant care",
    basePrice: 400,
    estimatedDuration: 90,
  },
  {
    name: "AC Repair",
    category: "AC & Refrigeration",
    description: "Air conditioner inspection and repair",
    basePrice: 500,
    estimatedDuration: 90,
  },
];

async function seedServices() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Service.deleteMany({});

    await Service.insertMany(services);

    console.log(`${services.length} services added successfully`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seedServices();