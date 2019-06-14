import React, {Component} from 'react';
import { NavBar,Icon } from "antd-mobile";
import "./previewimg.less";
import { HOST } from "../../../const/host"
class PreviewImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgs:[]
        };
    };
    componentDidMount(){
        console.log(JSON.parse(sessionStorage.getItem("preview")));
                this.setState({
                    imgs:JSON.parse(sessionStorage.getItem("preview"))
                })
    }
    componentWillUnmount(){
        sessionStorage.removeItem("preview")
        sessionStorage.removeItem("backTo")
    }

    render() {
        return (
            <div className="preview-img">
                <div className="preview-img-header">
                    <NavBar
                        mode="dark"
                        icon={<Icon type="left"/>}
                        onLeftClick={()=>{
                            this.props.history.push(sessionStorage.getItem("backTo"))
                        }}
                    >
                        查看转账凭证
                    </NavBar>
                </div>
                <div className="preview-img-body">
                    {
                        this.state.imgs.map(v=>(
                            <img src={v} key={v} alt=""/>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default PreviewImg