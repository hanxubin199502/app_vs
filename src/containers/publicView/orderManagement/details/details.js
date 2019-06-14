import React, {Component} from 'react';
import {NavBar, Icon, List, Flex, Steps,} from 'antd-mobile';
import {Link} from 'react-router-dom';
import axios from "axios"
import "./dateils.less"
import {HOST, API} from "../../../../const/host";

const Item = List.Item;
const Brief = Item.Brief;

const Step = Steps.Step;

const steps = [{
    title: 'Finished',
    description: 'This is description',
}, {
    title: 'In Progress',
    description: 'This is description',
}, {
    title: 'In Progress',
    description: 'This is description',
}, {
    title: 'Waiting',
    description: 'This is description',
}].map((s, i) => <Step key={i} title={s.title} description={s.description}/>);

const customIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42" className="am-icon am-icon-md">
        <g fillRule="evenodd" stroke="transparent" strokeWidth="4">
            <path d="M21 0C9.402 0 0 9.402 0 21c0 11.6 9.402 21 21 21s21-9.4 21-21C42 9.402 32.598 0 21 0z"/>
            <path fill="#FFF"
                  d="M29 18.73c0-.55-.447-1-1-1H23.36l4.428-5.05c.407-.46.407-1.208 0-1.668-.407-.46-1.068-.46-1.476 0l-5.21 5.89-5.21-5.89c-.406-.46-1.067-.46-1.475 0-.406.46-.406 1.207 0 1.667l4.43 5.05H14.23c-.55 0-.998.45-.998 1 0 .554.448.97 1 .97h5.9v3.942h-5.9c-.552 0-1 .448-1 1s.448.985 1 .985h5.9v4.896c0 .552.448 1 1 1 .55 0 .968-.284.968-.836v-5.06H28c.553 0 1-.433 1-.985s-.447-1-1-1h-5.9v-3.94H28c.553 0 1-.418 1-.97z"/>
        </g>
    </svg>
);

// const API = "http://192.168.31.34:8080";

