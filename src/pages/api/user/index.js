import dbConnect from "../../../libs/dbconnect";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  await dbConnect();

  try {
    const users = await User.find();

    res.status(200).json({ message: "success", users: users });
  } catch (error) {
    console.error("Error fetching users by type:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
}
