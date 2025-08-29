const { Donor, NGO, Requirement, Donation } = require("./models"); // make sure Requirement is exported from index.js
const sequelize = require("./config/database");

async function seedTestData() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // 1. Donor
    const donor = await Donor.create({
      donor_name: "John Doe",
      donor_email: "john@example.com",
      donor_password: "password123",
      donor_address: "123 Street",
      donor_phone: "1234567890",
    });

    // 2. NGO
    const ngo = await NGO.create({
      ngo_name: "Helping Hands",
      ngo_email: "ngo@example.com",
      ngo_password: "password123",
      ngo_registration_no: "NGO123",
      ngo_status: "approved",
      ngo_address: "456 Avenue",
      ngo_contact: "0987654321",
    });

    // 3. Requirement
    const requirement = await Requirement.create({
      requirement_name: "Rice",
      // add other fields if needed
    });

    // 4. Donation (references all above)
    await Donation.create({
      donorId: donor.donor_id,
      ngoId: ngo.ngo_id,
      requirement_id: requirement.requirement_id,
      donated_item: "Rice",
      donated_quantity: 10,
      pickup_or_drop: "pickup",
      donation_status: "pending",
    });

    console.log("Test data seeded successfully.");
  } catch (error) {
    console.error("Error seeding test data:", error);
  } finally {
    await sequelize.close();
  }
}

seedTestData();
