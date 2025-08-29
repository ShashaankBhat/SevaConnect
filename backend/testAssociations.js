const { Donor, NGO, Requirement, Donation } = require("./models");
const sequelize = require("./config/database"); // Make sure path is correct

async function testAssociations() {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    // Fetch donations with related Donor, NGO, and Requirement
    const donations = await Donation.findAll({
      include: [
        { model: Donor },
        { model: NGO },
        { model: Requirement }
      ],
      limit: 5, // Limit to 5 for testing
    });

    console.log(JSON.stringify(donations, null, 2));
  } catch (error) {
    console.error("Error testing associations:", error);
  } finally {
    await sequelize.close();
  }
}

// Run the test
testAssociations();
