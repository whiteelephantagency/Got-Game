const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express(); 

const nameRoutes = require('./routes/name');

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/names', nameRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Simple Route to Test
app.get('/', (req, res) => {
  res.send('Hello from Got Game backend!');
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
