const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require("cors");
const Razorpay = require("razorpay");
const RegistrationModel = require("./models/Registration");
const FeedbackModel = require("./models/Feedback");
const NewsletterModel = require("./models/Newsletter");

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL);

// Routes
app.get("/", (req, res) => {
  res.send("server working");
});

// Razorpay Order Creation Route
app.post("/create-order", async (req, res) => {
  const { amount, receipt } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: receipt || "receipt_" + new Date().getTime(),
    });
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).send({ error: "Failed to create order" });
  }
});

// Other routes
app.post("/signup", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await RegistrationModel.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    const newUser = await RegistrationModel.create(req.body);
    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ message: err.message });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  RegistrationModel.findOne({ email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          res.json({ status: "Success", user: { name: user.name, email: user.email } });
        } else {
          res.status(400).json("Password is incorrect");
        }
      } else {
        res.status(400).json("Email was not registered");
      }
    })
    .catch(err => res.status(500).json(err.message));
});

app.post("/feedback", async (req, res) => {
  const { name, email, productName, message } = req.body;
  try {
    const newFeedback = new FeedbackModel({ name, email, productName, message });
    const feedback = await newFeedback.save();
    res.json({ status: "Success", feedback });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

app.post("/newsLetter", (req, res) => {
  const { email } = req.body;
  NewsletterModel.findOne({ email })
    .then((user) => {
      if (user) {
        res.status(400).json({ message: "You're already on our list" });
      } else {
        NewsletterModel.create(req.body)
          .then((user) => res.json(user))
          .catch((err) => res.status(500).json(err.message));
      }
    })
    .catch((err) => res.status(500).json(err.message));
});

// Save Purchase History Route
app.post("/save-purchase-history", async (req, res) => {
  const { email, purchaseData } = req.body;

  try {
    const user = await RegistrationModel.findOne({ email });
    if (user) {
      user.purchaseHistory.push(...purchaseData); // Add new purchases to the history
      await user.save();
      res.json({ status: "Success", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Fetch Purchase History Route
app.get("/get-purchase-history/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const user = await RegistrationModel.findOne({ email });
    if (user) {
      res.json({ status: "Success", purchaseHistory: user.purchaseHistory });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
