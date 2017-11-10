import React, { Component } from 'react';

class FileUploader extends Component {
  render() {
    return (
        <form encType="multipart/form-data">
          <input id="file" type="file" onChange={this.props.onFileUploaded} />
          <label htmlFor="file" className="file-upload"><span>START</span></label>
        </form>
    );
  }
}

export default FileUploader;