import React, { Component } from 'react';
import './Home.css';
import Logo from './Logo';
import FileUploader from './FileUploader';


class Home extends Component {

  render() {
    return (
      <main className="home">
        <header>
          <Logo />
          <h1>Find any record based on cover art</h1>
          <FileUploader onFileUploaded={this.props.onFileUploaded}/>
        </header>
      </main>
    );
  }
}

export default Home;
