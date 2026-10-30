// Demo data for testing and the viva: Pakistani bikes, providers, customers, bookings, reviews, support messages.
// Run from server/:  node seedDemoData.js          (removes old demo data, then inserts fresh data)
//                    node seedDemoData.js --reset  (only removes demo data)
// Demo records use emails ending in @demo.riderent.pk, so real data is never touched.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";
import Bike from "./models/bikeModel.js";
import Booking from "./models/Booking.js";
import SupportMessage from "./models/SupportMessage.js";
import { KYC_DIR } from "./middleware/uploadMiddleware.js";

dotenv.config({ quiet: true });

const DEMO_DOMAIN = "@demo.riderent.pk";
const DEMO_PASSWORD = "demo1234";
const COMMISSION_RATE = Number(process.env.COMMISSION_RATE) || 0.1;
const DAY_MS = 1000 * 60 * 60 * 24;

// Base accounts from seedUsers.js, created here too if missing
const BASE_ACCOUNTS = [
  { name: "Admin User", email: "admin@example.com", role: "admin" },
  { name: "Provider User", email: "provider@example.com", role: "provider" },
  { name: "Normal User", email: "user@example.com", role: "user" },
];
const BASE_PASSWORD = "anas123";

const unsplash = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;
const COMMUTER_IMAGE = "/uploads/demo/commuter-125.png";

// Put real photos in server/uploads/bikes/ named after the model (see `node seedDemoData.js --image-names`)
const BIKE_PHOTO_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "uploads", "bikes");
const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const ownPhoto = (name) => {
  for (const ext of ["jpg", "jpeg", "png"]) {
    if (fs.existsSync(path.join(BIKE_PHOTO_DIR, `${slug(name)}.${ext}`))) return `/uploads/bikes/${slug(name)}.${ext}`;
  }
  return null;
};
// Category to borrow a local photo from when a category has none of its own
const SIMILAR_CATEGORY = { "100-110cc": ["70cc", "125cc"], Electric: ["70cc"], "150cc": ["125cc"] };

// Sample CNIC images for demo accounts (shared files, prefixed "demo-" so they are never deleted with a user)
const SAMPLE_DOCS = { cnicFront: "demo-cnic-front.svg", cnicBack: "demo-cnic-back.svg" };
const writeSampleDocs = () => {
  const card = (title, lines) => `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">
<rect width="640" height="400" rx="24" fill="#e8f5ee" stroke="#198754" stroke-width="6"/>
<rect x="0" y="0" width="640" height="70" rx="24" fill="#198754"/>
<text x="32" y="46" font-family="Arial" font-size="26" font-weight="bold" fill="#fff">${title}</text>
${lines.map((l, i) => `<text x="32" y="${130 + i * 46}" font-family="Arial" font-size="24" fill="#1b2620">${l}</text>`).join("")}
<text x="32" y="372" font-family="Arial" font-size="18" fill="#c0392b" font-weight="bold">SAMPLE DOCUMENT FOR TESTING ONLY</text>
</svg>`;
  fs.mkdirSync(KYC_DIR, { recursive: true });
  fs.writeFileSync(path.join(KYC_DIR, SAMPLE_DOCS.cnicFront),
    card("Islamic Republic of Pakistan · CNIC (Front)", ["Name: Demo Account", "Identity No: 00000-0000000-0", "Date of Birth: 01.01.2000", "Date of Expiry: 01.01.2035"]));
  fs.writeFileSync(path.join(KYC_DIR, SAMPLE_DOCS.cnicBack),
    card("CNIC (Back)", ["Present Address: Demo Street, Pakistan", "Permanent Address: Demo Street, Pakistan", "Registrar General of Pakistan"]));
};

