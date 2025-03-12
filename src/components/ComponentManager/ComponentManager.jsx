import React, { useState, useEffect } from 'react';
import Grid from "@material-ui/core/Grid";
import Card from '@material-ui/core/Card';
import LinearProgress from '@material-ui/core/LinearProgress';
// Custom components
import OperationDay from "../OperationDay/OperationDay.jsx";
import Instructions from "../Instructions/Instructions.jsx";
import TreansferOrders from "../TreansferOrders/TreansferOrders.jsx";
import Users from "../Users/Users.jsx";
import Reports from "../Reports/Reports.jsx";
import MainForm from "../MainForm/MainForm.jsx";
import InstructionsRegistrars from "../InstructionsRegistrars/InstructionsRegistrars.jsx";
import ImportFileGIK from "../ImportFileGIK/ImportFileGIK.jsx";
import CorporativeActions from "../CorporativeActions/CorporativeActions.jsx";
import DocsWithFiles from "../DocsWithFiles/DocsWithFiles.jsx";
import TradingSystems from "../TradingSystems/TradingSystems.jsx";
import Forms from "../Forms/Forms.jsx";
import History from "../History/History.jsx";
import NewSecurityApplications from "../NewSecurityApplications/NewSecurityApplications.jsx";
import ExchangeTSFiles from "../ExchangeTSFiles/ExchangeTSFiles.jsx";
import RegistryGIK from "../RegistryGIK/RegistryGIK.jsx";
var moment = require('moment');

