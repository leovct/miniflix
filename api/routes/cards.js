const fs = require('fs');
const express = require("express");
const router = express.Router();

const API_URL = process.env.API_URL || "http://localhost:3000";

const cardsPath = "../data/cards.json";
let cards = require(cardsPath);

/**
 * Create a new subscription card.
 */
 router.use(express.json())
 router.post("", (req, res) => {
    const id = cards.length ? Math.max(...cards.map(x => x.id)) + 1 : 1;
    if (!id) {
        res.status(500);
        res.json({ error: "can't create a new subscription card because the id is null" });
        return;
    }

    const startDate = req.query.startDate
    const duration = req.query.duration
    const tier = req.query.tier
    const card = {
        id: id,
        name: "Miniflix Subscription Card #" + id,
        description: "Miniflix tokenized subscription deployed on the Polygon blockchain",
        image: getImagePath(tier),
        external_url: "https://miniflix-app.vercel.app",
        attributes: [
            {
                display_type: "date",
                trait_type: "Start date",
                value: startDate,
            },
            {
                trait_type: "Duration",
                value: duration,
            },
            {
                display_type: "number",
                trait_type: "Tier",
                value: tier,
            },
        ]
    }
    cards.push(card);
    saveData();
    
    console.log("POST: subscription card #%s created (start date: %s, duration: %s, tier: %s)", id, startDate, duration, tier);
    res.status(201);
    res.json({status: "Subscription card created", id: id});
})

/**
 * Get the json representation of a subscription card.
 */
router.get("/:id", (req, res) => {
    const id = req.params.id;

    // Check if the id is a number
    if (!isNumeric(id)) {
        res.status(404);
        res.json({ error: "id is not a number or it is badly written" });
        return;
    }

    // Check if the number is lower than 0 
    const idNumber = parseInt(id);
    if (idNumber < 0 ) {
        res.status(404);
        res.json({ error: "id must be positive or equal to 0" });
        return;
    }

    // Find the metadata of the card
    const card = cards.find(x => x.id.toString() === id.toString());
    if (!card) {
        res.status(404);
        res.json({ error: "metadata not found for Miniflix Subscription Card #" + id });
        return;
    }

    // Return the json representation
    res.status(200);
    res.json(card);
});

/**
 * Save the new cards data.
 */
function saveData() {
    fs.writeFileSync("data/cards.json", JSON.stringify(cards, null, 2));
}

/**
 * Get the path of the image based on the tier.
 * @param {*} tier 
 * @returns 
 */
 function getImagePath(tier) {
    switch (tier) {
        case "Basic":
        case "Standard":
        case "Premium":
            return API_URL + "/tier/" + tier.toLowerCase() + ".png";
        default:
            return "";
    }
}

/**
 * Check if a string is a number.
 * @param {string} str, the string to check
 * @return {boolean} the result of the check
 */
 function isNumeric(str) {
    if (typeof str != "string") return false;
    return !isNaN(str) && !isNaN(parseFloat(str));
}

module.exports = router;