// Pakistani CNIC prefixes by city, and realistic pick-up addresses for shops
const CNIC_PREFIX = {
  Lahore: "35202", Karachi: "42101", Islamabad: "61101", Rawalpindi: "37405", Faisalabad: "33100", Multan: "36302",
  Peshawar: "17301", Sialkot: "34603", Quetta: "54400", Hyderabad: "41306", Gujranwala: "34101",
};
const SHOP_ADDRESS = {
  Lahore: "Shop 14, McLeod Road, near Lakshmi Chowk, Lahore",
  Karachi: "Shop 7, Plaza Quarters, Saddar, Karachi",
  Islamabad: "Shop 3, G-9 Markaz, Islamabad",
  Rawalpindi: "Shop 21, Committee Chowk, Murree Road, Rawalpindi",
  Faisalabad: "Shop 9, Jhang Bazaar, Faisalabad",
  Multan: "Shop 5, Hussain Agahi Road, Multan",
  Peshawar: "Shop 11, Saddar Road, Peshawar Cantt",
  Sialkot: "Shop 2, Paris Road, Sialkot",
  Quetta: "Shop 6, Jinnah Road, Quetta",
  Hyderabad: "Shop 4, Saddar Bazaar, Hyderabad",
  Gujranwala: "Shop 8, GT Road, Gujranwala",
};
const CUSTOMER_CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Sialkot"];
const LICENCE_CODE = { Lahore: "LHR", Karachi: "KHI", Islamabad: "ISB", Rawalpindi: "RWP", Faisalabad: "FSD", Multan: "MUL", Peshawar: "PSH", Sialkot: "SKT" };
const IMAGES = {
  "150cc": [unsplash("1508357941501-0924cf312bbd"), unsplash("1591637333184-19aa84b3e01f"), unsplash("1558980664-769d59546b3d")],
  "Sports & Heavy": [
    unsplash("1449426468159-d96dbf08f19f"), unsplash("1547549082-6bc09f2049ae"), unsplash("1568772585407-9361f9bf3a87"),
    unsplash("1580310614729-ccd69652491d"), unsplash("1599819811279-d5ad9cccf838"), unsplash("1609630875171-b1321377ee65"),
    unsplash("1615172282427-9a57ef2d142e"), unsplash("1580341289255-5b47c98a59dd"), unsplash("1517846693594-1567da72af75"),
  ],
  Cruiser: [unsplash("1622185135505-2d795003994a"), unsplash("1558981285-6f0c94958bb6")],
  Electric: [unsplash("1558981403-c5f9899a28bc")],
};

// Pakistani market bikes: [name, brand, category, rent per day]
const MODELS = [
  ["Honda CD 70", "Honda", "70cc", 700],
  ["Honda CD 70 Dream", "Honda", "70cc", 800],
  ["United US 70", "United", "70cc", 550],
  ["Road Prince RP 70", "Road Prince", "70cc", 550],
  ["Super Power SP 70", "Super Power", "70cc", 500],
  ["Unique UD 70", "Unique", "70cc", 500],
  ["Hi-Speed SR 70", "Hi-Speed", "70cc", 500],
  ["Yamaha YB 125Z", "Yamaha", "125cc", 1300],
  ["Honda Pridor", "Honda", "100-110cc", 900],
  ["Suzuki GD 110S", "Suzuki", "100-110cc", 1000],
  ["United US 100", "United", "100-110cc", 800],
  ["Road Prince RX 110", "Road Prince", "100-110cc", 800],
  ["Honda CG 125", "Honda", "125cc", 1200],
  ["Honda CG 125 Self Start", "Honda", "125cc", 1300],
  ["Honda CB 125F", "Honda", "125cc", 1500],
  ["Yamaha YBR 125", "Yamaha", "125cc", 1500],
  ["Yamaha YBR 125G", "Yamaha", "125cc", 1600],
  ["Yamaha YB 125Z-DX", "Yamaha", "125cc", 1400],
  ["United US 125", "United", "125cc", 1000],
  ["Road Prince RP 125", "Road Prince", "125cc", 1000],
  ["Suzuki GS 150", "Suzuki", "150cc", 1700],
  ["Suzuki GS 150 SE", "Suzuki", "150cc", 1800],
  ["Suzuki GR 150", "Suzuki", "150cc", 2200],
  ["Honda CB 150F", "Honda", "150cc", 2300],
  ["Road Prince Wego 150", "Road Prince", "150cc", 1600],
  ["Super Power Archi 150", "Super Power", "150cc", 1500],
  ["Hi-Speed Infinity 150", "Hi-Speed", "150cc", 1700],
  ["Yamaha YZF-R15", "Yamaha", "Sports & Heavy", 4500],
  ["Benelli TNT 25", "Benelli", "Sports & Heavy", 5000],
  ["Benelli 302R", "Benelli", "Sports & Heavy", 6500],
  ["Kawasaki Ninja 400", "Kawasaki", "Sports & Heavy", 8000],
  ["Kawasaki Ninja 650", "Kawasaki", "Sports & Heavy", 9500],
  ["Haojue DR 300", "Haojue", "Sports & Heavy", 5000],
  ["Suzuki Gixxer 150", "Suzuki", "Sports & Heavy", 3000],
  ["Royal Enfield Classic 350", "Royal Enfield", "Cruiser", 6000],
  ["Benelli Leoncino 500", "Benelli", "Cruiser", 9000],
  ["Jolta JE-70D", "Jolta", "Electric", 700],
  ["Evee C1 Air", "Evee", "Electric", 800],
];

