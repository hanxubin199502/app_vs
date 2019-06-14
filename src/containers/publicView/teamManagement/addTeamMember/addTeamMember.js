import React, {Component} from 'react';
import {NavBar,Icon,InputItem,List,Picker,Button,WingBlank,Toast,Modal} from "antd-mobile"
import "./addTeamMember.less";
import {HOST,API} from "../../../../const/host";
import axios from "axios";
const Item = List.Item;
const alert = Modal.alert;
class AddTeamMember extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roleCode:JSON.parse(sessionStorage.getItem("user")).roleCode,
            backLink:"",
            id:"",
            org:"",
            orgId:"",
            role:"",
            roleId:"",
            userName:"",
            nickName:"",
            mobile:"",
            password:"",
        };
        this.selectDone = this.selectDone.bind(this)
        this.setValue = this.setValue.bind(this)
        this.submit = this.submit.bind(this)
        this.del = this.del.bind(this)
    };
    componentDidMount(){
        this.setState({
            backLink:this.state.roleCode === "subadmin"?"/team":"/index/team"
        });
        //请求组织列表
        axios.post(`${API}/sys/org/list`,{}).then(response=>{
            let res = response.data;
            if(res.result){
                console.log(res.data);
                res.data.forEach(v=>{
                    v.label = v.orgName;
                    v.value = v.id
                });
                this.setState({
                    org:res.data
                })
            }
        });
        //请求角色列表
        axios.get(`${API}/sys/user/addPre`).then(response=>{
            let res = response.data;
            if(res.result){
                res.data.forEach(v=>{
                    v.label = v.roleName;
                    v.value = v.id;
                    if(this.state.roleCode === v.roleCode){
                        this.setState({
                            roleId:v.id
                        })
                    }
                });

                this.setState({
                    role:res.data
                })

            }
        });
        //查看的时候，请求数据回显
        if(this.props.match.params.id){
            axios.get(`${API}/sys/user/updatePre`,{
                params:{ id:this.props.match.params.id }
            }).then(response=>{
                let res = response.data;
                if(res.result){
                    this.setState({
                        orgId:res.data.orgId,
                        roleId:res.data.roleId,
                        nickName:res.data.nickName,
                        mobile:res.data.mobile,
                        userName:res.data.userName
                    });
                    console.log(res.data);
                }
            });
        }


    }
    selectDone(val,name){
        this.setState({
            [name]:val[0]
        })
    }
    setValue(val,name){
        this.setState({
            [name]:val
        })
    }
    del(){
        alert('确认删除吗?', '', [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '确认', onPress: () => {
                    axios.get(`${API}/sys/user/del`,{params:{id:this.props.match.params.id}}).then(response=>{
                        let res = response.data;
                        if(res.result){
                            setTimeout(()=>{
                                this.props.history.push(this.state.backLink)
                            },1000)
                        }
                        Toast.info(res.msg,1);
                    })
            } },
        ])

    }
    submit(){
        let submitData = {
            roleId:this.state.roleId,
            userName:this.state.userName,
            nickName:this.state.nickName,
            mobile:this.state.mobile,
            password:this.state.password,
        };
        if(this.state.roleCode !== "subadmin"){
            submitData = {
                orgId:this.state.orgId,
                roleId:this.state.roleId,
                userName:this.state.userName,
                nickName:this.state.nickName,
                mobile:this.state.mobile,
                password:this.state.password,
            };

        }
        for(let k in submitData){
            if(submitData[k] === ""){
                Toast.fail("请检查是否全部填写",1)
                return
            }
        }
        console.log(submitData);
        axios.post(`${API}/sys/user/add`,submitData).then(response=>{
            let res = response.data;
            if(res.result){
                Toast.success(res.msg,1);
                setTimeout(()=>{
                    this.props.history.push(this.state.backLink)
                },1000)
            }else{
                Toast.fail(res.msg);
            }
            console.log(res)
        })

    }

    render() {
        return (
            <div className="add-team-member">
                <div className="add-team-member-header">
                    <NavBar
                        mode="dark"
                        icon={<Icon type="left"/>}
                        onLeftClick={()=>this.props.history.push(`${HOST}${this.state.backLink}`)}
                    >新增团队成员</NavBar>
                </div>
                <div className="add-team-member-body">
                    <List>
                        <InputItem placeholder="请输入账户" value={this.state.userName} style={{textAlign:"right"}} onChange={(val)=>this.setValue(val,"userName")}>账户</InputItem>
                        {
                            this.props.match.params.id?
                                ""
                                :
                                <InputItem placeholder="请输入密码" type="password" style={{textAlign:"right"}} onChange={(val)=>this.setValue(val,"password")}>密码</InputItem>

                        }

                        <InputItem placeholder="请输入昵称" value={this.state.nickName} style={{textAlign:"right"}} onChange={(val)=>this.setValue(val,"nickName")}>昵称</InputItem>
                        {
                            this.state.roleCode === "subadmin"?
                                ""
                                :
                                this.state.org?
                                    <Picker data={this.state.org} cols={1} onOk={(val)=>{this.selectDone(val,"orgId")}} value={[this.state.orgId]}>
                                        <List.Item arrow="horizontal">组织</List.Item>
                                    </Picker>
                                    :
                                    <InputItem placeholder="组织列表加载中..." editable={true}style={{textAlign:"right"}}>组织</InputItem>
                        }
                        {
                            this.state.roleCode === "subadmin"?
                                <InputItem value="销售" editable={false} style={{textAlign:"right"}}>角色</InputItem>
                                :
                                this.state.role?
                                    <Picker data={this.state.role} cols={1} onOk={(val)=>{this.selectDone(val,"roleId")}} value={[this.state.roleId]}>
                                        <List.Item arrow="horizontal">角色</List.Item>
                                    </Picker>
                                    :
                                    <InputItem placeholder="角色列表加载中..." editable={true}style={{textAlign:"right"}}>角色</InputItem>
                        }
                        <InputItem placeholder="请输入电话"  value={this.state.mobile} style={{textAlign:"right"}} onChange={(val)=>this.setValue(val,"mobile")}>电话</InputItem>
                    </List>
                    <WingBlank style={{marginTop:15}}>
                        {
                            this.props.match.params.id?
                                <Button type="primary" onClick={this.del}>删除</Button>
                                :
                                <Button type="primary" onClick={this.submit}>提交</Button>

                        }
                    </WingBlank>
                </div>
            </div>
        )
    }
}

export default AddTeamMember