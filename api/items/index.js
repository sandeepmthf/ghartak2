const connectDB = require("../db");
const Item = require("../models/Item");

async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve(null);
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

module.exports = async (req, res) => {
  try {
    await connectDB();

    if (req.method === "GET") {
      const items = await Item.find({}).sort({ createdAt: -1 }).lean();
      return res.status(200).json({ ok: true, items });
    }

    if (req.method === "POST") {
      const body = await readJsonBody(req);
      if (!body || !body.name) {
        return res.status(400).json({ ok: false, error: "Missing 'name'" });
      }
      const item = await Item.create({ name: body.name, description: body.description || "" });
      return res.status(201).json({ ok: true, item });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  } catch (err) {
    const code = err.message === "Invalid JSON" ? 400 : 500;
    return res.status(code).json({ ok: false, error: err.message });
  }
};
