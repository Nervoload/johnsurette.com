// server/server.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Example API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the Node server!' });
});

// Serve static files if you decide to build the React app for production
// app.use(express.static('../client/build'));
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});