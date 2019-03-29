import React, {Component} from "react";

import {
    Form, Input, Row, Col, Select
} from 'antd';
import {Redirect} from "react-router-dom";
import { relativeTimeRounding } from "moment";
import { Paper, Button, TextField, 
    withStyles, Table, MenuItem, 
    TableBody, TableCell, TableHead,
    TableRow, Modal } from "@material-ui/core";
import portfolio from "./portfolio";
import { object } from "prop-types";

const Option = Select.Option;

const states = {
    1: "Portfolio Name", 
    2: "Porfolio Details",
    3: "Coin Price Predictions",
    4: "Confirmation"
}

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

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

/*
    item = {coin, amount_purchased, max_amount}
    tomorrows_predicted_prices = {coin:  ,price:}
*/ 

class UserForm extends Component {
    state = {
        back: false,
        current_state: 1,
        coin_options: [],
        username: "",
        portfolio: {
            name: "",
            items: []
        },
        current_portfolio_item: {
            coin: "",
            amount_purchased: "",
            max_amount: ""
        },
        predicted_price: [],
        suggestions: [],
        open_suggestion_modal: false
    };

    validatePortfolioItem = (item) => {
        return true
    }

    validatePortfolioName = (name) => {
        return true
    }

    componentDidMount() {
        this.setState({username: this.props.location.state.username.username})
    }

    getPredictedPricesFor = (coins) => {
        let tomorrows_predicted_prices = []
        for (var c in coins) {
            tomorrows_predicted_prices.push({coin: coins[c], price: 5})
        }
        return tomorrows_predicted_prices;
    }

    handleClose = (event) => {
        this.setState({open_suggestion_modal: false})
    }

    handleNextState = (nextState) => {
        if (nextState === 2) {
            const portfolio_name = this.state.portfolio.name
            if (!this.validatePortfolioName(portfolio_name)) {
                return;
            }
            fetch("api/coin/")
            .then(response => response.json())
            .then(data => {
                let coins_options = data.map(coin => {
                    return(coin.name)
                })
                this.setState({
                    coin_options: coins_options,
                    portfolio: {
                        name: portfolio_name, 
                        items: []
                    },
                     current_state: nextState
                    })
            })

        } else if (nextState === 3) {
            const coin_list = this.state.portfolio.items.map(item => item.coin)
            fetch('api/coin/predict/', {
                method: 'post',
                body: JSON.stringify(coin_list)
              }).then(response => response.json())
              .then(data => {
                  const items = Object.keys(data).map(coin => ({coin: coin, price: data[coin]}))
                  this.setState({predicted_price: items, current_state: nextState})
                })
        }
    }

    handlePricePredictionChange = (prediction_change_event) => {
        let b = Array.from(this.state.predicted_price)
        console.log(prediction_change_event)
        for (var i in b) {
            var item = b[i]
            if (item.coin == prediction_change_event.coin) {
                item.price = prediction_change_event.new_price
            }
        }
        this.setState({predicted_price: b})
    }

    handleChange = (event) => {
        let type = event.target.id
        if (type == null) {
            type = event.target.name
        }
        const value = event.target.value

        if (type == "portfolio-name") {
            this.setState({portfolio: {name: value, items: this.state.portfolio.items}})
        } else if (type == "select-coin") {
            this.setState(
                {
                    current_portfolio_item: {
                        coin: value,
                        amount_purchased: this.state.current_portfolio_item.amount_purchased,
                        max_amount: this.state.current_portfolio_item.max_amount
                    }
                })
        } else if (type == "amount-purchased") {
            this.setState(
                {
                    current_portfolio_item: {
                        coin: this.state.current_portfolio_item.coin,
                        amount_purchased: value,
                        max_amount: this.state.current_portfolio_item.max_amount
                    }
                })
        } else if (type == "maximum-amount") {
            this.setState(
                {
                    current_portfolio_item: {
                        coin: this.state.current_portfolio_item.coin,
                        amount_purchased: this.state.current_portfolio_item.amount_purchased,
                        max_amount: value
                    }
                })
        }
    }

