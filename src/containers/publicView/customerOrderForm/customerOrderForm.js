import React, {Component} from 'react';
import { NavBar,Icon, WingBlank,List,Tabs, WhiteSpace  } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';
import { Link } from 'react-router-dom';
import { HOST } from '../../../const/host';
const Item = List.Item;
//tab内容
function renderTabBar(props) {
    return (<Sticky>
        {({ style }) => <div style={{ ...style, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
}
//销售tabs
const saleTabs = [
    { title: '待确认',status:"UNCONFIRMED" },
    { title: '财务确认',status:"UNFINANCECONFIRMED" },
    { title: '未发货',status:"UNSEND" },
    { title: '已发货',status:"ALLSEND" },
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
const tab = sessionStorage.getItem("roleSymbol") === "2"?saleTabs:branchTabs;
class CustomerOrderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    };

    render() {
        return (
            <div className="customer-order-form">
                <div className="header">
                    <NavBar
                        mode="dark"
                        leftContent={
                            <Link to={`${HOST}/search`}>
                                <Icon key="0" type="search" style={{ marginRight: '16px' }} />
                            </Link>
                            }
                        rightContent={<Icon key="1" type="ellipsis" />}

                    >客户订单</NavBar>
                </div>
                <div className="icon-orderForm-body">
                    {/*tab导航*/}
                    <StickyContainer>
                        <Tabs tabs={tab}
                              initalPage={'t2'}
                              renderTabBar={renderTabBar}
                        >
                            {
                                tab.map(v=>(
                                    <div key={v.status}>

                                    </div>
                                    )
                                )
                            }
                        </Tabs>
                    </StickyContainer>
                    <WingBlank>

                    </WingBlank>
                </div>
            </div>
        )
    }
}
export default CustomerOrderForm