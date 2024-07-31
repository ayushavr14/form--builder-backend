const mongoose = require("mongoose");

const inputSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["email", "text", "password", "number", "date"],
  },
  title: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
  },
});

const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    inputs: [inputSchema],
  },
  {
    timestamps: true,
  }
);

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
