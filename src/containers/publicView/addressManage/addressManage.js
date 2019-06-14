import React, {Component} from 'react';
import {NavBar,Icon,WingBlank,Modal,Toast} from "antd-mobile";
import './addressManage.less';
import axios from "axios";
import { HOST } from "../../../const/host"
const API = "http://192.168.31.222:8080";
const alert = Modal.alert;
class AddressManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[
                {
                    name:"周海涛",
                    phone:"18840846671",
                    provenceId:123,
                    provence:"四川",
                    cityId:"456",
                    city:"重庆",
                    areaId:"789",
                    area:"大山区",
                    isDefault:true,
                    address:"北京市大兴区河西务镇包楼村",
                    addressId:"12"
                },
                {
                    name:"周海涛",
                    phone:"18840846671",
                    provenceId:123,
                    provence:"四川",
                    cityId:"456",
                    city:"重庆",
                    areaId:"789",
                    area:"大山区",
                    isDefault:false,
                    address:"北京市大兴区河西务镇包楼村",
                    addressId:"13"
                },
                {
                    name:"周海涛",
                    phone:"18840846671",
                    provenceId:123,
                    provence:"四川",
                    cityId:"456",
                    city:"重庆",
                    areaId:"789",
                    area:"大山区",
                    isDefault:false,
                    address:"北京市大兴区河西务镇包楼村",
                    addressId:"14"
                }
            ]
        };
        this.setDefault = this.setDefault.bind(this)
    };
    componentDidMount(){
        let user = JSON.parse(sessionStorage.getItem("user"));

        axios.get(`${API}/base/area/findAll`,{
            params:{id:user.id}
        }).then(response=>{
            let res = response.data;
            console.log(res);
        })
    }
    setDefault(id){
        console.log(id);
    }
    delAddress(id){
        alert('确认删除吗？',"是否确认删除这个地址？", [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '确认', onPress: () => {
                    axios.get(`${API}/logout`).then(res=>{
                        if(res.data.result){
                            Toast.success("删除成功",1);
                        }
                    })
                }},
        ])
    }

    render() {
        return (
            <div className="address-manage">
                <div className="address-header">
                    <NavBar
                        mode="dark"
                        icon={<Icon type="left" />}
                        onLeftClick={()=>{
                            window.history.go(-1)
                        }}
                        rightContent={<div onClick={()=>{this.props.history.push(`${HOST}/newAddress`)}}>新增</div>}
                    >地址管理</NavBar>

                </div>
                <div className="address-body">
                    {
                        this.state.data.map(v=>

                            <WingBlank key={v.addressId} className="address-item">
                                <div className="top">
                                    <div className="name">{v.name}</div>
                                    <div className="phone">{v.phone}</div>
                                </div>
                                <div className="address">
                                    {v.provence} {v.city} {v.area} {v.address}
                                    <div>
                                        {v.isDefault?
                                            <div className="default"><span className="check-default"></span><span>默认地址</span></div>:
                                            <div className="set-default" onClick={()=>{this.setDefault(v.addressId)}}><span className="check-default"></span><span>设置默认</span></div>
                                        }
                                    </div>
                                </div>
                                <div className="option">
                                    <div className="left">编辑</div>
                                    <div className="left" onClick={()=>{this.delAddress(v.addressId)}}>删除</div>
                                </div>
                            </WingBlank>
                        )
                    }
                    <WingBlank>

                    </WingBlank>
                </div>
            </div>
        )
    }
}

export default AddressManage