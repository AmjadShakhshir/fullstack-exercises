import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

if (process.env.MONGO_URI === undefined || process.env.MONGO_URI === "") {
  console.log("give password as argument");
  process.exit(1);
}

const url = process.env.MONGO_URI;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

const note = new Note({
  content: "HTML is easy",
  important: true,
});

note.save().then((result) => {
  console.log("note saved!");
  mongoose.connection.close();
});
