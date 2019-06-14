import React, {Component} from 'react';
import {NavBar,List,Icon,Popover,Pagination} from "antd-mobile";
import axios from "axios";
import {Link} from "react-router-dom";
import {HOST,API} from "../../../const/host";
import "./teamManagement.less"
import convertTime from "../../../util/convertTime"
const Item = List.Item;
const Brief = Item.Brief;


class TopManagerTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            currentPage :1,
            pageSize : 5,
            total:0,
            roleCode:JSON.parse(sessionStorage.getItem("user")).roleCode,
            visible:false,
            hasBeenBottom:false
        };
        //this.handleScroll = this.handleScroll.bind(this)
        this.fetchData = this.fetchData.bind(this);
        this.pagination = this.pagination.bind(this)

    };
    componentDidMount(){
        //window.addEventListener('scroll', this.handleScroll);

        this.fetchData()

    }
    pagination(val){
        console.log(val);
        this.setState({
            currentPage:val
        },()=>{
            this.fetchData()
        })

    }
/*    handleScroll(){
        //滚动请求分页
        let totalHeight = document.body.scrollHeight;
        let scrolledTop = window.scrollY;
        let screenHeight = document.body.clientHeight;
        console.log(totalHeight,scrolledTop,screenHeight)
        if(scrolledTop+screenHeight==totalHeight){
            this.setState({
                currentPage:this.currentPage +1
            },()=>{
                this.fetchData()
            })
        }
    };*/
    fetchData(){
        axios.post(`${API}/sys/user/mlist`,{pageSize:this.state.pageSize,currentPage:this.state.currentPage}).then(response=>{
            let res = response.data;
            if(res.totalElements.length!==0){
                console.log(res);
                this.setState({
                    data:res.content,
                    total:res.totalPages
                });
            }
        });
    }
    render() {
        let leftLink = this.state.roleCode === "subadmin"?"/index/branchUserCenter":"/teamSearch";;
        return (
            <div className="top-manager-team">
                <div className="top-manager-team-header">
                    <NavBar
                        mode="dark"
                        leftContent={<Icon type={this.state.roleCode === "subadmin"?"left":"search"}/>}
                        onLeftClick={()=>{this.props.history.push(`${HOST}${leftLink}`)}}
                        rightContent={
                            this.state.roleCode === "subadmin"?
                                <Popover
                                         overlayClassName="fortest"
                                         overlayStyle={{ color: 'currentColor' }}
                                         visible={this.state.visible}
                                         overlay={[
                                             (<Popover.Item key="4"><div onClick={()=>{this.props.history.push(`${HOST}/addTeamMember`)}}>新增</div></Popover.Item>),
                                             (<Popover.Item key="5" style={{ whiteSpace: 'nowrap' }} ><div onClick={()=>{this.props.history.push(`${HOST}/teamSearch`)}}>搜索</div></Popover.Item>),

                                         ]}
                                         triggerStyle={{
                                             position:"relative",
                                             zIndex:9999
                                         }}
                                         align={{
                                             overflow: { adjustY: 0, adjustX: 0 },
                                             offset: [-10, 0],
                                         }}
                                         /*onVisibleChange={this.handleVisibleChange}
                                         onSelect={this.onSelect}*/
                                >
                                    <div style={{
                                        height: '100%',
                                        padding: '0 15px',
                                        marginRight: '-15px',
                                        display: 'flex',
                                        alignItems: 'center',

                                    }}
                                    >
                                        <Icon type="ellipsis" />
                                    </div>
                                </Popover>
                                :
                            <div onClick={()=>{}}>新增</div>
                        }
                    >
                        团队管理
                    </NavBar>
                </div>
                <div className="top-managger-team-body">
                    <List>
                        {
                            this.state.data.length === 0?
                                ""
                                :
                                this.state.data.map((v,i)=>(
                                    <Link  key={i} to={`${HOST}/editTeamMember/${v.id}`}>
                                        <Item arrow="horizontal" multipleLine onClick={() => {}}>
                                            <div className="team-member">
                                                <div className="name">{v.nickName}</div>
                                                <div className="phone">{v.mobile}</div>
                                            </div>
                                            <Brief>{convertTime(v.createTime)}</Brief>
                                        </Item>

                                    </Link>

                                ))
                        }
                    </List>
                    {
                        this.state.data.length === 0?
                            ""
                            :
                            <div className="pagination">
                                <Pagination total={this.state.total}
                                            className="custom-pagination-with-icon"
                                            onChange={(val)=>this.pagination(val)}
                                            current={this.state.currentPage}
                                            locale={{
                                                prevText: (<span className="arrow-align"><Icon type="left" />上一页</span>),
                                                nextText: (<span className="arrow-align">下一页<Icon type="right" /></span>),
                                            }}
                                />
                            </div>

                    }
                </div>
            </div>
        )
    }
}

export default TopManagerTeam