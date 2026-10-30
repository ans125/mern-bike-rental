import SupportMessage from "../models/SupportMessage.js";

// PUBLIC - Send a message from the Contact page
export const createSupportMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({ message: "Name, email, subject and message are required" });
    }

    const ticket = await SupportMessage.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim().slice(0, 2000),
      user: req.user?._id,
    });

    res.status(201).json({ message: "Message sent. Our team will reply by email.", id: ticket._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN - List all support messages, newest first
export const getSupportMessages = async (req, res) => {
  try {
    const messages = await SupportMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN - Mark a message resolved or open again
export const updateSupportMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["open", "resolved"].includes(status)) {
      return res.status(400).json({ message: "Status must be open or resolved" });
    }

    const ticket = await SupportMessage.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: "Message not found" });
    }

    ticket.status = status;
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
