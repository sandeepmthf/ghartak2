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

    const id = (req.query && (req.query.id || req.query["id"])) || (req.url.match(/\/items\/([^?]+)/) || [])[1];
    if (!id) {
      return res.status(400).json({ ok: false, error: "Missing id" });
    }

    if (req.method === "GET") {
      const item = await Item.findById(id).lean();
      if (!item) return res.status(404).json({ ok: false, error: "Not found" });
      return res.status(200).json({ ok: true, item });
    }

    if (req.method === "PUT") {
      const body = await readJsonBody(req);
      const item = await Item.findByIdAndUpdate(id, { $set: body || {} }, { new: true });
      if (!item) return res.status(404).json({ ok: false, error: "Not found" });
      return res.status(200).json({ ok: true, item });
    }

    if (req.method === "DELETE") {
      const item = await Item.findByIdAndDelete(id);
      if (!item) return res.status(404).json({ ok: false, error: "Not found" });
      return res.status(200).json({ ok: true });
    }

    res.setHeader("Allow", "GET, PUT, DELETE");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  } catch (err) {
    const code = err.message === "Invalid JSON" ? 400 : 500;
    return res.status(code).json({ ok: false, error: err.message });
  }
};
