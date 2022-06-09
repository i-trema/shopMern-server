const mongoose = require("mongoose");

const annonceSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      require: true,
    },
    prix: {
      type: Number,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    photo: {
      type: String,
    },
    qteDispo: {
      type: Number,
      default: 1,
    },
    //// on ajoute une clé étrangère qui fera référence à l'id de la collection User
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Annonce", annonceSchema);
