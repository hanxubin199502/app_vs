import React, {Component} from 'react';
import { NavBar, Icon ,WingBlank,List,InputItem, Accordion,Flex , WhiteSpace ,Picker,Toast,TextareaItem } from 'antd-mobile';
import { Link } from 'react-router-dom';
import axios from "axios"
import {HOST,API} from "../../../../const/host";
import GoodsList from "../../../../components/goodsList/goodsList"
/*import { createForm } from 'rc-form';
import arrayTreeFilter from 'array-tree-filter';
import { district, provinceLite } from 'antd-mobile-demo-data';*/
import "./add.less"

//const API = "http://192.168.31.34:8080"
const Item = List.Item;
const Brief = Item.Brief;


//${API}/base/customer/appFindAll`,customerName:""客户  post

//axios.

class add extends Component {

    constructor(props) {
        super(props);
        this.state = {
            customer:[
                {
                    label:"门店",
                    value:"STORE"
                },
                {
                    label:"代理商",
                    value:"AGENT"
                },
                {
                    label:"大客户",
                    value: "BIGCUSTOMER"
                },
            ],
            customerName:"",
            customerId:"",
            goodsList:"",
            goods:[],
            totalGoodsPrice:"",
            mark:""
        };
        this.customerWay=this.customerWay.bind(this);
        this.submit=this.submit.bind(this);
        this.select=this.select.bind(this);
        this.mark=this.mark.bind(this);
        //value=key
    };
    componentDidMount(){

        axios.post(`${API}/base/customer/appFindAll`,{customerName:""}).then(response=>{
            let res = response.data;
            let arr=[];
            res.map((item,index)=>{
                // console.log(item,index)
                // console.log(item['id'])
                 arr[index]={};
                 arr[index]['value']=item['id'];
                 arr[index]['label']=item['customerName'];
            })
            this.setState({
                customer:arr
            })
        })

        axios.post(`${API}/base/stockInfo/findAllStockInfo`,{
            currentPage :1,
            pageSize : 100
        }).then(response=>{
            let res = response.data;
            console.log(res);
            // res.map((item)=>{
            //     item['nums']=1;
            //     item['num']=1;
            // })
            // console.log(res);
            this.setState({
                goodsList:res
            })
        })
    }
    customerWay=(v)=>{
        let name;
        // noinspection JSAnnotator
        this.state.customer.map(item=>{
            if(item['value']==v){
                name=item['label']
            }
        })
        this.setState({
            customerName:name,
            customerId:v
        })

    }
    submit(){
        // console.log("111",this.state)
        //base:order:addOrder
        this.state.goods.map(item=>{
            item['productName']=item['goodsName']
        })
        if( this.state.customerId!==""&&this.state.goods.length!==0){
            let totalGoodsPrice=0;
            this.state.goods.map(item=>{
                totalGoodsPrice=totalGoodsPrice+item['num']*item['price']
            })
            let params={
                customerId:this.state.customerId[0],
                appOrderItemModels:this.state.goods,
                totalGoodsPrice:totalGoodsPrice,
                mark:this.state.mark
            }
            console.log(params);
            axios.post(`${API}/base/order/addOrder`,params).then(response=>{
                console.log(response)
                let res=response.data;
                console.log(res);
                if(res.result){
                    Toast.success(res.msg,1)
                    setTimeout(()=>{
                        this.props.history.push(`${HOST}/index/orderManagement`)
                    },1000)
                }else{
                    Toast.fail(res.msg, 1);
                }


            })
        }else{
            Toast.fail('请选择客户或者商品', 1);
        }
    }
    select(e){
        this.setState({
            goods:e,
        })
    }
    mark(v){
        this.setState({
            mark:v,
        })
    }
    render() {
        return (
            <div style={{width:"100%"}}>
                <div className={"nav-empty"}>.</div>
                <div className={"nav"}>
                    <NavBar
                        mode="light"
                        leftContent={
                            <Link to={`${HOST}/index/orderManagement`}>
                                <Icon type="left" style={{marginRight: '16px' ,color:"#fff"}}/>
                            </Link>
                        }
                        rightContent={
                            <a onClick={this.submit}>完成</a>
                        }
                    >订单添加</NavBar>
                </div>
                <div style={{ marginBottom: 5 }}>
                    <List style={{ backgroundColor: 'white'}} className="picker-list">
                        <Picker
                            data={this.state.customer} extra={this.state.customerName} cols={1} onOk={(v)=>{ this.customerWay(v)}}
                        >
                            <List.Item arrow="horizontal">用户</List.Item>
                        </Picker>
                    </List>
                </div>
                <div>
                    <TextareaItem
                        title="备注"
                        placeholder="请填写备注"
                        rows={2}
                        onChange={(v)=>{
                            console.log(v);
                            this.mark(v);
                        }}
                    />
                </div>
                <div>
                    {
                        this.state.goodsList?
                            <GoodsList data={this.state.goodsList} onSelect={(e)=>{
                                this.select(e)
                                //接受数据
                            }} onNumChange={(n)=>{console.log(n);
                                //数量
                            }}/>
                            :
                            ""

                    }


                </div>






            </div>
        );
    }
}

// const addss = createForm()(add);

export default add