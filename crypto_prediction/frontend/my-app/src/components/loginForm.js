import React, {Component} from "react";
import {
    Form, Icon, Input, Button, Checkbox,
} from 'antd';
import {Redirect} from "react-router-dom";

class LoginForm extends Component {
    state= {
        login: false,
        register: false
    };
    handleSubmit = (option) => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
        if (option === "register") {
            this.setState({register: true})
        }
        else if (option === "login") {
            this.setState({login: true})
        }
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        if (this.state.login === true) {
            return <Redirect to={{
                pathname: '/home',
                state: {username: "Laudantium nemo arc"}
            }} />
        }
        if (this.state.register === true) {
            return <Redirect to='/register' />
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
                        <Button type="primary" onClick={() => this.handleSubmit("login")} htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={() => this.handleSubmit("register")} className="login-form-button">
                            Register Now!
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default Form.create({name: 'normal_login'})(LoginForm);