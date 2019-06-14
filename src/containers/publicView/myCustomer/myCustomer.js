import React,{Component} from "react";
import {NavBar,List ,Tabs } from "antd-mobile";
import { StickyContainer, Sticky } from 'react-sticky';
import {HOST,API} from "../../../const/host";
import axios from "axios"
import "./myCustomer.less";
//const API = "http://192.168.31.13:8080"
const Item = List.Item;
const Brief = Item.Brief;
function renderTabBar(props) {
    return (<Sticky topOffset={-45}>
        {({ style }) => <div style={{ ...style,top:45,zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
}
class MyCustomer extends Component{
    constructor(props){
        super(props);
        this.state={
            tabs:[
                { title: '意向客户' },
                { title: '成交客户' },
            ],
            data:"",

        };
        this.changeType = this.changeType.bind(this)

    }
    componentDidMount(){
        axios.post(`${API}/base/customer/appFindAll`,{customerName:"",status:"随便"}).then(response=>{
            let res = response.data;
            this.setState({
                data:res
            })
            console.log(res);
        })
    }
    changeType(val){
        let status="";
        switch(val.title){
            case "意向客户":
                status="suibian";
                break;
            case "成交客户":
                status="SUCCESS";
                break;
        }
        axios.post(`${API}/base/customer/appFindAll`,{customerName:"",status}).then(response=>{
            let res = response.data;
            console.log(res);
            this.setState({
                data:res
            },()=>{
                //console.log(this.state.data);
            })
        });


    }
    render(){
        return(
            <div className="my-customer">

                <div className="my-customer-header">
                    <div className="my-customer-header-inner">
                        <NavBar
                            mode="dark"
                            rightContent={<div onClick={()=>{this.props.history.push(`${HOST}/myCustomer/newCustomer`)}}>新增</div>}
                        >我的客户</NavBar>
                    </div>

                </div>
                <div className="my-customer-body">
                    <StickyContainer>
                        <Tabs tabs={this.state.tabs}
                              onChange={this.changeType}
                              renderTabBar={renderTabBar}
                        >{
                            this.state.data?

                                    <div className="customer-wrapper">
                                        <List>
                                            {
                                                this.state.data.map(v=>(
                                                    <Item arrow="horizontal"  key={v.id} multipleLine onClick={() => {this.props.history.push(`${HOST}/myCustomer/customerDetail/${v.id}`)}} extra={v.customerType}>
                                                        <div className="name">
                                                            <span>{v.customerName}</span>
                                                            <span>({v.status})</span>
                                                        </div>
                                                        <Brief>{v.mobilePhone}</Brief>
                                                    </Item>

                                                ))
                                            }

                                        </List>
                                    </div>


                                :
                                ""
                        }

                        </Tabs>
                    </StickyContainer>
                </div>
            <div>

            </div>
            </div>

        )
    }
}
export default MyCustomer