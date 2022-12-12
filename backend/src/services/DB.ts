import { ID, Person } from "../types";

/**
 * DISCLAIMER:
 * This is a mock database that stores all people in memory.
 * It is used to demonstrate how to use the backend.
 * In a real application you would use a real database.
 */
export default class DB {
  // All people in the database
  static mockDatabase: Map<ID, Person> = new Map();

  // The current id, incremented for each new person
  static currentId: ID = 0;

  /**
   * Create a new person in the database
   * @param person The person to create
   * @returns The id of the created person or undefined if the person could not be created
   */
  static async createPerson(person: Person): Promise<ID | undefined> {
    console.log("Creating person in db...", person);

    // Check if the person is valid
    if (!person?.firstName || !person?.lastName) {
      return;
    }

    // Add the person to the database
    const id = this.currentId++;
    this.mockDatabase.set(id, { ...person, id });
    return id;
  }

  /**
   * Read a person from the database
   * @param id The id of the person to read
   * @returns The person or undefined if the person could not be found
   */
  static async readPerson(id: ID): Promise<Person | undefined> {
    console.log(`Reading person with id ${id} from db...`);
    return this.mockDatabase.get(id);
  }

  /**
   * Update a person in the database
   * @param person The new person data
   * @param id The id of the person to update
   * @returns The updated person or undefined if the person could not be found
   */
  static async updatePerson(
    person: Person,
    id: ID
  ): Promise<Person | undefined> {
    console.log(`Updating person with id ${id} in db...`, person);

    // Get the person to update
    const personToChange = this.mockDatabase.get(id);

    // Check if the person exists
    if (!personToChange) {
      return;
    }

    // Create a new person with the updated values
    const newPerson = { ...personToChange, ...person, id };

    // Update the person in the database
    this.mockDatabase.set(id, newPerson);
    return newPerson;
  }

  /**
   * Delete a person from the database
   * @param id The id of the person to delete
   * @returns True if the person was deleted, false if the person could not be found
   */
  static async deletePerson(id: ID): Promise<boolean> {
    console.log(`Deleting person with id ${id} from db...`);
    return this.mockDatabase.delete(id);
  }

  /**
   * Read all people from the database
   * @returns All people in the database
   */
  static async readPeople(): Promise<Person[]> {
    console.log(`Reading all people from db...`);
    return Array.from(this.mockDatabase.values());
  }
}
