const mongoose = require("mongoose");
const validator = require("validator");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
    },
    message: "This is not a email",
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
    },
    message: "This is not a Link",
  },

  password: {
    type: String,
    required: true,
    select: false,
  },
});
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      console.log(password);
      console.log(user);
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
