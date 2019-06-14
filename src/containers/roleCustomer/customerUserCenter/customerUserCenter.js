import React, {Component} from 'react';
import './customerUserCenter.less';
import axios from "axios";
import { Button,Modal,NavBar,List,WingBlank,Toast } from "antd-mobile";
import { HOST,API } from "../../../const/host"
const Item = List.Item;
const Brief = Item.Brief;
const alert = Modal.alert;
class CustomerUserCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            num:0,
            user:JSON.parse(sessionStorage.getItem('user'))
        };
        this.logout = this.logout.bind(this)

    };
    logout(){
        alert('确认退出吗？？',"是否确认真的退出？", [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '确认', onPress: () => {
                axios.get(`${API}/logout`).then(res=>{
                    if(res.data.result){
                        sessionStorage.clear();
                        localStorage.clear();
                        Toast.success("退出成功",1);
                        this.props.history.push('/login')
                    }
                })
            }},
        ])

    }
    componentWillUnmount = () => {
        this.setState = (state,callback)=>{
            return;
        };
    }
    componentDidMount(){
        console.log('挂载后')
    }

    render() {

        return (
            <div className="user-center">
                <NavBar
                    mode="dark"
                >用户中心</NavBar>
                <div className="user-center-body">
                    <List>
                        <Item align="top" >
                            {this.state.user.nickName} <Brief>{this.state.user.userName}</Brief>
                        </Item>
                    </List>
                    <List style={{marginTop:10}}>
                        <Item arrow="horizontal" onClick={() => {
                            sessionStorage.setItem("backTo",this.props.match.url);
                            this.props.history.push(`${HOST}/message`)
                        }
                        }>消息提醒</Item>

                        {/*<Item arrow="horizontal" onClick={() => {this.props.history.push(`${HOST}/addressManage`)}}>地址管理</Item>*/}
                    </List>
                </div>
                <div className="logout">
                    <WingBlank>
                        <Button type="primary" onClick={this.logout}>退出</Button>
                    </WingBlank>

                </div>
            </div>
        )
    }
}

export default CustomerUserCenter