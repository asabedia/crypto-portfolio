import React, {Component} from "react";

import {
    Form, Input, Row, Col
} from 'antd';

class UserForm extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <Row type="flex" align="middle" justify="center">
                    <Col>
                        <Form.Item label="Job Site">
                            {getFieldDecorator('job-site', {
                                rules: [{
                                    required: true,
                                    message: 'Please input the name of your Job Site',
                                }],
                            })(
                                <Input placeholder="Name of Job Site"/>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    }
}
export default Form.create()(UserForm);