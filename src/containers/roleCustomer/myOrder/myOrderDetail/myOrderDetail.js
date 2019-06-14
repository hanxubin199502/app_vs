import React, {Component} from 'react';
import { NavBar,List,Icon,WingBlank,Radio,TextareaItem,Toast,Button,ImagePicker,InputItem,Modal } from "antd-mobile";
import { HOST,API } from "../../../../const/host";
import { Link } from "react-router-dom";
import axios from "axios";
import "./myOrderDetail.less";
const RadioItem = Radio.RadioItem;
const alert = Modal.alert;
const Item = List.Item;
class MyOrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status:"COMPLETE",
            data:"",
            address:"",
            //上传图片
            files:[],
            imgUrl:[],
            payMethod:[
                { value:"TRANSFER",label:"转账支付" },
                { value:"ALIPAY",label:"支付宝支付" },
                { value:"UNPAID",label:"未付款先发货" }
            ],
            payType:"TRANSFER",
            mark:"",

        };
        this.changePayType = this.changePayType.bind(this);
        this.onChange = this.onChange.bind(this);
        this.submit = this.submit.bind(this);
        this.setMarkValue = this.setMarkValue.bind(this)
        this.linkToPreview = this.linkToPreview.bind(this)
        this.confirm = this.confirm.bind(this)
    };
    componentDidMount(){
        //初始请求订单信息
        axios.get(`${API}/base/orderItem/findAllAppOrderItem`,{
            params:{id:this.props.match.params.id}
        }).then(response=>{
            let res = response.data;
            this.setState({
                data:res,
                status:res.status,
                mark:res.mark
            },()=>{
                console.log(this.state.data);
            });

        })
    }


    //确认收货
    confirm(){
        alert('确认收货吗？',"请务必确认收到货物", [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '确认', onPress: () => {
                axios.get(`${API}/base/order/customerConfirm`,{
                    params:{
                        id:this.state.data.orderId
                    }
                }).then(response=>{
                    let res = response.data;
                    if(res.result){
                        Toast.success(res.msg,1);
                        setTimeout(()=>{
                            this.props.history.push(`${HOST}/index/myOrder`)
                        },1000)

                    }else{
                        Toast.fail(res.msg,1);
                    }

                })
            }},
        ])

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
    linkToPreview(v){
        if(!this.state.data[v]){
            Toast.info("未上传凭证",1)
            return
        }
        let imgs = this.state.data[v].split(",");
        sessionStorage.setItem("preview",JSON.stringify(imgs));
        sessionStorage.setItem("backTo",this.props.match.url);
        this.props.history.push(`${HOST}/previewImg`)
    }

    //确认销售发来的订单
    submit(flag){

        if(this.state.files.length === 0 && this.state.payType!=="UNPAID" && flag){
            Toast.fail("请上传转账凭证",1);
            return
        }
        let title = "确认订单吗?";
        let msg = "请确认信息无误";
        let status = "UNFINANCECONFIRMED";
        let toast = "确认成功";
        if(!flag){
            title = "确认拒绝吗?";
            msg = "";
            status="CLOSE";
            toast="拒绝成功"
        }

        alert(title,msg, [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '确认', onPress: () => {
                    let submitData={
                        paymentVoucher :this.state.imgUrl.join(","),
                        payType:this.state.payType,
                        mark:this.state.mark,
                        id:this.state.data.orderId,
                        status
                    };
                    axios.post(`${API}/base/order/customerPay`, submitData).then(response => {
                        let res = response.data;
                        console.log(res);
                        if (res.result) {
                            Toast.success(toast, 1);
                            setTimeout(() => {
                                this.props.history.push(`${HOST}/index/purchase`)
                            }, 1000)
                        } else {
                            Toast.fail(res.msg, 1);
                        }
                    });
                }},
        ])


    }
    componentWillUnmount(){
        sessionStorage.setItem("backTo",this.props.match.url)
    }
    render() {
        const content=()=>{
            switch(this.state.status){
                case "待确认":
                    return <div className="order-detail-body">
                            <div className="address-box">
                                <WingBlank>
                                    <div className="consignee">
                                        <div className="name">{this.state.data.customerName}</div>
                                        <div className="phone">{this.state.data.mobilePhone}</div>
                                    </div>
                                    <div className="address">
                                        {this.state.data.address}
                                    </div>

                                </WingBlank>
                            </div>
                            <div className="goods-box">
                                {
                                    this.state.data.appOrderItemModels.map((v,i)=>
                                        <div key={i} className="goods-item">
                                            <WingBlank>
                                                <div className="top">
                                                    <div className="name">{v.productName}</div>
                                                    <div className="price">¥{v.total}</div>
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
                                        <div>¥{this.state.data.totalGoodsPrice}</div>
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
                                defaultValue={this.state.data.mark}
                                onChange={value=>this.setMarkValue(value)}
                            />

                        </div>
                        <WingBlank style={{marginTop:20}}>
                            <Button type="primary" onClick={()=>{this.submit(true)}}>确认订单</Button>
                            <Button type="default" style={{marginTop:15}} onClick={()=>{this.submit(false)}}>拒绝</Button>
                        </WingBlank>
                    </div>;
                    break;
                case "待财务确认":
                    return <div className="order-detail-body">
                        <div className="address-box">
                            <WingBlank>
                                    <div className="consignee">
                                        <div className="name">{this.state.data.customerName}</div>
                                        <div className="phone">{this.state.data.mobilePhone}</div>
                                    </div>
                                    <div className="address">
                                        {this.state.data.address}
                                    </div>

                            </WingBlank>
                        </div>
                        <div className="goods-box">
                            {
                                this.state.data.appOrderItemModels.map((v,i)=>
                                    <div key={i} className="goods-item">
                                        <WingBlank>
                                            <div className="top">
                                                <div className="name">{v.productName}</div>
                                                <div className="price">¥{v.total}</div>
                                            </div>
                                            <div className="bottom">
                                                <div className="size">型号：{v.modelSize}</div>
                                                <div className="num">数量：{v.num}</div>
                                            </div>
                                            <div className="unit">单位：{v.units}</div>

                                        </WingBlank>

                                    </div>
                                )
                            }

                        </div>
                        <div className="totalPrice-wrapper">
                            <WingBlank>
                                <div className="totalPrice">
                                    <div>总价</div>
                                    <div>¥{this.state.data.totalGoodsPrice}</div>
                                </div>
                            </WingBlank>

                        </div>
                        <div className="pay-method">
                            <InputItem editable={false} value={`${this.state.data.payType}`} style={{textAlign:"right"}}>支付方式</InputItem>
                        </div>
                        <div className="pay-method">
                            <InputItem editable={false} value={`${this.state.status}`} style={{textAlign:"right"}}>订单状态</InputItem>
                        </div>
                        <List style={{marginTop:10}}>
                            <Item arrow="horizontal"  multipleLine onClick={()=>{
                                this.linkToPreview("paymentVoucher")
                            }}>
                                查看付款凭证
                            </Item>
                        </List>
                        <div className="mark">
                            <TextareaItem
                                title="订单备注"
                                value={this.state.data.mark}
                                autoHeight
                                rows={3}
                                editable={false}
                            />

                        </div>
                    </div>;
                    break;
                case "未发货":
                    return <div className="order-detail-body">
                        <div className="address-box">
                            <WingBlank>
                                    <div className="consignee">
                                        <div className="name">{this.state.data.customerName}</div>
                                        <div className="phone">{this.state.data.mobilePhone}</div>
                                    </div>
                                    <div className="address">
                                        {this.state.data.address}
                                    </div>
                            </WingBlank>
                        </div>
                        <div className="goods-box">

                            {
                                this.state.data.appOrderItemModels.map((v,i)=>
                                    <div key={i} className="goods-item">
                                        <WingBlank>
                                            <div className="top">
                                                <div className="name">{v.productName}</div>
                                                <div className="price">¥{v.total}</div>
                                            </div>
                                            <div className="bottom">
                                                <div className="size">型号：{v.modelSize}</div>
                                                <div className="num">数量：{v.num}</div>
                                            </div>
                                            <div className="unit">单位：{v.units}</div>
                                        </WingBlank>

                                    </div>
                                )
                            }

                        </div>
                        <div className="totalPrice-wrapper">
                            <WingBlank>
                                <div className="totalPrice">
                                    <div>总价</div>
                                    <div>¥{this.state.data.totalGoodsPrice}</div>
                                </div>
                            </WingBlank>

                        </div>
                        <div className="pay-method">
                            <InputItem editable={false} value={`${this.state.data.payType}`} style={{textAlign:"right"}}>支付方式</InputItem>
                        </div>
                        <div className="pay-method">
                            <InputItem editable={false} value={`${this.state.status}`} style={{textAlign:"right"}}>订单状态</InputItem>
                        </div>
                        <List style={{marginTop:10}}>
                            <Item arrow="horizontal"  multipleLine onClick={()=>{
                                this.linkToPreview("paymentVoucher")
                            }}>
                                查看付款凭证
                            </Item>
                        </List>

                        <div className="mark">
                            <TextareaItem
                                title="订单备注"
                                value={this.state.data.mark}
                                autoHeight
                                rows={3}
                                editable={false}
                            />

                        </div>
                    </div>;
                    break
                case "已发货":
                    return <div className="order-detail-body">
                        <div className="address-box">
                            <WingBlank>
                                    <div className="consignee">
                                        <div className="name">{this.state.data.customerName}</div>
                                        <div className="phone">{this.state.data.mobilePhone}</div>
                                    </div>
                                    <div className="address">
                                        {this.state.data.address}
                                    </div>
                            </WingBlank>
                        </div>
                        <div className="goods-box">

                            {
                                this.state.data.appOrderItemModels.map((v,i)=>
                                    <div key={i} className="goods-item">
                                        <WingBlank>
                                            <div className="top">
                                                <div className="name">{v.productName}</div>
                                                <div className="price">¥{v.total}</div>
                                            </div>
                                            <div className="bottom">
                                                <div className="size">型号：{v.modelSize}</div>
                                                <div className="num">数量：{v.num}</div>
                                            </div>
                                            <div className="unit">单位：{v.units}</div>
                                        </WingBlank>

                                    </div>
                                )
                            }

                        </div>
                        <div className="totalPrice-wrapper">
                            <WingBlank>
                                <div className="totalPrice">
                                    <div>总价</div>
                                    <div>¥{this.state.data.totalGoodsPrice}</div>
                                </div>
                            </WingBlank>

                        </div>
                        <div className="pay-method">
                            <List>
                                <Item extra={`${this.state.data.payType}`}>支付方式</Item>
                            </List>
                        </div>
                        <div className="pay-method">
                            <InputItem editable={false} value={`${this.state.status}`} style={{textAlign:"right"}}>订单状态</InputItem>
                        </div>

                        <List className="logistics">
                            <Item extra={"申通物流"}>
                                物流公司
                            </Item>
                            <Item extra={this.state.data.logisticCode} multipleLine wrap={true}>
                                运单号
                            </Item>
                            <Item arrow="horizontal" onClick={() => {this.props.history.push(`${HOST}/logistics/${this.state.data.orderNo}`)}}>
                                查看物流
                            </Item>
                        </List>
                        <List style={{marginTop:10}}>
                            <Item arrow="horizontal"  multipleLine onClick={()=>{
                                this.linkToPreview("paymentVoucher")
                            }}>
                                查看付款凭证
                            </Item>
                            <Item arrow="horizontal"  multipleLine onClick={()=>{
                                this.linkToPreview("thumbnail")
                            }}>
                                查看发货凭证
                            </Item>

                        </List>

                        <div className="mark">
                            <TextareaItem
                                title="订单备注"
                                value={this.state.data.mark}
                                autoHeight
                                rows={3}
                                editable={false}
                            />

                        </div>
                        <WingBlank>
                            <Button type="primary" style={{marginTop:20}} onClick={this.confirm}>确认收货</Button>
                        </WingBlank>

                    </div>;
                    break
                case "完成":
                    return <div className="order-detail-body">
                        <div className="address-box">
                            <WingBlank>
                                    <div className="consignee">
                                        <div className="name">{this.state.data.customerName}</div>
                                        <div className="phone">{this.state.data.mobilePhone}</div>
                                    </div>
                                    <div className="address">
                                        {this.state.data.address}
                                    </div>
                            </WingBlank>
                        </div>
                        <div className="goods-box">

                            {
                                this.state.data.appOrderItemModels.map((v,i)=>
                                    <div key={i} className="goods-item">
                                        <WingBlank>
                                            <div className="top">
                                                <div className="name">{v.productName}</div>
                                                <div className="price">¥{v.total}</div>
                                            </div>
                                            <div className="bottom">
                                                <div className="size">型号：{v.modelSize}</div>
                                                <div className="num">数量：{v.num}</div>
                                            </div>
                                            <div className="unit">单位：{v.units}</div>
                                        </WingBlank>

                                    </div>
                                )
                            }

                        </div>
                        <div className="totalPrice-wrapper">
                            <WingBlank>
                                <div className="totalPrice">
                                    <div>总价</div>
                                    <div>¥{this.state.data.totalGoodsPrice}</div>
                                </div>
                            </WingBlank>

                        </div>
                        <div className="pay-method">
                            <InputItem editable={false} value={`${this.state.data.payType}`} style={{textAlign:"right"}}>支付方式</InputItem>
                        </div>
                        <div className="pay-method">
                            <InputItem editable={false} value={`${this.state.status}`} style={{textAlign:"right"}}>订单状态</InputItem>
                        </div>
                        <List className="logistics">

                            <Item extra={"申通物流"}>
                                物流公司
                            </Item>
                            <Item extra={"332200984893939"} multipleLine wrap={true}>
                                运单号
                            </Item>
                            <Item arrow="horizontal" onClick={() => {this.props.history.push(`${HOST}/logistics/${this.state.data.orderNo}`)}}>
                                查看物流
                            </Item>

                        </List>
                        <Item arrow="horizontal"  multipleLine onClick={()=>{
                            this.linkToPreview("paymentVoucher")
                        }}>
                            查看付款凭证
                        </Item>
                        <Item arrow="horizontal"  multipleLine onClick={()=>{
                            this.linkToPreview("thumbnail")
                        }}>
                            查看发货凭证
                        </Item>
                        <div className="mark">
                            <TextareaItem
                                title="订单备注"
                                value={this.state.data.mark}
                                autoHeight
                                rows={3}
                                editable={false}
                            />
                        </div>
                    </div>;
                    break
            }

        };
        return (
            <div className="my-order-detail">
                <div className="order-detail-header">
                    <NavBar
                        mode="dark"
                        icon={<Icon type="left" />}
                        onLeftClick={() => this.props.history.push(`${HOST}/index/myOrder`)}
                    >订单详情</NavBar>
                </div>
                {
                    this.state.data?
                        content()
                        :
                        ""
                }


            </div>
        )
    }
}

export default MyOrderDetail