const PROVIDERS = [
  { name: "Ali Bike Rentals", email: "ali.rentals", city: "Lahore", phone: "0300-1234567" },
  { name: "Karachi Ride Point", email: "karachi.ride", city: "Karachi", phone: "0321-2345678" },
  { name: "Capital Bikes", email: "capital.bikes", city: "Islamabad", phone: "0333-3456789" },
  { name: "Pindi Motors", email: "pindi.motors", city: "Rawalpindi", phone: "0345-4567890" },
  { name: "Faisal Motors", email: "faisal.motors", city: "Faisalabad", phone: "0301-5678901" },
  { name: "Multan Wheels", email: "multan.wheels", city: "Multan", phone: "0302-6789012" },
  { name: "Khyber Riders", email: "khyber.riders", city: "Peshawar", phone: "0311-7890123" },
  { name: "Sialkot Auto Rentals", email: "sialkot.auto", city: "Sialkot", phone: "0312-8901234" },
];
const PENDING_PROVIDERS = [
  { name: "Quetta Bike Hub", email: "quetta.hub", city: "Quetta", phone: "0313-9012345" },
  { name: "Hyderabad Rides", email: "hyderabad.rides", city: "Hyderabad", phone: "0314-0123456" },
];
const REJECTED_PROVIDERS = [
  { name: "Gujranwala Bike Point", email: "gujranwala.bikes", city: "Gujranwala", phone: "0315-1122334",
    note: "The name on the CNIC does not match the shop owner. Please contact support with the owner's CNIC." },
];
// Customers waiting for CNIC verification, and one rejected
const PENDING_CUSTOMERS = [["Kamran Akmal", "kamran"], ["Nida Yasir", "nida"]];
const REJECTED_CUSTOMERS = [["Imran Shah", "imran", "CNIC photo is blurry and the number is not readable. Please register again with a clear photo."]];
const CUSTOMERS = [
  ["Ahmed Raza", "ahmed"], ["Fatima Khan", "fatima"], ["Bilal Hussain", "bilal"], ["Ayesha Malik", "ayesha"],
  ["Usman Tariq", "usman"], ["Hira Siddiqui", "hira"], ["Hamza Sheikh", "hamza"], ["Zainab Ali", "zainab"],
  ["Saad Qureshi", "saad"], ["Maryam Iqbal", "maryam"], ["Hassan Javed", "hassan"], ["Sana Riaz", "sana"],
];

const REVIEW_TEXT = {
  5: ["Excellent bike, very smooth ride and the owner was on time.", "Bike was in perfect condition. Highly recommended!",
    "Great fuel average, used it all week for office. Will book again."],
  4: ["Good bike and fair rent. Small delay at pick-up but overall fine.", "Comfortable for city rides, brakes were good.",
    "Clean bike and helpful owner. Mirror was a bit loose."],
  3: ["Okay for short trips, tyres need replacing soon.", "Average condition but it did the job."],
};
const SUPPORT = [
  ["Booking issue", "My booking is still pending after one day. How long does the owner take to respond?", "open"],
  ["Payment question", "Do I pay the provider in cash at pick-up or online?", "open"],
  ["Provider account", "I registered as a provider two days ago. When will my account be approved?", "open"],
  ["Report a problem", "The bike I rented had a flat tyre at pick-up. The owner replaced it but I lost an hour.", "resolved"],
  ["Other", "Can I rent a bike for one month at a discounted price?", "resolved"],
];
const CHAT = [
  ["user", "Assalam o Alaikum, I will come for pick-up at 10 AM. Is that okay?"],
  ["provider", "Walaikum Assalam, yes 10 AM is fine. Please bring your original CNIC and driving licence."],
  ["user", "Sure. Is a helmet included?"],
  ["provider", "Yes, helmet is included and the tank will be full. Shop address is shown in the booking details."],
];

