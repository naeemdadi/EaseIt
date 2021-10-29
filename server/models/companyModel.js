const { Schema, model } = require("mongoose");

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: [true, "Name is Required!"],
    },
    uniqueId: {
      type: String,
      required: [true, "Unique Id is Required!"],
      trim: true,
    },
    joiningPassword: {
      type: String,
      required: true,
    },
    users: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    tasks: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          ref: "Task",
        },
      },
    ],
  },
  { timestamps: true }
);

const Company = model("Company", companySchema);

module.exports = Company;
