import React from 'react';
import './index.css';
import HomePage from './components/HomePage/HomePage';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import TimeSheet from './components/TimeCardPage/TimeSheet'
import 'bootstrap/dist/css/bootstrap.css';

export default function Landing() {
    return (
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/timecard" element={<TimeSheet />} />
    
      </Routes>
    </BrowserRouter>
    );
  }
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Landing/>);  
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
