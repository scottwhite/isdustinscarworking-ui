import React, { Component } from 'react';
import './index.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import actions from './actions';
import Car from './car';


class Main extends Component {
  componentDidMount(){
    this.props.fetchStatus();
    let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }
  render() {
    let {error, status} = this.props;
    console.log(status);
    let qclass = '';
    if(status){
      qclass = 'question';
    }
    return (
      <div>
      <Car working={status}/>
      <p className={qclass}>Is Dustin's car working?</p>
      </div>
    );
  }
}


const mapStateToProps = (state, props) => {
  console.log(state);
  console.log(props);
  const { status, error } = state.status;
  return {
    status,
    error
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);
