const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  purchaseHistory: [
    {
      id: String, // Product ID
      name: String, // Product name
      image: String, // Product image URL
      selectedSize: String, // Selected size (e.g., "10-12 (1kg)")
      selectedDate: String, // Selected delivery date
      selectedTimeSlot: String, // Selected delivery time slot
      cakeMessage: String, // Custom message for the cake
      flavor: String, // Flavor of the product
      price: Number, // Price of the product
      quantity: Number, // Quantity purchased
      total: Number, // Total price (price * quantity)
      purchasedAt: {
        type: Date,
        default: Date.now, // Timestamp of purchase
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Timestamp of user registration
  },
});

RegistrationSchema.index({ email: 1 }, { unique: true });

const RegistrationModel = mongoose.model("registration", RegistrationSchema);
module.exports = RegistrationModel;