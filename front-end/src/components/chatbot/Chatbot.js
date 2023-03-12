//chatbot(causer avec un robot)
import React, {Component} from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {v4 as uuid} from 'uuid';

import Message from './Message';
import Card from './Card';
import QuickReplies from './QuickReplies';

const cookies = new Cookies();

class Chatbot extends Component {
   messagesEnd;
   talkInput;

   constructor(props){
    super(props);
    // Le binding es necessaire pour que la méthode 'this' marche sur le 'callback'
    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    this._handleQuickReplyPayload =this._handleQuickReplyPayload.bind(this);

    this.hide = this.hide.bind(this);
    this.show = this.show.bind(this);

    this.state ={
        messages: [],
        showBot: true
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
                 console.log('moi',res.data.fulfillmentMessages)
                  says = {
                    speaks : 'bot',
                    msg: msg
                  };
              
                let  msg2 = res.data.fulfillmentMessages[1];
                 // console.log(JSON.stringify(msg2))
                  let  says2 = {
                    speaks : 'bot',
                    msg: msg2
                  };   
                  let  msg3 = res.data.fulfillmentMessages[2];
                  console.log('msg3',msg3)
                   let  says3 = {
                     speaks : 'bot',
                     msg: msg3                     
                   }; 
                    
               // console.log('says', says)
                if(says3 !== undefined){
                  this.setState({messages: [...this.state.messages, says,says2,says3]});
                  }else if( says2 !== undefined){
                    this.setState({messages: [...this.state.messages, says, says2 ]});
                  }else{
                    this.setState({messages: [...this.state.messages, says]});
                  }     
            }
   }

   async df_event_query(eventName){
    
    const res = await axios.post('/api/df_event_query', {event:eventName, userID: cookies.get('userID') });
    let msg, says ={};
   //console.log('messagse event entré', res.data.fulfillmentMessages)
      msg = res.data.fulfillmentMessages[0];
       says = {
            speaks : 'bot', 
            msg: msg
        }
      //  console.log('says event', says)
        this.setState({messages: [...this.state.messages, says]});
  
   }

   componentDidMount(){
     this.df_event_query('Welcome');
    
   };
   
   componentDidUpdate(){
       this.messagesEnd.scrollIntoView({ behaviour: 'smooth'});
      if(this.talkInput){
        this.talkInput.focus();
      }
  
   };

   show(event){
    event.preventDefault();
    event.stopPropagation();
     this.setState({showBot: true});
 
   }

   hide(event){
    event.preventDefault();
    event.stopPropagation();
    this.setState({showBot: false});
 
  }

   _handleQuickReplyPayload(event, payload, text){
       event.preventDefault();
       event.stopPropagation();

       switch (payload){
        case 'training_masterclass':
          this.df_event_query('MASTERCLASS');
        break;
        default:
          this.df_text_query(text);
       
       }
      

   }

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

                  <div style={{overflow: 'auto'}}>
                     <div style={{height: 300, width: message.msg.payload.fields.cards.listValue.values.length*270}}>
                        {this.renderCards(message.msg.payload.fields.cards.listValue.values)}
                     </div>
                  </div>

                  </div>
                </div>
           </div>
           );
        } else if(message.msg &&
          message.msg.payload &&
          message.msg.payload.fields &&
          message.msg.payload.fields.quick_replies
            ){
              
                return( <QuickReplies
                text = {message.msg.payload.fields.text ? message.msg.payload.fields.text: null}
                key={i} 
                replyClick={this._handleQuickReplyPayload}
                speaks={message.speaks}
                payload={message.msg.payload.fields.quick_replies.listValue.values}
                />)
            }
   };

   renderMessages(stateMessages){
    if(stateMessages){
      //console.log('setmessages', stateMessages)
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
      if(this.state.showBot){
        return(
            <div style={{height:500,width:400,position:'absolute', bottom: 0, right:0, border:'1px solid lightgrey'}}>
             <nav>
              <div className='nav-wrapper'>
                 <a href='/' className='brand-logo'>ChatBot</a>
                 <ul id='nav-mobile' className='right hide-on-med-and-down'>
                  <li><a href='/' onClick={this.hide}>Fermer</a></li>
                 </ul>
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
        );
    }else {
      return(
        <div style={{height:40,width:400,position:'absolute', bottom: 0, right:0, border:'1px solid lightgrey'}}>
         <nav>
          <div className='nav-wrapper'>
             <a href='/' className='brand-logo'>ChatBot</a>
             <ul id='nav-mobile' className='right hide-on-med-and-down'>
                  <li><a href='/' onClick={this.show}>Ouvrir</a></li>
                 </ul>
          </div>
         </nav>
         <div ref={(el) => {this.messagesEnd = el;}}
                      style={{ float: 'left', clear:'both'}}>
                  </div>
        </div>
      );
    }
  }
}

export default Chatbot;