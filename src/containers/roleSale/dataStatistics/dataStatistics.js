import React, {Component} from 'react';
import "./dataStatistics.less";
import { NavBar,Icon ,DatePicker, List , Tabs, WhiteSpace, Badge,Flex} from "antd-mobile";
import axios from 'axios';
import { API,HOST } from '../../../const/host';


const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const Item = List.Item;

const user=sessionStorage.getItem('user')





const tabs2 = [
    { title: '商品',type:"productType" ,sub: '1' },
    { title: '门店',type:"customerType" ,sub: '2' },
    { title: '所有',type:"customerType" ,sub: '3' },
];


class TaBle1 extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data:this.props.data
        };
    };
    render(){
        return(
            <table>
                <thead>
                <tr>
                    <th>门店</th>
                    <th>商品</th>
                    <th>数量</th>
                    <th>金额</th>
                    <th>回款</th>
                    <th>未回款</th>
                    {
                        /*switch (user.roleCode) {
                            case "sales":
                               break;
                        }*/
                        /*<th>销售员</th>
                                 <th>分公司</th>*/
                    }


                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>门店</td>
                    <td>商品</td>
                    <td>数量</td>
                    <td>金额</td>
                    <td>回款</td>
                    <td>未回款</td>
                    {
                        /*switch (user.roleCode) {
                            case "sales":
                               break;
                        }*/
                        /*<th>销售员</th>
                                 <th>分公司</th>*/
                    }
                </tr>
                </tbody>
            </table>
        )
    }
}

class shpin extends Component{
    constructor(props){
        super(props);
        this.state={
            data:this.props.data
        }
    }
    render(){
        return(
            <table>
                <thead>
                <tr>
                    <th>商品</th>
                    <th>数量</th>
                    <th>金额</th>
                    <th>回款</th>
                    <th>未回款</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>商品</td>
                    <td>数量</td>
                    <td>金额</td>
                    <td>回款</td>
                    <td>未回款</td>
                </tr>
                </tbody>
            </table>
        )
    }
}

/*
class TaBle1 extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data:this.props.data
        };
    };
    render(){
        return(
            <table>
                <thead>
                <tr>
                    <th>商品</th>
                    <th>数量</th>
                    <th>金额</th>
                    <th>回款</th>
                    <th>未回款</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>商品</td>
                    <td>数量</td>
                    <td>金额</td>
                    <td>回款</td>
                    <td>未回款</td>
                </tr>
                </tbody>
            </table>
        )
    }
}
*/

const api="http://192.168.31.34:8080";

class DataStatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTime:now,
            endTime:now,
            status:"",
            list:""
        };
        this.TabClick=this.TabClick.bind(this)
        this.searchClick=this.searchClick.bind(this)
        this.endClick=this.endClick.bind(this)
    };
    componentDidMount(){
        let params={
            customerType:"",
            productType:"productType",
            searchTime:"2018-3",
            endTime:"2018-4"
        }
        /*
        * let params={
            status:this.state.status,
            searchTime:this.state.searchTime,
            endTime:this.state.endTime
        }*/
       axios.post(`${api}/base/salesData/findAllSalesData`,params).then(response=>{
           console.log(response)
       })
    }
    componentWillUnmount(){

    }
    TabClick(tab,index){
        this.setState({status:tab.type})
    }
    searchClick(date){
        let sdate=new Date(date);
        let dateTime = sdate.getFullYear()+'-'+(Number(sdate.getMonth())+1);
        console.log(dateTime)
        this.setState({searchTime:dateTime})
    }
    endClick(date){
        this.setState({endTime:date})
        let dat =  this.state.date;
        let Date = date.getFullYear()+'-'+(Number(date.getMonth())+1);
        console.log(Date)
    }

    render() {
        return (
            <div className="data-statistics">
                <div className="data-statistics-header">
                    <NavBar
                        mode="dark"
                        icon={<Icon type="left"/>}
                        onLeftClick={()=>{
                            this.props.history.push(`${HOST}/index/salesUserCenter`)
                        }}
                    >
                        数据统计
                    </NavBar>
                </div>
                <List className="date-picker-list" style={{ backgroundColor: 'white' }}>
                    <DatePicker
                        mode="month"
                        title="Select Date"
                        extra="Optional"
                        value={this.state.searchTime}
                        onOk={this.searchClick}
                    >
                        <List.Item arrow="horizontal">起始月初</List.Item>
                    </DatePicker>
                    <DatePicker
                        mode="month"
                        title="Select Date"
                        extra="Optional"
                        value={this.state.endTime}
                        onOk={this.endClick}
                    >
                        <List.Item arrow="horizontal">结束月初</List.Item>
                    </DatePicker>
                </List>
                <div>
                    <Tabs tabs={tabs2}
                          onTabClick={this.TabClick}
                    >
                    </Tabs>
                </div>
                <div className="tabList">
                    <table>
                        <thead>
                        <tr>
                            <th>商品</th>
                            <th>数量</th>
                            <th>金额</th>
                            <th>回款</th>
                            <th>未回款</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>商品</td>
                            <td>数量</td>
                            <td>金额</td>
                            <td>回款</td>
                            <td>未回款</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default DataStatistics