// Small deterministic random generator so every run produces the same demo data
let seed = 42;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const pick = (list) => list[Math.floor(rand() * list.length)];
const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));
const dayOffset = (n) => new Date(startOfToday.getTime() + n * DAY_MS);

const describe = (name, category, city) => {
  const text = {
    "70cc": "Economical 70cc bike, ideal for daily commuting and short city trips. Excellent fuel average.",
    "100-110cc": "Light and fuel-efficient bike, comfortable for daily office and university rides.",
    "125cc": "Reliable 125cc bike with good power for city and highway travel. Popular choice for long rides.",
    "150cc": "Powerful 150cc bike with a comfortable seat, suitable for intercity travel and touring.",
    "Sports & Heavy": "Sports bike for experienced riders. Valid licence and security deposit required at pick-up.",
    Cruiser: "Classic cruiser for relaxed long-distance rides. Experienced riders only.",
    Electric: "Electric bike with zero fuel cost. Full charge at pick-up, around 70 km range.",
  }[category];
  return `${text} Helmet included. Pick-up from our ${city} shop. ${name} is regularly serviced.`;
};

const removeDemoData = async () => {
  const demoUsers = await User.find({ email: { $regex: `${DEMO_DOMAIN.replace(/\./g, "\\.")}$` } }, "_id");
  const ids = demoUsers.map((u) => u._id);
  const demoBikes = await Bike.find({ provider: { $in: ids } }, "_id");
  const bikeIds = demoBikes.map((b) => b._id);

  const bookings = await Booking.deleteMany({ $or: [{ user: { $in: ids } }, { provider: { $in: ids } }, { bike: { $in: bikeIds } }] });
  const bikes = await Bike.deleteMany({ _id: { $in: bikeIds } });
  const messages = await SupportMessage.deleteMany({ email: { $regex: `${DEMO_DOMAIN.replace(/\./g, "\\.")}$` } });
  // Reviews written by demo customers on non-demo bikes
  await Bike.updateMany({ "reviews.user": { $in: ids } }, { $pull: { reviews: { user: { $in: ids } } } });
  const users = await User.deleteMany({ _id: { $in: ids } });

  console.log(`Removed demo data: ${users.deletedCount} users, ${bikes.deletedCount} bikes, ` +
    `${bookings.deletedCount} bookings, ${messages.deletedCount} support messages`);
};

const ensureBaseAccounts = async () => {
  for (const acc of BASE_ACCOUNTS) {
    if (!(await User.exists({ email: acc.email }))) {
      await User.create({ ...acc, password: await bcrypt.hash(BASE_PASSWORD, 10), isApproved: true, verificationStatus: "approved" });
      console.log(`Created base account ${acc.email}`);
    }
  }
};

