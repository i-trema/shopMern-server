const express = require("express");
const router = express.Router();
const Annonce = require("../models/Annonce");
const auth = require("../middleware/auth");

//// Création d'une annonce :
router.post("/", auth, async (req, res) => {
  try {
    ///// 1ere méthode :
    // const annonce = new Annonce({
    //   nom: req.body.nom,
    //   prix: req.body.prix,
    //   description: req.body.description,
    //   photo: req.body.photo,
    //   qteDispo: req.body.qteDispo,
    //   idUser: req.payload.id,
    // });

    ///// 2e méthode :
    req.body.idUser = req.payload.id;
    const annonce = new Annonce(req.body);

    const newAnnonce = await annonce.save();
    res.status(201).json(newAnnonce);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//// Lister toutes les annonces ( on peut les trier avec .sort())
router.get("/", async (req, res) => {
  try {
    const listeAnnonces = await Annonce.find().sort("createdAt");
    res.json(listeAnnonces);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//// Récupérer les annonces du user connecté
router.get("/getAnnonceUser", auth, async (req, res) => {
  try {
    /// 1ere méthode :
    // const annonces = await Annonce.find()
    //   .where("idUser")
    //   .equals(req.payload.id);

    /// 2eme methode :
    const annonces = await Annonce.find({ idUser: req.payload.id });

    res.json(annonces);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//// Récupérer une annonce avec son id
router.get("/:id", async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);

    if (!annonce) {
      return res.status(404).json("Cette annonce n'existe pas");
    }
    res.json(annonce);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//// Supprimer une annonce (si elle existe)
router.delete("/:id", auth, async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);

    if (!annonce) {
      return res.status(404).json("Cette annonce n'existe pas");
    }
    /// on ne peut pas mettre "!==" car ils n'ont pas le même type:
    if (annonce.idUser != req.payload.id) {
      return res.status(401).json("Cette annonce ne vous appartient pas");
    }
    await annonce.remove();
    res.status(200).json("annonce supprimée");
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//// Mettre à jour une annonce
router.put("/:id", auth, async (req, res) => {
  try {
    const annonce = await Annonce.findById(req.params.id);
    if (!annonce) {
      return res.status(404).json("Cette annonce n'existe pas");
    }
    if (annonce.idUser != req.payload.id) {
      return res.status(401).json("Cette annonce ne vous appartient pas");
    }

    annonce.nom = req.body.nom;
    annonce.prix = req.body.prix;
    annonce.description = req.body.description;
    annonce.photo = req.body.photo;
    annonce.qteDispo = req.body.qteDispo;

    await annonce.save();
    res.json(annonce);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

module.exports = router;
