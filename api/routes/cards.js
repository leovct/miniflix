const fs = require('fs');
const express = require("express");
const router = express.Router();

const API_URL = process.env.API_URL || "http://localhost:3000";

const cardsPath = "../data/cards.json";
let cards = require(cardsPath);

/**
 * Get all the subscription cards.
 */
 router.get("", (req, res) => {
    res.status(200);
    res.json(cards);
});

/**
 * Get the json representation of a subscription card.
 */
router.get("/:id", (req, res) => {
    const id = req.params.id;

    // Check if the id is a number
    if (!isNumeric(id) || !(id >= 0)) {
        res.status(404);
        res.json({ error: "id is not valid", value: id });
        return;
    }

    // Find the card in the database
    const card = getCard(id);
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

    console.log("POST: subscription card #%s created (start date: %s, duration: %s, tier: %s)", id, card.startDate, card.duration, card.tier);
    res.status(201);
    res.json({ status: "subscription card created", id: id });
});

/**
 * Update the tier of a subscription card.
 */
router.put("/:id/update", (req, res) => {
    const id = req.params.id;

    // Check if the id is a number
    if (!isNumeric(id) || !(id >= 0)) {
        res.status(404);
        res.json({ error: "id is not valid", value: id });
        return;
    }

    // Check the tier parameter
    const tier = req.query.tier;
    if (!tier || !isTierValid(tier)) {
        res.status(400);
        res.json({ error: "tier is not valid", value: tier });
        return;
    }

    // Find the card in the database
    const card = getCard(id);
    if (!card) {
        res.status(404);
        res.json({ error: "metadata not found for Miniflix Subscription Card #" + id });
        return;
    }

    // Update the card
    const oldTier = getAttribute(card, "Tier");
    if (oldTier === tier) {
        res.status(400);
        res.json({ error : "card already has this tier value", value: tier});
        return;
    }
    card.attributes = updateAttribute(card, "Tier", tier);
    card.image = getImagePath(tier);
    saveData();

    console.log("POST: subscription card #%s updated (new tier: %s)", id, tier);
    res.status(200);
    res.json({ status: "subscription card tier updated", id: id }); 
});

/**
 * Extend the duration of a subscription card.
 */
 router.put("/:id/extend", (req, res) => {
    const id = req.params.id;

    // Check if the id is a number
    if (!isNumeric(id) || !(id >= 0)) {
        res.status(404);
        res.json({ error: "id is not valid", value: id });
        return;
    }

    // Check the duration parameter
    let duration = req.query.duration;
    if (!duration || !isNumeric(duration) || !(duration > 0)) {
        res.status(400);
        res.json({ error: "duration is not valid", value: duration });
        return;
    }
    duration = parseInt(duration, 10);

    // Find the card in the database
    const card = getCard(id);
    if (!card) {
        res.status(404);
        res.json({ error: "metadata not found for Miniflix Subscription Card #" + id });
        return;
    }

    // Update the card
    const oldDuration = getAttribute(card, "Duration");
    const newDuration = oldDuration + duration * 60 * 60 * 24;
    card.attributes = updateAttribute(card, "Duration", newDuration);
    saveData();

    console.log("POST: subscription card #%s updated (new duration: %s)", id, newDuration);
    res.status(200);
    res.json({ status: "subscription card duration updated", id: id }); 
});

/**
 * Subscribe again after a subscription card has expired.
 */
 router.put("/:id/resubscribe", (req, res) => {
    const id = req.params.id;

    // Check if the id is a number
    if (!isNumeric(id) || !(id >= 0)) {
        res.status(404);
        res.json({ error: "id is not valid", value: id });
        return;
    }

    // Find the card in the database
    const card = getCard(id);
    if (!card) {
        res.status(404);
        res.json({ error: "metadata not found for Miniflix Subscription Card #" + id });
        return;
    }
    const oldDate = getAttribute(card, "Start date");

    // Get the current date to check if the card is expired
    const now = Math.round(+new Date()/1000);
    if (now <= oldDate) {
        res.status(404);
        res.json({ error: "card is not expired", value: oldDate });
        return;
    }

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

    // Update the card values
    card.attributes = updateAttribute(card, "Start date", now);
    card.attributes = updateAttribute(card, "Duration", duration);
    card.attributes = updateAttribute(card, "Tier", tier);
    saveData();

    console.log("POST: subscription card #%s re-activated (start date: %s, duration: %s, tier: %s)", id, card.startDate, card.duration, card.tier);
    res.status(200);
    res.json({ status: "subscription card re-activated", id: id }); 

});

/**
 * Save the new cards data.
 */
function saveData() {
    fs.writeFileSync("data/cards.json", JSON.stringify(cards, null, 2));
}

/**
 * Get a card of the database.
 * @param {*} id 
 * @returns 
 */
 function getCard(id) {
    return cards.find(x => x.id.toString() === id.toString());
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

function getAttribute(card, type) {
    for(i = 0; i < card.attributes.length; i++) {
        const attr = card.attributes[i];
        if (attr["trait_type"] === type) {
            return attr.value;
        }
    }
    return null;
}

function updateAttribute(card, type, newvalue) {
    for(i = 0; i < card.attributes.length; i++) {
        let attr = card.attributes[i];
        if (attr["trait_type"] === type) {
            attr.value = newvalue;
        }
        card.attributes[i] = attr;
    }
    return card.attributes;
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
