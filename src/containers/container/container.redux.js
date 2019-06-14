const initialState={
    num:2
};
const ADD = "ADD";
const SUB = "SUB";
export function count( state=initialState,action) {
    switch (action.type){
        case ADD:
            return {...state,num:state.num+1};
        case SUB:
            return {...state,num:state.num-1};
        default:
            return state
    }
}

function addAction(){
    return {
        type:ADD
    }
}
function subAction(){
    return {
        type:SUB
    }
}

export function add() {
    return dispatch=>{
        dispatch(addAction())
    }
}
export function sub() {
    return dispatch=>{
        dispatch(subAction())
    }
}
