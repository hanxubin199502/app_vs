import React, {Component} from 'react';
import { NavBar, Icon } from 'antd-mobile';
class MaterialApply extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    };

    render() {
        return (
            <div className="material-apply">
                <NavBar
                    mode="dark"
                    leftContent="Back"
                    rightContent={[
                        <Icon key="0" type="search" style={{ marginRight: '16px' }} />,
                        <Icon key="1" type="ellipsis" />,
                    ]}
                >物料申请</NavBar>
                materialapply
            </div>
        )
    }
}

export default MaterialApply