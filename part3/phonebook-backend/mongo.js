import mongoose from "mongoose";

if (process.argv.length < 3) {
  console.log("Please provide the password");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://amjadshakhshir73:${password}@phonebook.lnvti8g.mongodb.net/phonebook`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length >= 5) {
  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length === 3) {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note.name + " " + note.number);
    });
    mongoose.connection.close();
  });
}
