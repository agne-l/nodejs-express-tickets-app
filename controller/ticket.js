import TicketModel from "../models/ticket.js";
import UserModel from "../models/user.js";

const CREATE_TICKET = async (req, res) => {
  try {
    const ticket = new TicketModel({
      title: req.body.title,
      price: req.body.price,
      from_location: req.body.from_location,
      to_location: req.body.to_location,
      to_location_photo_url: req.body.to_location_photo_url,
    });

    ticket.id = ticket._id;

    const response = await ticket.save();

    return res.status(200).json({ message: "Ticket was created", response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const GET_ALL_TICKETS = async (req, res) => {
  try {
    const tickets = await TicketModel.find();
    return res.status(200).json({ tickets });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const BUY_TICKET = async (req, res) => {
  try {
    console.log(req.body.userId);
    const userId = req.body.userId;
    const user = await UserModel.findById(userId);
    // const userId = user._id;
    const ticket = await TicketModel.findById(req.params.id);
    const ticketId = ticket.id;

    if (!ticket) {
      return res.status(500).json({ message: "Ticket does not exist" });
    }

    if (user.money_balance < ticket.price) {
      return res.status(400).json({
        message: "Current balance is insufficient to purchase this ticket",
      });
    }

    UserModel.updateOne(
      { id: userId },
      { $push: { bought_tickets: ticketId } }
    ).exec();

    UserModel.updateOne(
      { id: userId },
      { money_balance: (user.money_balance -= ticket.price) }
    ).exec();

    return res.status(200).json({
      message: `${user.name} has bought the ticket to ${ticket.to_location}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export { CREATE_TICKET, GET_ALL_TICKETS, BUY_TICKET };
