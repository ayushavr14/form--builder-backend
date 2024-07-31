const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Form = require("./schema/schema");

const app = express();
const PORT = 5000;
const dotenv = require("dotenv");

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Use middleware
app.use(bodyParser.json());
app.use(cors());

// Routes

app.post("/api/saveForm", async (req, res) => {
  const formData = req.body;

  try {
    const form = new Form(formData);
    await form.save();
    res.status(200).send({ message: "Form saved successfully!" });
  } catch (error) {
    console.error("Error saving form:", error);
    res.status(500).send({ message: "Failed to save form." });
  }
});

// Get all forms
app.get("/api/forms", async (req, res) => {
  try {
    const forms = await Form.find({});
    res.status(200).json(forms);
  } catch (error) {
    console.error("Error fetching forms:", error);
    res.status(500).send({ message: "Failed to fetch forms." });
  }
});

// Get a specific form by ID
app.get("/api/forms/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const form = await Form.findById(id);
    if (!form) {
      return res.status(404).send({ message: "Form not found." });
    }
    res.status(200).json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).send({ message: "Failed to fetch form." });
  }
});

// Create or update a form
app.post("/api/forms/:id", async (req, res) => {
  const { id } = req.params;
  const formData = req.body;

  try {
    if (id) {
      // Update form
      const form = await Form.findByIdAndUpdate(id, formData, { new: true });
      if (!form) {
        return res.status(404).send({ message: "Form not found." });
      }
      res.status(200).json(form);
    } else {
      // Create new form
      const form = new Form(formData);
      await form.save();
      res.status(201).json(form);
    }
  } catch (error) {
    console.error("Error saving form:", error);
    res.status(500).send({ message: "Failed to save form." });
  }
});

// Delete a form
app.delete("/api/forms/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Form.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send({ message: "Form not found." });
    }
    res.status(200).send({ message: "Form deleted successfully!" });
  } catch (error) {
    console.error("Error deleting form:", error);
    res.status(500).send({ message: "Failed to delete form." });
  }
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).send({ message: "Route not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
