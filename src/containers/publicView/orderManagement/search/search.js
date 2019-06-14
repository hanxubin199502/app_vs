import React, {Component} from 'react';
import { NavBar, Icon ,WingBlank,List,InputItem,Flex} from 'antd-mobile';
import { Link } from 'react-router-dom';
import axios from "axios"
import {HOST} from "../../../../const/host";
import "./search.less"

const Item = List.Item;
const Brief = Item.Brief;
const API="http://192.168.31.34:8080"

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list:[],
            value:"请输入"
        };
        this.handleChange=this.handleChange.bind(this);
    };
    componentDidMount(){
        /*列表数据*/
        axios.get(`${API}/base/order/findAllAppOrderModel`,{params:{status:this.state.status}}).then(response=>{
            console.log(response)
            let res=response.data;
            this.setState({list:res})
        })
    }
    handleChange(v){
        axios.get(`${API}/base/order/findAllCondition`,{params:{search:v}}).then(response=>{
            // console.log(response)
            if(response.data.length!==0){
                let res=response.data;
                console.log(res)
                 this.setState({list:res})
            }
        })

    }
    componentWillUnmount(){
        sessionStorage.setItem("backTo",this.props.match.url)
    }
    render() {
        return (
            <div>
                <div className={"nav-empty"}>.</div>
                <div className={"nav"}>
                    <NavBar
                        mode="light"
                        leftContent={
                            <Link to={`${HOST}/index/orderManagement`}>
                                <Icon type="left" style={{ marginRight: '16px' ,color:"#fff"}} />
                            </Link>
                        }
                        rightContent={
                            <Icon  type="search" style={{ marginRight: '16px' ,color:"#fff"}} />
                        }
                    >搜索</NavBar>
                </div>
                <div className="icon-orderForm-body">
                        <div className="my-list">
                                <InputItem
                                    placeholder="请输入搜索字段"
                                    onBlur={this.handleChange}
                                >
                                </InputItem>
                        </div>
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
                                            <Brief>{v.address} {v.status}</Brief>
                                            <Flex justify="end">
                                                <Link to={ `${HOST}/logistics/${v.orderId}`}>
                                                    <Flex.Item className="button">
                                                        查看物流
                                                    </Flex.Item>
                                                </Link>
                                                <Link  to={ `${HOST}/orderManagement/details/${v.orderId}`}>
                                                    <Flex.Item className="button">
                                                        查看详情
                                                    </Flex.Item>
                                                </Link>
                                            </Flex>

                                        </Item>
                                    </List>
                                )):""
                        }
                </div>
            </div>
        )
    }
}
export default Search