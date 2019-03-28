import React, {Component} from "react";

import {
    Form, Input, Row, Col, Select
} from 'antd';
import {Redirect} from "react-router-dom";
import { relativeTimeRounding } from "moment";
import { Paper, Button, TextField, 
    withStyles, Table, MenuItem, 
    TableBody, TableCell, TableHead,
    TableRow } from "@material-ui/core";
import portfolio from "./portfolio";

const Option = Select.Option;

const states = {
    1: "Portfolio Name", 
    2: "Porfolio Details",
    3: "Coin Price Predictions",
    4: "Saved"
}

const styles = theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
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
    item = {coin, price_purchased, amount_purchased, max_amount}
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
            price_purchased: "",
            amount_purchased: "",
            max_amount: ""
        },
        generated_portfolio_name: "",
        tomorrows_predicted_prices: []
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
            const predictions = this.getPredictedPricesFor(this.state.portfolio.items.map(item => item.coin))
            this.setState((prevState) => (
                {
                    portfolio: prevState.portfolio,
                    current_state: nextState,
                    tomorrows_predicted_prices: predictions
                }))
        }
    }

    handlePricePredictionChange = (prediction_change_event) => {
        let b = Array.from(this.state.tomorrows_predicted_prices)
        console.log(prediction_change_event)
        for (var i in b) {
            var item = b[i]
            if (item.coin == prediction_change_event.coin) {
                item.price = prediction_change_event.new_price
            }
        }
        this.setState({tomorrows_predicted_prices: b})
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
                        price_purchased: this.state.current_portfolio_item.price_purchased,
                        amount_purchased: this.state.current_portfolio_item.amount_purchased,
                        max_amount: this.state.current_portfolio_item.max_amount
                    }
                })
        } else if (type == "price-purchased") {
            this.setState(
                {
                    current_portfolio_item: {
                        coin: this.state.current_portfolio_item.coin,
                        price_purchased: value,
                        amount_purchased: this.state.current_portfolio_item.amount_purchased,
                        max_amount: this.state.current_portfolio_item.max_amount
                    }
                })
        } else if (type == "amount-purchased") {
            this.setState(
                {
                    current_portfolio_item: {
                        coin: this.state.current_portfolio_item.coin,
                        price_purchased: this.state.current_portfolio_item.price_purchased,
                        amount_purchased: value,
                        max_amount: this.state.current_portfolio_item.max_amount
                    }
                })
        } else if (type == "maximum-amount") {
            this.setState(
                {
                    current_portfolio_item: {
                        coin: this.state.current_portfolio_item.coin,
                        price_purchased: this.state.current_portfolio_item.price_purchased,
                        amount_purchased: this.state.current_portfolio_item.amount_purchased,
                        max_amount: value
                    }
                })
        } else if (type == "generated-portfolio-name") {
            this.setState({generated_portfolio_name: value})
        } 
    }

    handleSubmit = (type) => {
        if (type === 'back') {
            this.setState({back: true})
        }
        else if (type === 'next') {
            this.setState({next: true})
        }
        else if (type == 'submit-portfolio-items'){
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
                tomorrows_predicted_prices: this.state.tomorrows_predicted_prices
            }
            fetch('/api/generated_portfolio/', {
                method: 'post',
                body: JSON.stringify(lp)
              }).then(response => response.json())
              .then(data => console.log(data))
        }
    };

    render() {
        const { classes } = this.props
        let content
        let rightButton

        if(this.state.current_state === 1) {
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
        } else if (this.state.current_state === 2) {
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
                                id="price-purchased"
                                label="Price Purchased"
                                required
                                className={classes.textField}
                                value = {this.state.current_portfolio_item.price_purchased}
                                placeholder="50.50"
                                onChange={this.handleChange}
                                margin="normal"
                            />
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
                                <TableCell align="right">Price Purchased</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell align="right">Maximum Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.portfolio.items.map(item => {
                                return(
                                    <TableRow key = {item.coin} >
                                        <TableCell component="th" scope="row" align="right">{item.coin}</TableCell>
                                        <TableCell align="right">{item.price_purchased}</TableCell>
                                        <TableCell align="right">{item.amount_purchased}</TableCell>
                                        <TableCell align="right">{item.max_amount}</TableCell>
                                    </TableRow>)
                            })}
                        </TableBody>    
                    </Table>
                </div>

            rightButton = <Button variant="contained" color="primary" className={classes.button} onClick={() => this.handleNextState(this.state.current_state + 1)}>Next</Button>
        } else if (this.state.current_state === 3) {
            content = 
                <div>
                    <TextField
                        id="generated-portfolio-name"
                        label="Generated Portfolio Name"
                        required
                        className={classes.textField}
                        value= {this.state.generated_portfolio_name}
                        onChange={this.handleChange}
                        margin="normal"
                    />
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Coin</TableCell>
                                <TableCell align="right">Predicted Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.tomorrows_predicted_prices.map(item => {
                                return(
                                    <TableRow key = {item.coin} >
                                        <TableCell component="th" scope="row" align="right">{item.coin}</TableCell>
                                        <TableCell component="th" scope="row" align="right">
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