import React, {Component} from 'react';
import { NavBar,Icon,Radio,Button,WingBlank,ImagePicker,Toast,TextareaItem } from 'antd-mobile';
import axios from "axios"
import { Link } from "react-router-dom";
import {HOST,API} from "../../../const/host";
import './pay.less';
//const API = "http://192.168.31.34:8080"
const RadioItem = Radio.RadioItem;
class Pay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goodsData:JSON.parse(sessionStorage.getItem("goodsData")),
            address:{
              customerName:"",
              mobilePhone:"",
              address:""
            },
            payMethod:[
                { value:"TRANSFER",label:"转账支付" },
                { value:"ALIPAY",label:"支付宝支付" },
                { value:"UNPAID",label:"未付款先发货" }
            ],
            payType:"TRANSFER",
            files:[],
            imgUrl:[],
            mark:"",
            totalGoodsPrice:0
        };
        this.changePayType = this.changePayType.bind(this);
        this.onChange = this.onChange.bind(this);
        this.submit = this.submit.bind(this)
        this.setMarkValue = this.setMarkValue.bind(this)
    };
    componentDidMount(){
        let totalGoodsPrice = 0
        this.state.goodsData.forEach(v=>{
            totalGoodsPrice +=v.num * v.price
        });
        this.setState({
            totalGoodsPrice
        });
        let userId = JSON.parse(sessionStorage.getItem("user")).id;

        axios.get(`${API}/base/area/updatePre`,{
                params:{
                    id:userId
                }
            }
        ).then(response=>{
            let res = response.data;
            this.setState({
                address:res
            });

        })
    }
    changePayType(val){
        console.log(val);
        this.setState({
            payType:val
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


    };
    setMarkValue(val){
        this.setState({
            mark:val
        })
    }
    submit(){
        if(this.state.files.length === 0 && this.state.payType!=="UNPAID"){
            Toast.fail("请上传转账凭证",1)
            return
        }
        let goodsData = [];

        this.state.goodsData.forEach(v=>{
/*            goodsData.push({
                goodsId : 21,
                modelSize : v.modelSize,
                price : 32,
                unitsId : 12,
                units:v.units,
                num : v.num,
                total:v.num*v.price
            });*/
            goodsData.push({
                goodsId : v.goodsId,
                modelSize : v.modelSize,
                price : v.price,
                unitsId : v.unitsId,
                units:v.units,
                num : v.num,
                total:v.num*v.price
            });

        });
        let submitData={
            paymentVoucher :this.state.imgUrl.join(","),
            appOrderItemModels: goodsData,
            /*address:`${this.state.address.customerName}@${this.state.address.mobilePhone}@${this.state.address.detailAddress}`,*/
            payType:this.state.payType,
            totalGoodsPrice:this.state.totalGoodsPrice,
            mark:this.state.mark
        };
        axios.post(`${API}/base/order/addOrder`,submitData).then(response=>{
            let res = response.data;
            console.log(res);
            if(res.result){
                Toast.success(res.msg,1);
                setTimeout(()=>{
                    this.props.history.push(`${HOST}/index/purchase`)
                },1000)
            }else{
                Toast.fail(res.msg,1);
            }
        })
        console.log(submitData);
    }
    componentWillUnmount(){
        sessionStorage.removeItem("goodsData")
    }
    render() {
        return (
            <div className="pay">
                <div className="pay-header">
                    <NavBar
                        mode="dark"
                        leftContent={
                            <Link to={`${HOST}/index/purchase`}><Icon type="left" style={{ marginRight: '16px'}} /></Link>
                        }
                        onLeftClick={()=>{sessionStorage.removeItem("this.state.selectedGoods")}}
                    >付款</NavBar>
                </div>
                <div className="pay-body">
                    <div className="address-box">
                        <WingBlank>
                            <div className="consignee">
                                <div className="name">{this.state.address.customerName}</div>
                                <div className="phone">{this.state.address.mobilePhone}</div>
                            </div>
                            <div className="address">
                                {this.state.address.address}
                            </div>
                        </WingBlank>
                    </div>
                    <div className="goods-box">

                    {
                        this.state.goodsData.map((v,i)=>
                            <div key={i} className="goods-item">
                                <WingBlank>
                                    <div className="top">
                                        <div className="name">{v.goodsName}</div>
                                        <div className="price">¥{v.price}</div>
                                    </div>
                                    <div className="bottom">
                                        <div className="size">型号：{v.modelSize}</div>
                                        <div className="num">数量：{v.num}</div>
                                    </div>
                                </WingBlank>

                            </div>
                        )
                    }

                </div>
                    <div className="totalPrice-wrapper">
                        <WingBlank>
                            <div className="totalPrice">
                                <div>总价</div>
                                <div>¥{this.state.totalGoodsPrice}</div>
                            </div>
                        </WingBlank>

                    </div>
                    {
                        this.state.payType === "UNPAID"?
                            ""
                            :
                            <div className="upload">
                                <WingBlank>
                                    <div className="upload-title">上传转账凭证(最多3张)</div>
                                    <ImagePicker
                                        files={this.state.files}
                                        onChange={this.onChange}
                                        onImageClick={(index, fs) => console.log(index, fs)}
                                        selectable={this.state.files.length < 3}
                                        multiple={true}
                                    />
                                </WingBlank>
                            </div>
                    }



                </div>
                <div className="pay-method">
                    {this.state.payMethod.map(i => (
                        <RadioItem key={i.value} checked={this.state.payType === i.value} onChange={() => this.changePayType(i.value)}>
                            {i.label}
                        </RadioItem>
                    ))}
                </div>
                <div className="mark">
                    <TextareaItem
                        title="订单备注"
                        placeholder="请输入备注"
                        autoHeight
                        rows={3}
                        onChange={value=>this.setMarkValue(value)}
                    />

                </div>
                <WingBlank style={{marginTop:20}}>
                    <Button type="primary" onClick={this.submit}>提交订单</Button>
                </WingBlank>
            </div>
        )
    }
}

export default Pay