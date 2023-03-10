import React from 'react';

const Card =(props) => {
    return (
    <div style={{ float: 'left', paddingRight:30, width:270}}>
         <div className="card">
        <div className="card-image" style={{width: 240}}>
             {console.log('props1',props.payload)}
             {console.log('props2',props.payload)}  
          <img  alt={props.payload.fields.header.stringValue} src="front-end/src/components/chatbot/laptop.jpg" />
          <span className="card-title">{props.payload.fields.header.stringValue}</span>
        </div>
        <div className="card-content">
            { props.payload.fields.description.stringValue }
           <p><a href='/'>{props.payload.fields.prix.stringValue}</a></p>
        </div>
        <div className="card-action">
          <a target="_blank" rel='noopener noreferrer' href={props.payload.fields.lien.stringValue}>Regardé maintenant</a>
        </div>
      </div>
    </div>
    );
};
//props.payload.fields.image.stringValue !!!!!!!!!
export default Card;