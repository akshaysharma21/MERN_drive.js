import React, {Component} from 'react';

export default class EditExercise extends Component{
    constructor(props){
        super(props);

        //here we bind the methods we wrote down there to use the correct this
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        //you don't declare variables in react like you do in javascript, instead, you make a state and 
        //declare and manipulate variables in a state. This way, whenever a state is updated, react updates the webpage.
        this.state = {
            username: '',
        }
    }

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const user = {
            username: this.state.username
        }
        console.log(user);

        // This time, we wanna keep the user on the same page so that they can input multiple users at the same time.
        // To do this, we set the username to an empty string so that they have another slot to enter.
        this.setState({
            username: ''
        })
    }
    
    render() {
        return(
            <div>
                <p>You are on the edit-Exercise page!</p>
            </div>
        )
    }
}