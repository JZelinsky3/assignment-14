const express = require('express');
const app = express();
const cors = require('cors');
const joi = require('joi');

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

const movies = [
  {
    "title": "The Grand Budapest Hotel",
    "genre": "Comedy",
    "year": 2014,
    "actors": [
      "Ralph Fiennes",
      "F. Murray Abraham",
      "Mathieu Amalric"
    ],
    "director": "Wes Anderson",
    "rating": 8.1,
    "quotes": [
      "You see, there are still faint glimmers of civilization left in this barbaric slaughterhouse that was once known as humanity."
    ]
  },
  {
    "title": "Superbad",
    "genre": "Comedy",
    "year": 2007,
    "actors": [
      "Jonah Hill",
      "Michael Cera",
      "Christopher Mintz-Plasse"
    ],
    "director": "Greg Mottola",
    "rating": 7.6,
    "quotes": [
      "I am McLovin!"
    ]
  },
  {
    "title": "Anchorman: The Legend of Ron Burgundy",
    "genre": "Comedy",
    "year": 2004,
    "actors": [
      "Will Ferrell",
      "Christina Applegate",
      "Paul Rudd"
    ],
    "director": "Adam McKay",
    "rating": 7.2,
    "quotes": [
      "60% of the time, it works every time."
    ]
  },
  {
    "title": "The Hangover",
    "genre": "Comedy",
    "year": 2009,
    "actors": [
      "Bradley Cooper",
      "Ed Helms",
      "Zach Galifianakis"
    ],
    "director": "Todd Phillips",
    "rating": 7.7,
    "quotes": [
      "What happens in Vegas, stays in Vegas."
    ]
  },
  {
    "title": "Bridesmaids",
    "genre": "Comedy",
    "year": 2011,
    "actors": [
      "Kristen Wiig",
      "Maya Rudolph",
      "Rose Byrne"
    ],
    "director": "Paul Feig",
    "rating": 6.8,
    "quotes": [
      "I’m ready to party with the best of them."
    ]
  },
  {
    "title": "Napoleon Dynamite",
    "genre": "Comedy",
    "year": 2004,
    "actors": [
      "Jon Heder",
      "Efren Ramirez",
      "Jon Gries"
    ],
    "director": "Jared Hess",
    "rating": 6.9,
    "quotes": [
      "Vote for Pedro."
    ]
  }
]

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
});

app.get('/movies', async (req, res) => {
  console.log('Request to /movies received');
  try {
      res.json(movies);
  } catch (error) {
      console.error('Error:', error);
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
        res.json({ message: 'Movie added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));