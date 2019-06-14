import React, {Component} from 'react';
import { SearchBar, WhiteSpace,NavBar ,Icon,WingBlank,} from 'antd-mobile';
import {HOST,API} from "../../../../const/host";
import { Link } from 'react-router-dom';
import './searchs.less';
import axios from "axios/index";
//const API = "http://192.168.31.13:8080";

class Searchs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content:""
        };
        this.submit = this.submit.bind(this)
    };

//搜索
    submit(value){
        let customerName = value;
        axios.post(`${API}/base/visitPlan/findAll`,{customerName}).then((response)=>{
            console.log(response.data)
            let res = response.data;
            this.setState({
                content:res
            });
        })

    }

    render() {
        return (
            <div className="sub-title">
                <div className="visit-plan" >
                    <div className="visit-smile">
                        <NavBar
                            mode="dark"
                            icon={<Icon type="left" />}
                            onLeftClick={() => {this.props.history.push(`../index/visitPlan`)}}
                            rightContent={
                                <Link to={`${HOST}/addVisitPlan`} style={{color:"white"}}>
                                    <Icon key="1" type="" />
                                </Link>
                            }
                        >搜索</NavBar>
                    </div>

                </div>
                <SearchBar placeholder="点击查询"
                           ref={ref => this.autoFocusInst = ref}
                           onSubmit={(value)=>{this.submit(value)}}
                />
                <WhiteSpace />
                {
                    this.state.content?
                        this.state.content.map((v=>
                                    <Link to={`${HOST}/visitDetail/${v.id}`} key={v.id}>
                                        <div className="goods-item ">
                                            <WingBlank className="big-title">
                                                <div className ="title" >
                                                    <p>客户名称：{v.customerName}</p>
                                                    <p>[客户]：{v.status}</p>
                                                </div>
                                                <div className="next-text">
                                                    <p>{v.visitTime}</p>
                                                </div>
                                            </WingBlank>
                                        </div>
                                    </Link>
                            )
                        )
                        :""
                }
            </div>
        )
    }
}

export default Searchs