//chatbot(causer avec un robot)
import React, {Component} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {v4 as uuid} from 'uuid';

import Message from './Message';
import Card from './Card';

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
            if(res.data.fulfillmentMessages){
                msg = res.data.fulfillmentMessages[0];
                  console.log(JSON.stringify(msg))
                  says = {
                    speaks : 'bot',
                    msg: msg
                  };
              
                let  msg2 = res.data.fulfillmentMessages[1];
                  console.log(JSON.stringify(msg2))
                  let  says2 = {
                    speaks : 'bot',
                    msg: msg2
                  };   
                console.log('says', says)
                if(says2 !== undefined){
                  this.setState({messages: [...this.state.messages, says,says2]});
                  }else{
                    this.setState({messages: [...this.state.messages, says]});
                  }      
            }
   }

   async df_event_query(eventName){
    
    const res = await axios.post('/api/df_event_query', {event:eventName, userID: cookies.get('userID') });
    let msg, says ={};
   console.log('messagse event entré', res.data.fulfillmentMessages)
      msg = res.data.fulfillmentMessages[0];
       says = {
            speaks : 'bot', 
            msg: msg
        }
        console.log('says event', says)
        this.setState({messages: [...this.state.messages, says]});
  
   }

   componentDidMount(){
     this.df_event_query('Welcome');
   };
   
   componentDidUpdate(){
       this.messagesEnd.scrollIntoView({ behaviour: 'smooth'});
   };

   renderCards(cards){
       return cards.map((card, i) => <Card key={i} payload={card.structValue} />)
   }

   renderOneMessage(message, i){
    if(message.msg && message.msg.text && message.msg.text.text){
      return (<Message key={i} speaks={message.speaks} text={message.msg.text.text}/>);
    } else if( message.msg && message.msg.payload  && message.msg.payload.fields.cards) {
           return( 
            <div key={i}>
                <div className='card-panel grey lighten-5 z-depth-1'>
                  <div style={{ overflow: 'hidden'}}>

                  <div className="col s2">
                   <a href="/" className="btn-floating btn-large waves-effect waves-light red">{message.speaks}</a>
                  </div>

                  <div style={{overflow: 'auto', overflowY: 'scroll'}}>
                     <div style={{height: 300, width: message.msg.payload.fields.cards.listValue.values.length*270}}>
                        {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                     </div>
                  </div>

                  </div>
                </div>
           </div>
           );
    }
   };

   renderMessages(stateMessages){
    if(stateMessages){
      console.log('setmessages', stateMessages)
        return stateMessages.map((message, i) =>{
           return this.renderOneMessage(message,i)
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
            <div style={{height:400,width:400,position: 'relative', bottom: 0, left:800, border:'1px solid lightgrey'}}>
             <nav>
              <div className='nav-wrapper'>
                 <a className='brand-logo'>ChatBot</a>
              </div>
             </nav>
               <div id="chatbot" style ={{height:388,width:'100%',overflow:'auto'}}>
               
                   {this.renderMessages(this.state.messages)}
                  <div ref={(el) => {this.messagesEnd = el;}}
                      style={{ float: 'left', clear:'both'}}>
                  </div>
               </div> 
               <div className='s12'>
               <input style={{margin: 0, paddingLeft:'1%', paddingRight:'1%', width:'98%'}} placeholder='Saisir un message:' type="text" ref={(input)=> {this.talkInput = input;}} onKeyPress={this._handleInputKeyPress}/>
               </div>
            </div>
        )
    }
}

export default Chatbot;