require('dotenv').config(); // Load .env variables

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB using MONGODB_URI from .env
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Define Mongoose schema and model for User
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  waterRate: { type: Number, required: true, min: 0 },
});

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(express.json());

// Simple validation function (optional, Mongoose also validates)
function validateUser(data) {
  const { name, address, waterRate } = data;
  if (!name || !address) {
    return 'Name and address are required.';
  }
  if (waterRate == null || isNaN(waterRate) || waterRate < 0) {
    return 'Water rate must be a non-negative number.';
  }
  return null;
}

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// POST endpoint to receive user form data and save to MongoDB
app.post('/api/users', async (req, res) => {
  const error = validateUser(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const { name, address, waterRate } = req.body;
    const user = new User({ name, address, waterRate });
    await user.save();

    res.status(201).json({
      message: 'User saved successfully',
      user,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save user' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
