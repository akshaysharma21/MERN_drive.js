import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";

const URL_users = "http://localhost:5000/users/";
const URL_exercises = "http://localhost:5000/exercises/add"
//exercise component that will be rendered in the main app is exported from this class
export default class CreateExercise extends Component{
    constructor(props){
        super(props);

        //here we bind the methods we wrote down there to use the correct this
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        //you don't declare variables in react like you do in javascript, instead, you make a state and 
        //declare and manipulate variables in a state. This way, whenever a state is updated, react updates the webpage.
        this.state = {
            username: '',
            description: '',
            duration: 0,
            date: new Date(),
            users: []
        }
    }

    //this is one of the react lifecycle methods that react will call at a certain point in the execution
    //componentDidMount is called right before anything (the component) is displayed on the page
    componentDidMount() {
        // code to create a stub on the startup
        // console.log(this);
        // this.setState({
        //     users: ['Test User'],
        //     username: 'Test User'
        // })
        
        // Code to get a list of exercises from the backend and add them to the users array
        axios.get(URL_users)
            .then(response => {
                if (response.data.length > 0) {
                    this.setState({
                        users: response.data.map(user => user.username),
                        username: response.data[0].username
                    })
                }
            })
    }

    //Methods for changing the states
    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        })
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        })
    }

    onChangeDuration(e) {
        this.setState({
            duration: e.target.value
        })
    }

    onChangeDate(date) {
        this.setState({
            date: date
        })
    }

    //this method is there to prevent the default action on submission of the form and instead
    //execute the code that we wrote for it
    onSubmit(e) {
        e.preventDefault();

        const exercise = {
            username: this.state.username,
            description: this.state.description,
            duration: this.state.duration,
            date: this.state.date
        }

        axios.post(URL_exercises, exercise)
            .then(res => console.log(res.data));

        console.log(exercise);

        window.location = '/'; //send the user to the homepage on submit
    }

    //main render method
    render() {
        return(
            //add the form code for this component
            <div>
                <h3>Create New Exercise Log</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <select ref="userInput"
                            required
                            className="form-control"
                            value={this.state.username}
                            onChange={this.onChangeUsername}>
                                {
                                    //here we will use our state to retuen someting to the frontend
                                    //in the select box, we have some options and to populate it, we 
                                    //will get the users directly from the users array
                                    this.state.users.map(function(user){
                                        return <option
                                        key={user}
                                        value={user}>
                                            {user}
                                        </option>
                                    })
                                }
                            </select>
                    </div>
                    <div className="form-group"> 
                        <label>Description: </label>
                        <input  type="text"
                                required
                                className="form-control"
                                value={this.state.description}
                                onChange={this.onChangeDescription}
                        />
                    </div>
                    <div className="form-group">
                        <label>Duration (in minutes): </label>
                        <input 
                            type="text" 
                            className="form-control"
                            value={this.state.duration}
                            onChange={this.onChangeDuration}
                        />
                    </div>
                    <div className="form-group">
                        <label>Date: </label>
                        <div>
                            <DatePicker
                            selected={this.state.date}
                            onChange={this.onChangeDate}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Create Exercise Log" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}