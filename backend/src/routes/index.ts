import express from "express";
const router = express.Router();

// Index: This is a simple route to check if the backend is running
router.get("/", (req, res) => {
  res
    .status(200)
    .send(
      "This is the backend part of the template. The Backend does not know anything about the frontend."
    );
});

// Ping: Used from the frontend to check if the backend is running
router.get("/ping", (req, res) => {
  res.sendStatus(200);
});

export default router;
