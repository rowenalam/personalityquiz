'use strict';
const Alexa = require('ask-sdk');
const Util = require('./util');

/***********
Data: Customize the data below as you please.
***********/


const SKILL_NAME = "Animal Personality Quiz";
const HELP_MESSAGE_BEFORE_START = "Just answer five simple questions and I will show you the your spirit animal. Are you ready?";
const HELP_MESSAGE_AFTER_START = "These are just quick yes or no questions and you'll see what animal you are at the end of the quiz.";
const HELP_REPROMPT = "Only after you have answered 5 questions can I show you the answer.";
const STOP_MESSAGE = "I guess you didn't want to know your animal.";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "Please only say a yes or a no.";



//const BACKGROUND_IMAGE_URL = "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/default.jpg";
const BACKGROUND_IMAGE_URL = "default.jpeg";
//const BACKGROUND_GOODBYE_IMAGE_URL = "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/goodbye.jpg";
const BACKGROUND_GOODBYE_IMAGE_URL = "goodbye.jpeg";
//const BACKGROUND_HELP_IMAGE_URL = "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/help.jpg";
const BACKGROUND_HELP_IMAGE_URL = "help.jpeg";

const WELCOME_MESSAGE = "Howdy! I can tell you which animal you truly resemble. All you have to do is answer five questions with either yes or no. Do you want to play?";
const INITIAL_QUESTION_INTROS = [
  "Okay! Let's begin!",
  "<say-as interpret-as='interjection'>Great</say-as>! Here comes your first question!",
  "Wonderful. <say-as interpret-as='interjection'>ok</say-as>.",
  "<say-as interpret-as='interjection'>So</say-as>."
];
const QUESTION_INTROS = [
  "Oh wow.",
  "Okie Dokie.",
  "Way to go!",
  "Sure.",
  "I wouldn't have said that, but it's okay.",
  "Really? I see.",
  "Oh...alright.",
  "Oh yea, I totally agree.",
  "Uh Huh.",
  "True that."
];
const UNDECISIVE_RESPONSES = [
  "<say-as interpret-as='interjection'>Ahem</say-as>. I'll just choose at random for you.",
  "<say-as interpret-as='interjection'>Uhh</say-as>. Are you going to answer?",
  "<say-as interpret-as='interjection'>Sigh</say-as>... well nothing I can do about it now.",
  "<say-as interpret-as='interjection'>Welp</say-as>. Let's skip to the next one shall we?",
  "<say-as interpret-as='interjection'>Darn</say-as>. What about this one?",
];
const RESULT_MESSAGE = "Here's what you've been waiting for! You are a"; // the name of the result is inserted here.
const RESULT_MESSAGE_SHORT = "You're a"; // the name of the result is inserted here.
const PLAY_AGAIN_REQUEST = "The end. Did you want to change your answers and try again?";

const resultList = {
  result1: {
    name: "Peacock",
    display_name: "Peacock",
    audio_message: "Peacock is actually the name of the male, a female is called a peahen and babies are called peachicks.",
    description: "Peacocks are bright and colorful. They are flashy and know how to attract attention. You might enjoy waving your colorful train at everyone",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Red-knobbed.starfish.1200.jpg"
      largeImageUrl: "peacock.jpg",
    }
  },
  result2: {
    name: "Panda",
    display_name: "Panda",
    audio_message: "Pandas are usually born in August",
    description: "Pandas have so many fans because they look cute. They are lazy and mostly eat and sleep all day. But there's nothing wrong with being a panda, if I were one, I'd eat, sleep, and repeat too!",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Aceria_anthocoptes.1200.jpg"
      largeImageUrl: "panda.jpeg",
    }
  },
  result3: {
    name: "Dolphin",
    display_name: "Dolphin",
    audio_message: "Dolphins only use half their brain when they sleep",
    description: "Dolphins are extremely intelligent. They are also very friendly and caring. You'll use your smarts to tease and play with your friends",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Anodorhynchus_hyacinthinus.1200.jpg"
      largeImageUrl: "dolphin.jpg",
    }
  },
  result4: {
    name: "Butterfly",
    display_name: "Butterfly",
    audio_message: "Butterflies live only just a few weeks",
    description: "Butterflies come in all different colors and sizes. They trick predators to avoid being eaten. You have the freedom to fly and can either be one that hides or one that boldy announces their presence.",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Male_goat.1200.jpg"
      largeImageUrl: "butterfly.jpg",
    }
  },
  result5: {
    name: "Giraffe",
    display_name: "Giraffe",
    audio_message: "A newborn giraffe is around 6 feet tall, taller than most adult humans",
    description: "Giraffes have cool patterns, they are totally unique, no two giraffes are ever the same! You stand tall and powerful",
    img: {
      //largeImageUrl: "https://coach-courses-us.s3.amazonaws.com/public/courses/voice/Example%20images%20skill%203/Bufo_boreas.1200.jpg"
      largeImageUrl: "giraffe.jpeg",
    }
  }
};

