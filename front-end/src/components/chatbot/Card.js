import React from 'react';

const Card =(props) => {
    return (
    <div style={{ float: 'left', paddingRight:30, height:270}}>
         <div className="card">
        <div className="card-image" style={{with: 240}}>
          <img alt={props.playload.fields.header.stringValue} src={props.playload.fields.image.stringValue} />
          <span className="card-title">{props.playload.fields.header.stringValue}</span>
        </div>
        <div className="card-content">
           {props.playload.fields.description.stringValue}
           <p><a href='/'>{props.playload.fields.prix.stringValue}</a></p>
        </div>
        <div className="card-action">
          <a target="_blank" rel='noopener noreferrer' href={props.playload.fields.lien.stringValue}>Regardé maintenant</a>
        </div>
      </div>
    </div>
    );
};

export default Card;