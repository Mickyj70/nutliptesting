//? /api/apartments/id note that the id is dynamic
import dbConnect from "../../../libs/dbconnect";
import Apartment from "../../../models/Apartment";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET" /* Get an apartment */:
      try {
        const apartment = await Apartment.findById(id);
        if (!apartment) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: apartment });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT" /* Edit an apartment */:
      try {
        const apartment = await Apartment.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!apartment) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: apartment });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE" /* Delete an apartment */:
      try {
        const deletedApartment = await Apartment.deleteOne({ _id: id });
        if (!deletedApartment) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}