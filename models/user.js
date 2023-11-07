import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  id: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  bought_tickets: {
    type: Array,
    required: true,
  },
  money_balance: {
    type: Number,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
