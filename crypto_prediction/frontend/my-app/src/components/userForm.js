import React, {Component} from "react";

import {
    Form, Input, Row, Col, Select, Button
} from 'antd';
const Option = Select.Option;
function handleChange(value) {
    console.log(`selected ${value}`);
}
class UserForm extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        let menuItems = [];
        for (var i = 0; i < 10; i++) {
            menuItems.push( <Row type="flex" align="middle" justify="center" gutter={64}>
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
                    <Form.Item label="Predicted Price">
                        {getFieldDecorator(`Predicted[${i}]`)(
                            <Input placeholder="Feel free to change it!"/>
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
            </Row>);
        }
        return (
            <Form>
                {menuItems}
                <Row type="flex" align="middle" justify="center">
                    <Col>
                        <Form.Item>
                            <Button size="large" type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}
export default Form.create()(UserForm);