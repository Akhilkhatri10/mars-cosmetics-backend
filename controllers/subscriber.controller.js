import { Subscriber } from "../models/subscriber.model.js";


export const subscribeUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const exists = await Subscriber.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: "Already subscribed" });
  }

  await Subscriber.create({ email });

  res.status(201).json({ message: "Subscribed successfully" });
};
