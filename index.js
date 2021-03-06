"use strict";

const fs = require('fs');

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();

const buttons = ['select', 'a', 'up', 'x', 'left', 'start', 'right', 'b', 'down', 'y'];

// Replace these with whatever numbers you want to control Player Two.
// I have an American and British number from when we used this at SIGNAL London.
const playerTwoNumbers = ['+19145952857', '+447492882126']

app.use(bodyParser.urlencoded({extended: false}));

app.post('/handle-key', (req, res) => {
  let digitPressed = req.body.Digits;
  let number = req.body.To;
  let button = buttons[digitPressed];

  if(buttons.indexOf(button) > -1) {
    if(['a', 'b', 'x', 'y'].includes(button)) {
      button = button.toUpperCase();
    }

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
    timeout: '9999'
  });

  res.send(twiml.toString());
});

app.post('/voice', (req, res) => {
  let twiml = new twilio.TwimlResponse();
  twiml.say('Connected. Refer to the instructions on screen for which buttons to press.');
  twiml.gather({
    numDigits: '1',
    action: '/handle-key',
    method: 'POST',
    timeout: '9999'
  });

  res.send(twiml.toString());
});

app.listen(3000, console.log('Listening on port 3000'));
