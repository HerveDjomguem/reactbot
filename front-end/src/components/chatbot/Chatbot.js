//chatbot(causer avec un robot)
import React, {Component} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {v4 as uuid} from 'uuid';

import Message from './Message';

const cookies = new Cookies();

class Chatbot extends Component {
   messagesEnd;
   constructor(props){
    super(props);


    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    this.state ={
        messages: []
    };

    //cookie accesible sur toutes les pages
    if(cookies.get('userID') === undefined){
      cookies.set('userID', uuid(), {path: '/'});
    }
     console.log(cookies.get('userID')); 

   }

   async df_text_query(queryText){
      let msg;
      let says = {
        speaks: 'me',
        msg: {
            text :{
                text: queryText
            }
         }
       };
  
      this.setState({messages: [...this.state.messages, says]});
      const res = await axios.post('/api/df_text_query', {text: queryText, userID: cookies.get('userID') });
     
      console.log('messagse text entré', res.data.fulfillmentMessages)
     
      if(res.data.fulfillmentMessages){
       for (let i=0; i<res.data.fulfillmentMessages.length;i++ ){
         msg = res.data.fulfillmentMessages[i];
          says = {
            speaks : 'bot',
            msg: msg
          };
         console.log('says', says)
         this.setState({messages: [...this.state.messages, says]}, () =>  console.log('messagse text sorti', this.state));
        }
      }
     
   }

   async df_event_query(eventName){
    
    const res = await axios.post('/api/df_event_query', {event:eventName, userID: cookies.get('userID') });
    let msg, says ={};
   console.log('messagse event entré', res.data.fulfillmentMessages)
    for (let i=0; i<res.data.fulfillmentMessages.length;i++){
      msg = res.data.fulfillmentMessages[i];
       says = {
            speaks : 'bot', 
            msg: msg
        }
        console.log('says event', says)
        this.setState({messages: [...this.state.messages, says]}, () =>  console.log('messagse event sorti', this.state));
      }
  
   }

   componentDidMount(){
     this.df_event_query('Welcome');
   };
   
   componentDidUpdate(){
       this.messagesEnd.scrollIntoView({ behaviour: 'smooth'});
   }

   renderMessages(stateMessages){
    if(stateMessages){
      console.log('setmessages', stateMessages)
        return stateMessages.map((message, i) =>{
           return <Message key={i} speaks={message.speaks} text={message.msg.text.text}/>;
        });
        
    }else{
        return null;
    }

   }

   _handleInputKeyPress(e){
        if(e.key === 'Enter'){
            this.df_text_query(e.target.value);           
            e.target.value = '';
        }
   }

    render(){
        return(
            <div style={{height:400,width:400,float: 'right'}}>
               <div id="chatbot" style ={{height:'100%',width:'100%',overflow:'auto'}}>
                  <h2>Chatbot</h2>
                  {this.renderMessages(this.state.messages)}
                  <div ref={(el) => {this.messagesEnd = el;}}
                      style={{ float: 'left', clear:'both'}}>
                  </div>
                  <input type="text" onKeyPress={this._handleInputKeyPress}/>
               </div> 
            </div>
        )
    }
}

export default Chatbot;