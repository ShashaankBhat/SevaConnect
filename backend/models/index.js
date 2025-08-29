const Donor = require("./Donor");
const NGO = require("./NGO");
const Requirement = require("./Requirement");
const Donation = require("./Donation");

// Associations
Donor.hasMany(Donation, { foreignKey: "donorId" });
Donation.belongsTo(Donor, { foreignKey: "donorId" });

NGO.hasMany(Donation, { foreignKey: "ngoId" });
Donation.belongsTo(NGO, { foreignKey: "ngoId" });

Requirement.hasMany(Donation, { foreignKey: "requirement_id" });
Donation.belongsTo(Requirement, { foreignKey: "requirement_id" });

module.exports = { Donor, NGO, Requirement, Donation };