const questions = [{
    question: "Do you like playing video games with your friends?",
    questionDisplay: "Do you play co-op games?",
    //background:  "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q1.jpg",
    background: "games.jpeg",
    points: {
      result1: 3,
      result2: 2,
      result3: 5,
      result4: 4,
      result5: 1
    }
  },
  {
    question: "Do you like long walks on the beach",
    questionDisplay: "Do you like walking along the beach?",
    //background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q2.jpg",
    background: "beach.jpeg",
    points: {
      result1: 5,
      result2: 2,
      result3: 0,
      result4: 1,
      result5: 4
    }
  },
  {
    question: "Do you find that books are better than movies?",
    questionDisplay: "Do you enjoy a book more than a movie?",
    //background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q3.jpg",
    background: "books.jpeg",
    points: {
      result1: 1,
      result2: 4,
      result3: 5,
      result4: 0,
      result5: 2
    }
  },
  {
    question: "Do you like having picnics at the park?",
    questionDisplay: "Do you like picnics?",
    //background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q4.jpg",
    background: "picnic.jpeg",
    points: {
      result1: 4,
      result2: 3,
      result3: 1,
      result4: 5,
      result5: 2
    }
  },
  {
    question: "Would you pick going to a concert over a quiet night staying in?",
    questionDisplay: "Loud music over staying home?",
    //background: "https://s3.amazonaws.com/coach-courses-us/public/courses/voice/2.7/q5.jpg",
    background: "concert.jpeg",
    points: {
      result1: 4,
      result2: 1,
      result3: 5,
      result4: 5,
      result5: 3
    }
  }
];

/***********
Execution Code: Avoid editing the code below if you don't know JavaScript.
***********/

// Private methods (this is the actual code logic behind the app)



const newSessionHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var isCurrentlyPlayingOrGettingResult = false;
    if (sessionAttributes.state) {
       isCurrentlyPlayingOrGettingResult = true;
    }


    return handlerInput.requestEnvelope.request.type === `LaunchRequest` || (!isCurrentlyPlayingOrGettingResult && request.type === 'IntentRequest' && (request.intent.name === 'AMAZON.YesIntent' || request.intent.name === 'AMAZON.NoIntent'));
  },
  handle(handlerInput) {

    console.log('--------------------------------------- New session')
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    if (handlerInput.requestEnvelope.request.type === `LaunchRequest`) {
      _initializeApp(sessionAttributes);
      return buildResponse(handlerInput, WELCOME_MESSAGE, WELCOME_MESSAGE, SKILL_NAME);
    }
    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent') {

      sessionAttributes.state = states.QUIZMODE;

      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }
    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent') {
      console.log('--------------------------------------- Exit session')
      const attributesManager = handlerInput.attributesManager;
      const sessionAttributes = attributesManager.getSessionAttributes();
      sessionAttributes.state = '';
      return buildResponse(handlerInput, STOP_MESSAGE, '', SKILL_NAME, BACKGROUND_GOODBYE_IMAGE_URL,STOP_MESSAGE);
    }
    if (request.type === 'IntentRequest' && request.intent.name === 'UndecisiveIntent') {
      const outputSpeech = MISUNDERSTOOD_INSTRUCTIONS_ANSWER;
      return buildResponse(handlerInput, outputSpeech, outputSpeech, SKILL_NAME, BACKGROUND_IMAGE_URL,"");
    }
  },
};

const nextQuestionIntent = (handlerInput, prependMessage) => {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();
  sessionAttributes.questionProgress++;
  var currentQuestion = questions[sessionAttributes.questionProgress].question;
  return {
    prompt: `${prependMessage} ${_randomQuestionIntro(sessionAttributes)} ${currentQuestion}`,
    reprompt: HELP_MESSAGE_AFTER_START,
    displayText: questions[sessionAttributes.questionProgress].questionDisplay,
    background: questions[sessionAttributes.questionProgress].background
  };
}

