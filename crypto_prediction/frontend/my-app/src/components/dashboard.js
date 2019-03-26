import React, {Component} from "react";
import {
    Card, Col, Row, Button, Icon
} from 'antd';
import { Redirect} from "react-router-dom";
import {Form} from "antd/lib/form";

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
        if(this.props.location.state != null){
            username = this.props.location.state.username
            this.setState({logged_in_user: this.props.location.state})
            console.log(this.state.logged_in_user)
        }
        if(username == "" && this.state.logged_in_user != ""){
            username = this.state.logged_in_user
        }
        if(username != "") {
            fetch("api/portfolio/" + username + "/")
            .then(results => {
                results = []
                try {
                    results = results.json()
                }
                catch(err) {}
                return results
            })
            .then(data => {
                let portfolios = data.map((portfolio) => {
                    console.log(portfolio.name)
                    return(
                        <Col span={8} key = {portfolio.id}>
                            <Card title= {portfolio.name}>
                                <Row>
                                    <Button size="large" type="primary" onClick={() => this.handleAccess(portfolio.id)}>
                                        Access
                                    </Button>
                                </Row>
                            </Card>
                        </Col>
                    )
                })
                this.setState({portfolios: portfolios});
            })
        }
    }

    render() {
        if (this.state.access.flag === true) {
            return <Redirect to= {{pathname: '/add_portfolio', state: {portfolio_id: this.state.access.portfolio_id}}}/>
        }
        if (this.state.new_portfolio === true) {
            return <Redirect to= {{pathname: '/form', state: {username: this.state.logged_in_user}}}/>
        }
        return (
            <div style={{margin: "5% 2% 0 2%"}}>
                <Row gutter={16} style={{margin: "5% 2% 0 2%"}}>
                    {this.state.portfolios}
                </Row>
                <Row gutter={16} style={{margin: "5% 2% 0 2%"}}>
                    <Card title="Add a portfolio">
                        <Button size="large" type="primary" onClick={() => this.handleNewPortfolio()}>
                            <Icon type="plus-circle" style={{fontSize: '32px', color: 'white', align: 'center'}}/>
                        </Button>
                    </Card>
                </Row>
            </div>
        );
    }
}

export default (Dashboard);