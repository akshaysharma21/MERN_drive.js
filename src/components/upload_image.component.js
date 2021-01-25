import axios from 'axios';
import React, {Component} from 'react';
import {store} from 'react-notifications-component';

export default class UploadImage extends Component{
    
    state={
        images: [],
        username: sessionStorage.user
    };

   fileSelectHandler = (event) => {
        console.log("file select handler executed. prev state: " + this.state.images);
        console.log(event.target.files);
        var target = [];
        for(var i = 0; i < event.target.files['length']; i++){
            target.push(event.target.files[''+i]);
        }
        console.log(target);
        this.setState({
            images: target
        }, () => {console.log('Current state: ' + this.state.images)});
   }

   fileUploadHandler = (event) => {
        if(sessionStorage.user == 'undefined'){
            store.addNotification({
                title : 'Password Incorrect!',
                message: 'Please sign in to view your gallery.',
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
            const fd = new FormData();
            var i = 0;
            for(var img of this.state.images){
                fd.append('image' + i, img, img.name);
                i++;
            }
            fd.append('username', sessionStorage.user);

            console.log(fd.getAll('image'));
            axios.post(/*"https://e84c70d56841.ngrok.io/images/addDev"*/"http://localhost:5000/images/addDev", fd ,{
                onUploadProgress: ProgressEvent => {
                    console.log('upload progress: ' + Math.round((ProgressEvent.loaded / ProgressEvent.total)*100) + '%');
                }
            })
            .then(res => {
                this.setState({images: []}, () => {console.log("state after uploading: " + this.state.images)});
                
                store.addNotification({
                    title : 'Success!',
                    message: 'Files uploaded succeefully',
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
            })
            .catch( (err) => {
                console.log("Error recieved: " + err);
            });
        }
   } 

    render() {
        return(
            <div>
                <p>You are on the Upload Image Component!</p>

                <input type="file" onChange={this.fileSelectHandler} multiple/>
                <button onClick={this.fileUploadHandler}>Upload</button>
            </div>
        )
    }
}