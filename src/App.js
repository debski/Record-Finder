import React, { Component } from 'react';
import Axios from 'axios';
import Home from './Home';
import Results from './Results';


class App extends Component {

  constructor(props) {
    super(props);
    
    this.state = {};

    //Return from Spotify auth
    if (!this.state.spotifyToken && window.location.hash.indexOf('access_token') > -1) {
      this.state.spotifyToken = /#access_token=([^&]+)/g.exec(window.location.hash)[1];
      
      var storedParsedImage = localStorage.getItem('parsedImage')
      if (storedParsedImage) {
        this.state.parsedImage = JSON.parse(storedParsedImage);
        localStorage.removeItem('parsedImage');
      }
    }

    this.fileUploaded = this.fileUploaded.bind(this);
  }

  fileUploaded(e) {
    var reader = new FileReader();

    reader.onloadend = () => {
      var base64 = reader.result.replace(/^data:image\/(png|jpg|jpeg);base64,/, "")

      Axios.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAKEp6Esra-jJCXT9rhmp4v4HmYni0mDmE', {
        "requests": [
          {
            "image": {
              "content": base64
            },
            "features": [
              {
                "type": "TEXT_DETECTION"
              }
            ]
          }
        ]
      })
      .then((response) => {

        var text = '';


        if (!response.data.responses || !response.data.responses[0].textAnnotations) {
          alert('Couldn\'t find any text in the photo. Please try again!')
          return;
        }
        
        response.data.responses[0].textAnnotations.forEach(function(element) {
          if (!element.locale && parseInt(element.description) != element.description) {
            text += element.description + ' ';
          }
        });

        var parsedImage = {
          'imageData' : reader.result,
          'parsedText' : text
        };

        localStorage.setItem('parsedImage', JSON.stringify(parsedImage));

        this.setState({ 'parsedImage' : parsedImage});
      })
      .catch((error) => {
        alert('Finding text failed. Please try again!')
        console.log(error);
      });



    };

    if (e.target.files) {
      reader.readAsDataURL(e.target.files[0]);
    }
  }
  render() {
    if (this.state.parsedImage) {
      return (<Results spotifyToken={this.state.spotifyToken} parsedImage={this.state.parsedImage} />);
    } else {
      return (<Home onStartClicked={this.spotifySignIn} onFileUploaded={this.fileUploaded}/>);
    }
  }
}

export default App;
