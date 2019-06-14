import React, {Component} from 'react';
import { Button, InputItem,Toast } from 'antd-mobile';
import axios from 'axios';
import { API,HOST } from '../../const/host';
import './login.less';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userName:"",
            password:""
        };
        this.login = this.login.bind(this);
        this.recordValue = this.recordValue.bind(this)
    };
    recordValue(key,val){
        this.setState({
            [key]:val
        })
    }
    login(){
        if(this.state.userName!==""&&this.state.password!==""){
            axios.post(`${API}/login`,{
                userName:this.state.userName,
                password:this.state.password
            }).then(response=>{
                console.log(response);
                if(response.data.result){
                    for (let k in response.headers){
                        if(k === "x-auth-token"){
                            //this.$store.dispatch('saveUserInfo',response.data.data);//请求回来后，把用户信息存储到VUEX里
                            sessionStorage.setItem('user',JSON.stringify(response.data.data));//为了防止刷新后用户数据丢失，存到sessionStorege里一份
                            localStorage.setItem('xAuthToken',response.headers[k]);//将token长期存储，便于下次进入系统验证dd
                            switch (response.data.data.roleCode){
                                case "admin":
                                    this.props.history.push(`${HOST}/index/team`);
                                    break;
                                case "subadmin":
                                    this.props.history.push(`${HOST}/index/myCustomer`);
                                    break;
                                case "sales":
                                    this.props.history.push(`${HOST}index/myCustomer`);
                                    break;
                                case "customer":
                                    this.props.history.push(`${HOST}/index/purchase`);
                                    break;
                                case "finance":
                                    this.props.history.push(`${HOST}/index/paymentCheck`);
                                    break;
                                case "wareHouse":
                                    this.props.history.push(`${HOST}/index/materialCheck`);


                            }
                            //sessionStorage.setItem('currentPath','/index');

                            //window.location.pathname="/index";//登陆成功后跳转到首页
                            return
                        }
                    }
                }else{
                    Toast.fail(response.data.msg, 1);
                }
            })
        }


    }

    render() {
        return (
            <div className="login">
                <div className="login-box">
                    <div className="logo">
                        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1520592272232&di=313f55f26d85fcdd3409e26c4285c189&imgtype=jpg&src=http%3A%2F%2Fimg2.imgtn.bdimg.com%2Fit%2Fu%3D2215144747%2C3112270367%26fm%3D214%26gp%3D0.jpg" alt=""/>
                    </div>
                    <div>
                        <InputItem
                            type="text"
                            placeholder="请输入用户名"
                            clear
                            moneyKeyboardAlign="left"
                            value={this.state.userName}
                            onChange={(val)=>{this.recordValue("userName",val)}}
                        >用户名</InputItem>
                        <InputItem
                            type="password"
                            placeholder="请输入密码"
                            clear
                            moneyKeyboardAlign="left"
                            value={this.state.password}
                            onChange={(val)=>{this.recordValue("password",val)}}
                        >密码</InputItem>
                        <div className="btn">
                            <Button type="primary" onClick={this.login}>登 录</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login