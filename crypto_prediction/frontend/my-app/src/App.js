import React, {Component} from 'react';
import './App.css';
import 'antd/dist/antd.css';
import UserForm from './components/userForm';
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/registerForm"
import {BrowserRouter as Router, Route, Switch, withRouter} from "react-router-dom";
import Dashboard from "./components/dashboard";

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Dashboard/>
                    <Switch>
                        <Route exact path="/" component={LoginForm} />
                        <Route path="/home" component={withRouter(Dashboard)} />
                        <Route path="/register" component={withRouter(RegisterForm)} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
