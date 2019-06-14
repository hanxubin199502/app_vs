import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './react-cascader.css'
class ReactCascader extends Component {
    constructor(props) {
        super(props)
        this.state = {
            headerData:[
                {
                    name:"省",
                    areaType:"PROVINCE",
                    pid:"0"
                },
                {
                    name:"市",
                    areaType:"CITY",
                    pid:null
                },
                {
                    name:"县",
                    areaType:"DISTRICT",
                    pid:null
                }
            ],
            area:[],
            PROVINCE:{},
            CITY:{},
            DISTRICT:{},
            areaType:"PROVINCE",
            currentHeader:"PROVINCE"

        };
    }
    componentWillMount(){


    }
    toggleHeader(v,i){
        if(this.state.headerData[i].pid){
            this.setState({
                currentHeader:v.areaType
            });
            this.props.getData(this.state.headerData[i].pid)
            for(let k=i+1;k<this.state.headerData.length;k++){
                this.state.headerData[k].pid = null
            }
            this.setState({})
        }

    }
    loadData(id,name,areaType){
        let current = "";
        if(areaType === "PROVINCE"){
            current =  "CITY"
        }else if(areaType === "CITY" || areaType === "DISTRICT" ){
            current = "DISTRICT"
        }
        this.setState({
            [areaType]:{id,name},
            currentHeader:current
        },()=>{
            if(areaType === 'DISTRICT'){
                this.props.onOk([this.state.PROVINCE,this.state.CITY,this.state.DISTRICT])

            }else{
                this.props.getData(id);
                this.state.headerData.forEach(v=>{
                    if(v.areaType === this.state.currentHeader){
                        v.pid = id
                    }
                })
            }
        });

    }
    render() {
        const currentHeader={
            background:'#f68b0e',
            color:'#fff'
        }

        return (
            <div id="react-cascader">
                <ReactCSSTransitionGroup
                    transitionName="cascader-modal-show"
                    transitionEnterTimeout={200}
                    transitionLeaveTimeout={300}>
                    {
                        this.props.cascaderShow?
                            <div className="cascader-modal" onClick={this.props.onCancel}></div>
                            :
                            null
                    }

                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup
                    transitionName="cascader-show"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {
                        this.props.cascaderShow ?
                            <div className="cascader-wrapper">
                                <div className="cascader-header">
                                    {
                                        this.state.headerData.map((v,i)=>(
                                            <div className="cascader-title" key={i} style={v.areaType === this.state.currentHeader?currentHeader:null} onClick={this.toggleHeader.bind(this,v,i)}>{v.name}</div>
                                        ))
                                    }

                                </div>
                                <div className="cascader-body" >

                                    {

                                        this.props.data.map((v,i)=>(
                                            <div className="cascader-item" key={i} onClick={this.loadData.bind(this,v.id,v.areaName,v.areaType)} >{v.areaName}</div>
                                        ))
                                    }

                                </div>
                            </div>
                            :
                            null

                    }
                </ReactCSSTransitionGroup>

            </div>
        );
    }
}
export default ReactCascader