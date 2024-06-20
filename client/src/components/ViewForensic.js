import React, { Component } from 'react';
import ViewCaseNav from './Navbar/ViewForensic';
import SimpleStorageContract from "../contracts/ForensicContract.json";
import getWeb3 from "../utils/getWeb3";
import axios from 'axios';

class ViewForensic extends Component {
  state = {
    ipfsHash: '',
    buffer: null,
    web3: null,
    accounts: null,
    contract: null,
    case_id: '',
    exhibit_name: '',
    desc: '',
    timestamp: ''
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      console.log('Contract Address:', deployedNetwork.address);
      this.setState({ web3, accounts, contract: instance }, this.onGetDate);
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: reader.result, file });
      console.log('Buffer:', this.state.buffer);
    };
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const { accounts, contract, buffer, file } = this.state;

    if (!buffer) {
      alert('Please select a file to upload.');
      return;
    }

    try {
      const fileData = new FormData();
      fileData.append("file", file);

      const response = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: fileData,
        headers: {
          pinata_api_key: "e8dd2b3a8c6f3d8c3969",
          pinata_secret_api_key: "0d6ca1361be4c30c1894a4682b0dc17e778e55ad08434d09d376baa9c820faaf",
          "Content-Type": "multipart/form-data",
        },
      });

      const ipfsHash = response.data.IpfsHash;
      console.log('IPFS Hash:', ipfsHash);

      const transaction = await contract.methods.addReport(
        this.state.case_id,
        this.state.exhibit_name,
        this.state.desc,
        this.state.timestamp,
        ipfsHash
      ).send({ from: accounts[0] });

      console.log('Blockchain Transaction Receipt:', transaction);
      alert('File successfully uploaded to IPFS and transaction completed.');
    } catch (error) {
      console.error('Upload and Blockchain Transaction Error:', error);
      alert('Error uploading file to IPFS or in blockchain transaction. Check console for details.');
    }
  };

  onGetDate = () => {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 101).toString().substring(1);
    const day = (date.getDate() + 100).toString().substring(1);
    const hour = (date.getHours() + 100).toString().substring(1);
    const mins = (date.getMinutes() + 100).toString().substring(1);
    const sec = (date.getSeconds() + 100).toString().substring(1);
    this.setState({
      timestamp: `${year}-${month}-${day} ${hour}:${mins}:${sec}`
    });
  };

  render() {
    const crimeId = this.props.routeParams.caseId;

    return (
      <div>
        <ViewCaseNav crimeId={crimeId} />
        <h4 className="title-styled" style={{ marginTop: "40px", marginLeft: "235px", marginBottom: "25px" }}>Upload Forensic Reports</h4>
        <div className="container">
          <form onSubmit={this.onSubmit} id="donateForm" className="donate-form">
            <div className="row">
              <div className="col-sm-4">
                <div className="form-group required">
                  <label htmlFor="case_id">CASE ID</label>
                  <input className="form-control" readOnly value={crimeId} type="text" id="case_id" name="case_id" required />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-8">
                <div className="form-group required">
                  <label htmlFor="exhibit_name">EXHIBIT NAME - CODE</label>
                  <input className="form-control" type="text" id="exhibit_name" name="exhibit_name" placeholder="Type and code of uploaded exhibit." onChange={(evt) => this.setState({ exhibit_name: evt.target.value })} required />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-8">
                <div className="form-group required">
                  <label htmlFor="desc">DESCRIPTION</label>
                  <input className="form-control" type="text" id="desc" name="desc" placeholder="One line description" onChange={(evt) => this.setState({ desc: evt.target.value })} required />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-8">
                <div className="form-group required">
                  <label htmlFor="file">Documents (upload in .zip or .rar format)</label>
                  <input className="form-control" type="file" accept="application/zip,application/x-zip,application/x-zip-compressed,application/octet-stream" onChange={this.captureFile} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-4">
                <div className="form-group required">
                  <label htmlFor="timestamp">TIMESTAMP</label>
                  <input value={this.state.timestamp} className="form-control" readOnly type="text" id="timestamp" name="timestamp" required />
                </div>
              </div>
              <div className="col-sm-4">
                <div className="form-submit">
                  <button type="submit" className="dropbtn1" style={{ marginTop: "10px" }}>Upload to Blockchain</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
export default ViewForensic;