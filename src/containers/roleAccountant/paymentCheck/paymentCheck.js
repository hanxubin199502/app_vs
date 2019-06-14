import React, {Component} from 'react';
import {NavBar,List,Tabs} from "antd-mobile"
import "./paymentCheck.less";
import axios from "axios";
import { StickyContainer, Sticky } from 'react-sticky';
import {HOST,API} from "../../../const/host";
const Item = List.Item;
const Brief = Item.Brief;

function renderTabBar(props) {
    return (<Sticky  topOffset={-45}>
        {({ style }) => <div style={{ ...style,top:45,zIndex: 1,display: 'flex', alignItems: 'center', justifyContent: 'center', }}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
}

class PaymentCheck extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs:[
                { title: '待确认',value:"UNFINANCECONFIRMED" },
                { title: '未发货',value:"UNSEND" },
                { title: '已发货',value:"ALLSEND" },
                { title: '完成',value:"COMPLETE" },
            ],
            data:[]
        };
        this.changeType = this.changeType.bind(this)
    };
    componentDidMount(){
        axios.get(`${API}/base/order/findAllAppOrderModel`,{
            params:{status:"UNFINANCECONFIRMED"}
        }).then(response=>{
            let res = response.data;
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
            <div className="payment-check">
                <div className="payment-check-header">
                    <div className="payment-check-header-fixed">
                        <NavBar
                            mode="dark"
                        >付款审核</NavBar>

                    </div>
                </div>
                <StickyContainer>
                    <Tabs tabs={this.state.tabs}
                          onChange={this.changeType}
                          renderTabBar={renderTabBar}
                    >
                        {
                            this.state.tabs.map(v=>
                                <div key={v.value} className="payment-check-body">
                                    {
                                        this.state.data.length===0?
                                            ""
                                            :
                                            this.state.data?
                                                this.state.data.map(v=>(
                                                    <Item arrow="horizontal"key={v.orderId} multipleLine onClick={() => {this.props.history.push(`${HOST}/paymentOrderDetail/${v.orderId}`)}} extra={v.customerType}>
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
                        }

                    </Tabs>
                </StickyContainer>

            </div>
        )
    }
}

export default PaymentCheck