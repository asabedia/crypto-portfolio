import React, { Component } from "react";
import {
    Paper, Button, TextField,
    withStyles, Table, MenuItem,
    TableBody, TableCell, TableHead,
    TableRow, Modal, CircularProgress
} from "@material-ui/core";
import { Redirect } from "react-router-dom";
const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    },
    button: {
        margin: theme.spacing.unit,
        height: 50
    },
    input: {
        display: 'none',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 300,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
});
class LoginForm extends Component {
    state = {
        user: {
            username: "",
            first_name: "",
            password: ""
        },
        allUsers: [],
        login: false,
        register: false,
        invalid: false
    };

    componentDidMount() {
        fetch("/api/user/")
            .then(response => response.json())
            .then(data => {
                console.log(data)
                let users = data.map(user => ({ username: user.username, first_name: user.first_name, password: user.password }))
                this.setState({ allUsers: users })
            })
    }
    handleChange = (event) => {
        const type = event.target.id
        const value = event.target.value
        console.log(value)
        if (type == "username") {
            this.setState({ user: { username: value, password: this.state.user.password } })
        }
        else if (type == "password") {
            this.setState({ user: { username: this.state.user.username, password: value } })
        }
    }
    handleSubmit = (option) => {
        if (option === "register") {
            this.setState({ register: true })
        }
        else if (option === "login") {
            const userList = this.state.allUsers
            const username = this.state.user.username
            const password = this.state.user.password
            for (var i in userList) {
                if (userList[i].username == username && userList[i].password == password) {
                    this.setState({ login: true, invalid: false, user: {username: userList[i].username, first_name: userList[i].first_name} })
                }
                else {
                    this.setState({ invalid: true })
                }
            }
        }
    };

    render() {
        let invalid;
        const { classes } = this.props;
        if (this.state.login === true) {
            console.log(this.state.user)
            return <Redirect to={{
                pathname: '/home',
                state: { username: this.state.user.username, first_name: this.state.user.first_name }
            }} />
        }
        if (this.state.register === true) {
            return <Redirect to='/register' />
        }
        if (this.state.invalid === true) {
            invalid = <div><h2>Wrong credentials!</h2></div>
        }
        return (
            <div style={{ margin: "5% 2% 0 2%" }}>
                {invalid}
                <TextField
                    id="username"
                    label="Username"
                    required
                    value={this.state.username}
                    className={classes.textField}
                    placeholder="Please enter username"
                    onChange={this.handleChange}
                    margin="normal"
                />
                <br />
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    required
                    helperText="Please enter the amount of coins"
                    value={this.state.password}
                    className={classes.textField}
                    placeholder="Please enter password"
                    onChange={this.handleChange}
                    margin="normal"
                />
                <br />
                <Button variant="contained" color="secondary" className={classes.button} onClick={() => this.handleSubmit("login")}>Login</Button>
                <br />
                <Button variant="contained" color="secondary" className={classes.button} onClick={() => this.handleSubmit("register")}>Register</Button>
            </div>
        );
    }
}

export default withStyles(styles)(LoginForm);