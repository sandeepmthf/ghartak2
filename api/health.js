// Example API route to verify DB connectivity on Vercel
const connectDB = require("./db");

module.exports = async (req, res) => {
  try {
    await connectDB();
    return res.status(200).json({ ok: true, message: "DB connected" });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
