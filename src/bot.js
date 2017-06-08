const SOFA = require('sofa-js');
const Fiat = require('./lib/Fiat')
const Bot = require('./lib/Bot');

let bot = new Bot();

bot.onEvent = function(session, message) {
  switch (message.type) {
<<<<<<< HEAD
    case "Message":
      onMessage(session, message);
      break;
    case "Command":
      onCommand(session, message);
      break;
    case "PaymentRequest":
      onPaymentRequest(session, message);
      break;
=======
    case 'Init':
      welcome(session)
      break
    case 'Message':
      onMessage(session, message)
      break
    case 'Command':
      onCommand(session, message)
      break
    case 'Payment':
      onPayment(session, message)
      break
    case 'PaymentRequest':
      welcome(session)
      break
>>>>>>> 5c18c60df025a80904674c58d451754bc077673f
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
      body: "Here is your logo",
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

<<<<<<< HEAD
  //otherwise send a default prompt
  sendButtonPrompt(session, "I only want to talk about my favorite color. Guess what it is!");
=======
function onPayment(session, message) {
  if (message.fromAddress == session.config.paymentAddress) {
    // handle payments sent by the bot
    if (message.status == 'confirmed') {
      // perform special action once the payment has been confirmed
      // on the network
    } else if (message.status == 'error') {
      // oops, something went wrong with a payment we tried to send!
    }
  } else {
    // handle payments sent to the bot
    if (message.status == 'unconfirmed') {
      // payment has been sent to the ethereum network, but is not yet confirmed
      sendMessage(session, `Thanks for the payment! 🙏`);
    } else if (message.status == 'confirmed') {
      // handle when the payment is actually confirmed!
    } else if (message.status == 'error') {
      sendMessage(session, `There was an error with your payment!🚫`);
    }
  }
>>>>>>> 5c18c60df025a80904674c58d451754bc077673f
}


function sendButtonPrompt(session, body) {
  session.reply(SOFA.Message({
    body:  body,
    controls: [
      {type: "button", label: "New Task", value: "newTask"},
      {type: "button", label: "Green", value: "green"},
      {type: "button", label: "Blue", value: "blue"}
    ],
    showKeyboard: false
  }));
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
  //fetch fiat conversion rates
  Fiat.fetch().then((toEth) => {
    let limit = toEth.USD(100)
    if (message.ethValue < limit) {
      session.sendEth(message.ethValue, (session, error, result) => {
        if (error) { session.reply('I tried but there was an error') }
        if (result) { session.reply('Here you go!') }
      })
    } else {
      session.reply('Sorry, I have a 100 USD limit.')
    }
  })
  .catch((error) => {
    session.reply('Sorry, something went wrong while I was looking up exchange rates')
  })
}
