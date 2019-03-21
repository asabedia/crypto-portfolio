import React, {Component} from "react";
import {
    Card, Col, Row, Button, Icon
} from 'antd';
import { Redirect} from "react-router-dom";
import {Form} from "antd/lib/form";

class Dashboard extends Component {
    state = {
        access: false
    }
    handleAccess = () => {
        this.setState({access: true})
    };
    

    render() {
        if (this.state.access === true) {
            return <Redirect to='/form'/>
        }
        let menuItems = [];
        for (var i = 0; i < 3; i++) {
            menuItems.push(
                <Col span={8}>
                    <Card title="Portfolio">
                        <Row>
                            <Button size="large" type="primary" onClick={() => this.handleAccess()}>
                                Access
                            </Button>
                        </Row>
                    </Card>
                </Col>);
        }
        return (
            <div style={{margin: "5% 2% 0 2%"}}>
                <Row gutter={16} style={{margin: "5% 2% 0 2%"}}>
                    {menuItems}
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