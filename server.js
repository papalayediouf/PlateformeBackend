const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/formations')
  .then(() => console.log("Connecté à MongoDB"))
  .catch(err => console.error("Erreur de connexion :", err));


// Modèle Formation
const formationSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  date: { type: Date, required: true },
  nombreMaxParticipants: { type: Number, required: true },
  thematique: { type: String, required: true },
  prix: { type: Number, required: true },
});

const Formation = mongoose.model("Formation", formationSchema);

// Routes
// 1. Obtenir toutes les formations triées par date
app.get("/formations", async (req, res) => {
  const formations = await Formation.find().sort({ date: 1 });
  res.json(formations);
});

// 2. Obtenir une seule formation
app.get("/formations/:id", async (req, res) => {
  const formation = await Formation.findById(req.params.id);
  if (!formation) return res.status(404).send("Formation non trouvée");
  res.json(formation);
});

// 3. Ajouter une nouvelle formation
app.post("/formations", async (req, res) => {
  const formation = new Formation(req.body);
  try {
    const result = await formation.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Modifier une formation
app.put("/formations/:id", async (req, res) => {
  try {
    const formation = await Formation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!formation) return res.status(404).send("Formation non trouvée");
    res.json(formation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. Supprimer une formation
app.delete("/formations/:id", async (req, res) => {
  try {
    const result = await Formation.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send("Formation non trouvée");
    res.send("Formation supprimée avec succès");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Démarrage du serveur
const PORT = 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
