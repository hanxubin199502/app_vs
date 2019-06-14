import React, {Component} from 'react';
import { HOST } from '../../const/host'
import { Button } from 'antd-mobile';
import { connect } from 'react-redux';
import { add,sub } from './container.redux';
import { Switch,Route } from 'react-router-dom';
import NavLinkBar from '../../components/nav-link-bar/nav-link-bar'
//公共页面
import TeamManagement from '../publicView/teamManagement/teamManagement'//团队管理
import CustomerOrderForm from '../publicView/customerOrderForm/customerOrderForm'//客户管理

//总管理员
import StockCheck from '../topManager/stockCheck/stockCheck';//库存查询
import TopUserCenter from '../topManager/topUserCenter/topUserCenter';//库存查询

//分公司（暂无单独页面）
import BranchUserCenter from '../branchManager/branchUserCenter/branchUserCenter'
//销售
import VisitPlan from '../publicView/visitPlan/visitPlan';//拜访计划
import MyCustomer from '../publicView/myCustomer/myCustomer'//客户管理

import orderManagement from '../publicView/orderManagement/orderManagement'//订单管理
import SalesUserCenter from '../roleSale/salesUserCenter/salesUserCenter'//用户中心
//分公司管理
import OrderManagement from '../publicView/orderManagement/orderManagement'//订单管理
import CustomerManagement from '../branchManager/customerManagement/customerManagement'//客户管理

//客户
import Purchase from '../roleCustomer/purchase/purchase';//商品采购
import MaterialApply from '../roleCustomer/materialApply/material';//物料申请
import PresentApply from '../roleCustomer/presentApply/presentApply';//赠品申请
import CustomerUserCenter from '../roleCustomer/customerUserCenter/customerUserCenter'//用户中心
import MyOrder from '../roleCustomer/myOrder/myOrder'//用户中心

//财务
import PaymentCheck from '../roleAccountant/paymentCheck/paymentCheck';//付款审核
import AccountantUserCenter from '../roleAccountant/accountantUserCenter/accountantUserCenter';//付款审核

//运营
import MaterialCheck from '../roleOperation/materialCheck/materialCheck'//物料审核
import PresentCheck from '../roleOperation/presentCheck/presentCheck'//赠品审核
import WarehouseUserCenter from '../roleOperation/warehouseUserCenter/warehouseUserCenter'//赠品审核
import SendManagement from '../roleOperation/sendManagement/sendManagement'//赠品审核
import './container.less';


