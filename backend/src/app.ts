import express from "express";
import cors from "cors";
import indexRouter from "./routes/index";
import personRouter from "./routes/person";

// Create a new express application instance
const app = express();

// Cross Origin Resource Sharing (CORS)
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
// is required to allow the frontend to access the backend
app.use(cors());

// Required to parse the body (JSON Data) of a request (e.g. POST to create a new person)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/", indexRouter);
app.use("/api/person", personRouter);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server started on port ${port}`));
