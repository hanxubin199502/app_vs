import React, {Component} from 'react';
import { NavBar } from 'antd-mobile';
import GoodsList from "../../../components/goodsList/goodsList";
import { HOST,API } from "../../../const/host"
import axios from "axios";
import './purchase.less';
class Purchase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goods:[],
            selectedGoods:[],
            nums:[]
        };
        this.selectGood = this.selectGood.bind(this);
        this.numChange = this.numChange.bind(this);
        this.submitOrder = this.submitOrder.bind(this)
    };
    componentDidMount(){
        axios.post(`${API}/base/stockInfo/findAllStockInfo`).then(response=>{
            if(response){
                let res = response.data;
                this.setState({
                    goods:res
                },()=>{
                    console.log(this.state.goods)
                })

            }

        })
    }
    selectGood(data){
        this.setState({
            selectedGoods:data
        })

    };
    numChange(data){
/*        this.setState({
            nums:data
        })*/
    }
    submitOrder(){
/*        this.state.nums.forEach(v=>{
            v = parseInt(v)
        });
        this.state.goods.findIndex((v,i)=>{
            this.state.selectedGoods.forEach(k=>{
                if(k.id === v.id){
                    //k.num = this.state.nums[i]
                }
            })
        });*/

        this.props.history.push(`${HOST}/pay`);

        sessionStorage.setItem("goodsData",JSON.stringify(this.state.selectedGoods))
    }
    render() {
        return (
            <div className="purchase">
                <div className="header">
                    <NavBar
                        mode="dark"
                        rightContent={
                            this.state.selectedGoods.length === 0?
                                "":
                            <div onClick={this.submitOrder}>
                                下单({this.state.selectedGoods.length})
                            </div>
                        }
                    >商品采购</NavBar>
                </div>

                <div className="pruchase-body">
                    {
                        this.state.goods.length!==0?
                            <GoodsList data={this.state.goods} onSelect={this.selectGood} onNumChange={this.numChange}/>
                            :
                            ""
                    }

                </div>
            </div>
        )
    }
}

export default Purchase