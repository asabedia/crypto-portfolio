import React, {Component} from "react";

import {
    Form, Input, Row, Col, Select
} from 'antd';

import {Redirect} from "react-router-dom";
import { relativeTimeRounding } from "moment";
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

const Option = Select.Option;

const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
    },
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
    table: {
      minWidth: 500
    },
  });

class Portfolio extends Component {
    state = {
        back: false,
        next: false,
        portfolio_items: [],
        username:""
    };

    componentDidMount() {
        const portfolio_id = this.props.location.state.portfolio_id
        console.log()
        fetch("api/coin/generated_portfolio/"+portfolio_id+"/")
        .then(response => response.json())
        .then(data => {
            let portfolio_items = data.map(item => {
                return(
                    <TableRow key = {item.coin_id} >
                        <TableCell component="th" scope="row" align="right">{item.coin_id}</TableCell>
                        <TableCell align="right">{item.predicted_price}</TableCell>
                        <TableCell align="right">{item.amount_purchased}</TableCell>
                    </TableRow>
                )
            })
            this.setState({portfolio_items: portfolio_items, username: this.props.location.state.username})
        })
    }

    handleChange = (value) => {
        console.log(`selected ${value}`);
    }

    handleSubmit = (option) => {
        if (option === 'back') {
            this.setState({back: true})
        }
        else if (option === 'next') {
            this.setState({next: true})
        }
        else if (option === 'Submit'){
            this.props.form.validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
                }
            });
        }
    };

    render() {
        if (this.state.back === true) {
            return <Redirect to={{
                pathname: '/home', 
                state: {username: this.state.username.username, first_name: this.props.location.state.first_name}
            }}/>
        }
    
        return (
            <div>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="right">Coins</TableCell>
                                <TableCell align="right">Predicted Price</TableCell>
                                <TableCell align="right">Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.portfolio_items}
                        </TableBody>
                    </Table>
                </Paper> 
                <Button variant="contained" color="primary" className={this.props.classes.button} onClick={() => this.handleSubmit("back")}>Back</Button>
            </div>
        );
    }
}

export default withStyles(styles)(Portfolio);