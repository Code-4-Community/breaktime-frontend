import React from 'react';
import './index.css';
import HomePage from './components/HomePage/HomePage';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import NavBar from "./components/NavBar/NavBar"
import { Amplify } from 'aws-amplify';
import awsmobile from './aws-exports'

import AuthedApp from './components/Auth/AuthWrapper'

import TimeSheet from './components/TimeCardPage/TimeSheet'
import Signout from './components/SignOut/Signout'
import 'bootstrap/dist/css/bootstrap.css';

import '@aws-amplify/ui-react/styles.css';
import { ChakraProvider } from '@chakra-ui/react';

Amplify.configure(awsmobile);


export default function Landing() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<AuthedApp page={<HomePage />} />} />
          <Route path="/timecard" element={<AuthedApp page={<TimeSheet />} />} />
          <Route path="/logout" element={<Signout />} />

        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Landing />);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
