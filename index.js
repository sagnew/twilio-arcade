"use strict";

const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();

const gameboyButtons = ['a', 'b', 'x', 'y', 'left', 'right', 'up', 'down', 'start', 'select'];
const keys = ['select', 'a', 'up', 'x', 'left', 'start', 'right', 'b', 'down', 'y'];
const playerTwoNumbers = ['+14154032748', '+441618505031']

app.use(bodyParser.urlencoded({extended: false}));

app.post('/handle-key', (req, res) => {
  let digitPressed = req.body.Digits;
  let number = req.body.To;
  let button = keys[digitPressed];

  if(gameboyButtons.indexOf(button) > -1) {
    if(['a', 'b', 'x', 'y'].includes(button)) {
      button = button.toUpperCase();
    }

    console.log(button);
    if(playerTwoNumbers.includes(number)) {
      fs.writeFile('p2.txt', button, 'utf8', () => {});
    } else {
      fs.writeFile('p1.txt', button, 'utf8', () => {});
    }
  }

  let twiml = new twilio.TwimlResponse();
  twiml.gather({
    numDigits: '1',
    action: '/handle-key',
    method: 'POST',
    timeout: '10000'
  });

  res.send(twiml.toString());
});

app.post('/voice', (req, res) => {
  console.log(req.body.Body);

  let twiml = new twilio.TwimlResponse();
  twiml.gather({
    numDigits: '1',
    action: '/handle-key',
    method: 'POST',
  });

  res.send(twiml.toString());
});

app.listen(5000, console.log('Listening on port 5000'));
