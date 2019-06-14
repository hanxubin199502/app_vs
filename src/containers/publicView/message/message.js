import React, {Component} from 'react';
import "./message.less";
import { NavBar,Icon,Tabs } from "antd-mobile";
import { StickyContainer, Sticky } from 'react-sticky';
import axios from "axios";
import {API} from "../../../const/host"

function renderTabBar(props) {
    return (<Sticky topOffset={-45}>
        {({ style }) => <div style={{ ...style, top:45, zIndex: 1 }}><Tabs.DefaultTabBar {...props} /></div>}
    </Sticky>);
}
class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs:[
                {
                    title:"未读消息",
                    value:"1"
                },
                {
                    title:"已读消息",
                    value:"2"
                }
            ]
        };
    };
    componentDidMount(){
        axios.get(`${API}/base/notic/findCome`).then(response=>{
            let res = response.data;
            console.log(res);
        })

    }
    componentWillUnmount(){
        sessionStorage.removeItem("backTo");
    }
    render() {
        return (
            <div className="message">
                <div className="message-header">
                    <NavBar
                        icon={<Icon type="left"/>}
                        onLeftClick={()=>{
                                this.props.history.push(sessionStorage.getItem("backTo"))
                            }
                        }
                    >
                        消息提醒
                    </NavBar>
                </div>
                <div className="message-body">
                    <StickyContainer>
                    <Tabs tabs={this.state.tabs}
                          initalPage={'t2'}
                          renderTabBar={renderTabBar}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                            Content of first tab
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '250px', backgroundColor: '#fff' }}>
                            Content of second tab
                        </div>
                    </Tabs>
                </StickyContainer>
                </div>
            </div>
        )
    }
}

export default Message