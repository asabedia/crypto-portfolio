import React, {Component} from "react";
import {
    Card, Col, Row, Button, Icon
} from 'antd';
import { Redirect} from "react-router-dom";
import {Form} from "antd/lib/form";

class Dashboard extends Component {
    state = {
        access: false,
        portfolios: [],
        logged_in_user: ""
    }
    handleAccess = () => {
        this.setState({access: true})
    };
    
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
            .then(results => results.json())
            .then(data => {
                let portfolios = data.map((portfolio) => {
                    console.log(portfolio.name)
                    return(
                        <Col span={8} key = {portfolio.id}>
                            <Card title= {portfolio.name}>
                                <Row>
                                    <Button size="large" type="primary" onClick={() => this.handleAccess()}>
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
        if (this.state.access === true) {
            return <Redirect to='/form'/>
        }
        return (
            <div style={{margin: "5% 2% 0 2%"}}>
                <Row gutter={16} style={{margin: "5% 2% 0 2%"}}>
                    {this.state.portfolios}
                </Row>
                <Row gutter={16} style={{margin: "5% 2% 0 2%"}}>
                    <Card title="Add a portfolio">
                        <Button size="large" type="primary" onClick={() => this.handleAccess()}>
                            <Icon type="plus-circle" style={{fontSize: '32px', color: 'white', align: 'center'}}/>
                        </Button>

                    </Card>
                </Row>
            </div>
        );
    }
}

export default (Dashboard);