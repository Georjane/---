/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
let searchWord = '';
let book = '';
const logic = require('./logic.js');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Word Voyage, Which word would you like to learn today?';
        const repromptText = 'You can try saying, help me remember the word benevolent. So which word do you have in mind?'; 


        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const CaptureWordIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CaptureWordIntent';
    },
    handle(handlerInput) {
        searchWord = handlerInput.requestEnvelope.request.intent.slots.word.value;
        const speakOutput = `Sure, Did you find the word ${searchWord} in
            something that you are reading?`
        const repromptText = ` Did you find the word ${searchWord} in
            something that you are reading?.`;
    
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const CaptureWordSourceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CaptureWordSourceIntent';
    },
    async handle(handlerInput) {
        const yesResponse = handlerInput.requestEnvelope.request.intent.slots.yesResponse.value;
        const noResponse = handlerInput.requestEnvelope.request.intent.slots.noResponse.value;
        // add speakout to be noResponse wen response is yes
        let speakOutput = '';
        let repromptText = ``;
        if(yesResponse){
            speakOutput = `OK, Please tell me what you are reading today. Where did you find the word, ${searchWord}?`;
            repromptText = `Which book did you find the word, ${searchWord}.`;
        }
        if(noResponse){
            let roots = await logic.fetchWordRootsApi(searchWord);
            
            
            if (roots.length >= 1) {
                speakOutput += `A good way to remember ${searchWord} is to think about its Latin roots. The first root is ${roots[0].exact_root} meaning ${roots[0].meaning}.`
                if(roots.length >= 2){
                    speakOutput += ` The second root in ${searchWord} is ${roots[1].exact_root}, meaning ${roots[1].meaning}.`
                    if(roots.length >= 3){
                        speakOutput += ` The third root is ${roots[2].exact_root} meaning ${roots[2].meaning}. `
                    if(roots.length >= 4){
                    speakOutput += ` The fourth root is ${roots[3].exact_root} meaning ${roots[3].meaning}. `
                    }
                    }
                }
                
                
             }
             speakOutput += `Can you guess the full meaning of the word, ${searchWord}?`
             repromptText = `Can you guess the full meaning of the word, ${searchWord}?`;
        } 
        
    
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const CaptureBookIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CaptureBookIntent';
    },
    async handle(handlerInput) {
        book = handlerInput.requestEnvelope.request.intent.slots.book.value;
        let author = await logic.fetchAuthorApi(book)
        let speakOutput = ``;
        if (author !== null){
            let wordcount = await logic.fetchWordCountApi(book, searchWord)
            if (wordcount === 0){
                speakOutput = `Great. ${book} by ${author}. Can you read me the sentence you found?`;
            }
            if (wordcount > 0){
                  
             speakOutput = `Great. ${book} by ${author}. ${searchWord} is in the book  
              ${wordcount} times. Can you read me the sentence you found?`;
              if (wordcount === 1) {
                   speakOutput = `Great. ${book} by ${author}. ${searchWord} is in the book,  
              ${wordcount} time. Can you read me the sentence you found?`;   
                  }
            }
        } else {
            speakOutput = `Great. Can you read me the sentence you found?`;           
        }
        // let wordcount = await logic.fetchWordCountApi(book, searchWord)
        
        //  if(author === null){
            
        //  }
        // if(author === null && wordcount === 0){
        //     speakOutput = `Great. Can you read me the sentence you found?`;
        // } 
        // if (author === null && wordcount > 0){
        //      speakOutput = `Great. ${searchWord} is in the book, ${book}, 
        //   ${wordcount} times. Can you read me the sentence you found?`;
        //   if (wordcount === 1) {
        //       speakOutput = `Great. ${searchWord} is in the book, ${book}, 
        //   ${wordcount} time. Can you read me the sentence you found?`;   
        //       }
        //  } 
        //  if (author !== null && wordcount === 0){
        //     speakOutput = `Great. ${book} by ${author}. Can you read me the sentence you found?`;
        //   }
        //   if (author !== null && wordcount > 0){
              
        //      speakOutput = `Great. ${book} by ${author}. ${searchWord} is in the book  
        //   ${wordcount} times. Can you read me the sentence you found?`;
        //   if (wordcount === 1) {
        //       speakOutput = `Great. ${book} by ${author}. ${searchWord} is in the book,  
        //   ${wordcount} time. Can you read me the sentence you found?`;   
        //       }
        //   }
        const repromptText = `Can you read me the sentence you found?`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};


const ReadSentenceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadSentenceIntent';
    },
    async handle(handlerInput) {
        let roots = await logic.fetchWordRootsApi(searchWord);
        
        let speakOutput = '';
        const repromptText = `Which book did you find the word, ${searchWord}.`;
        
        if (roots.length >= 1) {
            speakOutput += `A good way to remember ${searchWord} is to think about its Latin roots. The first root is ${roots[0].exact_root} meaning ${roots[0].meaning}.`
            if(roots.length >= 2){
                speakOutput += ` The second root in ${searchWord} is ${roots[1].exact_root}, meaning ${roots[1].meaning}. `
                if(roots.length >= 3){
                    speakOutput += ` The third root is ${roots[2].exact_root} meaning ${roots[2].meaning}. `
                if(roots.length >= 4){
                speakOutput += ` The fourth root is ${roots[3].exact_root} meaning ${roots[3].meaning}. `
                }
                }
            }
            
            
         }
         speakOutput += ` Can you guess the full meaning?`
         
         
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};


const ReadMeaningIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadMeaningIntent';
    },
    async handle(handlerInput) {
        // const speakOutput = `Here’s the definition: The study of how to arrange reproduction within a human population to increase the occurrence of heritable characteristics regarded as desirable. Do you understand the word now?`;
        const repromptText = `Do you understand the word now?`;
        const meaning = await logic.fetchWordMeaningApi(searchWord);
        let speakOutput = ``;
             
         if(meaning === null){
                speakOutput = `We will discuss more about the word, ${searchWord}, later. Is that okay by you?`; 
             }else {
               speakOutput = `Here’s the definition: ${meaning}. Do you understand the word now?`;  
             }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const UnderstandWordIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'YesIntent';
    },
    handle(handlerInput) {
        let speakOutput = ``;
        const repromptText = `Do you understand the word now?`;
        
            speakOutput = `OK. I will save ${searchWord} in your personal word bank and we'll talk
about it more later. If you would like to investigate some other root words that are
related to ${searchWord}, you can just say, Help remember the word. thank you`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};


const DontUnderstandWordIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NoIntent';
    },
    handle(handlerInput) {
        let speakOutput = ``;
        const repromptText = `Do you understand the word now?`;
        speakOutput = `We will find an example of how this word is used in the book and we can discuss it later. Is that okay by you?`  
         
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const ByeWordVoyageIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ByeWordVoyage';
    },
    handle(handlerInput) {
        const speakOutput = `It was great learning with you today, your new word, ${searchWord}, has been noted! Bye for now!`;
        const repromptText = `Would you like to investigate some other words?`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            // .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please can you try saying help me remember the word? or you can say thank you to quit.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            
            
            .reprompt('Can you please say that one more time')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please can you try saying help me remember the word? or you can say thank you to quit.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CaptureWordIntentHandler,
        CaptureWordSourceIntentHandler,
        CaptureBookIntentHandler,
        ReadSentenceIntentHandler,
        ReadMeaningIntentHandler,
        DontUnderstandWordIntentHandler,
        UnderstandWordIntentHandler,
        ByeWordVoyageIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
let searchWord = '';
let book = '';
const logic = require('./logic.js');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Word Voyage, Which word would you like to learn today?';
        const repromptText = 'You can try saying, help me remember the word benevolent. So which word do you have in mind?'; 


        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const CaptureWordIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CaptureWordIntent';
    },
    handle(handlerInput) {
        searchWord = handlerInput.requestEnvelope.request.intent.slots.word.value;
        const speakOutput = `Sure, Did you find the word ${searchWord} in
            something that you are reading?`
        const repromptText = ` Did you find the word ${searchWord} in
            something that you are reading?.`;
    
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const CaptureWordSourceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CaptureWordSourceIntent';
    },
    async handle(handlerInput) {
        const yesResponse = handlerInput.requestEnvelope.request.intent.slots.yesResponse.value;
        const noResponse = handlerInput.requestEnvelope.request.intent.slots.noResponse.value;
        // add speakout to be noResponse wen response is yes
        let speakOutput = '';
        let repromptText = ``;
        if(yesResponse){
            speakOutput = `OK, Please tell me what you are reading today. Where did you find the word, ${searchWord}?`;
            repromptText = `Which book did you find the word, ${searchWord}.`;
        }
        if(noResponse){
            let roots = await logic.fetchWordRootsApi(searchWord);
            
            
            if (roots.length >= 1) {
                speakOutput += `A good way to remember ${searchWord} is to think about its Latin roots. The first root is ${roots[0].exact_root} meaning ${roots[0].meaning}.`
                if(roots.length >= 2){
                    speakOutput += ` The second root in ${searchWord} is ${roots[1].exact_root}, meaning ${roots[1].meaning}.`
                    if(roots.length >= 3){
                        speakOutput += ` The third root is ${roots[2].exact_root} meaning ${roots[2].meaning}. `
                    if(roots.length >= 4){
                    speakOutput += ` The fourth root is ${roots[3].exact_root} meaning ${roots[3].meaning}. `
                    }
                    }
                }
                
                
             }
             speakOutput += `Can you guess the full meaning of the word, ${searchWord}?`
             repromptText = `Can you guess the full meaning of the word, ${searchWord}?`;
        } 
        
    
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const CaptureBookIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CaptureBookIntent';
    },
    async handle(handlerInput) {
        book = handlerInput.requestEnvelope.request.intent.slots.book.value;
        let author = await logic.fetchAuthorApi(book)
        let speakOutput = ``;
        if (author !== null){
            let wordcount = await logic.fetchWordCountApi(book, searchWord)
            if (wordcount === 0){
                speakOutput = `Great. ${book} by ${author}. Can you read me the sentence you found?`;
            }
            if (wordcount > 0){
                  
             speakOutput = `Great. ${book} by ${author}. ${searchWord} is in the book  
              ${wordcount} times. Can you read me the sentence you found?`;
              if (wordcount === 1) {
                   speakOutput = `Great. ${book} by ${author}. ${searchWord} is in the book,  
              ${wordcount} time. Can you read me the sentence you found?`;   
                  }
            }
        } else {
            speakOutput = `Great. Can you read me the sentence you found?`;           
        }
        // let wordcount = await logic.fetchWordCountApi(book, searchWord)
        
        //  if(author === null){
            
        //  }
        // if(author === null && wordcount === 0){
        //     speakOutput = `Great. Can you read me the sentence you found?`;
        // } 
        // if (author === null && wordcount > 0){
        //      speakOutput = `Great. ${searchWord} is in the book, ${book}, 
        //   ${wordcount} times. Can you read me the sentence you found?`;
        //   if (wordcount === 1) {
        //       speakOutput = `Great. ${searchWord} is in the book, ${book}, 
        //   ${wordcount} time. Can you read me the sentence you found?`;   
        //       }
        //  } 
        //  if (author !== null && wordcount === 0){
        //     speakOutput = `Great. ${book} by ${author}. Can you read me the sentence you found?`;
        //   }
        //   if (author !== null && wordcount > 0){
              
        //      speakOutput = `Great. ${book} by ${author}. ${searchWord} is in the book  
        //   ${wordcount} times. Can you read me the sentence you found?`;
        //   if (wordcount === 1) {
        //       speakOutput = `Great. ${book} by ${author}. ${searchWord} is in the book,  
        //   ${wordcount} time. Can you read me the sentence you found?`;   
        //       }
        //   }
        const repromptText = `Can you read me the sentence you found?`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};


const ReadSentenceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadSentenceIntent';
    },
    async handle(handlerInput) {
        let roots = await logic.fetchWordRootsApi(searchWord);
        
        let speakOutput = '';
        const repromptText = `Which book did you find the word, ${searchWord}.`;
        
        if (roots.length >= 1) {
            speakOutput += `A good way to remember ${searchWord} is to think about its Latin roots. The first root is ${roots[0].exact_root} meaning ${roots[0].meaning}.`
            if(roots.length >= 2){
                speakOutput += ` The second root in ${searchWord} is ${roots[1].exact_root}, meaning ${roots[1].meaning}. `
                if(roots.length >= 3){
                    speakOutput += ` The third root is ${roots[2].exact_root} meaning ${roots[2].meaning}. `
                if(roots.length >= 4){
                speakOutput += ` The fourth root is ${roots[3].exact_root} meaning ${roots[3].meaning}. `
                }
                }
            }
            
            
         }
         speakOutput += ` Can you guess the full meaning?`
         
         
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};


const ReadMeaningIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadMeaningIntent';
    },
    async handle(handlerInput) {
        // const speakOutput = `Here’s the definition: The study of how to arrange reproduction within a human population to increase the occurrence of heritable characteristics regarded as desirable. Do you understand the word now?`;
        const repromptText = `Do you understand the word now?`;
        const meaning = await logic.fetchWordMeaningApi(searchWord);
        let speakOutput = ``;
             
         if(meaning === null){
                speakOutput = `We will discuss more about the word, ${searchWord}, later. Is that okay by you?`; 
             }else {
               speakOutput = `Here’s the definition: ${meaning}. Do you understand the word now?`;  
             }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const UnderstandWordIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'YesIntent';
    },
    handle(handlerInput) {
        let speakOutput = ``;
        const repromptText = `Do you understand the word now?`;
        
            speakOutput = `OK. I will save ${searchWord} in your personal word bank and we'll talk
about it more later. If you would like to investigate some other root words that are
related to ${searchWord}, you can just say, Help remember the word. thank you`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};


const DontUnderstandWordIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NoIntent';
    },
    handle(handlerInput) {
        let speakOutput = ``;
        const repromptText = `Do you understand the word now?`;
        speakOutput = `We will find an example of how this word is used in the book and we can discuss it later. Is that okay by you?`  
         
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const ByeWordVoyageIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ByeWordVoyage';
    },
    handle(handlerInput) {
        const speakOutput = `It was great learning with you today, your new word, ${searchWord}, has been noted! Bye for now!`;
        const repromptText = `Would you like to investigate some other words?`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            // .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please can you try saying help me remember the word? or you can say thank you to quit.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            
            
            .reprompt('Can you please say that one more time')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please can you try saying help me remember the word? or you can say thank you to quit.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CaptureWordIntentHandler,
        CaptureWordSourceIntentHandler,
        CaptureBookIntentHandler,
        ReadSentenceIntentHandler,
        ReadMeaningIntentHandler,
        DontUnderstandWordIntentHandler,
        UnderstandWordIntentHandler,
        ByeWordVoyageIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
let searchWord = '';
let book = '';
const logic = require('./logic.js');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Word Voyage, Which word would you like to learn today?';
        const repromptText = 'You can try saying, help me remember the word benevolent. So which word do you have in mind?'; 


        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const CaptureWordIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CaptureWordIntent';
    },
    handle(handlerInput) {
        searchWord = handlerInput.requestEnvelope.request.intent.slots.word.value;
        const speakOutput = `Sure, Did you find the word ${searchWord} in
            something that you are reading?`
        const repromptText = ` Did you find the word ${searchWord} in
            something that you are reading?.`;
    
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const CaptureWordSourceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CaptureWordSourceIntent';
    },
    async handle(handlerInput) {
        const yesResponse = handlerInput.requestEnvelope.request.intent.slots.yesResponse.value;
        const noResponse = handlerInput.requestEnvelope.request.intent.slots.noResponse.value;
        // add speakout to be noResponse wen response is yes
        let speakOutput = '';
        let repromptText = ``;
        if(yesResponse){
            speakOutput = `OK, Please tell me what you are reading today. Where did you find the word, ${searchWord}?`;
            repromptText = `Which book did you find the word, ${searchWord}.`;
        }
        if(noResponse){
            let roots = await logic.fetchWordRootsApi(searchWord);
            
            
            if (roots.length >= 1) {
                speakOutput += `A good way to remember ${searchWord} is to think about its Latin roots. The first root is ${roots[0].exact_root} meaning ${roots[0].meaning}.`
                if(roots.length >= 2){
                    speakOutput += ` The second root in ${searchWord} is ${roots[1].exact_root}, meaning ${roots[1].meaning}.`
                    if(roots.length >= 3){
                        speakOutput += ` The third root is ${roots[2].exact_root} meaning ${roots[2].meaning}. `
                    if(roots.length >= 4){
                    speakOutput += ` The fourth root is ${roots[3].exact_root} meaning ${roots[3].meaning}. `
                    }
                    }
                }
                
                
             }
             speakOutput += `Can you guess the full meaning of the word, ${searchWord}?`
             repromptText = `Can you guess the full meaning of the word, ${searchWord}?`;
        } 
        
    
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const CaptureBookIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'CaptureBookIntent';
    },
    async handle(handlerInput) {
        book = handlerInput.requestEnvelope.request.intent.slots.book.value;
        let author = await logic.fetchAuthorApi(book)
        let speakOutput = ``;
        if (author !== null){
            let wordcount = await logic.fetchWordCountApi(book, searchWord)
            if (wordcount === 0){
                speakOutput = `Great. ${book} by ${author}. Can you read me the sentence you found?`;
            }
            if (wordcount > 0){
                  
             speakOutput = `Great. ${book} by ${author}. ${searchWord} is in the book  
              ${wordcount} times. Can you read me the sentence you found?`;
              if (wordcount === 1) {
                   speakOutput = `Great. ${book} by ${author}. ${searchWord} is in the book,  
              ${wordcount} time. Can you read me the sentence you found?`;   
                  }
            }
        } else {
            speakOutput = `Great. Can you read me the sentence you found?`;           
        }
        // let wordcount = await logic.fetchWordCountApi(book, searchWord)
        
        //  if(author === null){
            
        //  }
        // if(author === null && wordcount === 0){
        //     speakOutput = `Great. Can you read me the sentence you found?`;
        // } 
        // if (author === null && wordcount > 0){
        //      speakOutput = `Great. ${searchWord} is in the book, ${book}, 
        //   ${wordcount} times. Can you read me the sentence you found?`;
        //   if (wordcount === 1) {
        //       speakOutput = `Great. ${searchWord} is in the book, ${book}, 
        //   ${wordcount} time. Can you read me the sentence you found?`;   
        //       }
        //  } 
        //  if (author !== null && wordcount === 0){
        //     speakOutput = `Great. ${book} by ${author}. Can you read me the sentence you found?`;
        //   }
        //   if (author !== null && wordcount > 0){
              
        //      speakOutput = `Great. ${book} by ${author}. ${searchWord} is in the book  
        //   ${wordcount} times. Can you read me the sentence you found?`;
        //   if (wordcount === 1) {
        //       speakOutput = `Great. ${book} by ${author}. ${searchWord} is in the book,  
        //   ${wordcount} time. Can you read me the sentence you found?`;   
        //       }
        //   }
        const repromptText = `Can you read me the sentence you found?`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};


const ReadSentenceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadSentenceIntent';
    },
    async handle(handlerInput) {
        let roots = await logic.fetchWordRootsApi(searchWord);
        
        let speakOutput = '';
        const repromptText = `Which book did you find the word, ${searchWord}.`;
        
        if (roots.length >= 1) {
            speakOutput += `A good way to remember ${searchWord} is to think about its Latin roots. The first root is ${roots[0].exact_root} meaning ${roots[0].meaning}.`
            if(roots.length >= 2){
                speakOutput += ` The second root in ${searchWord} is ${roots[1].exact_root}, meaning ${roots[1].meaning}. `
                if(roots.length >= 3){
                    speakOutput += ` The third root is ${roots[2].exact_root} meaning ${roots[2].meaning}. `
                if(roots.length >= 4){
                speakOutput += ` The fourth root is ${roots[3].exact_root} meaning ${roots[3].meaning}. `
                }
                }
            }
            
            
         }
         speakOutput += ` Can you guess the full meaning?`
         
         
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};


const ReadMeaningIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ReadMeaningIntent';
    },
    async handle(handlerInput) {
        // const speakOutput = `Here’s the definition: The study of how to arrange reproduction within a human population to increase the occurrence of heritable characteristics regarded as desirable. Do you understand the word now?`;
        const repromptText = `Do you understand the word now?`;
        const meaning = await logic.fetchWordMeaningApi(searchWord);
        let speakOutput = ``;
             
         if(meaning === null){
                speakOutput = `We will discuss more about the word, ${searchWord}, later. Is that okay by you?`; 
             }else {
               speakOutput = `Here’s the definition: ${meaning}. Do you understand the word now?`;  
             }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const UnderstandWordIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'YesIntent';
    },
    handle(handlerInput) {
        let speakOutput = ``;
        const repromptText = `Do you understand the word now?`;
        
            speakOutput = `OK. I will save ${searchWord} in your personal word bank and we'll talk
about it more later. If you would like to investigate some other root words that are
related to ${searchWord}, you can just say, Help remember the word. thank you`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};


const DontUnderstandWordIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NoIntent';
    },
    handle(handlerInput) {
        let speakOutput = ``;
        const repromptText = `Do you understand the word now?`;
        speakOutput = `We will find an example of how this word is used in the book and we can discuss it later. Is that okay by you?`  
         
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            .getResponse();
    }
};

const ByeWordVoyageIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ByeWordVoyage';
    },
    handle(handlerInput) {
        const speakOutput = `It was great learning with you today, your new word, ${searchWord}, has been noted! Bye for now!`;
        const repromptText = `Would you like to investigate some other words?`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptText)
            // .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please can you try saying help me remember the word? or you can say thank you to quit.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            
            
            .reprompt('Can you please say that one more time')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please can you try saying help me remember the word? or you can say thank you to quit.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CaptureWordIntentHandler,
        CaptureWordSourceIntentHandler,
        CaptureBookIntentHandler,
        ReadSentenceIntentHandler,
        ReadMeaningIntentHandler,
        DontUnderstandWordIntentHandler,
        UnderstandWordIntentHandler,
        ByeWordVoyageIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();