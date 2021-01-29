const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

const playStoreGames = require('./playstore');

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
      Base URL: ${req.baseUrl}
      Host: ${req.hostname}
      Path: ${req.path}
    `;
    res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end(); //do not send any data back to the client
});

app.get('/greetings', (req, res) => {
    //1. get values from the request
    const name = req.query.name;
    const race = req.query.race;
  
    //2. validate the values
    if(!name) {
      //3. name was not provided
      return res.status(400).send('Please provide a name');
    }
  
    if(!race) {
      //3. race was not provided
      return res.status(400).send('Please provide a race');
    }
  
    //4. and 5. both name and race are valid so do the processing.
    const greeting = `Hello ${name} the ${race}, welcome to our kingdom.`;
  
    //6. send the response 
    res.send(greeting);
});

app.get('/sum', (req, res) => {
  //get values from request
  const a = parseFloat(req.query.a);
  const b = parseFloat(req.query.b);

  //make sure values are entered or are numbers
  if(!a) {
    return res.status(400).send('Please provide a valid number.')
  }
  if(!b) {
    return res.status(400).send('Please provide a valid number.')
  }

  //if both a and b are valid, create response
  const c = a + b;
  const additionProcess = `The sum of ${a} and ${b} is ${c}`;

  //send the response
  res.send(additionProcess);
});

app.get('/cipher', (req, res) => {
  const text = req.query.text;
  const shift = req.query.shift;

  if(!text) {
    return res.status(400).send('Text is required.')
  }
  if(!shift) {
    return res.status(400).send('Shift is required.')
  }

  const numShift = parseFloat(shift);

  if(Number.isNaN(numShift)) {
    return res.status(400).send('Shift is required to be a number.')
  }

  const base = 'A'.charCodeAt(0);

  const code = text.toUpperCase().split('').map(letter => {
    const letterCode = letter.charCodeAt(0);
    if(letterCode < base || letterCode > (base + 26)) {
      return letter;
    }

    let difference = (letterCode - base) + numShift;
    difference = difference % 26;

    const shiftedLetter = String.fromCharCode(base + difference);
    return shiftedLetter;
  }).join('');

  res.send(code);
});

app.get('/lotto', (req, res) => {
  const numbers = req.query.numbers;

  if(!numbers) {
    return res.status(400).send('Numbers are required.')
  }

  if(!Array.isArray(numbers)) {
    return res.status(400).send('Numbers must be an array')
  }

  const guesses = numbers.map(n => parseInt(n)).filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

  if(guesses.length !== 6) {
    return res.status(400).send('Six numbers between 1 and 20 are required.')
  }

  let randomNumbersList = [];

  for(let i = 0; i < 6; i++) {
    let randomInt = Math.floor(Math.random() * 20) + 1; //returns a random integer from 1 to 20
    randomNumbersList.push(randomInt)
  }

  let count = 0;

  for(let i=0; i < 6; i++) {
    for(let j=0; j < 6; j++) {
      if(guesses[j] === randomNumbersList[i]) {
        count = count + 1;
      }
    }
  }

  let responseText = ""

  if (count < 4) {
    responseText = "Sorry, you lose";
  } else if (count === 4) {
    responseText = "Congratulations, you win a free ticket";
  } else if (count === 5) {
    responseText = "Congratulations! You win $100!";
  } else {
    responseText = "Wow! Unbelievable! You could have won the mega millions!";
  }

  console.log(guesses);
  console.log(randomNumbersList);
  res.send(responseText);

});

app.get('/grade', (req, res) => {
  const { mark } = req.query;

  if(!mark) {
    return res
      .status(400)
      .send('Please provide a mark');
  }

  const numericMark = parseFloat(mark);
  if (Number.isNaN(numericMark)) {
    return res
      .status(400)
      .send('Mark must be a numeric value');
  }

  if (numericMark < 0 || numericMark > 100) {
    return res
      .status(400)
      .send('Mark must be in range 0 to 100');
  }

  if (numericMark >= 90) {
    return res.send('A');
  }

  if (numericMark >= 80) {
    return res.send('B');
  }

  if (numericMark >= 70) {
    return res.send('C');
  }

  res.send('F');
});

app.get('/apps', (req, res) => {
  //console.log(playStoreGames);
  const { genre = "", sort } = req.query;

  if (sort) {
    if (!['Rating', 'App'].includes(sort)) {
      return res.status(400).send('Sort must be one of Rating or App');
    }
  }

  if (!['', 'Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'].includes(genre)) {
    return res.status(400).send('Genre must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card');
  }

  let results = playStoreGames.filter(playStoreGame => 
    playStoreGame.Genres.includes(genre)
  );

  if (sort) {
    results.sort((a, b) => {
      return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 1;
    })
  }

  res.json(results);
})

module.exports = app;

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});
