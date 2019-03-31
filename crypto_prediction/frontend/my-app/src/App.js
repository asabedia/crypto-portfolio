import React, {Component} from 'react';
import './App.css';
import 'antd/dist/antd.css';
import UserForm from './components/userForm';
import LoginForm from "./components/loginForm";
import Portfolio from "./components/portfolio";
import RegisterForm from "./components/registerForm"
import {BrowserRouter as Router, Route, Switch, withRouter} from "react-router-dom";
import Dashboard from "./components/dashboard";

class App extends Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Switch>
                        <Route exact path="/" component={LoginForm} />
                        <Route path="/home" component={withRouter(Dashboard)} />
                        <Route path="/form" component={withRouter(UserForm)} />
                        <Route path="/add_portfolio" component={withRouter(Portfolio)} />
                        <Route path="/register" component={withRouter(RegisterForm)} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
