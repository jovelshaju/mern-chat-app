const mongoose = require("mongoose");
const bycryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.validatePassword = async function (inputPasword) {
  return await bycryptjs.compare(inputPasword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bycryptjs.genSalt(10);
  this.password = await bycryptjs.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
