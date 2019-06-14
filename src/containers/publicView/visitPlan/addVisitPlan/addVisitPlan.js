import React, {Component} from 'react';
import { NavBar, Icon, List, DatePicker ,Picker,TextareaItem,Toast} from 'antd-mobile';
import convertTime from "../../../../util/convertTime"
import './addVisitPlan.less';
import {HOST,API} from "../../../../const/host";
import axios from "axios/index";
//const API = "http://192.168.31.13:8080";
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
let time = convertTime(now.getTime());
class AddVisitPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date:now,
            content:"",
            cuntomer: [],
            status:[
                {
                    label:"一次拜访",
                    value:"ONE"
                },
                {
                    label:"二次拜访",
                    value:"TWO"
                },
                {
                    label:"多次拜访",
                    value:"MORE"
                },
                {
                    label:"签单",
                    value:"SUCCESS"
                },
                {
                    label:"弃单",
                    value:"FAIL"
                }
            ],
            statusName:"",
            statusId:"",
            customerName:"",
            customerId:"",
            objective:""
        };

        this.onOk = this.onOk.bind(this);
        this.cuntomerOk = this.cuntomerOk.bind(this);
        this.submit = this.submit.bind(this);
        this.setTime = this.setTime.bind(this);
    };
    componentDidMount() {

        axios.post(`${API}/base/customer/appFindAll`, {customerName:"", status: ""}).then((response) => {
            console.log(response.data)
            let res = response.data;
            res.forEach(v => {
                this.state.cuntomer.push({
                    label: v.customerName,
                    value: v.id
                })
            });
            this.setState({
                content: res
            })
        })

    }

    onOk(result){

        this.setState({
            cascaderShow:false,
            selectedData:result
        });

        let resultData = "";
        result.forEach((v,i)=>{
            resultData += i === 1?`/${v.name}/`:v.name
        });
        this.setState({
            area:resultData
        })


    }
    cuntomerOk(val){

        this.state.cuntomer.find((v,i)=>{
            if(val[0] === v.value){
                console.log(v.value)
                this.setState({
                    cuntomerName:v.label,
                    customerId:v.value

                })
            }
        })
    }
    statusOk(val){
            this.state.status.find((v,i)=>{
                if(val[0] === v.value){
                    console.log(v.value)
                    this.setState({
                        statusName:v.label,
                        statusId:v.value
                    })
                }
            })
    }
    setTime(v){
        this.setState({ date:v })
        time = convertTime(v.getTime())
    }
    submit(){
        if(this.state.customerId===""||this.state.statusId===""||this.state.objective===""){
            Toast.info("请检查内容是否填写正确")
        }
        let submitData = {
            customerId:this.state.customerId,
            customerStatusEnum:this.state.statusId,
            date:time,
            objective:this.state.objective
        };
        axios.post(`${API}/base/visitPlan/add`,{...submitData}).then(response=>{
            let res = response.data;
            if(res.result){
                Toast.success(res.msg,1);
                this.props.history.push(`${HOST}/index/visitPlan`)
                setTimeout(()=>{

                },1000)
            }else{
                Toast.fail(res.msg,1);
            }
        })
        console.log(submitData)
    }

    render() {
        return (
            <div>
                <div className="add-visit">
                    <div className="add-plan">
                        <NavBar
                            mode="dark"
                            icon={<Icon type="left" />}
                            onLeftClick={() => {this.props.history.push(`../index/visitPlan`)}}

                            rightContent={<div onClick={()=>{this.submit()}}>完成</div>}
                        >添加拜访计划</NavBar>
                    </div>
                    <div className="add-visit-body">
                        <div className="state-sides">
                            <div>
                                <List  className="date-picker-list" >
                                    <Picker data={this.state.cuntomer} extra={this.state.cuntomerName} cols={1} onOk={(v)=>{this.cuntomerOk(v)}}>
                                        <List.Item arrow="horizontal">客户名称</List.Item>
                                    </Picker>
                                    <DatePicker
                                        value={this.state.date}
                                        onChange={v => {this.setTime(v)}}
                                    >
                                        <List.Item arrow="horizontal" >计划时间</List.Item>
                                    </DatePicker>
                                    <Picker data={this.state.status} extra={this.state.statusName} cols={1} onOk={(v)=>{this.statusOk(v)}}>
                                        <List.Item arrow="horizontal">客户状态</List.Item>
                                    </Picker>
                                    <TextareaItem
                                        title="计划内容"
                                          rows={3}
                                          value={this.state.objective}
                                        placeholder="计划拜访内容"
                                        onChange={(val)=>{
                                            this.setState({
                                                objective:val
                                            })
                                        }}
                                    />
                                </List>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default AddVisitPlan