import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from "./redux/store"
import { withRouter,BrowserRouter,Route,Switch } from 'react-router-dom';
import Login from './containers/login/login'
import Router from './router';
import './App.css'


class App extends Component {
    componentWillMount(){

    }
    componentDidMount(){

    }

  render() {
    return (
        <Provider store = { store }>
            <div className="App" >
                <BrowserRouter>
                    <Switch>
                        <Route path="/login" component={Login}></Route>
                        <Router></Router>
                    </Switch>

                </BrowserRouter>

            </div>
        </Provider>

    );
  }
}

export default App;
