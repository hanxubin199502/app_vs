import React, {Component} from 'react';
import './myOrder.less'
import { NavBar,List ,Tabs  } from "antd-mobile";
import { StickyContainer, Sticky } from 'react-sticky';
import {HOST,API} from "../../../const/host";
import axios from "axios"
const Item = List.Item;
const Brief = Item.Brief;
//const API = "http://192.168.31.34:8080";
function renderTabBar(props) {
    return (<Sticky  topOffset={-45}>
        {({ style }) => <div style={{ ...style,top:45,zIndex: 1,display: 'flex', alignItems: 'center', justifyContent: 'center', }}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
}
/*UNCONFIRMED("待确认"), UNPAY("未付款"), UNFINANCECONFIRMED("待财务确认"), UNSEND("未发货"),  ALLSEND("已发货"), COMPLETE("完成"), APPLYREFUND("申请退货"),REFUND("已退货"),CLOSE("已关闭");*/
class MyOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs:[
                { title: '待确认',value:"UNCONFIRMED" },
                { title: '财务确认',value:"UNFINANCECONFIRMED" },
                { title: '未发货',value:"UNSEND" },
                { title: '已发货',value:"ALLSEND" },
                { title: '完成',value:"COMPLETE" },
            ],
            data:[],
        };
        this.changeType = this.changeType.bind(this)
    };
    componentDidMount(){
        axios.get(`${API}/base/order/findAllAppOrderModel`,{
            params:{status:"UNCONFIRMED"}
        }).then(response=>{
            let res = response.data;
            console.log(res);
            this.setState({
                data:res
            });
        })
    }
    changeType(tab,index){
        axios.get(`${API}/base/order/findAllAppOrderModel`,{
            params:{status:tab.value}
        }).then(response=>{
            let res = response.data;
            this.setState({
                data:res
            });
        });
    }

    render() {
        return (
            <div className="my-order">
                <div className="my-order-header">
                    <div className="my-order-header-inner">
                        <NavBar
                            mode="dark"
                        >我的订单</NavBar>

                    </div>
                </div>
                <div className="my-order-body">
                    <StickyContainer>
                        <Tabs tabs={this.state.tabs}
                              onChange={this.changeType}
                              renderTabBar={renderTabBar}
                        >
                            {
                                this.state.tabs?
                                    this.state.tabs.map(v=>
                                        <div key={v.value}>
                                            {
                                                this.state.data.length===0?
                                                    ""
                                                    :
                                                this.state.data?
                                                    this.state.data.map(v=>(
                                                        <Item arrow="horizontal"key={v.orderId} multipleLine onClick={() => {this.props.history.push(`${HOST}/myOrder/myOrderDetail/${v.orderId}`)}} extra={v.customerType}>
                                                            <div className="name">
                                                                <span>订单号：{v.orderNo}</span>
                                                                <span className="total-price">¥{v.totalGoodsPrice}</span>
                                                            </div>
                                                            <Brief>
                                                                <div className="brief">
                                                                    <span>{v.createTime}</span>
                                                                </div>
                                                            </Brief>
                                                        </Item>

                                                    )):
                                                    ""
                                            }
                                        </div>
                                    )
                                    :
                                    ""
                            }

                        </Tabs>
                    </StickyContainer>
                </div>
            </div>
        )
    }
}

export default MyOrder