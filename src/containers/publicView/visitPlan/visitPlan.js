import React, {Component} from 'react';
import { NavBar, Icon,WingBlank} from 'antd-mobile';
import {HOST,API} from "../../../const/host";
import { Link } from 'react-router-dom';
import './visitPlan.less';
import axios from "axios/index";
//const API = "http://192.168.31.13:8080";
class VisitPlan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content:"",
        };

    };
    componentDidMount(){

        axios.post(`${API}/base/visitPlan/findAll`,{customerName:""}).then((response)=>{
            let res = response.data;
            this.setState({
                content:res
            })
            console.log(res);
        })
    }
    customerType(type){
        switch (type){
            case "UNEXECUTED":
                return "未执行";
                break;
            case "UNEXECUTED":
                return "已执行";
                break;
        }
    }
    render() {
        return (
            <div className="visit-plan" >
                <div className="visit-smile">
                <NavBar
                    mode="dark"
                    leftContent={
                        <Link to={`${HOST}/searchs`}>
                            <Icon key="0" type="search" style={{ marginRight: '16px',color:"white" }} />
                        </Link>
                    }
                    rightContent={
                        <Link to={`${HOST}/addVisitPlan`} style={{color:"white"}}>
                        <Icon key="1" type="" />添加
                        </Link>
                    }
                >拜访计划</NavBar>
                </div>
                {
                    this.state.content?
                    this.state.content.map((v=>
                        <Link to={`${HOST}/visitDetail/${v.id}`} key={v.id}>
                                <div className="goods-item ">
                                      <WingBlank className="big-title">
                                              <div className ="title" >
                                                  <p>客户名称：{v.customerName}</p>
                                                  <p className="stage">执行阶段：{this.customerType(v.status)}</p>
                                              </div>
                                              <div className="next-text">
                                                  <div>{v.date}</div>
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

export default VisitPlan