import React, {Component} from 'react';
import {NavBar,List,Tabs} from "antd-mobile";
import { StickyContainer, Sticky } from 'react-sticky';
import './sendManagement.less'
import {HOST,API} from "../../../const/host";
import axios from "axios"
//const API = "http://192.168.31.34:8080"
const Item = List.Item;
const Brief = Item.Brief;
function renderTabBar(props) {
    return (<Sticky topOffset={-45}>
        {({ style }) => <div style={{ ...style,top:45,zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
}
class SendManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs:[
                { title: '未发货',value:"UNSEND" },
                { title: '已完成',value:"COMPLETE" },
            ],
            data:[]
        };
        this.changeType = this.changeType.bind(this)
    };
    componentDidMount(){
        let status = "UNSEND";
        axios.get(`${API}/base/order/findAllAppOrderModel`,{
            params:{
                status
            }
        }).then(response=>{
            let res = response.data;
            this.setState({
                data:res
            });
        })
    }
    changeType(tab,index){
        this.setState({
            data:[]
        },()=>{
            axios.get(`${API}/base/order/findAllAppOrderModel`,{
                params:{status:tab.value}
            }).then(response=>{
                let res = response.data;
                console.log(res);
                this.setState({
                    data:res
                });
            });

        })
    }


    render() {
        return (
            <div className="send-management">
                <div className="send-management-header">
                    <NavBar
                        mode="dark"
                    >发货管理</NavBar>
                </div>
                <div className="send-management-body">
                    <StickyContainer>
                        <Tabs tabs={this.state.tabs}
                              onChange={this.changeType}
                              renderTabBar={renderTabBar}
                        >
                            <div className="customer-wrapper">
                                <List>

                                    {
                                        this.state.data.length===0?
                                            ""
                                            :
                                        this.state.data.map(v=>
                                            <Item arrow="horizontal"key={v.orderId} multipleLine onClick={() => {this.props.history.push(`${HOST}/sendManagement/operationOrderDetail/${v.orderId}`)}} extra={v.customerType}>
                                                <div className="name">
                                                    <span>订单号：{v.orderNo}</span>
                                                    <span className="total-price">¥{v.totalGoodsPrice}</span>

                                                </div>
                                                <Brief>
                                                    <div className="brief">
                                                        <span>{v.customerName}</span>
                                                        <span>{v.createTime}</span>
                                                    </div>
                                                </Brief>
                                            </Item>
                                        )
                                    }

                                </List>
                            </div>
                            <div className="customer-wrapper">
                                <List>

                                    {
                                        this.state.data.length===0?
                                            ""
                                            :
                                        this.state.data.map(v=>
                                            <Item arrow="horizontal"key={v.orderId} multipleLine onClick={() => {this.props.history.push(`${HOST}/sendManagement/operationOrderDetail/${v.orderId}`)}} extra={v.customerType}>
                                                <div className="name">
                                                    <span>订单号：{v.orderNo}</span>
                                                    <span className="total-price">¥{v.totalGoodsPrice}</span>

                                                </div>
                                                <Brief>
                                                    <div className="brief">
                                                        <span>{v.customerName}</span>
                                                        <span>{v.createTime}</span>
                                                    </div>
                                                </Brief>
                                            </Item>
                                        )
                                    }

                                </List>
                            </div>

                        </Tabs>
                    </StickyContainer>
                </div>
            </div>
        )
    }
}

export default SendManagement