const Donor = require("./Donor");
const NGO = require("./NGO");
const Requirement = require("./Requirement");
const Donation = require("./Donation");

// Associations
Donor.hasMany(Donation, { foreignKey: "donor_id" });
Donation.belongsTo(Donor, { foreignKey: "donor_id" });

NGO.hasMany(Donation, { foreignKey: "ngo_id" });
Donation.belongsTo(NGO, { foreignKey: "ngo_id" });

Requirement.hasMany(Donation, { foreignKey: "requirement_id" });
Donation.belongsTo(Requirement, { foreignKey: "requirement_id" });

module.exports = { Donor, NGO, Requirement, Donation };