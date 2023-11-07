import mongoose from "mongoose";

const ticketSchema = mongoose.Schema({
  id: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  from_location: {
    type: String,
    required: true,
  },
  to_location: {
    type: String,
    required: true,
  },
  to_location_photo_url: {
    type: String,
    required: false,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
