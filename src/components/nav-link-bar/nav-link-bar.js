import React, {Component} from 'react';
import PropsTypes from 'prop-types';
import { TabBar } from 'antd-mobile';
import { withRouter,NavLink } from 'react-router-dom';
import './nav-link-bar.less';
import { HOST } from '../../const/host';
import { connect } from 'react-redux';
@withRouter

class NavLinkBar extends Component {
/*    static propTypes = {
        data:PropsTypes.array.isRequired
    };*/

    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount(){
    }
    render() {
        const navList = this.props.data;
        //console.log(navList);
        const {pathname} = this.props.location;
        const itemWidth = navList?`${100/this.props.data.length}%`:0;
        return (
            navList?
            <div className="tabbar">
                <div className="nav-bar">
                    {
                        navList.map(v=> (
                            <div className="nav-item" ref="navItem" key={v.path} style={{width:itemWidth}}>
                                <NavLink
                                    to={v.path}
                                    activeClassName="active"
                                >
                                    <div className="nav-inner">
                                        <div className="nav-icon">
                                            <span className={v.icon}></span>
                                        </div>
                                        <div className="nav-name">{v.name}</div>
                                    </div>
                                </NavLink>

                            </div>
                        ))
                    }
                </div>
            </div>
                :
                ""
        )
    }
}
export default NavLinkBar