import React from 'react';
import "./ChatBox.css";
class ChatBox extends React.Component {
    handleKeyPress = (e)=>{
        this.props.handleKeyPress(e)
    }
    handleOnChange = (e) => {
        this.props.handleOnChange(e);
    }
    handleSubmit = (e) =>{
        this.props.handleSubmit(e);
    }
    render() {
        return(
            <div>
                {(this.props.state.receiver!=="" && this.props.state.loading===false) ? (
                    <div id="chat">
                        <div id="chat-box">
                                {this.props.state.messages.map((msgs,index)=> {
                                    if(msgs.isUserSender===true){
                                        return <div id="userIsSender" key={index}>{msgs.message}</div> 
                                    } else{
                                        return <div id="userIsNotSender" key={index}>{msgs.message}</div>
                                    }
                                })}
                        </div>
                        <div id="form">
                            <form onSubmit={(e)=>this.handleSubmit(e)}>
                                <input id="formInput" type="text-area" value={this.props.state.message} onChange= {(e)=>this.handleOnChange(e)} onKeyPress={(e)=>this.handleKeyPress(e)}/>
                                <button style={{margin:5}} onClick={(e)=>this.handleSubmit(e)}>Submit</button>
                            </form>
                        </div>

                    </div>
                    ): this.props.state.loading===true? <h3>LOADING ...</h3>: <div></div>}
            </div>

        );
    }

}

export default ChatBox;