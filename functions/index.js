const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

// Secret stored in Google Secret Manager via Firebase params
const EXPORT_KEY = defineSecret("COOKIE_EXPORT_KEY");

exports.exportCookieRSVPs = onRequest(
  { secrets: [EXPORT_KEY] },
  async (req, res) => {
    try {
      // Simple auth: require a shared secret header
      const key = req.get("x-export-key");
      if (!key || key !== EXPORT_KEY.value()) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const db = admin.firestore();

      // Pull all RSVPs (ordered by createdAt if you want)
      const snap = await db
        .collection("cookieRSVPs")
        .orderBy("createdAt", "asc")
        .get();

      const rows = [];
      snap.forEach((doc) => {
        const d = doc.data();
        const createdAt = d.createdAt?.toDate
          ? d.createdAt.toDate().toISOString()
          : "";

        rows.push({
          createdAt,
          name: d.name || "",
          people: Number(d.people || 0),
          trays: Number(d.trays || 0),
          kits: Number(d.kits || 0),
          totalCost: Number(d.totalCost || 0),
        });
      });

      res.set("Cache-Control", "no-store");
      return res.status(200).json(rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);
