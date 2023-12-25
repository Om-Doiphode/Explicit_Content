const express = require("express");
const router = express.Router();
const ExplicitContent = require("../models/explicitContent");

// Route to create an entry for explicit content
router.post("/create", async (req, res) => {
    try {
        const { url, type, category } = req.body;

        // Check if the entry already exists
        let entry = await ExplicitContent.findOne({ contentUrl: url });

        if (entry) {
            // Entry already exists
            console.log(`Entry already exists for URL: ${url}`);
            return res.json({ success: false, category: entry.Category });
        }

        // Entry does not exist, create a new one
        entry = await ExplicitContent.create({
            contentUrl: url,
            contentType: type,
            Category: category,
        });

        console.log(`Entry created for URL: ${url}`);
        return res.json({ success: true, category });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route to check if an entry for explicit content exists
router.post("/check", async (req, res) => {
    try {
        const url = req.body.url;
        const entry = await ExplicitContent.findOne({ contentUrl: url });

        if (entry) {
            // Entry found
            console.log(`Entry found for URL: ${url}`);
            return res.status(200).json({ success: true, category: entry.Category });
        } else {
            // No entry found
            console.log(`No entry found for URL: ${url}`);
            return res.status(200).json({ success: false, category: null });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
