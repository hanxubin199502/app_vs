import React, {Component} from 'react';
import {NavBar,Icon,SearchBar,List} from "antd-mobile";
import "./teamSearch.less"
import axios from "axios"
import {HOST,API} from "../../../../const/host";
import convertTime from "../../../../util/convertTime";
const Item = List.Item;
const Brief = Item.Brief;
class TeamSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            roleCode:JSON.parse(sessionStorage.getItem("user")).roleCode,
            backLink:""
        };
        this.submit = this.submit.bind(this)
    };
    componentDidMount(){
        this.setState({
            backLink:this.state.roleCode === "subadmin"?"/team":"/index/team"
        })
    }
    submit(val){
        console.log(val);
        axios.post(`${API}/sys/user/mlist`,{pageSize:5,currentPage:1,nickName:val}).then(response=>{
            let res = response.data;
            if(res.totalElements.length!==0){
                console.log(res);
                this.setState({
                    data:res.content,
                    total:res.totalPages
                });
                this.props.history.push(this.state.backLink)
            }
        });

    }

    render() {
        return (
            <div className="team-search">
                <div className="team-search-header">
                    <NavBar
                        mode="dark"
                        icon={<Icon type="left" />}
                        onLeftClick={() => this.props.history.push(`${HOST}/index/team`)}
                    >
                        搜索团队成员
                    </NavBar>
                </div>
                <div className="team-search-body">
                    <SearchBar placeholder="搜索团队成员" onSubmit={(val)=>{this.submit(val)}}/>
                    <List style={{marginTop:0}}>
                        {
                            this.state.data.length === 0?
                                ""
                                :
                                this.state.data.map((v,i)=>(
                                    <Item arrow="horizontal" multipleLine onClick={() => {}} key={i}>
                                        <div className="team-member">
                                            <div className="name">{v.nickName}</div>
                                            <div className="phone">{v.mobile}</div>
                                        </div>
                                        <Brief>{convertTime(v.createTime)}</Brief>
                                    </Item>
                                ))
                        }
                    </List>

                </div>
            </div>
        )
    }
}

export default TeamSearch