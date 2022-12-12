import { useEffect, useRef, useState } from "react";
import { ID, Person } from "../types";
import InputField from "../components/InputField";
import API, { API_URL } from "../services/API";
import Button from "../components/Button";

function Home() {
  // State specific to a single person
  const [id, setId] = useState<ID | "">("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  // State for all people
  const [people, setPeople] = useState<Person[]>([]);

  // State for this page
  const [pingMs, setPingMs] = useState<number>();
  const [response, setResponse] = useState<string | null>();

  // Ping backend every second
  const interval = useRef<NodeJS.Timeout>(); // Store interval to clear it later

  // onMount
  useEffect(() => {
    const init = async () => {
      // Clear interval if it exists
      clearInterval(interval.current);

      // Ping backend every second
      const ms = 1000;
      interval.current = setInterval(async () => {
        const success = await pingBackend();
        if (!success) {
          setPingMs(undefined);
        }
      }, ms);

      // Read all people on mount when backend is up
      if (await pingBackend()) handleReadAll();
    };

    // Call init
    init();

    // Clear interval on unmount
    return () => clearInterval(interval.current);
  }, []);

  /**
   * Ping backend and set pingMs
   * @returns true if backend is up, false otherwise
   */
  const pingBackend = async () => {
    // Get current timestamp
    const currentTimestamp = new Date().getTime();

    // Ping backend
    const { success } = await API.ping();

    // Check if ping was successful
    if (!success) {
      setPingMs(undefined);
      return false;
    }

    // Get new timestamp and set pingMs
    const newTimestamp = new Date().getTime();
    setPingMs(newTimestamp - currentTimestamp);
    return true;
  };

  /**
   * Create a person
   */
  const handleCreate = async () => {
    // Provide all fields to the API
    const {
      success,
      message,
      data: person,
    } = await API.createPerson({
      firstName,
      lastName,
    });

    // Show response
    setResponse(message);

    // Check if request was successful
    if (!success) return;

    // Set values when successful
    setId(person.id);
    setFirstName("");
    setLastName("");
    setPeople((prev) => [...prev, person]);
  };

  /**
   * Get a person by id
   */
  const handleRead = async () => {
    // Provide id to the API
    const { success, message, data: person } = await API.readPerson(id as ID);

    // Show response
    if (!success) return setResponse(message);

    // Set values when successful
    setFirstName(person.firstName);
    setLastName(person.lastName);
    setResponse(JSON.stringify(person, null, 2));
  };

  /**
   * Update a person
   */
  const handleUpdate = async function () {
    // Provide all fields and id to the API
    const {
      success,
      message,
      data: person,
    } = await API.updatePerson(
      {
        firstName,
        lastName,
      },
      id as ID
    );

    // Show response
    setResponse(message);

    // Check if request was successful
    if (!success) return;

    // Set values when successful
    setFirstName("");
    setLastName("");

    // Update person in people
    setPeople((prev) => prev.map((p) => (p.id === person.id ? person : p)));
  };

  /**
   * Delete a person
   */
  async function handleDelete() {
    // Provide id to the API
    const { success, message } = await API.deletePerson(id as ID);

    // Show response
    setResponse(message);

    // Check if request was successful
    if (!success) return;

    // Remove person from list of people when successful
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }

  /**
   * Read all people
   */
  const handleReadAll = async () => {
    // Call API
    const { message, data: ppl } = await API.readPeople();

    // Show response and people
    setResponse(message);
    setPeople(ppl);
  };

  const noId = id === "";
  const noPerson = firstName === "" || lastName === "";

  return (
    <div className='flex flex-col justify-center items-center gap-2'>
      <h1>React Rest Template</h1>
      <p>
        You are viewing the frontend of the template.{" "}
        {pingMs ? (
          <p>
            Your backend is running on{" "}
            <a target='_blank' href={API_URL}>
              {API_URL}
            </a>{" "}
            with a ping of {pingMs}ms.
          </p>
        ) : (
          <p>Your backend is unresponsive.</p>
        )}
      </p>
      <pre className='pt-8 pb-4'>{response}</pre>
      <div className='mb-4'>
        <InputField
          placeholder='First Name'
          value={firstName}
          onChangeValue={setFirstName}
        />
        <InputField
          placeholder='Last Name'
          value={lastName}
          onChangeValue={setLastName}
        />
        <Button disabled={noPerson} onClick={handleCreate}>
          Create person
        </Button>
      </div>
      <div>
        <InputField
          type='number'
          placeholder='ID'
          value={id}
          onChangeValue={setId}
        />
        <Button disabled={noId} onClick={handleRead}>
          Read person
        </Button>
        <Button disabled={noId} onClick={handleUpdate}>
          Update person
        </Button>
        <Button disabled={noId} onClick={handleDelete}>
          Delete person
        </Button>
      </div>
      <div className='border-t border-t-white w-full flex flex-col mt-8 mb-4' />
      <ul>
        {people.length ? (
          people.map((p) => (
            <li key={p.id}>
              <strong>{p.id} -</strong> {p.firstName} {p.lastName}
            </li>
          ))
        ) : (
          <li>No people yet</li>
        )}
      </ul>
    </div>
  );
}

export default Home;
