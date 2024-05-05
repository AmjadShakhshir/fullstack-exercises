import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();
import PersonRepo from "./mongo.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist"));

morgan.token("tiny", function (req, res) {
  return [`${req.method}`, `${req.path}`, `${res.statusCode}`, `${res.responseTime} ms`, `${JSON.stringify(req.body)}`].join(" ");
});

app.use(morgan(":tiny"));

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/", (req, res) => {
  res.send("<h1>Api Running!</h1>");
});

app.get("/api/persons", (request, response) => {
  PersonRepo.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (req, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
  PersonRepo.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const person = new PersonRepo({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
