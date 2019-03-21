import React, {Component} from "react";
import {
    Card, Col, Row, Button,
} from 'antd';
import {BrowserRouter as Router, Route, Link, withRouter, Redirect} from "react-router-dom";

class Dashboard extends Component {
    state = {
        login: false,
        register: false
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        if (this.state.login === true) {
            return <Redirect to='/home'/>
        }
        if (this.state.register === true) {
            return <Redirect to='/register'/>
        }

        return (
            <div style={{margin: "5% 2% 0 2%"}}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Card title="Card title" bordered={false}>
                            Portfolio 1
                            <Button size="large" type="primary"
                                    htmlType="submit">Submit</Button>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Card title" bordered={false}>
                            Portfolio 3
                            <Button size="large" type="primary"
                                    htmlType="submit">Submit</Button>
                        </Card>                    </Col>
                    <Col span={8}>
                        <Card title="Card title" bordered={false}>
                            Portfolio 2
                            <Button size="large" type="primary"
                                    htmlType="submit">Submit</Button>
                        </Card>                    </Col>
                </Row>
            </div>
        );
    }
}

export default (Dashboard);