    handleSubmit = (type) => {
        if (type === 'back') {
            this.setState({back: true})
        }
        else if (type === 'next') {
            this.setState({next: true})
        }
        else if (type == 'submit-portfolio-items') {
            const item = this.state.current_portfolio_item
            if (this.validatePortfolioItem(item)) {
                this.setState((prevState) => 
                ({
                    portfolio: {
                            name: prevState.portfolio.name,
                            items: [...prevState.portfolio.items, item]
                        }
                }))
            }
        } else if (type === 'generate-portfolio') {
            const lp = 
            {
                username: this.state.username,
                current_portfolio: this.state.portfolio,
                predicted_price: this.state.predicted_price
            }
            fetch('/api/generated_portfolio/', {
                method: 'post',
                body: JSON.stringify(lp)
              }).then(response => response.json())
              .then(data => {
                console.log(data)                    
                this.setState(
                {
                    suggestions: data,
                    open_suggestion_modal: true
                })
            })
        } else if (type == "save-generate-portfolio") {
            const current_portfolio = this.state.portfolio
            const suggestions = this.state.suggestions
            const items = current_portfolio.items.map(item => {
                const amount_purchased = parseFloat(item.amount_purchased) + parseFloat(suggestions[item.coin])
                return({
                    coin: item.coin, 
                    amount_purchased: amount_purchased,
                    max_amount: item.max_amount
                })}) 
            const generated_portofio = {
                name: current_portfolio.name,
                associated_username: this.state.username,
                items: items
            }
            fetch('/api/generated_portfolio/new/', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(
                    {
                        name: generated_portofio.name,
                        associated_username: generated_portofio.associated_username
                    })
              }).then(response => response.json())
              .then(data => {
                const portfolio_id = data.id   
                fetch('/api/coin/generated_portfolio/', {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }, 
                    body: JSON.stringify((
                        {
                            portfolio_id: portfolio_id,
                            items:generated_portofio.items
                        })
                )})
                console.log(portfolio_id)                
            })
            console.log(generated_portofio)
        }
    };

    render() {
        const { classes } = this.props
        let content
        let rightButton
        let current_state = this.state.current_state
        if(current_state === 1) {
            content = 
            <form className = {classes.container}>
                <TextField
                        id="portfolio-name"
                        label="Portfolio Name"
                        className={classes.textField}
                        value= {this.state.portfolio.name}
                        onChange={this.handleChange}
                        margin="normal"
                    />
            </form>
            rightButton = 
                <Button variant="contained" color="primary" className={classes.button} onClick={() => this.handleNextState(this.state.current_state + 1)}>Next</Button>
        } else if (current_state === 2) {
            content = 
                <div>
                    <form className = {classes.container}>
                        <TextField
                            name="select-coin"
                            required
                            label="Select"
                            select
                            className={classes.textField}
                            value={this.state.current_portfolio_item.coin}
                            onChange={this.handleChange}
                            SelectProps={{
                                MenuProps: {
                                className: classes.menu,
                                },
                            }}
                            helperText="Please select your currency"
                            margin="normal">
                            {this.state.coin_options.map(option => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            id="amount-purchased"
                            label="Amount Purchased"
                            required
                            value = {this.state.current_portfolio_item.amount_purchased}
                            className={classes.textField}
                            placeholder="105.402"
                            onChange={this.handleChange}
                            margin="normal"
                        />
                        <TextField
                            id="maximum-amount"
                            label="Maximum Amount To Purchase"
                            required
                            helperText = "Please enter the amount of coins"
                            value = {this.state.current_portfolio_item.max_amount}
                            className={classes.textField}
                            placeholder="1000.521"
                            onChange={this.handleChange}
                            margin="normal"
                        />
                        <Button variant="contained" color="secondary"  className={classes.button} onClick={() => this.handleSubmit("submit-portfolio-items")}>Save</Button>
                    </form>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Coins</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell align="right">Maximum Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.portfolio.items.map(item => {
                                return(
                                    <TableRow key = {item.coin} >
                                        <TableCell component="th" scope="row" align="right">{item.coin}</TableCell>
                                        <TableCell align="right">{item.amount_purchased}</TableCell>
                                        <TableCell align="right">{item.max_amount}</TableCell>
                                    </TableRow>)
                            })}
                        </TableBody>    
                    </Table>
                </div>

            rightButton = <Button variant="contained" color="primary" className={classes.button} onClick={() => this.handleNextState(this.state.current_state + 1)}>Next</Button>
        } else if (current_state === 3) {
            content = 
                <div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Coin</TableCell>
                                <TableCell align="center">Predicted Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.predicted_price.map(item => {
                                return(
                                    <TableRow key = {item.coin} >
                                        <TableCell component="th" scope="row" align="center">{item.coin}</TableCell>
                                        <TableCell component="th" scope="row" align="center">
                                            <TextField
                                                id= "predicted-price"
                                                label="Predicted Price"
                                                helperText="You may alter the predicted price"
                                                className={classes.textField}
                                                value= {item.price}
                                                onChange={(event) => this.handlePricePredictionChange(
                                                        {
                                                            coin: item.coin,
                                                            new_price: event.target.value
                                                        }
                                                    )}
                                                margin="normal"
                                            />
                                        </TableCell>
                                    </TableRow>)
                            })}
                        </TableBody>    
                    </Table>
                    <Modal  aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            open={this.state.open_suggestion_modal}
                            onClose={this.handleClose}>
                        <div style={getModalStyle()} className={classes.paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="right">Coin</TableCell>
                                        <TableCell align="right">Buy/Sell</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(this.state.suggestions).map(entry => {
                                        return(
                                            <TableRow key = {entry[0]} >
                                                <TableCell component="th" scope="row" align="center">{entry[0]}</TableCell>
                                                <TableCell component="th" scope="row" align="center">{entry[1] < 0 ? "Sell" : "Buy"}</TableCell>
                                                <TableCell component="th" scope="row" align="center">{Math.abs(entry[1])}</TableCell>
                                            </TableRow>)
                                    })}
                                </TableBody>
                            </Table>
                            <Button variant="contained" color="primary" className={classes.button} onClick={() => this.handleSubmit("save-generate-portfolio")}>Save</Button>
                        </div>    
                    </Modal>
                </div>
                rightButton = <Button variant="contained" color="primary" className={classes.button} onClick={() => this.handleSubmit("generate-portfolio")}>Generate Profile</Button>
        } 
        
        else if (this.state.back === true) {
            return <Redirect to={{
                pathname: '/home', 
                state: {username: "Soluta ipsum blanditiis dolorem"}
            }}/>
        }
        
        return (
            <div>
                <Paper>
                    {content}
                </Paper>
                <Row type="flex" align="middle" justify="space-between" style={{margin: "5% 10% 0 10%"}}>
                    <Col>
                        <Button variant="contained" color="secondary" className={classes.button} onClick={() => this.handleSubmit("back")}>Back</Button>
                    </Col>
                    <Col>
                        {rightButton}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withStyles(styles)(UserForm);