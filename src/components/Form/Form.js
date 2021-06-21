import React, { Component } from 'react';
import ChatBox from "../ChatBox/ChatBox";
import './Form.css';

import firebase from 'firebase';


class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sender: "iamsumeet.bhar@gmail.com",
      receiver: "",
      message: "",
      messages: [],
      emails: [],
      loading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
  }

  handleOnChange = (e) => {
    this.setState({message: e.target.value})
  }
  handleKeyPress = (e) => {
    if (e.target.value !=="Enter") return;
    this.handleSubmit(e);

  }

  compare = ( a, b ) => {
    if ( a.createdAt < b.createdAt ){
      return -1;
    }
    if ( a.createdAt > b.createdAt ){
      return 1;
    }
    return 0;
  }
  async getChat() {
    this.setState({loading:true})
    const userInfo = this.props.user.v.src;
    const db = firebase.firestore();
    const chatsRefGet1 = db.collection("user").doc(userInfo.email).collection("chatsWith").doc(this.state.receiver).collection("chats").orderBy("createdAt","desc").limit(10);
    const chatsRefGet2 = db.collection("user").doc(this.state.receiver).collection("chatsWith").doc(userInfo.email).collection("chats").orderBy("createdAt","desc").limit(10);
    // this.setState({message:"",messages:[]});
    
    var chats = [];
    await chatsRefGet1.get().then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
          chats.push({message:doc.data().message,createdAt: doc.data().createdAt,isUserSender:true});
        });
      })
    await chatsRefGet2.get().then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        chats.push({message:doc.data().message,createdAt: doc.data().createdAt,isUserSender:false});
        });
      })
    
    chats.sort(this.compare);
    if(chats.length>10){
      chats = chats.slice(11);
    }

    this.setState({messages:chats});
    console.log(this.state.messages);
    console.log(chats);
    this.setState({loading:false});
  }
  async handleSubmit(e) {
    e.preventDefault();

    if(this.state.message!==""){
      const db  = firebase.firestore();
      const timestamp = firebase.firestore.FieldValue.serverTimestamp;
      const userInfo = this.props.user.v.src;
      const chatsRef = db.collection("user").doc(userInfo.email).collection("chatsWith").doc(this.state.receiver).collection("chats");
      await chatsRef.add({message: this.state.message,createdAt: timestamp()});
    }
    
    this.setState({message:""});
  
  }
  async componentDidMount() {
    const userInfo = this.props.user.v.src;
    const firestoreRef  = firebase.firestore();
    const emailsRef1 = firestoreRef.collection("contacts").where("user1","==",userInfo.email);
    const emailsRef2 = firestoreRef.collection("contacts").where("user2","==",userInfo.email);
    await firestoreRef.collection("user").doc(userInfo.email).set({name:userInfo.displayName, photoURL: userInfo.photoURL});  
    
    var emails = [];
    await emailsRef1.get().then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
          emails.push(doc.data().user2);
        });
      })
      await emailsRef2.get().then((querySnapshot) => {
        querySnapshot.docs.forEach((doc) => {
            emails.push(doc.data().user1);
          });
        })
    this.setState({emails:emails});
  };

  async handleEmail(email,e) {
    this.setState({receiver:email},this.getChat);
  }

  render() {
    return (
      <div className= "wrapper">
          <div id="email-list">
            <ul style={{listStyle:"none"}}>
              {this.state.emails.map((email,index) => {
                return <li key={index}><button onClick={(e) =>this.handleEmail(email,e)}>{email}</button></li>
              })}
            </ul>
          </div>
          <div id="chat-box">
            <ChatBox state={this.state} handleSubmit={this.handleSubmit} handleKeyPress={this.handleKeyPress} handleOnChange={this.handleOnChange}/>
          </div>
      </div>
    );
  }
}

export default Form;