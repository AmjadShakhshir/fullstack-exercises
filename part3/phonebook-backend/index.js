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

const opts = { runValidators: true };

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

app.get("/api/persons/:id", (request, response, next) => {
  PersonRepo.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const findPerson = PersonRepo.findOne({ name: body.name });
  if (findPerson) {
    const person = {
      number: body.number,
    };

    PersonRepo.findByIdAndUpdate(request.params.id, person, { new: true }, opts)
      .then((updatedPerson) => {
        response.json(updatedPerson);
      })
      .catch((error) => {
        console.log(error.response.data.error);
        next(error);
      });
  } else {
    const person = new PersonRepo({
      name: body.name,
      number: body.number,
    });

    person
      .save()
      .then((savedPerson) => {
        response.json(savedPerson);
      })
      .catch((error) => {
        next(error);
        console.log(error.response.data.error);
      });
  }
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  PersonRepo.findByIdAndUpdate(request.params.id, { name, number }, { new: true, opts, context: "query" })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response) => {
  PersonRepo.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
