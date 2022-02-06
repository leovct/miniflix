const fs = require('fs');
const express = require("express");
const router = express.Router();

const API_URL = process.env.API_URL || "http://localhost:3000";

const cardsPath = "../data/cards.json";
let cards = require(cardsPath);

/**
 * Create a new subscription card.
 */
router.use(express.json());
router.post("", (req, res) => {
    // Check the id parameter
    const id = cards.length ? Math.max(...cards.map(x => x.id)) + 1 : 0;
    if (id === null) {
        res.status(500);
        res.json({ error: "can't create a new subscription card because the id is null" });
        return;
    }

    // Check the start date parameter
    let startDate = req.query.startDate;
    if (!startDate || !isNumeric(startDate) || !(startDate > 0)) {
        res.status(400);
        res.json({ error: "start date is not valid" });
        return;
    }
    startDate = parseInt(startDate, 10);

    // Check the duration parameter
    let duration = req.query.duration;
    if (!duration || !isNumeric(duration) || !(duration > 0)) {
        res.status(400);
        res.json({ error: "duration is not valid", value: duration });
        return;
    }
    duration = parseInt(duration, 10);

    // Check the tier parameter
    const tier = req.query.tier;
    if (!tier || !isTierValid(tier)) {
        res.status(400);
        res.json({ error: "tier is not valid", value: tier });
        return;
    }

    // Create the new card
    const card = {
        id: id,
        name: "Miniflix Subscription Card #" + id,
        description: "Miniflix tokenized subscription deployed on the Polygon blockchain",
        image: getImagePath(tier),
        external_url: "https://miniflix-app.vercel.app",
        attributes: [
            {display_type: "date", trait_type: "Start date", value: startDate,},
            {trait_type: "Duration", value: duration},
            {display_type: "number", trait_type: "Tier", value: tier},
        ]
    }
    cards.push(card);
    saveData();

    console.log("POST: subscription card #%s created (start date: %s, duration: %s, tier: %s)", id, startDate, duration, tier);
    res.status(201);
    res.json({ status: "Subscription card created", id: id });
});

/**
 * Get the json representation of a subscription card.
 */
router.get("/:id", (req, res) => {
    const id = req.params.id;

    // Check if the id is a number
    if (!isNumeric(id) || !(idNumber >= 0)) {
        res.status(404);
        res.json({ error: "id is not valid", value: id });
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
 * Check if a tier is valid.
 * @param {*} tier 
 * @returns 
 */
function isTierValid(tier) {
    switch (tier) {
        case "Basic":
        case "Standard":
        case "Premium":
            return true;
        default:
            return false;
    }
}

/**
 * Get the path of the image based on the tier.
 * @param {*} tier 
 * @returns 
 */
function getImagePath(tier) {
    if (isTierValid(tier)) {
        return API_URL + "/tier/" + tier.toLowerCase() + ".png"; 
    }
    return "";
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
