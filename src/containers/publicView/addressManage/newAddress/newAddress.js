import React, {Component} from 'react';
import ReactCascader from "../../../../components/react-cascader/react-cascader";
import {NavBar,Icon,InputItem,Button,TextareaItem,WingBlank,Toast,Checkbox  } from "antd-mobile";

import axios from "axios";
import "./newAddress.less";
import {HOST} from "../../../../const/host";
const API = "http://192.168.31.222:8080";
const CheckboxItem = Checkbox.CheckboxItem;
class ComponentName extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cascaderShow:false,
            areaData:[],
            selectedData:[],
            area:"",
            isDefault:0,
            customerName:"",
            mobilePhone:"",
            address:""
        };
        this.showCascader = this.showCascader.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.done = this.done.bind(this)
        this.setDefault = this.setDefault.bind(this)
        this.setNameVal = this.setNameVal.bind(this)
        this.setPhoneVal = this.setPhoneVal.bind(this)
        this.setAddressVal = this.setAddressVal.bind(this)
    };

    componentDidMount(){
        axios.post(`${API}/base/area/province`).then(res=>{
            console.log(res.data);
            this.setState({
                areaData:res.data
            })
        })
    }

    showCascader(){
        this.setState({
            cascaderShow:true
        })
    }
    onCancel(){
        this.setState({
            cascaderShow:false
        })
    }
    getData(id){

        axios.get(`${API}/base/area/cityOrDistrict`,{
            params:{parentId:`${id}`}
        }).then(res=>{

            this.setState({
                    areaData:res.data
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
    setDefault(){
        if(this.state.isDefault === 0){
            this.setState({
                isDefault:1
            });
        }else{
            this.setState({
                isDefault:0
            });
        }

        console.log();
    }
    setNameVal(val){
       this.setState({
           customerName:val
       })
    }
    setPhoneVal(val){
        this.setState({
            mobilePhone:val
        })
    }
    setAddressVal(val){
        this.setState({
            address:val
        })
    }
    done(){
        let user = JSON.parse(sessionStorage.getItem("user"));
        let submitData = {
            customerName:this.state.customerName,
            mobilePhone:this.state.mobilePhone,
            address:this.state.address,
            id:user.id,
            isDefault:this.state.isDefault,
            provinceId:`${this.state.areaData[0].id}`,
            cityId:`${this.state.areaData[1].id}`,
            areaId:`${this.state.areaData[0].id}`,
        }

        axios.post(`${API}/base/area/saveArea`,{...submitData}
        ).then(response=>{
            let res = response.data;
            if(res.result){
                Toast.success("成功",1)
                window.setTimeout(()=>{
                    this.props.history.push("/addressManage")
                },1000)

            }else{
                Toast.fail(res.msg,1)
            }

        })
    }
    render() {
        return (
            <div className="new-address">
                <div className="new-address-header">
                    <NavBar
                        mode="dark"
                        icon={<Icon type="left" />}
                        onLeftClick={()=>{
                            window.history.go(-1)
                        }}
                    >新增地址</NavBar>
                </div>

                <div className="new-address-body">
                    <InputItem
                        type="text"
                        placeholder="收货人"
                        clear
                        moneyKeyboardAlign="left"
                        onChange={this.setNameVal}
                    >收货人</InputItem>
                    <InputItem
                        type="text"
                        placeholder="电话号码"
                        clear
                        moneyKeyboardAlign="left"
                        onChange={this.setPhoneVal}
                    >电话</InputItem>
                    <InputItem
                        type="text"
                        placeholder="请选择"
                        onClick={this.showCascader}
                        editable={false}
                        value={this.state.area}
                        clear
                        moneyKeyboardAlign="left"
                    >所属区域</InputItem>
                    <TextareaItem
                        title="详细地址"
                        placeholder="请输入详细地址"
                        data-seed="logId"
                        autoHeight
                        name="address"
                        rows={3}
                        onChange={this.setAddressVal}
                        ref={el => this.customFocusInst = el}
                    />
                    <WingBlank>
                        <div className="default-btn" onClick={this.setDefault}>
                                <div className={this.state.isDefault?"default active":"default"}></div><span>是否默认</span>
                        </div>
                    </WingBlank>
                    <div className="done">
                        <WingBlank>
                            <Button type="primary" onClick={this.done}>完成</Button>
                        </WingBlank>
                    </div>

                </div>

                <ReactCascader
                    cascaderShow={this.state.cascaderShow}
                    onCancel={this.onCancel}
                    getData={this.getData.bind(this)}
                    data={this.state.areaData}
                    onOk={this.onOk.bind(this)}
                ></ReactCascader>
            </div>
        )
    }
}

export default ComponentName