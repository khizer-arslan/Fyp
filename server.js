const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
const { route } = require('./routes/api/users');
// Connect Database
connectDB();

// init middleware
// this line allow us to get the data and req.body
// we use body parser.json but in express we have that pkg so we wrote express.json
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => res.send('Api Running'));
//  Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
