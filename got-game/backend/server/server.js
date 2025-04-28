const nameRoutes = require('./routes/names');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

app.use('/api/names', nameRoutes);
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected Successfully'))
.catch((err) => console.error('MongoDB Connection Error:', err));

// Simple Route to Test
app.get('/', (req, res) => {
  res.send('Hello from Got Game backend!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
