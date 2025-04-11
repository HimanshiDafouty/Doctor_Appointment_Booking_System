import mongoose from "mongoose";
import AayushmanCard from "./models/aayushmanModel.js";

await mongoose.connect(process.env.MONGODB_URI)

const sampleIds = [
  "12345-67890-12345",
  "98765-43210-98765",
  "11111-22222-33333"
];

await Promise.all(sampleIds.map(id => AayushmanCard.create({ cardId: id })));

console.log("Inserted sample Aayushman IDs");
process.exit();
