import React, {Component} from "react";

import {
    Form, Input, Row, Col, Select, Button
} from 'antd';
import {Redirect} from "react-router-dom";

const Option = Select.Option;

function handleChange(value) {
    console.log(`selected ${value}`);
}

class UserForm extends Component {
    state = {
        back: false,
        next: false
    };
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
            return <Redirect to='/home'/>
        }
        const {getFieldDecorator} = this.props.form;
        let predictedColumn;
        let rightButton;
        if (this.state.next === false) {
            predictedColumn = <div></div>;
            rightButton = <Form.Item>
                <Button size="large" type="primary" htmlType="submit"
                        onClick={() => this.handleSubmit("next")}>Next</Button>
            </Form.Item>;
        } else {
            predictedColumn = [];
            for (var i=0; i < 10; i++) {
                predictedColumn.push(<Col>
                    <Form.Item label="Predicted Price">
                        {getFieldDecorator(`Predicted[${i}]`)(
                            <Input placeholder="Feel free to change it!"/>
                        )}
                    </Form.Item>
                </Col>);
            }
                rightButton = <Form.Item>
                    <Button size="large" type="primary" htmlType="submit"
                            onClick={() => this.handleSubmit("Submit")}>Submit</Button>
                </Form.Item>

        }
        let menuItems = [];
        for (var i=0; i < 10; i++) {
            menuItems.push(<Row type="flex" align="middle" justify="center" gutter={64}>
                <Col>
                    <Form.Item label="Coin">
                        <Select defaultValue="coin1" onChange={handleChange}>
                            <Option value="coin1">Bitcoin</Option>
                            <Option value="coin2">Ethereum</Option>
                            <Option value="coin3">YEE</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item label="Price Purchased">
                        {getFieldDecorator(`Purchased[${i}]`, {
                            rules: [{
                                required: true,
                                message: 'Please input the name of your price-purchased',
                            }],
                        })(
                            <Input placeholder="$ when purchased"/>
                        )}
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item label="Maximum amount to purchase">
                        {getFieldDecorator(`Maximum[${i}]`, {
                            rules: [{
                                required: true,
                                message: 'Please input maximum amount',
                            }],
                        })(
                            <Input placeholder="Input maxmimum amount"/>
                        )}
                    </Form.Item>
                </Col>
                {predictedColumn[i]}
            </Row>);
        }
        return (
            <Form>
                {menuItems}
                <Row type="flex" align="middle" justify="space-between" style={{margin: "5% 10% 0 10%"}}>
                    <Col>
                        <Form.Item>
                            <Button size="large" type="primary" onClick={() => this.handleSubmit("back")}>Back</Button>
                        </Form.Item>
                    </Col>
                    <Col>
                        {rightButton}
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default Form.create()(UserForm);