const resultIntent = (handlerInput, prependMessage) => {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();
  const resultPoints = sessionAttributes.resultPoints;
  const result = Object.keys(resultPoints).reduce((o, i) => resultPoints[o] > resultPoints[i] ? o : i);
  const resultMessage = `${prependMessage} ${RESULT_MESSAGE} ${resultList[result].name}. ${resultList[result].audio_message}. ${PLAY_AGAIN_REQUEST}`;
  return {
    prompt: resultMessage,
    reprompt: PLAY_AGAIN_REQUEST,
    displayText: `${RESULT_MESSAGE_SHORT} ${resultList[result].name}`,
    background: resultList[result].img.largeImageUrl
  }

  // this.emit(':askWithCard', resultMessage, PLAY_AGAIN_REQUEST, resultList[result].display_name, resultList[result].description, resultList[result].img);
  //                        ^speechOutput  ^repromptSpeech     ^cardTitle                       ^cardContent                    ^imageObj
}


const _randomIndexOfArray = (array) => Math.floor(Math.random() * array.length);
const _randomOfArray = (array) => array[_randomIndexOfArray(array)];
const _adder = (a, b) => a + b;
const _subtracter = (a, b) => a - b;

// Handle user input and intents:

const states = {
  QUIZMODE: "_QUIZMODE",
  RESULTMODE: "_RESULTMODE"
}



const quizModeHandler = {
  canHandle(handlerInput) {

    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var isCurrentlyPlaying = false;
    if (sessionAttributes.state && sessionAttributes.state === states.QUIZMODE) {
      isCurrentlyPlaying = true;
    }

    return isCurrentlyPlaying;
  },
  handle(handlerInput) {
    console.log('---------------------------------------Quiz Mode')
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var prependMessage = '';
    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NextIntent') {
      const systemSpeak = nextQuestionIntent(handlerInput, prependMessage);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.YesIntent') {
      _applyresultPoints(sessionAttributes, _adder);
      sessionAttributes.state = states.QUIZMODE;
      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NoIntent') {
      _applyresultPoints(sessionAttributes, _subtracter);
      sessionAttributes.state = states.QUIZMODE;
      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

    if (request.type === 'IntentRequest' && request.intent.name === 'UndecisiveIntent') {
      Math.round(Math.random()) ? _applyresultPoints(sessionAttributes, _adder) : _applyresultPoints(sessionAttributes, _subtracter);
      const systemSpeak = _nextQuestionOrResult(handlerInput, _randomOfArray(UNDECISIVE_RESPONSES));
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background,systemSpeak.displayText);
    }

    if (request.type === 'IntentRequest' && request.intent.name === 'AMAZON.RepeatIntent') {
      var currentQuestion = questions[sessionAttributes.questionProgress].question;
      return buildResponse(handlerInput, currentQuestion, HELP_MESSAGE_AFTER_START, SKILL_NAME, BACKGROUND_HELP_IMAGE_URL);
    }

  },
};

const resultModeHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    var isCurrentlyPlaying = false;
    if (sessionAttributes.state &&
      sessionAttributes.state === states.QUIZMODE) {
      isCurrentlyPlaying = true;
    }

    return !isCurrentlyPlaying && request.type === 'IntentRequest' && sessionAttributes.state === states.RESULTMODE;
  },
  handle(handlerInput) {
    console.log('--------------------------------------- Result mode')
    const request = handlerInput.requestEnvelope.request;
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();

    if (request.intent.name === 'AMAZON.YesIntent') {
      _initializeApp(sessionAttributes);
      sessionAttributes.state = states.QUIZMODE;
      const systemSpeak = _nextQuestionOrResult(handlerInput);
      return buildResponse(handlerInput, systemSpeak.prompt, systemSpeak.reprompt, SKILL_NAME, systemSpeak.background, systemSpeak.displayText);
    }
    if (request.intent.name === 'AMAZON.NoIntent') {
      const attributesManager = handlerInput.attributesManager;
      const sessionAttributes = attributesManager.getSessionAttributes();
      sessionAttributes.state = '';
      return buildResponse(handlerInput, STOP_MESSAGE, '', SKILL_NAME, BACKGROUND_GOODBYE_IMAGE_URL,STOP_MESSAGE);

    }



  },
};