class details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ""
        };
        console.log(this.props.match.params.id)
        this.linkToPreview = this.linkToPreview.bind(this);
    };

    componentDidMount() {
        console.log(this.props.match.params.id)

        axios.get(`${API}/base/orderItem/findAllAppOrderItem`, {params: {id: this.props.match.params.id}}).then(response => {
            console.log(response)
            let res = response.data;
            this.setState({
                data: res
            })
        })
    }

    linkToPreview(v) {
        console.log(v)
        if (this.state.data[v]) {
            let imgs = this.state.data[v].split(",");
            sessionStorage.setItem("preview", JSON.stringify(imgs));
            sessionStorage.setItem("backTo", this.props.match.url);
            this.props.history.push(`${HOST}/previewImg`)
        } else {

        }
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
                                <Icon type="left" style={{marginRight: '16px', color: "#fff"}}/>
                            </Link>
                        }
                    >订单详情</NavBar>
                </div>
                {/*<div style={{width:'100%',overflow:'auto'}}>
                        <WingBlank mode={20} className="stepsExample">
                            <WhiteSpace />
                            <Steps current={2} direction="horizontal" size="small">{steps}</Steps>
                        </WingBlank>
                    </div>*/}
                {
                    this.state.data ?
                        <div>
                            <List renderHeader={() => '| 商品'} className="my-list">
                                {
                                    this.state.data.appOrderItemModels.map((item, index) => (
                                        <div key={index}>
                                            <Item align="middle">
                                                <Flex justify="between">
                                                    <Flex.Item>商品名称</Flex.Item>
                                                    <Flex.Item>{item.productName}</Flex.Item>
                                                </Flex>
                                            </Item>
                                            <Item align="middle">
                                                <Flex justify="between">
                                                    <Flex.Item>价格：{item.price}</Flex.Item>
                                                    <Flex.Item>数量：${item.num}</Flex.Item>
                                                </Flex>
                                            </Item>
                                        </div>
                                    ))
                                }

                                <Item align="middle">
                                    <Flex justify="between">
                                        <Flex.Item>总计：{this.state.data.totalGoodsPrice}</Flex.Item>
                                        <Flex.Item>{this.state.data.status}</Flex.Item>
                                    </Flex>
                                </Item>
                            </List>
                            <List renderHeader={() => '| 配送信息'} className="my-list">
                                <Item align="middle">
                                    <Flex justify="between">
                                        <Flex.Item>收货人:{this.state.data.customerName}</Flex.Item>
                                        <Flex.Item>手机号:{this.state.data.mobilePhone}</Flex.Item>
                                    </Flex>
                                </Item>
                                <Item align="middle">
                                    <Flex justify="between">
                                        <Flex.Item>收获地址 {this.state.data.address}</Flex.Item>
                                    </Flex>
                                </Item>
                            </List>
                            {/*<List renderHeader={() => '| 时间'}  className="my-list">
                                    <Item align="middle">
                                        客户确认时间
                                    </Item>
                                    <Item align="middle">
                                        财务确认时间
                                    </Item>
                                    <Item align="middle">
                                       发货时间
                                    </Item>
                                    <Item align="middle">
                                        确认收货时间
                                    </Item>
                                </List>*/}
                            {
                                this.state.data.shipperCode || this.state.data.logisticCode ?
                                    <List renderHeader={() => '| 物流信息'} className="my-list">
                                        <Item align="middle">
                                            <Flex justify="between">
                                                {
                                                    this.state.data.shipperCode ?
                                                        <Flex.Item>快递公司编码{this.state.data.shipperCode}</Flex.Item>
                                                        : ""
                                                }
                                                {
                                                    this.state.data.logisticCode ?
                                                        <Flex.Item>物流单号:{this.state.data.logisticCode}</Flex.Item>
                                                        : ""
                                                }
                                            </Flex>
                                        </Item>
                                        {/*<Item>
                                        运费 0
                                        <  /Item>*/}
                                    </List>
                                    : ""
                            }
                            <List>
                                {
                                    this.state.data.paymentVoucher ?
                                        <Item arrow="horizontal" multipleLine onClick={() => {
                                            this.linkToPreview("paymentVoucher")
                                        }}>
                                            查看付款凭证
                                        </Item>
                                        : ""
                                }
                                {
                                    this.state.data.thumbnail ?
                                        <Item arrow="horizontal" multipleLine onClick={() => {
                                            this.linkToPreview("thumbnail")
                                        }}>
                                            查看发货凭证
                                        </Item>
                                        : ""
                                }

                            </List>
                            < List renderHeader={() => '| 订单信息'} className="my-list">
                                <Item align="middle">
                                    <Flex justify="between">
                                        <Flex.Item>订单号</Flex.Item>
                                        <Flex.Item>{this.state.data.orderNo}</Flex.Item>
                                    </Flex>
                                </Item>
                                <Item align="middle">
                                    <Flex justify="between">
                                        <Flex.Item>下单时间</Flex.Item>
                                        <Flex.Item>{this.state.data.createTime}</Flex.Item>
                                    </Flex>
                                </Item>
                            </List>
                            <List renderHeader={() => '| 买家留言'} className="my-list">
                                <Item align="middle">
                                    <Flex justify="between">
                                        <Flex.Item style={{fontSize: '16px'}}>留言：{this.state.data.mark}</Flex.Item>
                                    </Flex>
                                </Item>
                            </List>
                            <List renderHeader={() => '| 付款'} className="my-list">
                                <Item align="middle">
                                    <Flex justify="between">
                                        <Flex.Item>付款类型</Flex.Item>
                                        <Flex.Item>{this.state.data.payType}</Flex.Item>
                                    </Flex>
                                </Item>
                                <Item align="middle">
                                    <Flex justify="between">
                                        <Flex.Item>付款金额</Flex.Item>
                                        <Flex.Item>￥{this.state.data.totalGoodsPrice}</Flex.Item>
                                    </Flex>
                                </Item>
                            </List>
                        </div>
                        : ""
                }
                {/*<List renderHeader={() => '| 用户信息'}  className="my-list">
                                    <Item align="middle">
                                        <Flex justify="between">
                                            <Flex.Item>用户ID</Flex.Item>
                                            <Flex.Item>ID</Flex.Item>
                                        </Flex>
                                    </Item>
                                    <Item align="middle">
                                        <Flex justify="between">
                                            <Flex.Item>用户名</Flex.Item>
                                            <Flex.Item>ID</Flex.Item>
                                        </Flex>
                                    </Item>
                                    <Item align="middle">
                                        <Flex justify="between">
                                            <Flex.Item>手机号</Flex.Item>
                                            <Flex.Item>ID</Flex.Item>
                                        </Flex>
                                    </Item>
                                </List>*/}
                <List

                    onClick={() => {

                    }}
                    className="my-list">
                    <Item
                        multipleLine
                        onClick={() => {
                        }}
                        platform="android"
                        className="order-list"
                    ></Item>
                </List>

            </div>
        );
    }
}

export default details


/*
     orderId":"30",
　　"userId":null,
　　"createTime":null,//创建时间
　　"orderNo":null, // 订单编号
　　"customerId":null,
　　"customerName":null,//收获人
　　"salesId":null,
　　"status":"待确认",状态
　　"address":"北京朝阳定福庄",//地址
　　"totalGoodsPrice":"44.0",//总价
　　"shipperCode":null,//快递公司
　　"logisticCode":null,//物流单号
　　"payType":null,//支付方式
　　"mark":"995", //注释
　　"roleCode":null,
　　"paymentVoucher":null,//付款凭证
    "thumbnail"://发货凭证
* */