export default (props) => {
  const [taskNames] = useState([])
  useEffect(() => {
    // console.log("COMP MNGR PROPs", props)
  }, [])
  async function sendFieldValues(commandJson) {
    props.sendFieldValues(commandJson)
  }
  async function handleCloseCurrentTab(process_id) {
    props.handleCloseCurrentTab(process_id)
  }
  async function clearTabData(process_id) {
    props.clearTabData(process_id)
  }
  // GENERAL FUNCTIONS
  function parseFullDateTime(date, separator) {// "2017-05-24T10:30"
    // console.log("IN DATE", date)
    if (date !== null) {
      let newDate = new Date(date)
      // console.log("IN DATE", newDate)
      let dd = String(newDate.getDate()).padStart(2, '0')
      let mm = String(newDate.getMonth() + 1).padStart(2, '0') //January is 0!
      let yyyy = newDate.getFullYear()
      let hours = newDate.getHours()
      if (parseInt(hours) < 10) {
        hours = "0" + hours
      }
      let minutes = newDate.getMinutes()
      if (parseInt(minutes) < 10) {
        minutes = "0" + minutes
      }
      let fullDateTime = yyyy + '-' + mm + '-' + dd + separator + hours + ":" + minutes // + ":" + seconds
      // console.log("FDATE", fullDateTime)

      // let fullDateTime = moment(date).format('YYYY-MM-DDTHH:MM')
      return fullDateTime
    }
  }
  // Convert date to approptiate format
  function parseDate(date) {
    try {
      let newDate = new Date(date) // "2020-01-26"
      let dd = String(newDate.getDate()).padStart(2, '0')
      let mm = String(newDate.getMonth() + 1).padStart(2, '0') //January is 0!
      let yyyy = newDate.getFullYear()
      let convertedDate = yyyy + '-' + mm + '-' + dd
      // console.log("CDATE", convertedDate)
      return convertedDate

      // let convertedDate = moment(date).format('YYYY-MM-DD')
      // return convertedDate
    }
    catch (er) {
      return "NaN.NaN.NaN"
    }
  }
  function getCurrentFullDateTime() {

    // var fullDate = parseDate(new Date())
    // var hours = new Date().getHours()
    // var minutes = new Date().getMinutes()
    // var seconds = new Date().getSeconds()
    // var convertedDate = fullDate + " " + hours + ":" + minutes + ":" + seconds + ".123456"
    // return convertedDate

    let fullDateTime = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss') // + ".123456"
    return fullDateTime
  }
  function taskManager(task) {
    let taskList = {
      Instructions: ["showInstructionsSearchForm", "showInstructionsCreationForm", "showInstructionsViewForm", "showInstructionsTypeSelectingForm", "showInstructionsGIKSearchForm", "showInstructionsGIKTypeSelectingForm", "showInstructionsGIKCreationForm", "showInstructionsGIKViewForm"],
      InstructionsRegistrars: ["showInstructionsRegistrarsSearchForm", "showInstructionsRegistrarsViewForm"],
      TreansferOrders: ["showTransferOrdersSearchForm", "showTransferOrdersCreatingForm", "showTransferOrdersEditForm"],
      RegistryGIK: ["showRegistryGIKSearchForm", "showRegistryGIKEditForm"],
      Users: ["showSearchUser", "showCreateUser", "showEditUser"],
      Reports: ["showReport", "showAccountingReportsSelectingForm", "showReportsSelectingForm", "showReportsCreatingForm"],
      OperationDay: ["showOperationDayForm"],
      ImportFileGIK: ["showImportFileGIKForm"],
      CorporativeActions: ["corporativeActionsMainForm", "shomMessageForm"],
      DocsWithFiles: ["showContractsSearchForm", "showContractsCreatingForm", "showContractsEditForm", "showExcertsSearchForm", "showExcertsCreatingForm", "showExcertsEditForm"],
      NewSecurityApplications: ["showNewSecurityApplicationsSearchForm", "showNewSecurityApplicationsTypeSelectingForm", "showNewSecurityApplicationsCreatingForm", "showNewSecurityApplicationsEditForm"],
      TradingSystems: ["showUploadDataToTSSecuritiesForm", "showLoadDataFromTSSecuritiesForm", "showUploadDataToTSCurrenciesForm", "showLoadDataFromTSCurrenciesForm"],
      Forms: ["showFormsEditForm"],
      History: ["showHistoryForm"],
      ExchangeTSFiles: ["showExchangeTSFilesListForm"]
    }
    let taskName = "MainForm" // All tnat is not indicated in list goes to MainForm
    for (let key in taskList) {
      for (let i = 0; i < taskList[key].length; i++) {
        if (taskList[key][i] === task) {
          taskName = key
          break
        }
      }
    }
    // console.log("TASK", task, taskName)
    return taskName
  }

  if (!props.userTask) return <LinearProgress />
  else if (taskManager(props.userTask.taskType) === "Instructions") {
    return (
      <Instructions
        // VARIABLES
        api={props.api}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        operDayIsOpened={props.operDayIsOpened}
        esUserFullName={props.esUserFullName}
        esInn={props.esInn}
        esExpiredDate={props.esExpiredDate}
        // FUNCTIONS
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
        setEsUserFullName={props.setEsUserFullName}
        setEsInn={props.setEsInn}
        setEsExpiredDate={props.setEsExpiredDate}
        currencyBeautifier={props.currencyBeautifier}
        intBeautifier={props.intBeautifier}
      />
    )
  }
  else if (taskManager(props.userTask.taskType) === "InstructionsRegistrars") {
    return (
      <InstructionsRegistrars
        // VARIABLES
        api={props.api}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        operDayIsOpened={props.operDayIsOpened}
        esUserFullName={props.esUserFullName}
        esInn={props.esInn}
        esExpiredDate={props.esExpiredDate}
        // FUNCTIONS
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
        setEsUserFullName={props.setEsUserFullName}
        setEsInn={props.setEsInn}
        setEsExpiredDate={props.setEsExpiredDate}
        currencyBeautifier={props.currencyBeautifier}
        intBeautifier={props.intBeautifier}
      />
    )
  }
  else if (taskManager(props.userTask.taskType) === "TreansferOrders") {
    return (
      <TreansferOrders
        // VARIABLES
        api={props.api}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        operDayIsOpened={props.operDayIsOpened}
        esUserFullName={props.esUserFullName}
        esInn={props.esInn}
        esExpiredDate={props.esExpiredDate}
        // FUNCTIONS
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
        setEsUserFullName={props.setEsUserFullName}
        setEsInn={props.setEsInn}
        setEsExpiredDate={props.setEsExpiredDate}
        currencyBeautifier={props.currencyBeautifier}
        intBeautifier={props.intBeautifier}
      />
    )
  }
  else if (taskManager(props.userTask.taskType) === "MainForm") {
    return (
      <MainForm
        api={props.api}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        // FUNCTIONS
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
        currencyBeautifier={props.currencyBeautifier}
        intBeautifier={props.intBeautifier}
      />
    )
  }
  else if (taskManager(props.userTask.taskType) === "RegistryGIK") {
    return (
      <RegistryGIK
        api={props.api}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        // FUNCTIONS
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
      />
    )
  }
  else if (taskManager(props.userTask.taskType) === "Users") {
    return (
      <Users
        api={props.api}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        // FUNCTIONS
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
        currencyBeautifier={props.currencyBeautifier}
        intBeautifier={props.intBeautifier}
      />
    )
  }
  else if (taskManager(props.userTask.taskType) === "Reports") {
    return (
      <Reports
        api={props.api}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        esUserFullName={props.esUserFullName}
        esInn={props.esInn}
        esExpiredDate={props.esExpiredDate}
        // FUNCTIONS
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
        setEsUserFullName={props.setEsUserFullName}
        setEsInn={props.setEsInn}
        setEsExpiredDate={props.setEsExpiredDate}
        currencyBeautifier={props.currencyBeautifier}
        intBeautifier={props.intBeautifier}
        downloadReport={props.downloadReport}
      />
    )
  }
  else if (taskManager(props.userTask.taskType) === "OperationDay") {
    return (
      <OperationDay
        api={props.api}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        operDayIsOpened={props.operDayIsOpened}
        // FUNCTIONS
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
        currencyBeautifier={props.currencyBeautifier}
        intBeautifier={props.intBeautifier}
      />
    )
  }
  else if (taskManager(props.userTask.taskType) === "ImportFileGIK") {
    return (
      <ImportFileGIK
        api={props.api}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        // FUNCTIONS
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
        currencyBeautifier={props.currencyBeautifier}
        intBeautifier={props.intBeautifier}
      />
    )
  }
  else if (taskManager(props.userTask.taskType) === "CorporativeActions") {
    return (
      <CorporativeActions
        api={props.api}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        esUserFullName={props.esUserFullName}
        esInn={props.esInn}
        esExpiredDate={props.esExpiredDate}
        // mailRest={props.mailRest}
        // FUNCTIONS
        updateMailDistributions={props.updateMailDistributions}
        reduceMailDistributions={props.reduceMailDistributions}
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
        setEsUserFullName={props.setEsUserFullName}
        setEsInn={props.setEsInn}
        setEsExpiredDate={props.setEsExpiredDate}
        currencyBeautifier={props.currencyBeautifier}
        intBeautifier={props.intBeautifier}
      />
    )
  }
  else if (taskManager(props.userTask.taskType) === "DocsWithFiles") {
    return (
      <DocsWithFiles
        api={props.api}
        id={props.userTask.process_id}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        // FUNCTIONS
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
        currencyBeautifier={props.currencyBeautifier}
        intBeautifier={props.intBeautifier}
      />
    )
  }
  else if (taskManager(props.userTask.taskType) === "NewSecurityApplications") {
    return (
      <NewSecurityApplications
        // VARIABLES
        api={props.api}
        id={props.userTask.process_id}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        esUserFullName={props.esUserFullName}
        esInn={props.esInn}
        esExpiredDate={props.esExpiredDate}
        // FUNCTIONS
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
        setEsUserFullName={props.setEsUserFullName}
        setEsInn={props.setEsInn}
        setEsExpiredDate={props.setEsExpiredDate}
        currencyBeautifier={props.currencyBeautifier}
        intBeautifier={props.intBeautifier}
      />
    )
  }
  else if (taskManager(props.userTask.taskType) === "TradingSystems") {
    return (
      <TradingSystems
        api={props.api}
        id={props.userTask.process_id}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        // FUNCTIONS
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
        currencyBeautifier={props.currencyBeautifier}
        intBeautifier={props.intBeautifier}
      />
    )
  }
  else if (taskManager(props.userTask.taskType) === "Forms") {
    return (
      <Forms
        api={props.api}
        id={props.userTask.process_id}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        // FUNCTIONS
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
        currencyBeautifier={props.currencyBeautifier}
        intBeautifier={props.intBeautifier}
      />
    )
  }
  else if (taskManager(props.userTask.taskType) === "History") {
    return (
      <History
        api={props.api}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        // FUNCTIONS
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
        currencyBeautifier={props.currencyBeautifier}
        intBeautifier={props.intBeautifier}
      />
    )
  }
  else if (taskManager(props.userTask.taskType) === "ExchangeTSFiles") {
    return (
      <ExchangeTSFiles
        api={props.api}
        key={props.userTask.process_id}
        userProfile={props.userProfile}
        userTask={props.userTask}
        // FUNCTIONS
        callErrorToast={props.callErrorToast}
        callSuccessToast={props.callSuccessToast}
        sendFieldValues={sendFieldValues}
        clearTabData={clearTabData}
        handleCloseCurrentTab={handleCloseCurrentTab}
        parseFullDateTime={parseFullDateTime}
        getCurrentFullDateTime={getCurrentFullDateTime}
        parseDate={parseDate}
        currencyBeautifier={props.currencyBeautifier}
        intBeautifier={props.intBeautifier}
      />
    )
  }

  else if (props.userTask.taskType === "error") {
    return (
      <Grid container direction="row" justify="center" spacing={0}>
        <Grid item xs={12}>
          <Card>
            <table>
              <tbody>
                <tr>
                  <td>{props.userTask.taskType}</td>
                </tr>
                <tr>
                  <td>{props.userTask.process_id}</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </Grid>
      </Grid>
    )
  }
  else {
    console.log("MAIN COMP ERR", props.userTask)
    return (
      <Grid container direction="row" justify="center" spacing={0}>
        <Grid item xs={12}>
          <Card>
            <LinearProgress />
          </Card>
        </Grid>
      </Grid>
    )
  }
}