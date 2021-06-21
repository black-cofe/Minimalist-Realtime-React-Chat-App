import React, { Component } from 'react';
import './App.css';
import Form from '../Form/Form.js';
import firebase from 'firebase';
import firebaseConfig from '../../config';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app(); // if already initialized, use that one
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      email:"",
      loading:true,
      redAlert:false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      console.log(user);
      this.setState({user:user,loading:false });
    });
  }
  handleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }
  handleLogOut() {
    firebase.auth().signOut();
  }
  handleChange= (e)=> {
    this.setState({email:e.target.value});
  }
  validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  async handleSubmit(e){
    if (this.validateEmail(this.state.email)){
      if (this.state.user && this.state.loading===false){
        const userInfo = this.state.user.v.src;
        const db = firebase.firestore();
        var uniqueId = null;
        if (this.state.email<userInfo.email){
          uniqueId = this.state.email.concat(userInfo.email);
        }else if(this.state.email>userInfo.email) {
          uniqueId = userInfo.email.concat(this.state.email);
        }
        if(uniqueId){
          await db.collection("contacts").doc(uniqueId).set({user1:userInfo.email,user2:this.state.email});
          window.location.reload();
        }else {
          console.log("Can't be same as yourself")
          this.setState({email:""});
        }
      }
    }else{
      this.setState({redAlert:true});
    }


  }
  render() {
    var userInfo=null;
    (this.state.user)?
    userInfo = this.state.user.v.src: userInfo=null;
    return (
      <div id="app">
          { !this.state.user ? (
            <button
              id="logIn"
              onClick={this.handleSignIn.bind(this)}
            >
              Google Log In
            </button>
          ) : (
            <div>
              <button
                id="logOut"
                onClick={this.handleLogOut.bind(this)}
              >
                Logout
              </button>
            </div>
          )}

          {(this.state.loading===false && this.state.user)?
          <div>
            <div id="nav">
              <img id="img" src={userInfo.photoURL} alt="User"/>
              <h3>{userInfo.displayName}</h3>
            </div>
            <div style={{marginLeft:"3%"}}>
              <input value={this.state.email} type="email" id="email" placeholder="Email" class={(this.state.redAlert)?"has-error":"email"} onChange={this.handleChange}/>
              <button onClick={this.handleSubmit}>Chat with this Email</button>
            </div>
          </div>: (this.state.user)?<h3>Loading...</h3> : <div></div> 
          }
          {this.state.user && this.state.loading===false? <Form user={this.state.user}/> : (this.state.user)?<h3>Loading...</h3>:<div></div>}
      </div>
    );
  }
}
export default App;

