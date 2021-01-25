import React, {Component} from 'react';
import axios from 'axios';
import {store} from 'react-notifications-component';

const ReactDOM = require('react-dom');
const { v4: uuidv4 } = require('uuid');

export default class ViewGallery extends Component{

    state={
        images: [],
        username: 'Akshay'
    };

    getImageHandler = (event) => {

        console.log('image handler executed!');
        if(sessionStorage.user==undefined){
            store.addNotification({
                title : 'Error!',
                message: 'Please Sign in first.',
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
        else{
            axios.get("http://localhost:5000/Images/"+ sessionStorage.user +"/getDev")
                .then(res => {
                    // console.log("Response: " + res);
                    
                    console.log(res.data);
                    var img = {filename : res.data[0]['file']['filename']};
                    var i = 0;
                    var el;
                    res.data.forEach(element => {
                        axios.post("http://localhost:5000/Images/getImage", {filename : element['file']['filename'], imgName : element.name})
                        .then(res => {
                            // console.data(res.data);
                            var joined = this.state.images.concat(res.data.data);
                            this.setState({images : joined});
                            console.log('done');
                            var imgArray = [];
                            var toAddNameSplit = res.data.name.split('.');
                            var toAddType = toAddNameSplit[toAddNameSplit.length-1];
                            var toAdd = '';
                            if(toAddType=='jpg'){
                                toAdd = <img key={uuidv4().toString()} borderColor= 'gray' borderWidth= '5' width="240" height="320" src={`data:image/jpeg;base64, ${this.state.images[i]}`} />
                            }
                            else if(toAddType=='mp4'){
                                toAdd = (<video key={uuidv4().toString()} width="320" height="240" controls>
                                    <source src={`data:video/mp4;base64,${this.state.images[i]}`} type="video/mp4"/>
                                </video>);
                            }

                            if(!el){
                                el = (<div>{toAdd}</div>)
                            }
                            else if( i == 1){
                                imgArray.push(el.props.children)
                                imgArray.push(toAdd);
                                el = (<div>{imgArray}</div>);
                            }
                            else{
                                console.log(el.props['children'].props);
                                for(var j = 0; j<el.props['children'].length; j++){
                                    imgArray.push(el.props.children[j]);
                                }
                                imgArray.push(toAdd);
                                el = (<div>{imgArray}</div>);
                            }

                            ReactDOM.render(el, document.getElementById('imageContainer'));
                            
                            i++;
                        })
                    //  break;
                    });
                })
                .catch( (err) => {
                    console.log("Error recieved: " + err);
                });
            }
    }

    render(){
        return(
            <div>
                <p>You are on the image gallery component.</p>
                <button onClick={this.getImageHandler}>load images!</button>
                <div id='imageContainer'>
                    {/* <img id='img1' src={`data:video/mp4;base64, ${this.state.images[0]}`} /> */}
                    
                </div>
            </div>
        );
    }
}