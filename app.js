const express = require("express");
const app = express();
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const { check, validationResult } = require("express-validator");
const dbPath = path.join(__dirname, "userData.db"); //assume that here userData database there
app.use(express.json());
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running..!");
    });
  } catch (e) {
    console.log(`DB error ${e.message}`);
  }
};

initializeDBAndServer();

// Input parameter validation middleware
const validateParams = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validate phone number
const validatePhoneNumber = (phone) => {
  // Perform phone number validation logic here
  // Return true if valid, false otherwise
};

//Customer API

app.post("/add_customer", validateParams, async (req, res) => {
  const { name, phone } = req.body;
  // Check for duplicate phone number
  const dbPhone = await db.get(
    `SELECT COUNT(*) AS count FROM customers WHERE phone_number =${phone};`
  );
  if (dbPhone !== undefined) {
    res.status(400);
    res.send("phone number already exist");
  } else {
    await db.run(
      `insert into customers (name , phone_numbers) values (${name}, ${phone});`
    );
    res.send("customer added successfully");
  }
});
