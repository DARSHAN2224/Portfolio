const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("❌ ERROR: MONGO_URI is missing in .env");
    process.exit(1);
}

console.log(`\n🔌 Testing Connection to: ${uri.split('@')[1] || 'MongoDB'}...`); // Hide credentials in log

mongoose.connect(uri)
    .then(async () => {
        console.log("✅ Connection SUCCESSFUL!");

        // Check for data
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`\n📂 Collections found: ${collections.length}`);
        collections.forEach(c => console.log(`   - ${c.name}`));

        if (collections.length === 0) {
            console.log("\n⚠️  WARNING: Database is EMPTY. You need to run 'node seed.js'.");
        } else {
            // Count documents in 'projects'
            try {
                const Project = require('./models/Project');
                const count = await Project.countDocuments();
                console.log(`\n📊 Projects found: ${count}`);
            } catch (e) {
                // Ignore if model issue
            }
        }

        console.log("\n✅ Test Complete. Connection is working.");
        process.exit(0);
    })
    .catch(err => {
        console.error("\n❌ Connection FAILED:");
        console.error(err.message);

        if (err.message.includes("bad auth")) {
            console.log("\n💡 HINT: Check your Username and Password.");
        } else if (err.message.includes("SSL") || err.message.includes("network")) {
            console.log("\n💡 HINT: Check MongoDB Atlas Network Access. Whitelist IP 0.0.0.0/0");
        }

        process.exit(1);
    });
