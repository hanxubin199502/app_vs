import React, {Component} from 'react';
import { NavBar, Icon,List,WingBlank,TextareaItem,Toast } from 'antd-mobile';
import axios from "axios/index";
import { Link } from 'react-router-dom';
import './visitDetail.less';
import {HOST,API} from "../../../../const/host";
//const API = "http://192.168.31.13:8080";
const Item = List.Item;
class VisitDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visitPlan:"",
            visitDetail:""
        };
        this.linkToPreview = this.linkToPreview.bind(this)
    };
    componentDidMount(){
        let id = this.props.match.params.id;
        axios.get(`${API}/base/visitPlan/updatePre`,{params:{id}}).then((response)=>{
            let res = response.data;
            console.log(res);
            this.setState({
                visitPlan:res
            })
        });
        axios.get(`${API}/base/visitRecord/findAll`,{params:{id}}).then((response)=>{
            let res = response.data;

            this.setState({
                visitDetail:res
            });

        })
    }
    customerStatus(status){
        switch(status){
            case "ZERO":
                return "未拜访";
                break;
            case "ONE":
                return "一次拜访";
                break;
            case "TWO":
                return "二次拜访";
                break;
            case "MORE":
                return "多次拜访";
                break;
            case "SUCCESS":
                return "签单";
                break;
            case "FAIL":
                return "弃单";
        }
    }
    planStatus(status){
        switch(status){
            case "UNEXECUTED":
                return "未执行";
                break;
            case "EXECUTING":
                return "执行中";
                break;
            case "SUCCESS":
                return "已完成";

        }
    }
    linkToPreview(i){
        if(!this.state.visitDetail[i].visitImgUrl){
            Toast.info("未上传凭证",1)
            return
        }
        let imgs = this.state.visitDetail[i].visitImgUrl.split(",");
        sessionStorage.setItem("preview",JSON.stringify(imgs));
        sessionStorage.setItem("backTo",this.props.match.url);
        this.props.history.push(`${HOST}/previewImg`)
    }

    render() {
        return (
            <div className="add-visit">
                <div className="add-plan">
                    <NavBar
                        mode="dark"
                        icon={<Icon type="left" />}
                        onLeftClick={() => {this.props.history.push(`../index/visitPlan`)}}
                        rightContent={
                            <Link to={`${HOST}/addVisitRecord/${this.props.match.params.id}`} style={{color:"white"}}>
                                <Icon key="1" type="" />新增
                            </Link>
                        }
                    >拜访计划详情</NavBar>
                </div>
                <div className="plan">
                    <div className="title">
                        <WingBlank>
                            拜访计划
                        </WingBlank>
                    </div>
                    <List>
                        <Item extra={this.state.visitPlan.customerName}>客户名称</Item>
                        <Item extra={this.state.visitPlan.salesAccount}>所属销售人员账户</Item>
                        <Item extra={this.state.visitPlan.date}>计划拜访时间</Item>
                        <Item extra={this.planStatus(this.state.visitPlan.status)}>计划状态</Item>
                        <TextareaItem value={this.state.visitPlan.objective} editable={false} title="计划内容" rows={3}/>

                    </List>
                </div>
                <div className="record">
                    <div className="title">
                        <WingBlank>
                            拜访记录
                        </WingBlank>
                    </div>
                    {
                        this.state.visitDetail?
                            this.state.visitDetail.map((v,i)=>
                                <List key={i} style={{marginBottom:3}}>
                                    <Item extra={this.customerStatus(v.status)}>客户状态</Item>
                                    <Item extra={v.userName}>所属销售人员账户</Item>
                                    <Item extra={v.visitTime}>拜访时间</Item>
                                    <Item arrow="horizontal" onClick={()=>{this.linkToPreview(i)}} >拜访图片</Item>
                                    <TextareaItem value={v.reachContent} rows={3} title="拜访成果" editable={false}/>
                                </List>
                            )
                            :
                            ""
                    }

                </div>



            </div>
        )
    }
}

export default VisitDetail