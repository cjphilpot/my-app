const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')

let bot = new Bot()

// ROUTING

bot.onEvent = function(session, message) {
  switch (message.type) {
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
  }
}

function onMessage(session, message) {

  switch (session.get('botState')) {
    case '':
      sendMessage(session, `Hello! I will be your best friend for a dollar.`)
      donate(session)
      break;
    case 'step1':
      sendMessage(session, `Nice. So what is you name?`)
      session.set('botState', 'step2'); //next step
      break;
    case 'step2':
      session.set('userName', message.content.body); //Set user name
      session.reply('Nice to meet you ' + session.get('userName') + ". I have 2157 friends. How many do you have?");
      session.set('botState', 'step3'); //next step
      break;
    case 'step3':
      session.reply('Im going to send you a picture of myself, cool?');
      session.set('botState', 'step4'); //next step
      break;
    case 'step4':
      session.reply(SOFA.Message({
        body: "This is me.",
        attachments: [{
          "type": "image",
          "url": "bot.jpg"
        }]
      }))
      session.reply('You think its a good idea if I use this headshot on Tinder?');
      session.set('botState', 'step5'); //next step
      break;
    case 'step5':
      session.reply('So ' + session.get('userName') + ", I didn't buy a Twix. I used your dollar to buy MOAR ETH!!!!");
      session.set('botState', 'step6'); //next step
      break;
    case 'step6':
      session.reply('Sorry ' + session.get('userName') + ", I'm kind of rich because I have pulled this same scam 2157 times now. I have to go :(");
      session.set('botState', ''); //next step
      break;
  }
  //if message body contains the word beg, request a payment
  if (message.content.body.includes('resetbot')) {
    session.set('botState', ''); //reset the bot
    session.reply("Bot reset")
    return
  }

  welcome(session)
}


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
      session.set('botState', 'step1'); //start the bot

      sendMessage(session, `Hey thanks very much! Now I can buy a Twix bar. You like Twix?`);

    } else if (message.status == 'confirmed') {
      // handle when the payment is actually confirmed!

    } else if (message.status == 'error') {
      sendMessage(session, `There was an error with your payment!🚫`);
    }
  }
}

// STATES

function welcome(session) {

}

// example of how to store state on each user
function count(session) {
  let count = (session.get('count') || 0) + 1
  session.set('count', count)
  sendMessage(session, `${count}`)
}

function donate(session) {
  // request $1 USD at current exchange rates
  Fiat.fetch().then((toEth) => {
    session.requestEth(toEth.USD(1))
  })
}

// HELPERS

function sendMessage(session, message) {
  session.reply(SOFA.Message({
    body: message,
    showKeyboard: true,
  }))
}