import express, { RequestHandler } from "express";
import { Person } from "../types";
import DB from "../services/DB";
const router = express.Router();

// Middleware to check if the given id is valid
// It is used in the routes below and can only be used on routes with an id parameter
const validId: RequestHandler<{ id: string }> = (req, res, next) => {
  const id = req.params.id;
  const parsedId = parseInt(id);

  // Check if the id is a number
  if (isNaN(parsedId)) {
    return res.status(400).send("Please provide a valid id!");
  }

  // Proceed to the next middleware or request handler
  next();
};

// Create a new person
router.post("/create", async (req, res) => {
  // The body of the request is a Person
  const person: Person = req.body;

  // Check if the person is valid
  if (!person) {
    return res.status(400).send("Please provide a person to create!");
  }
  if (!person.firstName) {
    return res.status(400).send("A person must have a first name!");
  }
  if (!person.lastName) {
    return res.status(400).send("A person must have a last name!");
  }

  // Create the person in the database
  const id = await DB.createPerson(person);

  // Check if the person was created
  if (id === undefined) {
    return res.status(400).send("Could not create person in the database!");
  }

  // Send the created person back to the frontend
  res.status(200).send({ ...person, id });
});

// Get a person by id
router.get("/:id", validId, async (req, res) => {
  // Get the id from the request
  const id = req.params.id;

  // Read the person from the database
  const person = await DB.readPerson(parseInt(id));

  // Check if the person was found
  if (!person) {
    return res.status(404).send("No person found in database");
  }

  // Send the person back to the frontend
  res.status(200).send(person);
});

// Update a person by id
router.patch("/update/:id", validId, async (req, res) => {
  // Get the id from the request
  const id = req.params.id;

  // The body of the request is a Person
  const person: Person = req.body;

  // Check if there are values to update
  if (Object.keys(person).every((key) => !person[key as keyof Person])) {
    return res.status(400).send("Please provide values to update!");
  }

  // Update the person in the database
  const updatedPerson = await DB.updatePerson(person, parseInt(id));

  // Check if the person was updated
  if (!updatedPerson) {
    return res.status(404).send("No person found in database");
  }

  // Send the updated person back to the frontend
  res.status(200).send(updatedPerson);
});

// Delete a person by id
router.delete("/delete/:id", validId, async (req, res) => {
  // Get the id from the request
  const id = req.params.id;

  // Delete the person from the database
  const success = await DB.deletePerson(parseInt(id));

  // Check if the person was deleted
  if (!success) {
    return res.status(404).send("No person found in database");
  }

  // Send a success message back to the frontend
  res.status(200).send();
});

// Get all people
router.get("/", async (req, res) => {
  // Read all people from the database
  const people = await DB.readPeople();

  // Check if people were found
  if (!people) {
    return res
      .status(404)
      .send("No people could be retrieved from the database!");
  }

  // Send the people back to the frontend
  return res.status(200).send(people);
});

export default router;
