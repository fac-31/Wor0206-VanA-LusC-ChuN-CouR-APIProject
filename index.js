const express = require('express');
const browserSync = require('browser-sync');
const app = express();
const PORT = process.env.PORT || 3001;

console.log('teesting123')

// Serve static files from the "public" directory
app.use(express.static('public'));

// Define a route for the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/anna', (req, res) => {
  res.sendFile(__dirname + '/public/anna.html');
});

app.get('/christine', (req, res) => {
  res.sendFile(__dirname + '/public/christine.html');
});

app.get('/nick', (req, res) => {
  res.sendFile(__dirname + '/public/nick.html');
});

app.get('/rich', (req, res) => {
  res.sendFile(__dirname + '/public/rich.html');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Initialize BrowserSync
browserSync.init({
  proxy: `http://localhost:${PORT}`,
  files: ['public/**/*.*'], // Watch for changes in the 'public' folder
  reloadDelay: 50,
});
