// server.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();  // Carica le variabili d'ambiente da .env
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Abilita CORS per richieste cross-origin
app.use(express.json());  // Permette di ricevere dati in formato JSON

// Connessione a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connessione a MongoDB avvenuta con successo!');
  })
  .catch((err) => {
    console.error('Errore di connessione a MongoDB:', err);
  });

// Schema e modello per l'inventario
const inventorySchema = new mongoose.Schema({
  nome: { type: String, required: true },
  quantita: { type: Number, required: true }
});

const Inventory = mongoose.model('Inventory', inventorySchema);

// Rotte per la gestione dell'inventario

// Ottieni tutti gli oggetti nell'inventario
app.get('/api/inventario', async (req, res) => {
  try {
    const inventario = await Inventory.find();
    res.json(inventario);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Aggiungi un nuovo oggetto all'inventario
app.post('/api/inventario', async (req, res) => {
  const { nome, quantita } = req.body;

  try {
    const existingItem = await Inventory.findOne({ nome });
    if (existingItem) {
      existingItem.quantita += quantita;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

    const newItem = new Inventory({ nome, quantita });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rimuovi un oggetto dall'inventario (decrementa la quantità)
app.put('/api/inventario', async (req, res) => {
  const { nome, quantita } = req.body;

  try {
    const item = await Inventory.findOne({ nome });
    if (!item) {
      return res.status(404).json({ message: 'Oggetto non trovato' });
    }

    if (item.quantita < quantita) {
      return res.status(400).json({ message: 'Quantità insufficiente' });
    }

    item.quantita -= quantita;
    if (item.quantita === 0) {
      await item.remove();
    } else {
      await item.save();
    }

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server in esecuzione su http://localhost:${port}`);
});
