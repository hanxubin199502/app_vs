import React, {Component} from 'react';
import { NavBar, Icon ,WingBlank,List,Steps,WhiteSpace} from 'antd-mobile';
import { Link } from 'react-router-dom';
import axios from "axios";
import "./logistics.less"
import {HOST,API} from "../../../const/host";

const Item = List.Item;
const Brief = Item.Brief;

const Step = Steps.Step;

class logistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:""
        };
    };
    componentDidMount(){

        axios.get(`${API}/api/express/traces/search`,{
            params:{
                orderNo:this.props.match.params.id
            }
        }).then(response=>{
            let res = response.data;
            if(res.result){
                this.setState({
                    data:JSON.parse(res.data)
                })
                console.log(JSON.parse(res.data))
            }

        })

    }
    componentWillUnmount(){
        sessionStorage.removeItem("backTo")
    }

    render() {
        return (
            <div className="logistics">
                <div className="logistics-header">
                    <NavBar
                        mode="light"
                        icon={<Icon type="left" />}
                        onLeftClick={() => this.props.history.push(sessionStorage.getItem("backTo"))}
                    >物流详情</NavBar>
                </div>
                {
                    this.state.data?
                        <div className="logistics-body">
                            <div className="express-info">
                                <List>
                                    <Item extra={this.state.data.orderCode}>订单号码</Item>
                                    <Item extra={this.state.data.logisticCode}>运单号码</Item>
                                </List>
                            </div>
                            <div className="express-step">
                                <List>
                                    <Item >物流进度</Item>
                                </List>
                                <WhiteSpace/>
                                <WingBlank>
                                    <Steps>
                                        {
                                            this.state.data.traces.map(v=>(
                                                <Step title={v.acceptTime} icon={<Icon type="check-circle" />} description={v.acceptStation} key={v.acceptTime}/>
                                            ))
                                        }

                                    </Steps>
                                </WingBlank>
                            </div>
                        </div>
                        :
                        ""
                }

            </div>
        )
    }
}

export default logistics