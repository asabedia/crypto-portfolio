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
class RegisterForm extends Component {
    state = {
        register: false,
        username: "",
        password: "",
        budget: "",
        first_name: "",
        last_name: ""
    }
    handleChange = (event) => {
        const type = event.target.id
        const value = event.target.value
        if (type == "first_name") {
            this.setState({ first_name: value })
        }
        else if (type == "last_name") {
            this.setState({ last_name: value })
        }
        else if (type == "username") {
            this.setState({ username: value })
        }
        else if (type == "password") {
            this.setState({ password: value })
        }
        else if (type == "budget") {
            this.setState({ budget: value })
        }
    }
    handleSubmit = () => {
        fetch('/api/user/new/', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify((
                {
                    username: this.state.username,
                    first_name: this.state.first_name,
                    last_name: this.state.last_name,
                    password: this.state.password,
                    budget: this.state.budget
                })
            )
        })
        this.setState({ register: true })
    }

    render() {
        const { classes } = this.props;
        if (this.state.register === true) {
            return <Redirect to='/' />
        }
        return (
            <div style={{ margin: "5% 2% 0 2%" }}>
                <TextField
                    id="first_name"
                    label="First Name"
                    required
                    value={this.state.first_name}
                    className={classes.textField}
                    placeholder="Please enter password"
                    onChange={this.handleChange}
                    margin="normal"
                />
                <TextField
                    id="last_name"
                    label="Last Name"
                    required
                    value={this.state.last_name}
                    className={classes.textField}
                    placeholder="Please enter Last Name"
                    onChange={this.handleChange}
                    margin="normal"
                />
                <br />
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
                <TextField
                    id="password"
                    label="Password"
                    required
                    type="password"
                    value={this.state.password}
                    className={classes.textField}
                    placeholder="Please enter password"
                    onChange={this.handleChange}
                    margin="normal"
                />
                <br />

                <TextField
                    id="budget"
                    label="Budget"
                    required
                    value={this.state.budget}
                    className={classes.textField}
                    placeholder="Please enter Budget"
                    onChange={this.handleChange}
                    margin="normal"
                />
                <br />
                <Button variant="contained" color="secondary" className={classes.button} onClick={() => this.handleSubmit()}>Register</Button>
            </div>
        );
    }
}
export default withStyles(styles)(RegisterForm);
