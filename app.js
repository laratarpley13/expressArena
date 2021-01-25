const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));

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
})

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
})
