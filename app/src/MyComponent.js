import React from "react";
import {
  AccountData,
  ContractData,
  ContractForm,
} from "drizzle-react-components";

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import logo from "./logo.png";

import { Drizzle } from 'drizzle'
import drizzleOptions from './drizzleOptions'

class MyComponent extends React.Component {
  state = {
    drizzle: null
  }

  componentDidMount() {
    console.log("pbw Drizzle? ", Drizzle)
    const drizzle = new Drizzle(drizzleOptions)
    console.log('pbw drizzle? ', drizzle)
    this.setState({
      drizzle
    })
  }

  test01 = async () => {
    console.log("test01")
    // const { contract, drizzleStatus, SimpleStorage } = this.props
    // console.log("pbw this.props? ", this.props)
    // console.log("pbw contract? ", contract)
    // console.log("pbw drizzleStatus? ", drizzleStatus)
    // console.log("pbw SimpleStorage? ", SimpleStorage)

    // console.log("pbw storedData? ", SimpleStorage.storedData["0x0"])
    // console.log("pbw store? ", this.props.store.getState())

    console.log('pbw test01 drizzle? ', this.state.drizzle)
    const contract = this.state.drizzle.contracts.SimpleStorage
    console.log('pbw contract? ', contract)
    const dataKey = contract.methods['storedData'].cacheCall()
    console.log("pbw dataKey? ", dataKey)
    // const storedData = contract.storedData[dataKey]
    console.log("pbw storedData? ", await contract.methods.storedData().call())

    // const dataKey = SimpleStorage.methods['storedData'].cacheCall()
    // console.log("pbw dataKey? ", dataKey)
  }

  test02 = async () => {
    const SimpleStorage = this.state.drizzle.contracts.SimpleStorage
    const { drizzleStatus, accounts } = this.props
    console.log("pbw drizzleStatus? ", drizzleStatus)
    console.log("pbw accounts? ", accounts)

    await SimpleStorage.methods.set.cacheSend(36, {from: accounts[0]})
  }

  render() {
    const { accounts, drizzleStatus } = this.props
    return(
      <div className="App">
      <div>
        <hr />
        <div>
          <button onClick={this.test01}>test01</button>
          <button onClick={this.test02}>test02</button>
        </div>
        <hr />
      </div>
      {
        console.log('drizzleState', drizzleStatus)
      }
        <ToastContainer />
        <div>
          <img src={logo} alt="drizzle-logo" />
          <h1>Drizzle Examples</h1>
          <p>Examples of how to get started with Drizzle in various situations.</p>
        </div>

        <div className="section">
          <h2>Active Account</h2>
          <AccountData accountIndex="0" units="ether" precision="3" />
        </div>

        <div className="section">
          <h2>SimpleStorage</h2>
          <p>
            This shows a simple ContractData component with no arguments, along with
            a form to set its value.
          </p>
          <p>
            <strong>Stored Value: </strong>
            <ContractData contract="SimpleStorage" method="storedData" />
          </p>
          <ContractForm contract="SimpleStorage" method="set" methodArgs={[accounts[0]]} />
        </div>

        <div className="section">
          <h2>TutorialToken</h2>
          <p>
            Here we have a form with custom, friendly labels. Also note the token
            symbol will not display a loading indicator. We've suppressed it with
            the <code>hideIndicator</code> prop because we know this variable is
            constant.
          </p>
          <p>
            <strong>Total Supply: </strong>
            <ContractData
              contract="TutorialToken"
              method="totalSupply"
              methodArgs={[{ from: accounts[0] }]}
            />{" "}
            <ContractData contract="TutorialToken" method="symbol" hideIndicator />
          </p>
          <p>
            <strong>My Balance: </strong>
            <ContractData
              contract="TutorialToken"
              method="balanceOf"
              methodArgs={[accounts[0]]}
            />
          </p>
          <h3>Send Tokens</h3>
          <ContractForm
            contract="TutorialToken"
            method="transfer"
            labels={["SomebodyElse", "Amount to Send"]}
          />
        </div>
        <div className="section">
          <h2>ComplexStorage</h2>
          <p>
            Finally this contract shows data types with additional considerations.
            Note in the code the strings below are converted from bytes to UTF-8
            strings and the device data struct is iterated as a list.
          </p>
          <p>
            <strong>String 1: </strong>
            <ContractData contract="ComplexStorage" method="string1" toUtf8 />
          </p>
          <p>
            <strong>String 2: </strong>
            <ContractData contract="ComplexStorage" method="string2" toUtf8 />
          </p>
          <strong>Single Device Data: </strong>
          <ContractData contract="ComplexStorage" method="singleDD" />
        </div>

        <div>
          <hr />
          <h1>PBW</h1>
          <p>
            <strong>storedUint1: </strong>
            <ContractData contract="ComplexStorage" method="storeduint1" />
          </p>
          <p>
            <strong>investmentsDeadlineTimeStamp: </strong>
            <ContractData contract="ComplexStorage" method="investmentsDeadlineTimeStamp" />
          </p>
          <p>
            <strong>string3: </strong>
            <ContractData contract="ComplexStorage" method="string3" />
          </p>
          <p>
            <strong>uints1: </strong>
            <ContractData contract="ComplexStorage" method="uintarray" methodArgs={[0]} />
          </p>
        </div>
      </div>
    )
  }
}

