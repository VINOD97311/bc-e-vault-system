import React, { Component } from "react";

import {Router, Route, browserHistory, Redirect} from "react-router";

import Home from './components/Home'
import PoliceHome from './components/PoliceHome';
import NewFIR from './components/NewFIR';
import ViewCase from './components/ViewCase';
import Forensics from './components/CrimeDetails/Forensics'
import ForensicsHome from './components/ForensicHome'
import ForensicUpdate from './components/ViewForensic'
import JudgeHome from './components/judgehome';

import "./App.css";

class App extends Component {

  render() {
      return (
        <Router history={browserHistory}>   
            <Redirect from="/" to="/home" />
            <Route> 
              <Route path = "police" component = {PoliceHome}/>
              <Route path = "newfir" component = {NewFIR}/>
              <Route path = "viewcase/:caseId" component = {ViewCase}/>
              <Route path = "home" component = {Home}></Route>
              <Route path = "/forensichome" component = {ForensicsHome}></Route>
              <Route path = "/Judgehome" component = {JudgeHome}></Route>
              <Route path = "crimedata/forensics/:caseId/" component = {Forensics}/>   
              <Route path = "forensicUpdate/:caseId" component = {ForensicUpdate}></Route>  
               
            </Route>                 
        </Router>
    );
  }
}
export default App;
