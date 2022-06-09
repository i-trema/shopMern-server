const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

/// "trigger" pour crypter le mdp avant de sauvegarder sur la bdd :
/// ( on ne peut pas utiliser une fonction fléchée )
userSchema.pre("save", async function () {
  // vérifier si le mdp est nouveau pour ne pas crypter un mdp deux fois :
  if (this.isModified("password")) {
    // crypter le mdp :
    this.password = await bcrypt.hash(this.password, 10);
  }
});

module.exports = mongoose.model("User", userSchema);
