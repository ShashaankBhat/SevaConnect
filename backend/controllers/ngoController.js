// controllers/ngoController.js
// Example: inside your NGO registration controller
exports.registerNGO = async (req, res) => {
  try {
    const { ngo_name, ngo_email, ngo_password, ngo_registration_no, ngo_address, ngo_contact } = req.body;

    // ✅ Enforce validation here
    if (!ngo_registration_no || ngo_registration_no.trim() === "") {
      return res.status(400).json({ error: "NGO registration number is required." });
    }

    const ngo = await NGO.create({
      ngo_name,
      ngo_email,
      ngo_password,
      ngo_registration_no,
      ngo_address,
      ngo_contact
    });

    res.status(201).json({ message: "NGO registered successfully", ngo });
  } catch (error) {
    console.error("NGO registration error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