const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.CancelIntent' ||
        request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    console.log('--------------------------------------- Exit session')
    const attributesManager = handlerInput.attributesManager;
    const sessionAttributes = attributesManager.getSessionAttributes();
    sessionAttributes.state = '';
    return buildResponse(handlerInput, STOP_MESSAGE, '', SKILL_NAME, BACKGROUND_GOODBYE_IMAGE_URL,STOP_MESSAGE);
    //------------------------------------------------
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    console.log('--------------------------------------- Help')
    const attributesManager = handlerInput.attributesManager;
    var speechOutput = '';
    const sessionAttributes = attributesManager.getSessionAttributes();
    if (sessionAttributes.state === states.QUIZMODE) {
       speechOutput = HELP_MESSAGE_AFTER_START;
    } else {
       speechOutput = HELP_MESSAGE_BEFORE_START;
    }
    const reprompt = HELP_REPROMPT;
    return buildResponse(handlerInput, speechOutput, reprompt, SKILL_NAME, BACKGROUND_HELP_IMAGE_URL);
  },
};
const UnhandledHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput) {
    console.log('---------------------------------------Unhandled')
    const outputSpeech = MISUNDERSTOOD_INSTRUCTIONS_ANSWER;
    return buildResponse(handlerInput, outputSpeech, outputSpeech, SKILL_NAME);
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log("Inside SessionEndedRequestHandler");
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

// Skill brain

const _initializeApp = handler => {
  // Set the progress to -1 one in the beginning
  handler.questionProgress = -1;
  // Assign 0 points to each animal
  var initialPoints = {};
  Object.keys(resultList).forEach(result => initialPoints[result] = 0);
  handler.resultPoints = initialPoints;
};

const _nextQuestionOrResult = (handlerInput, prependMessage = '') => {
  const attributesManager = handlerInput.attributesManager;
  const sessionAttributes = attributesManager.getSessionAttributes();
  if (sessionAttributes.questionProgress >= (questions.length - 1)) {

    sessionAttributes.state = states.RESULTMODE;
    return resultIntent(handlerInput, prependMessage)


  } else {
    return nextQuestionIntent(handlerInput, prependMessage);
  }
};

const _applyresultPoints = (handler, calculate) => {
  const currentPoints = handler.resultPoints;
  const pointsToAdd = questions[handler.questionProgress].points;

  handler.resultPoints = Object.keys(currentPoints).reduce((newPoints, result) => {
    newPoints[result] = calculate(currentPoints[result], pointsToAdd[result]);
    return newPoints;
  }, currentPoints);
};

const _randomQuestionIntro = handler => {
  if (handler.questionProgress === 0) {
    // return random initial question intro if it's the first question:
    return _randomOfArray(INITIAL_QUESTION_INTROS);
  } else {
    // Assign all question intros to remainingQuestionIntros on the first execution:
    var remainingQuestionIntros = remainingQuestionIntros || QUESTION_INTROS;
    // randomQuestion will return 0 if the remainingQuestionIntros are empty:
    let randomQuestion = remainingQuestionIntros.splice(_randomIndexOfArray(remainingQuestionIntros), 1);
    // Remove random Question from rameining question intros and return the removed question. If the remainingQuestions are empty return the first question:
    return randomQuestion ? randomQuestion : QUESTION_INTROS[0];
  }
};

// Utilities


let buildResponse = (handlerInput, prompt, reprompt, title = SKILL_NAME, image_url = BACKGROUND_IMAGE_URL,  displayText = SKILL_NAME, display_type = "BodyTemplate7" ) => {
  console.log(title);
  if (reprompt) {
    handlerInput.responseBuilder.reprompt(reprompt);
  } else {
    handlerInput.responseBuilder.withShouldEndSession(true);
  }
  var response;
  if (supportsDisplay(handlerInput)) {
    response = getDisplay(handlerInput.responseBuilder, title,  displayText, image_url, display_type)
  }
  else{
    response = handlerInput.responseBuilder
  }
  return response
  .speak(prompt)
  .getResponse();
}
function supportsDisplay(handlerInput) {
  var hasDisplay =
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display
  return hasDisplay;
}


function getDisplay(response, title, displayText, image_url, display_type){
	if (!image_url.includes('https://')) {
		image_url=Util.getS3PreSignedUrl("Media/"+image_url);
	}
	const image = new Alexa.ImageHelper().addImageInstance(image_url).getImage();

	console.log("the display type is => " + display_type);
    console.log(image_url);

	const myTextContent = new Alexa.RichTextContentHelper()
	.withPrimaryText(title+"<br/>")
	.withSecondaryText(displayText)
	.withTertiaryText("<br/> ")
	.getTextContent();

	if (display_type === "BodyTemplate7"){
		//use background image
		response.addRenderTemplateDirective({
			type: display_type,
			backButton: 'visible',
			backgroundImage: image,
			title:displayText,
			textContent: myTextContent,
			});
	}
	else{
		response.addRenderTemplateDirective({
			//use 340x340 image on the right with text on the left.
			type: display_type,
			backButton: 'visible',
			image: image,
			title:displayText,
			textContent: myTextContent,
			});
	}

	return response
}

// Init

  const skillBuilder = Alexa.SkillBuilders.custom();
  exports.handler = skillBuilder
    .addRequestHandlers(
      SessionEndedRequestHandler, HelpIntentHandler, ExitHandler, newSessionHandler, quizModeHandler, resultModeHandler, UnhandledHandler
    )
    //.addErrorHandlers(ErrorHandler)
    .lambda();
