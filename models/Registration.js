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
      id: String,
      selectedSize: String,
      selectedDate: String,
      selectedTimeSlot: String,
      cakeMessage: String,
      flavor: String,
      quantity: Number,
      purchasedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

RegistrationSchema.index({ email: 1 }, { unique: true });

const RegistrationModel = mongoose.model("registration", RegistrationSchema);
module.exports = RegistrationModel;