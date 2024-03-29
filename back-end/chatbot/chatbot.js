'use strict'
const dialogFlow = require('dialogflow');
const structjson = require('./structjson');
const config = require('../config/keys');
const mongoose = require('mongoose');

const projectID = config.googleProjectID;

//Pour le deploiment sur heruko
const credentials ={
    client_email: config.googleClientEmail,
    private_key: config.googlePrivateKey,
}

const sessionClient = new dialogFlow.SessionsClient({projectID,credentials});

const Registration = require('../models/registration');

module.exports = {
    textQuery: async function(text, userID, parameters ={}){
      let sessionPath = sessionClient.sessionPath(projectID, config.dialogFlowSessionID + userID);
        let self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
              text: {
                // The query to send to the dialogflow agent
                text: text,
                // The language used by the client 
                languageCode: config.dialogFlowSessionLanguageCode,
              },
            },
            queryParams: {
                payload: {
                    data: parameters
                }
            }
          };
          
           // Send request and log result  
          let responses = await sessionClient.detectIntent(request);
          responses = await self.handleAction(responses);
          return responses;
    },

    eventQuery: async function(event,userID,parameters ={}){
      let sessionPath = sessionClient.sessionPath(projectID, config.dialogFlowSessionID + userID);
        let self = module.exports;
        const request = {
            session: sessionPath,
            queryInput: {
               event: {
                // The query to send to the dialogflow agent
                name: event,
                parameters : structjson.jsonToStructProto(parameters),
                // The language used by the client 
                languageCode: config.dialogFlowSessionLanguageCode,
              },
            }
        
          };
          
           // Send request and log result  
          let responses = await sessionClient.detectIntent(request);
          responses = await self.handleAction(responses);
          return responses;
    },
    handleAction: function(response){
       let queryResult = response[0].queryResult;
       let self = module.exports;
       switch(queryResult.action){
          case 'recommandercours-yes':
            if(queryResult.allRequiredParamsPresent){
                self.saveRegistration(queryResult.parameters.fields);
            } 
            break;

       }
        return response;
    },

    saveRegistration: async function (fields){
      console.log(fields)
        const registration = new Registration({
          name: fields.name.stringValue,
          adresse: fields.adresse.stringValue,
          phone: fields.phone.stringValue,
          email:fields.email.stringValue,
          date: Date.now()
        });
        try{
            let reg = await registration.save();
            console.log(reg)
        }catch (err){
             console.log(err)
        }
    }

}