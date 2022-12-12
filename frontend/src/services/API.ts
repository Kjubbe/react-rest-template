import axios from "axios";
import { ID, Person } from "../types";

/**
 * APIResponse is the response type for all API calls.
 * @param success - Whether the API call was successful.
 * @param message - A message to display to the user for more information.
 * @param data - The optional data returned from the API call.
 */
interface APIResponse {
  success: boolean;
  message: string;
  data?: any;
}

const port = import.meta.env.PORT || 3001;
export const API_URL = `http://localhost:${port}/api`;

/**
 * Communicates with the backend via axios HTTP requests.
 * Provides methods for all CRUD operations on people.
 */
export default class API {
  static validateId(id?: ID) {
    return {
      valid: (!!id || id === 0) && !isNaN(id),
      onInvalid: {
        success: false,
        message: "Please provide a valid id.",
      },
    };
  }

  /**
   * Pings the backend to check if it is running.
   * @returns Promise<APIResponse> Response with the relevant information.
   */
  static async ping(): Promise<APIResponse> {
    try {
      // Send a get request to /ping.
      const { status } = await axios.get(`${API_URL}/ping`);
      return {
        success: status === 200,
        message: `Ping successful.`,
      };
    } catch (error: any) {
      console.log(error);
      return {
        success: false,
        message: `Failed to ping backend: ${error.response.data}`,
      };
    }
  }

  /**
   * Creates a person in the backend.
   * @param person Person to create.
   * @returns Promise<APIResponse> Response with the relevant information.
   */
  static async createPerson(person: Person): Promise<APIResponse> {
    try {
      // Send a post request to person/create with the data.
      const { status, data } = await axios.post(
        `${API_URL}/person/create`,
        person
      );

      // Return the created person (data).
      return {
        success: status === 200,
        message: `Successfully created person, id: ${data.id}`,
        data,
      };
    } catch (error: any) {
      console.log(error);
      return {
        success: false,
        message: `Failed to create person: ${error.response.data}`,
      };
    }
  }

  /**
   * Reads a person from the backend by id.
   * @param id ID of the person to read.
   * @returns Promise<APIResponse> Response with the relevant information.
   */
  static async readPerson(id?: ID): Promise<APIResponse> {
    // Check if the given id is valid.
    const { valid, onInvalid } = API.validateId(id);
    if (!valid) {
      return onInvalid;
    }

    try {
      // Send a get request to person/:id.
      const { status, data } = await axios.get(`${API_URL}/person/${id}`);

      // Return the read person (data).
      return {
        success: status === 200,
        message: `Successfully read person with id ${id}.`,
        data,
      };
    } catch (error: any) {
      console.log(error);
      return {
        success: false,
        message: `Failed to read person with id ${id}: ${error.response.data}`,
      };
    }
  }

  /**
   * Updates a person in the backend.
   * @param person Partial data of the person to update.
   * @param id ID of the person to update.
   * @returns Promise<APIResponse> Response with the relevant information.
   */
  static async updatePerson(
    person: Partial<Person>,
    id?: ID
  ): Promise<APIResponse> {
    // Check if the given id is valid.
    const { valid, onInvalid } = API.validateId(id);
    if (!valid) {
      return onInvalid;
    }

    try {
      // Send a patch request to person/update/:id with the data.
      const { status, data } = await axios.patch(
        `${API_URL}/person/update/${id}`,
        person
      );

      // Return the updated person (data).
      return {
        success: status === 200,
        message: `Successfully updated person with id ${id}.`,
        data,
      };
    } catch (error: any) {
      console.log(error);
      return {
        success: false,
        message: `Failed to update person with id ${id}: ${error.response.data}`,
      };
    }
  }

  /**
   * Delete a person from the backend.
   * @param id ID of the person to delete.
   * @returns Promise<APIResponse> Response with the relevant information.
   */
  static async deletePerson(id?: ID): Promise<APIResponse> {
    // Check if the given id is valid.
    const { valid, onInvalid } = API.validateId(id);
    if (!valid) {
      return onInvalid;
    }

    try {
      // Send a delete request to person/delete/:id.
      const { status } = await axios.delete(`${API_URL}/person/delete/${id}`);
      return {
        success: status === 200,
        message: `Successfully deleted person with id ${id}`,
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to delete person with id ${id}: ${error.response.data}`,
      };
    }
  }

  /**
   * Reads all people from the backend.
   * @returns Promise<APIResponse> Response with the relevant information.
   */
  static async readPeople(): Promise<APIResponse> {
    try {
      // Send a get request to /person to get all people.
      const { status, data } = await axios.get(`${API_URL}/person`);

      // Return the read people (data) and information about the amount of people.
      return {
        success: status === 200,
        message: data.length ? `Read ${data.length} people` : "No people yet",
        data,
      };
    } catch (error: any) {
      console.log(error);
      return {
        success: false,
        message: `Failed to read people: ${error.response.data}`,
      };
    }
  }
}
