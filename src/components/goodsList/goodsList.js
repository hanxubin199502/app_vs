import React, {Component} from 'react';
import {WingBlank} from "antd-mobile";
import QueueAnim from 'rc-queue-anim';
import './goodsList.less';

class GoodsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasSelected:[],
            isSelected:false,
            nums:[]
        };
        this.selecteItem = this.selecteItem.bind(this)
        this.changeNum = this.changeNum.bind(this)
        this.add = this.add.bind(this)
        this.sub = this.sub.bind(this)
    };

    componentWillMount(){

        this.props.data.forEach(v=>{
            this.state.nums.push(1)
        })

    }
    selecteItem(e,index){
        let selects = document.getElementsByClassName("select");
        let tempArr = []
        if(e.target.className === "select"){
            e.target.className = "select select-active"
        }else{
            e.target.className = "select"
        }
        for(let i = 0;i<selects.length;i++){
            if(selects[i].className === "select select-active"){
                tempArr.push(this.props.data[i]);
            }
        }
        this.props.onSelect(tempArr)
    }
    changeNum(e,i){
        //this.props.onNumChange(e.target.value)
        this.state.nums[i] = e.target.value
        this.setState({},()=>{
            this.props.data[i].num = this.state.nums[i]
            this.props.onNumChange(this.state.nums)
        })

    }
    add(i){
        this.state.nums[i]++;
        this.setState({},()=>{
            this.props.data[i].num = this.state.nums[i]
            this.props.onNumChange(this.state.nums);

        })


    }
    sub(i){ 
        if(this.state.nums[i]>0){
            this.state.nums[i]--;
            this.setState({},()=>{
                this.props.data[i].num = this.state.nums[i]
                this.props.onNumChange(this.state.nums)

            })
        }

    }
    render() {
        /*

        * */
        return (
            <QueueAnim delay={300} type="top" className="goods-list">
                {
                    this.props.data.map((v,i)=>
                        <div className="goods-item" key={i}>
                            <WingBlank>
                                <div className="title">{v.goodsName}</div>
                                <div className="info">
                                    <div className="size"><span>型号</span>{v.modelSize}</div>
                                    <div className="price"><span>¥</span>{parseInt(v.price).toFixed(2)}</div>
                                </div>
                                <div className="option">
                                    <div className="num">
                                        <div className="change-num">
                                            <div className="sub" onClick={()=>{this.sub(i)}}>-</div>
                                            <input type="text" value={this.state.nums[i]} onChange={(e)=>{this.changeNum(e,i)}}/>
                                            <div className="add" onClick={()=>{this.add(i)}}>+</div>
                                        </div>

                                        <span className="unit">{v.units}</span>

                                    </div>
                                    <div ref = "item" className="select" onClick={(e)=>{this.selecteItem(e,i)}}> </div>

                                </div>

                            </WingBlank>

                        </div>
                    )
                }
            </QueueAnim>
        )
    }
}

export default GoodsList