export default MyComponent

/*
export default ({ accounts, drizzleStatus }) => (
  <div className="App">
  {
    console.log('drizzleState', drizzleStatus)
  }
    <ToastContainer />
    <div>
      <img src={logo} alt="drizzle-logo" />
      <h1>Drizzle Examples</h1>
      <p>Examples of how to get started with Drizzle in various situations.</p>
    </div>

    <div className="section">
      <h2>Active Account</h2>
      <AccountData accountIndex="0" units="ether" precision="3" />
    </div>

    <div className="section">
      <h2>SimpleStorage</h2>
      <p>
        This shows a simple ContractData component with no arguments, along with
        a form to set its value.
      </p>
      <p>
        <strong>Stored Value: </strong>
        <ContractData contract="SimpleStorage" method="storedData" />
      </p>
      <ContractForm contract="SimpleStorage" method="set" />
    </div>

    <div className="section">
      <h2>TutorialToken</h2>
      <p>
        Here we have a form with custom, friendly labels. Also note the token
        symbol will not display a loading indicator. We've suppressed it with
        the <code>hideIndicator</code> prop because we know this variable is
        constant.
      </p>
      <p>
        <strong>Total Supply: </strong>
        <ContractData
          contract="TutorialToken"
          method="totalSupply"
          methodArgs={[{ from: accounts[0] }]}
        />{" "}
        <ContractData contract="TutorialToken" method="symbol" hideIndicator />
      </p>
      <p>
        <strong>My Balance: </strong>
        <ContractData
          contract="TutorialToken"
          method="balanceOf"
          methodArgs={[accounts[0]]}
        />
      </p>
      <h3>Send Tokens</h3>
      <ContractForm
        contract="TutorialToken"
        method="transfer"
        labels={["SomebodyElse", "Amount to Send"]}
      />
    </div>
    <div className="section">
      <h2>ComplexStorage</h2>
      <p>
        Finally this contract shows data types with additional considerations.
        Note in the code the strings below are converted from bytes to UTF-8
        strings and the device data struct is iterated as a list.
      </p>
      <p>
        <strong>String 1: </strong>
        <ContractData contract="ComplexStorage" method="string1" toUtf8 />
      </p>
      <p>
        <strong>String 2: </strong>
        <ContractData contract="ComplexStorage" method="string2" toUtf8 />
      </p>
      <strong>Single Device Data: </strong>
      <ContractData contract="ComplexStorage" method="singleDD" />
    </div>

    <div>
      <hr />
      <h1>PBW</h1>
      <p>
        <strong>storedUint1: </strong>
        <ContractData contract="ComplexStorage" method="storeduint1" />
      </p>
      <p>
        <strong>investmentsDeadlineTimeStamp: </strong>
        <ContractData contract="ComplexStorage" method="investmentsDeadlineTimeStamp" />
      </p>
      <p>
        <strong>string3: </strong>
        <ContractData contract="ComplexStorage" method="string3" />
      </p>
      <p>
        <strong>uints1: </strong>
        <ContractData contract="ComplexStorage" method="uintarray" methodArgs={[0]} />
      </p>
    </div>
  </div>
);
*/