class Container extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //总管理员
            topManager:[
                {
                    path:`${HOST}/index/team`,
                    name:`团队管理`,
                    icon:"icon-team",
                    component:TeamManagement
                },
                {
                    path:`${HOST}/index/customer`,
                    name:`客户管理`,
                    icon:"icon-customer",
                    component:CustomerManagement
                },
                {
                    path:`${HOST}/index/stockCheck`,
                    name:`库存查询`,
                    icon:"icon-stockCheck",
                    component:StockCheck
                },
                {
                    path:`${HOST}/index/topUserCenter`,
                    name:`我的`,
                    icon:"icon-user",
                    component:TopUserCenter
                },

            ],
            //分公司管理员
            branchManager:[
                {
                    path:`${HOST}/index/myCustomer`,
                    name:`客户管理`,
                    icon:"icon-customer",
                    component:MyCustomer
                },
                {
                    path:`${HOST}/index/orderManagement`,
                    name:`订单管理`,
                    icon:"icon-orderForm",
                    component:OrderManagement
                },
                {
                    path:`${HOST}/index/visitPlan`,
                    name:`拜访计划`,
                    icon:"icon-visitPlan",
                    component:VisitPlan
                },

/*
                {
                    path:`${HOST}/index/customerOrderForm`,
                    name:`客户订单`,
                    icon:"icon-orderForm",
                    component:CustomerOrderForm
                },
                {
                    path:`${HOST}/index/customer`,
                    name:`客户管理`,
                    icon:"icon-customer",
                    component:CustomerManagement
                },
                {
                    path:`${HOST}/index/team`,
                    name:`团队管理`,
                    icon:"icon-team",
                    component:TeamManagement
                },
*/
                {
                    path:`${HOST}/index/branchUserCenter`,
                    name:`我的`,
                    icon:"icon-user",
                    component:BranchUserCenter
                },

            ],
            //销售角色
            roleSale:[
                {
                    path:`${HOST}/index/myCustomer`,
                    name:`我的客户`,
                    icon:"icon-customer",
                    component:MyCustomer
                },
                {
                    path:`${HOST}/index/orderManagement`,
                    name:`订单管理`,
                    icon:"icon-orderForm",
                    component:OrderManagement
                },
                {
                    path:`${HOST}/index/visitPlan`,
                    name:`拜访计划`,
                    icon:"icon-visitPlan",
                    component:VisitPlan
                },
                {
                    path:`${HOST}/index/salesUserCenter`,
                    name:`我的`,
                    icon:"icon-user",
                    component:SalesUserCenter
                },

            ],
            //客户
            roleCustomer:[
                {
                    path:`${HOST}/index/purchase`,
                    name:`商品采购`,
                    icon:"icon-purchase",
                    component:Purchase
                },
                {
                    path:`${HOST}/index/myOrder`,
                    name:`我的订单`,
                    icon:"icon-material",
                    component:MyOrder
                },
/*                {
                    path:`${HOST}/index/materialApply`,
                    name:`物料申请`,
                    icon:"icon-material",
                    component:MaterialApply
                },
                {
                    path:`${HOST}/index/presentApply`,
                    name:`赠品申请`,
                    icon:"icon-gift",
                    component:PresentApply
                },*/
                {
                    path:`${HOST}/index/customerUserCenter`,
                    name:`我的`,
                    icon:"icon-user",
                    component:CustomerUserCenter
                },

            ],
            //财务
            roleAccountant:[
                {
                    path:`${HOST}/index/paymentCheck`,
                    name:`付款审核`,
                    icon:"icon-payCheck",
                    component:PaymentCheck
                },
                {
                    path:`${HOST}/index/accountantUserCenter`,
                    name:`我的`,
                    icon:"icon-user",
                    component:AccountantUserCenter
                },

            ],
            //运营
            roleOperation:[
/*
                {
                    path:`${HOST}/index/materialCheck`,
                    name:`发货管理`,
                    icon:"icon-stockCheck",
                    component:MaterialCheck
                },
                {
                    path:`${HOST}/index/presentCheck`,
                    name:`赠品审核`,
                    icon:"icon-gift",
                    component:PresentCheck
                },
*/
                {
                    path:`${HOST}/index/sendManagement`,
                    name:`发货管理`,
                    icon:"icon-stockCheck",
                    component:SendManagement
                },
                {
                    path:`${HOST}/index/wareHouseUserCenter`,
                    name:`我的`,
                    icon:"icon-user",
                    component:WarehouseUserCenter
                },

            ],
            //路由注册
            routes:[
                {
                   path:`${HOST}/index/team`,
                   component:TeamManagement
                },
                {
                   path:`${HOST}/index/customer`,
                   component:CustomerManagement
                },
                {
                   path:`${HOST}/index/stockCheck`,
                   component:StockCheck
                },
                {
                   path:`${HOST}/index/salesUserCenter`,
                   component:SalesUserCenter
                },
                {
                   path:`${HOST}/index/wareHouseUserCenter`,
                   component:WarehouseUserCenter
                },
                {
                   path:`${HOST}/index/customerUserCenter`,
                   component:CustomerUserCenter
                },
                {
                   path:`${HOST}/index/topUserCenter`,
                   component:TopUserCenter
                },
                {
                   path:`${HOST}/index/branchUserCenter`,
                   component:BranchUserCenter
                },
                {
                   path:`${HOST}/index/accountantUserCenter`,
                   component:AccountantUserCenter
                },


                {
                   path:`${HOST}/index/customerOrderForm`,
                   component:CustomerOrderForm
                },
                {
                   path:`${HOST}/index/visitPlan`,//拜访计划
                   component:VisitPlan
                },
                {
                   path:`${HOST}/index/purchase`,//商品采购
                   component:Purchase
                },
                {
                    path:`${HOST}/index/myOrder`,//我的订单
                    component:MyOrder
                },
                {
                   path:`${HOST}/index/materialApply`,
                   component:MaterialApply
                },
                {
                   path:`${HOST}/index/presentApply`,
                   component:PresentApply
                },
                {
                   path:`${HOST}/index/presentApply`,
                   component:PresentApply
                },
                {
                   path:`${HOST}/index/paymentCheck`,
                   component:PaymentCheck
                },
                {
                   path:`${HOST}/index/materialCheck`,
                   component:MaterialCheck
                },
                {
                   path:`${HOST}/index/presentCheck`,
                   component:PresentCheck
                },
                {
                    path:`${HOST}/index/myCustomer`,
                    component:MyCustomer
                },
                {
                    path:`${HOST}/index/orderManagement`,

                    component:orderManagement
                },

                //发货管理
                {
                    path:`${HOST}/index/sendManagement`,
                    component:SendManagement
                },

            ]
        };
    };
    componentDidMount(){

    }
    roleMenu(){
        if(JSON.parse(sessionStorage.getItem('user'))){
            let roleCode = JSON.parse(sessionStorage.getItem('user')).roleCode;
            switch (roleCode){
                case "admin":
                    return this.state.topManager;
                case "subadmin":
                    return this.state.branchManager;
                case "sales":
                    return this.state.roleSale;
                case "customer":
                    return this.state.roleCustomer;
                case "finance":
                    return this.state.roleAccountant;
                case "wareHouse":
                    return this.state.roleOperation;
            }

        }else{
            return false
        }

    };

    render() {
        return (
            <div>
                <Switch>
                    {
                        this.state.routes.map(v=>(
                            <Route path={v.path} key={v.path} component={v.component}/>
                            )
                        )
                    }
                </Switch>
                {
                    this.roleMenu()?
                        <NavLinkBar data={this.roleMenu()}/>
                        :
                        ""
                }

            </div>
        )
    }
}

export default Container