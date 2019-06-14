import React, {Component} from 'react';
import { NavBar,WingBlank,InputItem,TextareaItem,Button,List,Icon,Toast,Modal } from "antd-mobile";
import axios from "axios";
import './paymentOederDetail.less';
import { HOST,API } from "../../../../const/host"

const Item = List.Item;
const alert = Modal.alert;
class PaymentOrderDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:"",
            address:"",
            status:"",
            checkPic:false,
            preview:""
        };
        this.linkToPreview = this.linkToPreview.bind(this)
        this.checkPayment = this.checkPayment.bind(this)
    };
    componentDidMount(){
        //初始请求订单信息
        axios.get(`${API}/base/orderItem/findAllAppOrderItem`,{
            params:{id:this.props.match.params.id}
        }).then(response=>{
            let res = response.data;
            this.setState({
                data:res,
                status:res.status
            },()=>{
                console.log(this.state.data);
            });

        })
    }
    linkToPreview(v){
        if(!this.state.data[v]){
            Toast.info("未上传凭证",1);
            return
        }
        let imgs = this.state.data[v].split(",");
        sessionStorage.setItem("preview",JSON.stringify(imgs));
        sessionStorage.setItem("backTo",this.props.match.url);
        this.props.history.push(`${HOST}/previewImg`)
    }
    checkPayment(flag){
        let title = "确认通过审核吗?";
        let msg = "请确认收到货款";
        let status = "UNSEND";
        let toast = "审核成功";
        if(!flag){
            title = "确认不通过吗?";
            msg = "";
            status="CLOSE";
            toast = "拒绝成功";
        }
        alert(title,msg, [
            { text: '取消', onPress: () => {} },
            { text: '确认', onPress: () => {
                    axios.get(`${API}/base/order/financeConfirm`,{
                        params:{
                            id:this.state.data.orderId,
                            status
                        }
                    }).then(response=>{
                        let res = response.data;
                        if(res.result){
                            Toast.success(toast,1);
                            setTimeout(()=>{
                                this.props.history.push(`${HOST}/index/paymentCheck`)
                            },1000)
                        }else{
                            Toast.success(res.msg,1);
                        }

                    })
            }},
        ])

    }
    componentWillUnmount(){
        sessionStorage.setItem("backTo",this.props.match.url)
    }

    render() {
        return (
            <div className="payment-order-detail">

                <div className="payment-order-detail-header">
                    <NavBar
                        mode="dark"
                        icon={<Icon type="left"/>}
                        onLeftClick={()=>{
                            this.props.history.push(`${HOST}/index/paymentCheck`)
                        }}

                    >订单详情</NavBar>
                </div>
                {
                    this.state.data?
                        <div className="payment-order-detail-body">
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
                                        <Item arrow="horizontal" onClick={()=>{this.linkToPreview("paymentVoucher")}}>查看转账凭证</Item>
                                        {
                                            this.state.status !== "待财务确认" && this.state.status !== "未发货"?
                                                <Item arrow="horizontal"  multipleLine onClick={()=>{
                                                    this.linkToPreview("thumbnail")
                                                }}>
                                                    查看发货凭证
                                                </Item>
                                                :
                                                ""
                                        }
                                        {
                                            this.state.status === "已发货" || this.state.status === "完成"?
                                                <Item arrow="horizontal" onClick={() => {this.props.history.push(`${HOST}/logistics/${this.state.data.orderNo}`)}}>
                                                    查看物流
                                                </Item>
                                                :
                                                ""
                                        }

                                    </List>
                                </div>

                                <div className="pay-method">
                                    <InputItem editable={false} value={`${this.state.status}`} style={{textAlign:"right"}}>订单状态</InputItem>
                                </div>
                                <div className="mark">
                                    <TextareaItem
                                        title="订单备注"
                                        value={this.state.data.mark}
                                        autoHeight
                                        rows={3}
                                        editable={false}
                                    />
                                </div>
                            {
                                this.state.status !=="待财务确认"?
                                    ""
                                    :
                                    <div className="submit-btn">
                                        <WingBlank>
                                            <Button type="primary" onClick={()=>{this.checkPayment(true)}}>审核通过</Button>
                                            <Button type="default" onClick={()=>{this.checkPayment(false)}} style={{marginTop:15}}>不通过</Button>
                                        </WingBlank>
                                    </div>

                            }

                        </div>
                        :
                        ""
                }

            </div>
        )
    }
}

export default PaymentOrderDetail