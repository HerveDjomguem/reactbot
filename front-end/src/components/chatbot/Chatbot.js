//chatbot(causer avec un robot)
import React, {Component} from 'react';
import axios from 'axios';

import Message from './Message';

class Chatbot extends Component {

   constructor(props){
    super(props);


    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    this.state ={
        messages: []
    }

   }

   async df_text_query(text){
    let msg;
      let says = {
        speaks: 'me',
        msg: {
            text :{
                text: text
            }
        }
      };
  
      this.setState({messages: [...this.state.messages, says]});
      const res = await axios.post('http://localhost:5000/api/df_text_query', {text: text});
     
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

   async df_event_query(event){
    const res = await axios.post('http://localhost:5000/api/df_event_query', {event:event});
   console.log('messagse event', res.data.fulfillmentMessages)
    for (let msg of res.data.fulfillmentMessages){
        let says = {
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
            console.log('moi',e.target.value)
            e.target.value = '';
        }
   }

    render(){
        return(
            <div style={{height:400,width:400,float: 'right'}}>
               <div id="chatbot" style ={{height:'100%',width:'100%',overflow:'auto'}}>
                  <h2>Chatbot</h2>
                  {this.renderMessages(this.state.messages)}
                  <input type="text" onKeyPress={this._handleInputKeyPress}/>
               </div> 
            </div>
        )
    }
}

export default Chatbot;