const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const multer = require('multer');
const fs = require('fs');
const { promisify } = require('util');
const joi = require('joi');

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
});

const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

let movies = [];
const moviesFilePath = 'movies.json';

const initializeMovies = async () => {
  try {
    if (fs.existsSync(moviesFilePath)) {
      const data = await readFileAsync(moviesFilePath, 'utf8');
      movies = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading movies from file:', error.message);
  }
};

initializeMovies();

app.get('/', async (req, res) => {
  console.log('Request to / received');
  try {
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/add-movie', async (req, res) => {
  try {
    const schema = joi.object({
      title: joi.string().required(),
      genre: joi.string().required(),
      year: joi.number().required(),
      actors: joi.array().items(joi.string()).required(),
      director: joi.string().required(),
      rating: joi.number().required(),
      quotes: joi.array().items(joi.string()),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    movies.push(req.body);
    await writeFileAsync(moviesFilePath, JSON.stringify(movies, null, 2));
    res.json({ message: 'Movie added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));