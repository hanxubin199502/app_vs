import React, {Component} from 'react';
import { NavBar,Icon, WingBlank,List,Tabs, WhiteSpace ,Flex } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import { Link } from 'react-router-dom';
import { HOST,API } from '../../../const/host';
import axios from "axios"
import "./orderManagement.less"
const Item = List.Item;
const Brief = Item.Brief;
//tab内容
function renderTabBar(props) {
    return (<Sticky topOffset={-45}>
        {({ style }) => <div style={{ ...style, top:45, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
}
//销售tabs
const saleTabs = [
    { title: '待确认',status:"UNCONFIRMED" },
    { title: '财务确认',status:"UNFINANCECONFIRMED" },
    { title: '待发货',status:"UNSEND" },
    { title: '待收货',status:"ALLSEND" },
    { title: '完成',status:"COMPLETE" },
];
//分公司管理员tabs
const branchTabs = [
    { title: '全部',status:"UNCONFIRMED" },
    { title: '财务确认',status:"UNFINANCECONFIRMED" },
    { title: '未发货',status:"UNSEND" },
    { title: '已发货',status:"ALLSEND" },
    { title: '完成',status:"COMPLETE" },
];

const tab = sessionStorage.getItem("roleSymbol") === "sales"?branchTabs:saleTabs;

//const API="http://192.168.31.168:8080"
class OrderManagement extends Component {

    constructor(props) {
        super(props);
        this.state = {
           list:"",
           status:"UNCONFIRMED"
        };
        this.orderTab=this.orderTab.bind(this);
    };
    componentDidMount(){
        /*
        list列表数据
        * */
        axios.get(`${API}/base/order/findAllAppOrderModel`,{params:{status:this.state.status}}).then(response=>{
            console.log(response)
            let res=response.data;
            this.setState({list:res})
        })

    }
    orderTab(tab){
        this.setState({
            status:tab.status
        });
        axios.get(`${API}/base/order/findAllAppOrderModel`,{params:{status:tab['status']}}).then(response=>{
            let res=response.data;
            this.setState({list:res})
        })
    }
    componentWillUnmount(){
        sessionStorage.setItem("backTo",this.props.match.url)
    }
    render() {
        return (
            <div className="customer-order-form">
                <div className="header nav">
                    <NavBar
                        mode="dark"
                        leftContent={
                            <Link to={`${HOST}/orderManagement/search`}>
                                <Icon  type="search" style={{ marginRight: '16px' ,color:"#fff"}} />
                            </Link>

                        }
                        rightContent={
                                <Link key="0" to={`${HOST}/orderManagement/search`}>
                                    <Icon  type="search" style={{ marginRight: '16px' ,color:"#fff"}} />
                                </Link>,
                                <Link key="1" to={`${HOST}/orderManagement/add`}>
                                    <div style={{color:"#fff"}}>新增</div>
                                </Link>
                        }
                    >客户订单</NavBar>
                </div>
                <div className="icon-orderForm-body">
                    <div className={"nav-empty"}>.</div>
                    {/*tab导航*/}
                    <StickyContainer>
                        <Tabs tabs={tab}
                              initalPage={'t2'}
                              renderTabBar={renderTabBar}
                              onChange={(tab)=>{
                                  this.orderTab(tab)
                              }}
                        >
                            {
                                tab.map(v=>(
                                    <div key={v.status}>
                                        <div>
                                            {/*列表循环*/}
                                            {
                                                this.state.list?
                                                    this.state.list.map(v=>(
                                                        <List
                                                            key={v.orderId}
                                                            onClick={()=>{

                                                            }}
                                                            className="my-list">
                                                            <Item
                                                                multipleLine
                                                                onClick={() => {}}
                                                                platform="android"
                                                                className="order-list"
                                                            >
                                                                {v.orderNo} {v.customerName}
                                                                <Brief>{v.status}</Brief>
                                                                <Flex justify="end">

                                                                    {
                                                                        this.state.status === "ALLSEND" || this.state.status === "COMPLETE"?
                                                                            <Link to={ `${HOST}/logistics/${v.orderId}`} className="option">
                                                                                <div className="button">
                                                                                    查看物流
                                                                                </div>
                                                                            </Link>
                                                                            :
                                                                            ""
                                                                    }
                                                                    <Link  to={ `${HOST}/orderManagement/details/${v.orderId}`} className="option">
                                                                        <div className="button">
                                                                            查看详情
                                                                        </div>
                                                                    </Link>
                                                                </Flex>

                                                            </Item>
                                                        </List>
                                                    )):""
                                            }
                                        </div>
                                    </div>
                                    )
                                )
                            }
                        </Tabs>
                    </StickyContainer>

                </div>
            </div>
        )
    }
}
export default OrderManagement