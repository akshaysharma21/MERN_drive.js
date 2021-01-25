import React, {Component} from 'react';
import axios from 'axios';
import {store} from 'react-notifications-component';

const URL = "http://localhost:5000/users/getUser";

export default class SignIn extends Component{

    constructor(props){
        super(props);

        //here we bind the methods we wrote down there to use the correct this
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.showPasswordHandler = this.showPasswordHandler.bind(this);

        //you don't declare variables in react like you do in javascript, instead, you make a state and 
        //declare and manipulate variables in a state. This way, whenever a state is updated, react updates the webpage.
        this.state = {
            username: '',
            password: ''
        }
    }

    

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        })
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    showPasswordHandler(e) {
        var x = document.getElementById("pwShow");
        if(e.target.checked){
            x.type = "text"
        }
        else{
            x.type = "password"
        }
        
    }

    onSubmit(e) {
        e.preventDefault();

        const user = {
            user: this.state.username,
            password: this.state.password
        }
        console.log(user);

        axios.post(URL, user)
            .then(res => {
                console.log(res.data);
                if(res.data.result === 'user not found!'){
                    store.addNotification({
                        title : 'Error!',
                        message: 'User ' + res.data.user + ' not found!',
                        type: "danger",
                        insert: 'top',
                        container: 'bottom-right',
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: true
                        }
                    });
                }
                else if(res.data.result === 'success'){
                    sessionStorage.setItem('user', res.data.user);
                    store.addNotification({
                        title : 'Login Successful!',
                        message: 'Welcome back ' + res.data.user,
                        type: "success",
                        insert: 'top',
                        container: 'bottom-right',
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: true
                        }
                    });
                }
                else if(res.data.result === 'password incorrect'){
                    store.addNotification({
                        title : 'Password Incorrect!',
                        message: 'user: '+ res.data.user +' and password don\'t match',
                        type: "danger",
                        insert: 'top',
                        container: 'bottom-right',
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: true
                        }
                    });
                }
            })
            .catch(err =>{
                store.addNotification({
                    title : 'Error!',
                    message: err.response.data,
                    type: "danger",
                    insert: 'top',
                    container: 'bottom-right',
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                })
            });

        // This time, we wanna keep the user on the same page so that they can input multiple users at the same time.
        // To do this, we set the username to an empty string so that they have another slot to enter.
        this.setState({
            username: '',
            password: ''
        })
    }



    render(){
        return(
            <div>
                <h3>
                    Sign in with an existing acount
                </h3>
                <form onSubmit={this.onSubmit}>
                    <div className='form-group'>
                        <label>Username: </label>
                        <input type="text"
                            className="form-control"
                            value={this.state.username}
                            onChange={this.onChangeUsername}/>
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input id="pwShow"
                             type="password"
                            className="form-control"
                            value={this.state.password}
                            onChange={this.onChangePassword}/>
                    </div>
                    <div>
                        <label>Show password &nbsp;</label>
                        <input type="checkbox" onClick={this.showPasswordHandler}/>
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Sign in" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        );
    }
}