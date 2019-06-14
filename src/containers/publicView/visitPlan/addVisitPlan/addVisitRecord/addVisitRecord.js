import React, {Component} from 'react';
import { NavBar,Icon,Picker,List,DatePicker,TextareaItem,Button,Toast,ImagePicker,WingBlank} from 'antd-mobile';
import axios from "axios/index";
// import { Link } from 'react-router-dom';
import {HOST,API} from "../../../../../const/host";
import './addVisitRecord.less';
import convertTime from "../../../../../util/convertTime";

//const API = "http://192.168.31.13:8080";
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
let time = convertTime(now.getTime());
class AddVisitRecord extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date:now,
            content:"",
            status:[
                {
                    label:"未拜访",
                    value:"ZERO"
                },
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
            customerId:"",
            visitRecord:"",
            reachContent:"",
            files:[],
            imgUrl:[],
        };
        this.onOk = this.onOk.bind(this);
        this.submit = this.submit.bind(this);
        this.setTime = this.setTime.bind(this);
        this.setValue = this.setValue.bind(this);
    };
    componentDidMount() {
        console.log(this.props.match.params.id)
        let id = this.props.match.params.id;
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
    statusOk(val){
        this.state.status.find((v,i)=>{
            if(val[0] === v.value){
                console.log(v.value)
                this.setState({
                    statusName:v.label,
                    statusId:v.value,
                })
            }
        })
    }
    setTime(v){
        this.setState({ date:v })
        time = convertTime(v.getTime())
    }
    submit(){
        if(this.state.statusId === ""){
            Toast.info("请选择客户状态",1)
            return
        }else if(this.state.reachContent === ""){
            Toast.info("请填写拜访内容",1)
            return
        }else if(this.state.imgUrl.length === 0){
            Toast.info("请上传拜访图片",1)
            return

        }
        let submitData = {
            planId:this.props.match.params.id,
            status:this.state.statusId,
            reachContent:this.state.reachContent,
            visitTime:time,
            visitImgUrl:this.state.imgUrl.join(",")
        };
        console.log(submitData);
        axios.post(`${API}/base/visitRecord/add`,submitData).then(response=>{
            let res = response.data;
            console.log(res);
            if(res.result){

                Toast.success(res.msg,1);
                setTimeout(()=>{
                    this.props.history.push(`${HOST}/visitDetail/${this.props.match.params.id}`)
                },1000)
            }else{
                Toast.fail(res.msg,1);
            }
        })
    }
    //上传图片
    onChange = (files) => {
        let formData = new FormData();
        formData.append("file",files[files.length-1].file,files[files.length-1].name);
        let config={
            headers: {'Content-Type': 'multipart/form-data'}
        };
        axios.post(`${API}/base/attachment/upload/signal/uploadImg`,formData,config).then(response=>{
            let res = response.data;
            if(res.result){
                this.state.imgUrl.push(res.data)
                this.setState({files});
            }else{
                Toast.fail(res.msg,1)
            }
        });
    }
    setValue(value){
        this.setState({
            reachContent:value
        })
    }
    render() {
        return (
            <div className="add-record">
                <div className="add-record-title">
                    <NavBar
                        mode="dark"
                        icon={<Icon type="left" />}
                        onLeftClick={() => {this.props.history.push(`${HOST}/visitDetail/${this.props.match.params.id}`)}}

                    >新增加拜访记录</NavBar>
                </div>
                <div className="add-record-body">
                    <div>
                        <DatePicker
                            value={this.state.date}
                            onChange={v => {this.setTime(v)}}
                        >
                            <List.Item arrow="horizontal" >拜访时间:</List.Item>
                        </DatePicker>
                        <Picker data={this.state.status} extra={this.state.statusName} cols={1} onOk={(v)=>{this.statusOk(v)}}>
                            <List.Item arrow="horizontal">客户状态:</List.Item>
                        </Picker>
                        <TextareaItem
                            title="拜访成果:"
                            placeholder="请输入拜访成果"
                            data-seed="logId"
                            value={this.state.reachContent}
                            rows={3}
                            onChange={value=>this.setValue(value)}
                        />
                        <div className="upload">
                            <WingBlank>
                                <div className="upload-title">上传拜访场景(最多3张)</div>
                                <ImagePicker
                                    files={this.state.files}
                                    onChange={this.onChange}
                                    onImageClick={(index, fs) => console.log(index, fs)}
                                    selectable={this.state.files.length < 3}
                                    multiple={true}
                                />
                            </WingBlank>
                        </div>
                        <div className="submit-btn">
                            <WingBlank>
                                <Button type="primary" onClick={this.submit}>保存拜访记录</Button>
                            </WingBlank>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default AddVisitRecord