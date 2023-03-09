import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './pages/Landing';
import About from './pages/About';
import Shop from './shop/Shop';
import Header from './Header';
import Chatbot from './chatbot/Chatbot';

const App = () => {
    return (
        <div>
            <Router>
            <div className='container'>
             <Header/>
                <Routes>
                    <Route exact path="/" element={<Landing/>} />
                    <Route exact path="/about" element={<About/>} />
                    <Route exact path="/shop" element={<Shop/>} />
                </Routes>
                <Chatbot/>
             </div>
            </Router> 
        </div>
    );
}

export default App;