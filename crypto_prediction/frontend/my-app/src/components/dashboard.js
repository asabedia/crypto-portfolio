import React, {Component} from "react";
import {
    Col, Row, Icon
} from 'antd';
import { Card, CardContent, Typography, withStyles, CardActions, Button, Chip, Tab, Paper,  } from "@material-ui/core";
import { Redirect} from "react-router-dom";
import {Form} from "antd/lib/form";

const styles = theme => ({
    card: {
      minWidth: 200,
      marginBottom: 10
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 24,
    },
    pos: {
      marginBottom: 12,
      align: "left"
    },
    chip: {
        margin: theme.spacing.unit,
    }
  });

class Dashboard extends Component {
    state = {
        access: {flag: false, portfolio_id: ""},
        new_portfolio: false,
        portfolios: [],
        logged_in_user: ""
    }

    handleAccess = (portfolio_id) => {
        this.setState({access: {flag: true, portfolio_id: portfolio_id}})
    };
    
    handleNewPortfolio = () => {
        this.setState({new_portfolio: true})
    }

    componentDidMount() {
        let {username} = ""
        const { classes } = this.props;
        console.log(this.props.location.state)
        if(this.props.location.state != null){
            username = this.props.location.state.username
            this.setState({logged_in_user: this.props.location.state})
            console.log(this.state.logged_in_user)
        }
        if(username == "" && this.state.logged_in_user != ""){
            username = this.state.logged_in_user
        }
        if(username != "") {
            fetch("api/generated_portfolio/" + username + "/", {
                headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                   }
            })
            .then(results => results.json())
            .then(data => {
                console.log(data)
                let portfolios = data.map((portfolio) => {
                    console.log(portfolio.name)
                    return(
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography className={classes.title} component="h1">
                                        {portfolio.name}
                                    </Typography>
                                    <br/>
                                    <p>
                                        <Typography align="left" className={classes.pos}>
                                            Coins: 
                                                {portfolio.coins.map(coin => {
                                                return(
                                                    <Chip color="primary" label={coin} className={classes.chip} />
                                                )
                                                })}
                                        </Typography>
                                    </p>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => this.handleAccess(portfolio.id)}>Access</Button>
                                </CardActions>
                            </Card>
                    )
                })
                this.setState({portfolios: portfolios});
            })
        }
    }

    render() {
        const { classes } = this.props;
        if (this.state.access.flag === true) {
            return <Redirect to= {{pathname: '/add_portfolio', state: {portfolio_id: this.state.access.portfolio_id, username: this.state.logged_in_user}}}/>
        }
        if (this.state.new_portfolio === true) {
            return <Redirect to= {{pathname: '/form', state: {username: this.state.logged_in_user}}}/>
        }
        return (
            <div style={{margin: "5% 2% 5% 2%"}}>
                <Row gutter={16} style={{margin: "5% 2% 0 2%"}}>
                    {this.state.portfolios}
                </Row>
                <Row gutter={16} style={{margin: "5% 2% 0 2%"}}>
                    <Col>
                        <Button variant="contained" color="primary" className={classes.button} onClick={() => this.handleNewPortfolio()}>
                            New Portfolio
                            <Tab/>
                            <Icon type="plus-circle" style={{fontSize: '32px', color: 'white', align: 'center'}}/>
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default withStyles(styles)(Dashboard);