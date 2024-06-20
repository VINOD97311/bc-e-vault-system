import React, { Component } from 'react';
import SimpleStorageContract from "../contracts/ForensicContract.json";
import getWeb3 from "../utils/getWeb3";
import '../CSS/policeList.css';

class JudgeHome extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    crimeDetails: [],
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
      this.setState({ web3, accounts, contract: instance }, this.loadCrimeDetails);
    } catch (error) {
      alert(`Failed to load web3, accounts, or contract. Check console for details.`);
      console.error(error);
    }
  };

  loadCrimeDetails = async () => {
    const { contract } = this.state;
    const crimeCount = await contract.methods.getPatCount().call();
    let crimeDetails = [];
    let count=101;
    for (let i = 0; i < crimeCount; i++) {
      const crime = await contract.methods.getPat(i).call();
      const fileUrl = "https://gateway.pinata.cloud/ipfs/" + crime[4];
      crimeDetails.push({ 
        crime_id: count, 
        exhibit_name: crime[1], 
        desc: crime[2], 
        timestamp: crime[3], 
        fileUrl: fileUrl 
      });
      count++;
    }
    console.log(crimeDetails)
    this.setState({ crimeDetails });
  };
  render() {
    const { crimeDetails } = this.state;
    return (
      <div>
        <h2>Pending Cases</h2>
        <table>
          <thead>
            <tr>
              <th>Crime ID</th>
              <th>Exhibit Name</th>
              <th>Description</th>
              <th>Timestamp</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {crimeDetails.map((crime, index) => (
              <tr key={index}>
                <td>{crime.crime_id}</td>
                <td>{crime.exhibit_name}</td>
                <td>{crime.desc}</td>
                <td>{crime.timestamp}</td>
                <td><a href={crime.fileUrl} target="_blank" rel="noopener noreferrer">View File</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
export default JudgeHome;
