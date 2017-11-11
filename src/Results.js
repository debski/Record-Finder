import React, { Component } from 'react';
import Axios from 'axios';
import './Results.css';
import Logo from './Logo';


class Results extends Component {

  constructor(props) {
    super(props);

    this.state = { 'inputValue' : this.props.parsedImage.parsedText };

    this.searchSpotify();

    this.readInput = this.readInput.bind(this);
  }

  searchSpotify() {
    if (this.props.spotifyToken) {
      
      Axios.get('https://api.spotify.com/v1/search', {
        params : {
          'q' : this.state.inputValue,
          'type' : 'album'
        },
        headers : {
            'Authorization' : 'Bearer ' + this.props.spotifyToken
        }
      }).then((result) => {
        
        if (!result.data.albums.items) {
          alert('Found no Spotify results. You can change the found text and a new result will be fetched.');
          this.setState({'spotifyResults':  [] });
          return;
        }

        var spotiyResults = [];
        result.data.albums.items.forEach((element) => {
          spotiyResults.push(
            {
              'coverImage' : element.images[2].url,
              'albumName' : element.name,
              'artistName' : element.artists[0].name,
              'albumUrl' : element.uri
            }
          ) 
        })
        this.setState({'spotifyResults':  spotiyResults });
      }).catch((error) => {
          alert('Failed calling Spotify');
          console.log(error);
        });
    };

  }
  spotifySignIn() {
    window.location.href = 'https://accounts.spotify.com/authorize?client_id=3a19732ec1fd4056a7321eaf3fa23abd&response_type=token&redirect_uri=' + window.location.href.split('#')[0];
  }

  readInput(e){
    this.setState({'inputValue':   e.target.value });
    this.searchSpotify();
  }

  render() {
    
    console.log(this.state.spotifyResults);

    if (!this.props.spotifyToken) {

      return (<main className="results">
      <header>
        <Logo />
        <div className="cover">
          <img src={this.props.parsedImage.imageData} />       
        </div>
        <textarea onChange={this.readInput}>{this.state.inputValue}</textarea>
        <a href={window.location.href}>Start over</a>
      </header>
      <div className="result-list">
          <h2>SPOTIFY RESULTS</h2>
          <button onClick={this.spotifySignIn}>SIGN IN</button>
      </div>
    </main>);
    } else {

      const listItems = this.state.spotifyResults.map((element, index) => {
        return (<li key={'li-' + index}><a href={element.albumUrl}><img src={element.coverImage} alt={element.albumName} /><span><b>{element.albumName}</b> - {element.artistName}</span></a></li>)
        });

      return (<main className="results">
      <header>
        <Logo />
        <div className="cover">
          <img src={this.props.parsedImage.imageData} />       
        </div>
        <textarea onChange={this.readInput}>{this.state.inputValue}</textarea>
        <a href={window.location.href}>Start over</a>
      </header>
      <div className="result-list">
          <h2>SPOTIFY RESULTS</h2>
          <ul>
            {listItems}
          </ul>
      </div>
    </main>);
    } 
    }


}

export default Results;
