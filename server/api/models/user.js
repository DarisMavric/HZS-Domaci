const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const { String, Boolean } = mongoose.Schema.Types;

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match:
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