const insertDemoData = async () => {
  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
  writeSampleDocs();
  let serial = 1000;
  const cnicFor = (city) => `${CNIC_PREFIX[city] || "35202"}-${String(1234567 + (serial += 7919)).slice(-7)}-${serial % 10}`;
  const kyc = (city) => ({ cnic: cnicFor(city), city, documents: { ...SAMPLE_DOCS } });

  const providerDocs = [
    ...PROVIDERS.map((p) => ({ ...p, status: "approved" })),
    ...PENDING_PROVIDERS.map((p) => ({ ...p, status: "pending" })),
    ...REJECTED_PROVIDERS.map((p) => ({ ...p, status: "rejected" })),
  ].map((p) => ({
    name: p.name, email: `${p.email}${DEMO_DOMAIN}`, phone: p.phone, password: hash, role: "provider",
    shopName: p.name, address: SHOP_ADDRESS[p.city], ...kyc(p.city),
    isApproved: p.status === "approved", verificationStatus: p.status, verificationNote: p.note || "",
  }));
  const providers = await User.insertMany(providerDocs);
  const approvedProviders = providers.filter((p) => p.isApproved);
  const providerCity = Object.fromEntries(providers.map((p) => [p.email, p.city]));

  const customerDoc = ([name, email, note], i, status) => {
    const city = CUSTOMER_CITIES[i % CUSTOMER_CITIES.length];
    return {
      name, email: `${email}${DEMO_DOMAIN}`, password: hash, role: "user",
      phone: `03${String(10 + i).padStart(2, "0")}-${String(1000000 + i * 7919).slice(0, 7)}`,
      address: `House ${12 + i}, Street ${3 + (i % 9)}, ${city}`,
      licenseNumber: `${LICENCE_CODE[city]}-${2019 + (i % 6)}-${String(100000 + i * 3571).slice(0, 6)}`,
      ...kyc(city), isApproved: status === "approved", verificationStatus: status, verificationNote: note || "",
    };
  };
  const customers = await User.insertMany(CUSTOMERS.map((c, i) => customerDoc(c, i, "approved")));
  await User.insertMany([
    ...PENDING_CUSTOMERS.map((c, i) => customerDoc(c, CUSTOMERS.length + i, "pending")),
    ...REJECTED_CUSTOMERS.map((c, i) => customerDoc(c, CUSTOMERS.length + PENDING_CUSTOMERS.length + i, "rejected")),
  ]);

  // Every model is offered by 2-3 providers in different cities, so each city has a full mix of bikes
  const bikeDocs = [];
  const imageIndex = {};
  // Local photos grouped by category; models without their own photo reuse one from the same (or a similar) category
  const localByCategory = {};
  MODELS.forEach(([name, , category]) => {
    if (ownPhoto(name)) (localByCategory[category] ||= []).push(ownPhoto(name));
  });
  const localPhotosFor = (category) =>
    localByCategory[category] || (SIMILAR_CATEGORY[category] || []).flatMap((c) => localByCategory[c] || []);
  MODELS.forEach(([name, brand, category, rent], i) => {
    const n = approvedProviders.length;
    const owners = [approvedProviders[i % n], approvedProviders[(i + 3) % n]];
    if (rand() < 0.5) owners.push(approvedProviders[(i + 5) % n]);
    for (const owner of owners) {
      const city = providerCity[owner.email];
      let image = ownPhoto(name);
      if (!image) {
        const pool = localPhotosFor(category).length ? localPhotosFor(category) : IMAGES[category] || [COMMUTER_IMAGE];
        imageIndex[category] = (imageIndex[category] || 0) + 1;
        image = pool[imageIndex[category] % pool.length];
      }
      bikeDocs.push({
        provider: owner._id, name, brand, category, city, image,
        rentPerDay: rent + Math.round((rand() * 4 - 2)) * 50, // small price differences between shops
        description: describe(name, category, city),
        isAvailable: rand() > 0.06,
      });
    }
  });
  const bikes = await Bike.insertMany(bikeDocs);
  const ownerOf = Object.fromEntries(bikes.map((b) => [String(b._id), providers.find((p) => String(p._id) === String(b.provider))]));

  // Bookings in separate, non-overlapping date windows per bike.
  // Past accepted rentals are completed, the current one is on ride, future accepted ones wait for pick-up.
  const bookingDocs = [];
  const reviewsByBike = new Map();
  const windows = [
    { from: -170, status: "completed" }, { from: -150, status: "completed" }, { from: -130, status: "cancelled" },
    { from: -110, status: "completed" }, { from: -95, status: "completed" },
    { from: -75, status: "completed" }, { from: -55, status: "completed" }, { from: -40, status: "rejected" },
    { from: -30, status: "completed" }, { from: -18, status: "cancelled" }, { from: -10, status: "completed" },
    { from: -1, status: "ongoing" }, { from: 4, status: "pending" }, { from: 9, status: "approved" },
    { from: 15, status: "pending" }, { from: 22, status: "cancelled" }, { from: 30, status: "pending" },
  ];

  for (const bike of bikes) {
    for (const w of windows) {
      if (rand() > 0.42) continue;
      const customer = pick(customers);
      const owner = ownerOf[String(bike._id)];
      // 0-3 days between pick-up and drop-off; a ride in progress always ends after today
      const length = w.status === "ongoing" ? 2 + Math.floor(rand() * 2) : Math.floor(rand() * 4);
      const startDate = dayOffset(w.from);
      const endDate = dayOffset(w.from + length);
      // Same rule as bookingController: whole days between dates, minimum 1
      const totalPrice = Math.max(1, length) * bike.rentPerDay;
      const commission = Math.round(totalPrice * COMMISSION_RATE);
      const accepted = ["approved", "ongoing", "completed"].includes(w.status);

      const doc = {
        bike: bike._id, user: customer._id, provider: bike.provider, startDate, endDate,
        totalPrice, commission, providerEarning: totalPrice - commission, status: w.status,
        createdAt: dayOffset(Math.min(w.from - 2, -1)),
      };
      if (["ongoing", "completed"].includes(w.status)) doc.pickedUpAt = new Date(startDate.getTime() + 10 * 3600 * 1000);
      if (w.status === "completed") doc.returnedAt = new Date(endDate.getTime() + 18 * 3600 * 1000);
      if (accepted && w.from > -15) {
        doc.messages = CHAT.slice(0, w.status === "approved" ? 4 : 2).map(([who, text], k) => ({
          sender: who === "user" ? customer._id : owner._id,
          senderName: who === "user" ? customer.name : owner.name,
          text,
          createdAt: new Date(doc.createdAt.getTime() + (k + 1) * 3600 * 1000),
        }));
      }
      bookingDocs.push(doc);

      // Completed rentals get a review (once per customer per bike)
      const list = reviewsByBike.get(String(bike._id)) || [];
      if (w.status === "completed" && rand() < 0.7 && !list.some((r) => String(r.user) === String(customer._id))) {
        const rating = rand() < 0.55 ? 5 : rand() < 0.75 ? 4 : 3;
        list.push({ user: customer._id, name: customer.name, rating, comment: pick(REVIEW_TEXT[rating]) });
        reviewsByBike.set(String(bike._id), list);
      }
    }
  }
  await Booking.insertMany(bookingDocs);

  for (const [bikeId, reviews] of reviewsByBike) {
    const rating = Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
    await Bike.updateOne({ _id: bikeId }, { $set: { reviews, numReviews: reviews.length, rating } });
  }

  await SupportMessage.insertMany(
    SUPPORT.map(([subject, message, status], i) => {
      const c = customers[i % customers.length];
      return { name: c.name, email: c.email, user: c._id, subject, message, status, createdAt: dayOffset(-i * 2) };
    })
  );

  const counts = bookingDocs.reduce((acc, b) => ({ ...acc, [b.status]: (acc[b.status] || 0) + 1 }), {});
  const ownPhotos = MODELS.filter(([name]) => ownPhoto(name)).length;
  console.log(`Inserted ${providers.length} providers (${PENDING_PROVIDERS.length} pending, ${REJECTED_PROVIDERS.length} rejected), ` +
    `${customers.length + PENDING_CUSTOMERS.length + REJECTED_CUSTOMERS.length} customers ` +
    `(${PENDING_CUSTOMERS.length} pending, ${REJECTED_CUSTOMERS.length} rejected), ${bikes.length} bikes ` +
    `(${ownPhotos}/${MODELS.length} models with own photo), ${bookingDocs.length} bookings ${JSON.stringify(counts)}, ` +
    `${[...reviewsByBike.values()].flat().length} reviews, ${SUPPORT.length} support messages`);
};

const run = async () => {
  try {
    if (process.argv.includes("--image-names")) {
      console.log(`Put photos in ${BIKE_PHOTO_DIR} with these names (.jpg or .png):`);
      MODELS.forEach(([name]) => console.log(`  ${slug(name)}.jpg   ${ownPhoto(name) ? "(found)" : ""}`));
      return;
    }
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/rideRent");
    await removeDemoData();
    if (!process.argv.includes("--reset")) {
      await ensureBaseAccounts();
      await insertDemoData();
      console.log(`Demo password for all ${DEMO_DOMAIN} accounts: ${DEMO_PASSWORD}`);
    }
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

run();
