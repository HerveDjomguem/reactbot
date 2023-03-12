import React from 'react';

const QuickReply = (props) => {

  if(props.reply.structValue.fields.payload){
    return (
        <a style={{ margin: 3}} href="/" className="btn-floating btn-large waves-effect waves-light red"
            onClick={(event) =>
            props.click(
                event,
                props.reply.structValue.fields.payload.stringValue,
                props.reply.structValue.fields.text.stringValue
            )}
        >
        {props.reply.structValue.fields.text.stringValue}
        {console.log('QuickReply',props.reply)}
        </a>
      );
  }else {
    return (
        <a href={props.reply.structValue.fields.lien.stringValue}
        className="btn-floating btn-large waves-effect waves-light red">
        {props.reply.structValue.fields.text.stringValue}
        {console.log('QuickReply2',props.reply)}
        </a>
      );
  }
 
};

export default QuickReply;