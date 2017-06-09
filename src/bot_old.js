const SOFA = require('sofa-js');
const Fiat = require('./lib/Fiat')
const Bot = require('./lib/Bot');

let bot = new Bot();

bot.onEvent = function(session, message) {
  switch (message.type) {
    case "Message":
      onMessage(session, message);
      break;
    case "Command":
      onCommand(session, message);
      break;
    case "PaymentRequest":
      onPaymentRequest(session, message);
      break;
  }
}

function onMessage(session, message) {
  //if the newTaskSet variable is triggered then save the message body to currentTask.
  switch (session.get('newTaskState')) {
    case 'newTaskSet':
      session.set('savedTask', message.content.body);
      session.reply('You entered: ' + session.get('savedTask'));
      
      sendEtherOptionPrompt(session, "How much do you want to pay for this task?");
      session.set('newTaskState', ''); //reset state
      break;
  }
  //if message body contains the word beg, request a payment
  if (message.content.body.includes('cancel')) {
    session.reply("Cancelled")
    return
  }

  //if it contains the word ethlogo, send an image message
  if (message.content.body.includes('ethlogo')) {
    session.reply(SOFA.Message({
      body: "This is me:",
      attachments: [{
        "type": "image",
        "url": "ethereum.jpg"
      }]
    }))
    return
  }

  //if it contains a known fiat currency code, send the ETH conversion
  if (Object.keys(Fiat.rates).indexOf(message.content.body) > -1) {
    Fiat.fetch().then((toEth) => {
      session.reply('1 ETH is worth ' + toEth[message.content.body]() + ' ' + message.content.body)
    })
    return
  }

  //otherwise send a default prompt
  sendEtherOptionPrompt(session, "I only want to talk about my favorite color. Guess what it is!");
}

function sendEtherOptionPrompt(session, body) {
  session.reply(SOFA.Message({
    body:  body,
    controls: [
      {type: "button", label: "$1", value: "1"},
      {type: "button", label: "$5", value: "5"},
      {type: "button", label: "$10", value: "10"},
      {type: "button", label: "$20", value: "20"}
    ],
    showKeyboard: false
  }));
}


function onCommand(session, command, message) {
  switch (command.content.value) {
    case 'newTask':
      session.reply("Enter a task you would like completed. 'cancel' to exit.");
      session.set('newTaskState', 'newTaskSet');
      break;
    case '1':
      session.reply("You pay 1");
      //session.set('newTaskState', 'newTaskSet');
      break;
    case '5':
      session.reply("You Pay 5");
      //session.set('newTaskState', 'newTaskSet');
      break;
    case '10':
      session.reply("You Pay 10");
      //session.set('newTaskState', 'newTaskSet');
      break;
    case '20':
      session.reply("You pay 20");
      //session.set('newTaskState', 'newTaskSet');
      break;
  }

}


function onPaymentRequest(session, message) {
  //message
  session.reply("Sorry I don't have any money.");
}
