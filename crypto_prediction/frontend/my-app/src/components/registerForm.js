import React, {Component} from "react";
import {
    Form, Icon, Input, Button, Checkbox,
} from 'antd';
import {BrowserRouter as Router, Route, Link, withRouter, Redirect} from "react-router-dom";
import UserForm from './userForm';

class RegisterForm extends Component {
    state= {
        register: false
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({register: true})
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        if (this.state.register === true) {
            return <Redirect to='/' />
        }
        return (
            <div style={{margin: "5% 2% 0 2%"}}>
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                    {getFieldDecorator('userName', {
                        rules: [{required: true, message: 'Please input your username!'}],
                    })(
                        <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="Username"/>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('password', {
                        rules: [{required: true, message: 'Please input your Password!'}],
                    })(
                        <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                               placeholder="Password"/>
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator('budget', {
                        rules: [{required: true, message: 'Please input your budget!'}],
                    })(
                        <Input prefix={<Icon type="dollar" style={{color: 'rgba(0,0,0,.25)'}}/>}
                               placeholder="Budget"/>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={this.handleSubmit} htmlType="submit" className="login-form-button">
                        Register
                    </Button>
                </Form.Item>
            </Form>
            </div>
        );
    }
}

export default Form.create({name: 'normal_login'})(RegisterForm);