// Import material and react components
import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
// Table
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TextField from '@material-ui/core/TextField';

import ReplayIcon from '@material-ui/icons/Replay';

// Import libraries
import swal from 'sweetalert' // https://sweetalert.js.org/guides/
// var convert = require('xml-js');
var moment = require('moment');

const useStyles = makeStyles((theme) => ({
  importFile: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  inputFile: {
    display: 'none',
  }
}));
export default(props) =>{
  // This.state
  const classes = useStyles();
  const [userProfile] = useState(props.userProfile)
  const [process_id] = useState(props.userTask.process_id)
  const [session_id] = useState(props.userTask.session_id)
  const [taskID] = useState(props.userTask.taskID)
  const [enumData] = useState(props.userTask.enumData)
  const [taskType] = useState(props.userTask.taskType)
  const [gridForm] = useState(props.userTask.gridForm)
  const [buttons] = useState(props.userTask.buttons)
  const [docList, setDocList] = useState([])
  const [docListTrades, setDocListTrades] = useState([])
  const [docListOrders, setDocListOrders] = useState([])
  const [sectionColor] = useState("#B2E0C9")
  const [stocks, setStocks] = useState(null)
  const [file, setFile] = useState([])
  const [fieldValue, setFieldValue] = useState({date: new Date()})
  const [UploadDataToTSSecuritiesId, setUploadDataToTSSecuritiesId] = useState(null)
  const [UploadDataToTSCurrenciesId, setUploadDataToTSCurrenciesId] = useState(null)
  const [LoadDataFromTSSecuritiesOrdersId, setLoadDataFromTSSecuritiesOrdersId] = useState(null)
  const [LoadDataFromTSSecuritiesTradesId, setLoadDataFromTSSecuritiesTradesId] = useState(null)
  const [LoadDataFromTSCurrenciesId, setLoadDataFromTSCurrenciesId] = useState(null)
  const [updateState, setUpdateState] = useState(false)

  useEffect(()=>{
    console.log("TS PROPS", props.userTask)
    setUploadDataToTSSecuritiesId(getUUID())
    setUploadDataToTSCurrenciesId(getUUID())
    setLoadDataFromTSSecuritiesOrdersId(getUUID())
    setLoadDataFromTSSecuritiesTradesId(getUUID())
    setLoadDataFromTSCurrenciesId(getUUID())
    if(taskType === "showUploadDataToTSSecuritiesForm" || 
    taskType === "showUploadDataToTSCurrenciesForm" || 
    taskType === "showCliringResultGridForm"){
      setDocList(JSON.parse(props.userTask.docList))
    }
    // else if(taskType === "showUploadDataToTSCurrenciesForm"){
    //   setDocList(JSON.parse(props.userTask.docList))
    // }
    // setStocks(JSON.parse(props.userTask.docList))
  },[])
  function getUUID() {
    const uuidv1 = require("uuid/v1")
    return uuidv1()
  }

  // Main button click handler
  function buttonClick(buttonName){
    console.log("Button", buttonName)
    if(buttonName === "exportDataInTSOnline" || buttonName === "exportDataInTSOffline"){
      if(docList !== null){
        if(docList.length > 0){
          let newFiles = [{
            name: (taskType === "showUploadDataToTSSecuritiesForm" ? "Pos" : "Ds_Pos") + getCurDate(new Date) + ".txt",
            blob: Buffer.from(getPosTxt()).toString('base64')
          }]
          const commandJson = 
          {
            commandType: "saveTSFiles",
            session_id: session_id,
            userId: userProfile.userId,
            process_id: process_id,
            taskID: taskID,
            newFiles: newFiles,
            directory: getCurDate(new Date),
            variables: {
              userAction: {value: "exportDataInTS"},
              online: {value: buttonName === "exportDataInTSOnline" ? true : false}
            }
          }
          console.log("button exportDataInTS: ", commandJson)
          props.sendFieldValues(commandJson)
          props.clearTabData(process_id)
        }
        else{
          swAlert("Данные для выгрузки не обнаружены!", "warning")
        }
      }
      else{
        swAlert("Данные для выгрузки не обнаружены!", "warning")
      }
    }
    else if(buttonName === "uploadToTXT"){
      let txt = getPosTxt()
      let posBlob = new Blob([txt], {type: 'text/plain', endings: "native"})
      // Download txt
      let pom = document.createElement('a')
      let filename = (taskType === "showUploadDataToTSSecuritiesForm" ? "Pos" : "Ds_Pos") + getCurDate(new Date) + ".txt"
      pom.setAttribute('href', window.URL.createObjectURL(posBlob))
      pom.setAttribute('download', filename)
      
      pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':')
      pom.draggable = true
      pom.classList.add('dragout')
      pom.click()
    }
    else if(buttonName === "uploadOrdTrdToTXT"){
      let ord = getOrdTxt()
      // Download ord
      let pomOrd = document.createElement('a')
      let filenameOrd = "Ord" + getCurDate(new Date) + ".txt"
      let bbOrd = new Blob([ord], {type: 'text/plain'})
      pomOrd.setAttribute('href', window.URL.createObjectURL(bbOrd))
      pomOrd.setAttribute('download', filenameOrd)
      pomOrd.dataset.downloadurl = ['text/plain', pomOrd.download, pomOrd.href].join(':')
      pomOrd.draggable = true
      pomOrd.classList.add('dragout')
      pomOrd.click()

      let trd = getTrdTxt()
      // Download trd
      let pomTrd = document.createElement('a')
      let filenameTrd = "Trd" + getCurDate(new Date) + ".txt"
      let bbTrd = new Blob([trd], {type: 'text/plain'})
      pomTrd.setAttribute('href', window.URL.createObjectURL(bbTrd))
      pomTrd.setAttribute('download', filenameTrd)
      pomTrd.dataset.downloadurl = ['text/plain', pomTrd.download, pomTrd.href].join(':')
      pomTrd.draggable = true
      pomTrd.classList.add('dragout')
      pomTrd.click()
    }
    else if(buttonName === "processDataFromTSSecurities"){
      // if(docListTrades !== null && docListOrders !== null){
        if(fieldValue["date"] !== undefined && fieldValue["date"] !== "NaN.NaN.NaN"){
          var newDate = new Date(fieldValue["date"]) // "01.31.2021"
          console.log("ND", newDate)
          var dd = String(newDate.getDate()).padStart(2, '0')
          var mm = String(newDate.getMonth() + 1).padStart(2, '0') //January is 0!
          var yyyy = newDate.getFullYear()
          var convertedDate = mm + '.' + dd + '.' + yyyy
          // let newFiles = [
          //   {
          //     name: "Ord" + getCurDate(fieldValue["date"]) + ".txt",
          //     buf: Buffer.from(getOrdTxt()).toString('base64')
          //   },
          //   {
          //     name: "Trd" + getCurDate(fieldValue["date"]) + ".txt",
          //     buf: Buffer.from(getTrdTxt()).toString('base64')
          //   }            
          // ]
          const commandJson = 
          {
            commandType: "completeTask",
            session_id: session_id,
            userId: userProfile.userId,
            process_id: process_id,
            taskID: taskID,
            // directory: getCurDate(fieldValue["date"]),
            // newFiles: newFiles,
            variables: {
              userAction: {value: "processDataFromTS"},
              orders: {value: docListOrders.length === 0 ? "[]" : JSON.stringify(docListOrders)},
              trades: {value: docListTrades.length === 0 ? "[]" : JSON.stringify(docListTrades)},
              date: {value: convertedDate},
              date2: {value: "\'" + convertedDate + "\'"}
            }
          }
          console.log("processDataFromTS", commandJson)
          props.sendFieldValues(commandJson)
          props.clearTabData(process_id)
        }
        else{
          swAlert("Укажите дату!", "warning")
        }
      // }
      // else{
      //   swAlert("Для импорта данных нужны 2 файла!", "warning")
      // }
    }
    else if(buttonName === "processDataFromTSCurrencies"){
      // if(docListOrders !== null){
        if(fieldValue["date"] !== undefined && fieldValue["date"] !== "NaN.NaN.NaN"){
          var newDate = new Date(fieldValue["date"]) // "2020-01-26"
          var dd = String(newDate.getDate()).padStart(2, '0')
          var mm = String(newDate.getMonth() + 1).padStart(2, '0') //January is 0!
          var yyyy = newDate.getFullYear()
          var convertedDate = mm + '.' + dd + '.' + yyyy
          const commandJson = 
          {
            commandType: "completeTask",
            session_id: session_id,
            process_id: process_id,
            taskID: taskID,
            variables: {
              userAction: {value: "processDataFromTS"},
              orders: {value: JSON.stringify(docListOrders)},
              date: {value: convertedDate},
              date2: {value: "\'" + convertedDate + "\'"}
              // document: {value: userProfile.userId}
            }
          }
          console.log("processDataFromTSCurrencies", commandJson)
          props.sendFieldValues(commandJson)
          props.clearTabData(process_id)
        // }
        // else{
        //   swAlert("Укажите дату!", "warning")
        // }
      }
      else{
        swAlert("Данные для импорта не обнаружены!", "warning")
      }
    }
    else if(buttonName === "loadDataFromTS"){
      let commandJson = 
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        variables: {
          userAction: {value: "loadDataFromTS"},
        }
      }
      console.log("loadDataFromTS", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "updateDocList") {
      const commandJson =
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: { value: "updateDocList" },
        }
      }
      console.log("button updateDocList: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    
    else if(buttonName === "cancel"){
      const commandJson = 
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: {value: "cancel"},
        }
      }
      console.log("button cancel: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else{
      console.log("button: ", buttonName)
    }
  }
  function getCurDate(date){
    var newDate = new Date(date)
    var dd = String(newDate.getDate()).padStart(2, '0')
    var mm = String(newDate.getMonth() + 1).padStart(2, '0') //January is 0!
    var yyyy = newDate.getFullYear()
    var today = dd + mm + yyyy  
    return today
  }
  function getPosTxt(){
    let txt = ""
    if(taskType === "showUploadDataToTSSecuritiesForm"){
      for(let i=0; i<docList.length; i++){
        txt += docList[i]["depositor_id_from_trades"] + "\t"
        txt += docList[i]["security_code"] + "\t"
        txt += docList[i]["quantity"] + "\t"
        txt += docList[i]["account_number"] 
        if(i < docList.length-1){txt += "\r\n"}
      }
    }
    else if(taskType === "showUploadDataToTSCurrenciesForm"){
      for(let i=0; i<docList.length; i++){
        txt += docList[i]["depositor_id_from_trades"] + "\t"
        txt += docList[i]["quantity"] + "\t"
        txt += docList[i]["currency_code"] + "\t"
        txt += docList[i]["account_number"]
        if(i < docList.length-1){txt += "\r\n"}
      }
    }
    return txt
  }
  function getOrdTxt(){
    let ord = ""
    for(let i=0; i<docListOrders.length; i++){
      ord += docListOrders[i]["depositor_id_from_trades"] + "\t"
      ord += docListOrders[i]["security_code"] + "\t"
      ord += docListOrders[i]["quantity"] + "\t"
      ord += docListOrders[i]["account_number"]
      if(i < docListOrders.length-1){ord += "\r\n"}
    }
    return ord
  }
  function getTrdTxt(){
    let trd = ""
    for(let i=0; i<docListTrades.length; i++){
      trd += docListTrades[i]["trade_id"] + "\t"
      trd += docListTrades[i]["security_code"] + "\t"
      trd += docListTrades[i]["seller_id"] + "\t"
      trd += docListTrades[i]["seller_account"] + "\t"
      trd += docListTrades[i]["buyer_id"] + "\t"
      trd += docListTrades[i]["buyer_account"] + "\t"
      trd += docListTrades[i]["quantity"] + "\t"
      trd += docListTrades[i]["amount"] + "\t"
      trd += docListTrades[i]["cliring"]
      if(i < docListTrades.length-1){trd += "\r\n"}
    }
    return trd
  }
  // Returns Button component
  function createButton(button, index){
    return(
      <Button variant="outlined"
        name = {button.name}
        onClick = {()=> buttonClick(button.name)}
        style={{
          margin: 3,
          color: button.fontColor,
          backgroundColor: button.backgroundColor,
          height: 32,
          fontSize: 12
        }}
        value = {button.name}
        >
          {button.label}
      </Button> 
    )
  }
  // custom allerts
  function swAlert(text, icon){
    return(
      swal({
        text: text,
        icon: icon,
        buttons: {ok: "Ок"}
      })
    )
  }
  function getGridFormItems(value, type){
    if (type === "Float") {
      if (value === null || value === "" || value === undefined) {
        return "-"
      }
      else {
        let newCur = props.currencyBeautifier(value)
        return newCur
      }
    }
    else if (type === "Int") {
      if (value === null || value === "" || value === undefined) {
        return "-"
      }
      else {
        let newInt = props.intBeautifier(value)
        return newInt
      }
    }
    else{
      return value
    }
    
  }
  function handleAttachFile(e) {
    let selectedFiles = e.target.files
    if (selectedFiles && selectedFiles[0]){
      setFile(selectedFiles[0])
      let reader = new FileReader()
      reader.onload = async function(e){
        const file = e.target.result
        const rows = file.split(/\r\n|\n/)
        console.log("rows", rows)
        let arr = []
        for(let i=0; i<rows.length; i++){
          if(rows[i] !== ""){
            let items = rows[i].split('\t')
            if(taskType === "showUploadDataToTSSecuritiesForm"){
              let newItem = {
                depositor_id_from_trades: items[0],
                security_code: items[1],
                quantity: items[2],
                account_number: items[3]
              }
              arr.push(newItem)
            }
            else if(taskType === "showUploadDataToTSCurrenciesForm"){
              let newItem = {
                depositor_id_from_trades: items[0],
                quantity: items[1],
                currency_code: items[2],
                account_number: items[3]
              }
              arr.push(newItem)
            }
            // console.log("ITMS", items)
          }
        }
        setDocList(arr)
      }
      reader.readAsText(selectedFiles[0])
    }
  }
  function handleAttachFileTrades(e){
    // TRADES
    console.log("TRD FILE", e.target.files)
    let selectedFiles = e.target.files
    if (selectedFiles && selectedFiles[0]){
      let reader = new FileReader()
      reader.onload = async function(e){
        const file = e.target.result
        const rows = file.split(/\r\n|\n/)
        // console.log("rows", rows)
        let arr = []
        for(let i=0; i<rows.length; i++){
          if(rows[i] !== ""){
            let items = rows[i].split('\t')
            let newItem = {
              trade_id: items[0],
              security_code: items[1],
              seller_id: items[2],
              seller_account: items[3],
              buyer_id: items[4],
              buyer_account: items[5],
              quantity: items[6],
              amount: items[7],
              cliring: items[8],
              trading_system_id: 1
            }
            arr.push(newItem)
            // console.log("ITMS", items)
          }
        }
        setDocListTrades(arr)
      }
      reader.readAsText(selectedFiles[0])
    }
    setUpdateState(getUUID())
  }
  function handleAttachFileOrders(e){
    // ORDERS
    console.log("ORD FILE", e.target.files)
    let selectedFiles = e.target.files
    if (selectedFiles && selectedFiles[0]){
      let reader = new FileReader()
      reader.onload = async function(e){
        const file = e.target.result
        const rows = file.split(/\r\n|\n/)
        // console.log("rows", rows)
        let arr = []
        for(let i=0; i<rows.length; i++){
          if(rows[i] !== ""){
            let items = rows[i].split('\t')
            if(taskType === "showLoadDataFromTSSecuritiesForm"){
              let newItem = {
                depositor_id_from_trades: items[0],
                security_code: items[1],
                quantity: items[2],
                account_number: items[3]
              }
              arr.push(newItem)
            }
            else if(taskType === "showLoadDataFromTSCurrenciesForm"){
              let newItem = {
                depositor_id_from_trades: items[0],
                quantity: items[1],
                currency_code: items[2],
                account_number: items[3]
              }
              arr.push(newItem)
            }
            // console.log("ITMS", items)
          }
        }
        setDocListOrders(arr)
      }
      reader.readAsText(selectedFiles[0])
    }
    setUpdateState(getUUID())
  }
  function handleDateTimeChange(event){
    // // console.log("EVENT", event.target.name, event.target.value)
    // let fullDate = props.parseDate(event.target.value)
    // var hours = new Date().getHours()
    // var minutes = new Date().getMinutes()
    // var seconds = new Date().getSeconds()
    // var convertedDate = fullDate + " " + hours + ":" + minutes + ":" + seconds + ".123456"
    // fieldValue[event.target.name] = convertedDate
    let fullDateTime = moment(event.target.value).format('YYYY-MM-DDTHH:mm:ss')
    fieldValue[event.target.name] = fullDateTime
    setFieldValue(fieldValue)
    console.log("DATE CHANGE", fieldValue)
  }
  try{
    if(buttons === undefined){return <div>No Buttons</div>}
    return (
      <Grid key={updateState}>
        {taskType === "showUploadDataToTSSecuritiesForm" &&
          <Grid container direction="column" justify="flex-start" spacing={1}>
            <Grid item xs={8}>
              <Paper>
                <Grid container direction="row" justify="center" alignItems="center">
                  <Table size="small">
                    <TableHead>
                      <TableRow style={{height: 30}}>
                        <TableCell 
                          style={{
                            color: "black", 
                            fontSize: 14,
                            backgroundColor:  sectionColor,
                            width: "100%"
                          }}>
                          Формирование данных для КФБ
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                  <br/>
                </Grid>
                <Grid container  direction="row" justify="flex-start" alignItems="flex-start">
                  {buttons.map((button, index) => {
                    return createButton(button, index)
                  })}
                  <div className={classes.importFile}>
                    <input
                      accept="text/plain"
                      className={classes.inputFile} 
                      id={UploadDataToTSSecuritiesId}
                      multiple
                      type="file"
                      onChange={handleAttachFile}
                    />
                    <label htmlFor={UploadDataToTSSecuritiesId}>
                      <Button
                        component="span"
                        variant="outlined"
                        style={{
                          margin: 3,
                          color: "white",
                          backgroundColor: "#BB7100",
                          borderColor: "#161C87",
                          height: 32,
                          fontSize: 12
                        }}
                      >Выбрать файл
                      </Button>
                    </label>
                  </div>
                </Grid> 
              </Paper>
            </Grid>
            <br/>

          <ReplayIcon style={{ paddingTop: 3, cursor: "pointer" }} onClick={() => buttonClick("updateDocList")} />

            {/* Create grid table with data from doclist */}
            <Grid item sm={"auto"}>
              <Paper>
                <table 
                  size="small"
                  // style={{width:"100%", "border-collapse": "collapse"}}
                  class="main-table-style"
                >
                  <thead class="thead-style">
                    <tr>
                      {gridForm.sections.map(section => {
                        return (
                          <td 
                            colSpan={section.contents.length} 
                            class="td-head-style"
                            // style={{"color": "black", "fontSize": 13, "border": "1px solid grey", "text-align": "center", "font-weight":"bold"}}
                          >
                            {section.label}
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      {gridForm.sections.map(section =>
                        section.contents.map(contentItem => {
                          return (
                            <td 
                              rowSpan="2" 
                              class="td-head-style-2row"
                              // style={{"color": "black", "fontSize": 12, "border": "1px solid grey", "text-align": "center", "font-weight":"bold"}}
                            >
                              {contentItem.label}
                            </td>
                          )
                        })
                      )}
                    </tr>
                  </thead>
                  <TableBody>
                    {docList !== null &&
                      docList.map((dataItem) => (
                        gridForm.sections.map(section => {
                          return(
                            <tr style={{height: 30}}>
                              {section.contents.map(contentItem => {
                                return(<td style={{"fontSize": 12, "border": "1px solid grey"}}>{getGridFormItems(dataItem[contentItem.name], contentItem.type)}</td>)
                              })}
                            </tr>
                          )
                        })
                      )
                    )} 
                                        
                  </TableBody>
                </table>              
              </Paper>
            </Grid>
          </Grid>
        }
        {taskType === "showUploadDataToTSCurrenciesForm" &&
          <Grid container direction="column" justify="flex-start" spacing={1}>
            <Grid item xs={8}>
              <Paper>
                <Grid container direction="row" justify="center" alignItems="center">
                  <Table size="small">
                    <TableHead>
                      <TableRow style={{height: 30}}>
                        <TableCell
                          style={{
                            color: "black", 
                            fontSize: 14,
                            backgroundColor:  sectionColor,
                            width: "100%"
                          }}>
                          Формирование данных для КФБ
                        </TableCell>
                      </TableRow>
                    </TableHead>
                  </Table>
                  <br/>
                  
                </Grid>
                <Grid container  direction="row" justify="flex-start" alignItems="flex-start">
                  {buttons.map((button, index) => {
                    return createButton(button, index)
                  })}
                  <div className={classes.importFile}>
                    <input
                      accept="text/plain"
                      className={classes.inputFile} 
                      id={UploadDataToTSCurrenciesId}
                      multiple
                      type="file"
                      onChange={handleAttachFile}
                    />
                    <label htmlFor={UploadDataToTSCurrenciesId}>
                      <Button
                        component="span"
                        variant="outlined"
                        style={{
                          margin: 3,
                          color: "white",
                          backgroundColor: "#BB7100",
                          borderColor: "#161C87",
                          height: 32,
                          fontSize: 12
                        }}
                      >Выбрать файл
                      </Button>
                    </label>
                  </div>
                </Grid>
              </Paper>
            </Grid>
            <br/>
            <ReplayIcon style={{ paddingTop: 3, cursor: "pointer" }} onClick={() => buttonClick("updateDocList")} />
            {/* Create grid table with data from doclist */}
            <Grid item sm={"auto"}>
              <Paper>
                <table 
                  size="small"
                  // style={{width:"100%", "border-collapse": "collapse"}}
                  class="main-table-style"
                >
                  <thead class="thead-style">
                    <tr>
                      {gridForm.sections.map(section => {
                        return (
                          <td 
                            colSpan={section.contents.length} 
                            class="td-head-style"
                          >
                          {section.label}</td>
                        )
                      })}
                    </tr>
                    <tr>
                      {gridForm.sections.map(section =>
                        section.contents.map(contentItem => {
                          return (
                            <td 
                              rowSpan="2"
                              class="td-head-style"
                            >
                              {contentItem.label}
                            </td>
                          )
                        })
                      )}
                    </tr>
                  </thead>
                  <TableBody>
                    {docList !== null &&
                      docList.map((dataItem) => (
                        gridForm.sections.map(section => {
                          return(
                            <tr style={{height: 30}}>
                              {section.contents.map(contentItem => {
                                return(<td style={{"fontSize": 12, "border": "1px solid grey"}}>{getGridFormItems(dataItem[contentItem.name], contentItem.type)}</td>)
                              })}
                            </tr>
                          )
                        })
                      )
                    )} 
                                        
                  </TableBody>
                </table>              
              </Paper>
            </Grid>
          </Grid>
        }
        {taskType === "showLoadDataFromTSSecuritiesForm" &&
          <Grid container direction="column" justify="flex-start" spacing={1}>
            <Grid item xs={8}>
              <Paper>
                <Grid container direction="row" justify="center" alignItems="center">
                  <Table size="small">
                    <TableHead>
                      <TableRow style={{height: 30}}>
                        <TableCell
                          style={{
                            color: "black", 
                            fontSize: 14,
                            backgroundColor:  sectionColor
                          }}>
                          Загрузка данных из КФБ
                        </TableCell>
                        <TableCell
                          style={{
                            color: "black", 
                            fontSize: 14,
                            backgroundColor:  sectionColor
                          }}>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow style={{height: 30}}>
                        <TableCell
                          style={{
                            color: "black", 
                            fontSize: 14,
                            width: "40%"
                          }}>Дата
                        </TableCell>
                        <TableCell
                          style={{
                            color: "black", 
                            fontSize: 14,
                            width: "60%"
                          }}>
                           <TextField
                              type="date"
                              name = "date"
                              onBlur = {handleDateTimeChange}
                              style={{width: "100%"}}
                              defaultValue = {props.parseDate(fieldValue["date"])}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <br/>
                </Grid>
                <Grid container  direction="row" justify="flex-start" alignItems="flex-start">
                  {buttons.map((button, index) => {
                    return createButton(button, index)
                  })}
                  <div className={classes.importFile}>
                    <input
                      accept="text/plain"
                      className={classes.inputFile}
                      id={LoadDataFromTSSecuritiesOrdersId}
                      type="file"
                      onChange={handleAttachFileOrders}
                    />
                    <label htmlFor={LoadDataFromTSSecuritiesOrdersId}>
                      <Button
                        component="span"
                        variant="outlined"
                        onClick={()=> setDocListOrders(null)}
                        style={{
                          margin: 3,
                          color: "white",
                          backgroundColor: "#BB7100",
                          borderColor: "#161C87",
                          height: 32,
                          fontSize: 12
                        }}
                      >Файл остатков
                      </Button>
                    </label>
                  </div>
                  <div className={classes.importFile}>
                    <input
                      accept="text/plain"
                      className={classes.inputFile} 
                      id={LoadDataFromTSSecuritiesTradesId}
                      multiple
                      type="file"
                      onChange={handleAttachFileTrades}
                    />
                    <label htmlFor={LoadDataFromTSSecuritiesTradesId}>
                      <Button
                        component="span"
                        variant="outlined"
                        style={{
                          margin: 3,
                          color: "white",
                          backgroundColor: "#BB7100",
                          borderColor: "#161C87",
                          height: 32,
                          fontSize: 12
                        }}
                      >Файл сделок
                      </Button>
                    </label>
                  </div>
                </Grid> 
              </Paper>
            </Grid>
            <br/>
            {/* Create ORD grid table with data from doclist */}
            <Grid item sm={"auto"}>
              <Paper>
                <table size="small" class="main-table-style">
                  <thead class="thead-style">
                    <tr>
                      {gridForm.gridFormOrd.sections.map(section => {
                        return (
                          <td 
                            colSpan={section.contents.length} 
                            class="td-head-style"
                          >
                            {section.label}
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      {gridForm.gridFormOrd.sections.map(section =>
                        section.contents.map(contentItem => {
                          return (
                            <td 
                              rowSpan="2"
                              class="td-head-style"
                            >
                              {contentItem.label}
                            </td>
                          )
                        })
                      )}
                    </tr>
                  </thead>
                  <TableBody>
                    {docListOrders !== null &&
                      docListOrders.map((dataItem, index) => (
                        gridForm.gridFormOrd.sections.map(section => {
                          return(
                            <tr style={{height: 30}}>
                              {section.contents.map(contentItem => (
                               <td align="left" style={{"color": "black", "fontSize": 12, "border": "1px solid grey"}}>{dataItem[contentItem.name]}</td>
                              ))}
                            </tr>
                          )
                        })
                      )
                    )}                 
                  </TableBody>
                </table>              
              </Paper>
            </Grid>
            <br/>
            {/* Create TRD grid table with data from doclist */}
            <Grid item sm={"auto"}>
              <Paper>
                <table 
                  size="small"
                  class="main-table-style"
                >
                  <thead class="thead-style">
                    <tr>
                      {gridForm.gridFormTrd.sections.map(section => {
                        return (
                          <td 
                            colSpan={section.contents.length}
                            class="td-head-style"
                          >
                            {section.label}
                          </td>
                        )
                      })}
                    </tr>
                    <tr>
                      {gridForm.gridFormTrd.sections.map(section =>
                        section.contents.map(contentItem => {
                          return (
                            <td 
                              rowSpan="2" 
                              class="td-head-style"
                            >
                              {contentItem.label}
                            </td>
                          )
                        })
                      )}
                    </tr>
                  </thead>
                  <TableBody>
                    {docListTrades !== null &&
                      docListTrades.map((dataItem, index) => (
                        gridForm.gridFormTrd.sections.map(section => {
                          return(
                            <tr style={{height: 30}}>
                              {section.contents.map(contentItem => (
                                <td align="left" style={{"color": "black", "fontSize": 12, "border": "1px solid grey"}}>{dataItem[contentItem.name]}</td>
                              ))}
                            </tr>
                          )
                        })
                      )
                    )}               
                  </TableBody>
                </table>              
              </Paper>
            </Grid>
          </Grid>
        }
        {taskType === "showLoadDataFromTSCurrenciesForm" &&
          <Grid container direction="column" justify="flex-start" spacing={1}>
            <Grid item xs={8}>
              <Paper>
                <Grid container direction="row" justify="center" alignItems="center">
                  <Table size="small">
                    <TableHead>
                      <TableRow style={{height: 30}}>
                        <TableCell
                          style={{
                            color: "black", 
                            fontSize: 14,
                            backgroundColor:  sectionColor,
                          }}>
                          Загрузка данных из КФБ
                        </TableCell>
                        <TableCell
                          style={{
                            color: "black", 
                            fontSize: 14,
                            backgroundColor:  sectionColor,
                          }}>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow style={{height: 30}}>
                        <TableCell
                          style={{
                            color: "black", 
                            fontSize: 14,
                            width: "40%"
                          }}>Дата
                        </TableCell>
                        <TableCell
                          style={{
                            color: "black", 
                            fontSize: 14,
                            width: "60%"
                          }}>
                           <TextField
                              type="date"
                              name = "date"
                              onBlur = {handleDateTimeChange}
                              style={{width: "100%"}}
                              defaultValue = {(fieldValue["date"] !== undefined) ? props.parseDate(fieldValue["date"]): ""}
                              InputLabelProps={{
                                shrink: true,
                              }}
                            />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <br/>
                </Grid>
                <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                  {buttons.map((button, index) => {
                    return createButton(button, index)
                  })}
                  <div className={classes.importFile}>
                    <input
                      accept="text/plain"
                      className={classes.inputFile}
                      id={LoadDataFromTSCurrenciesId}
                      type="file"
                      onChange={handleAttachFileOrders}
                    />
                    <label htmlFor={LoadDataFromTSCurrenciesId}>
                      <Button
                        component="span"
                        variant="outlined"
                        onClick={()=> setDocListOrders(null)}
                        style={{
                          margin: 3,
                          color: "white",
                          backgroundColor: "#BB7100",
                          borderColor: "#161C87",
                          height: 32,
                          fontSize: 12
                        }}
                      >Файл остатков
                      </Button>
                    </label>
                  </div>
                </Grid> 
              </Paper>
            </Grid>
            <br/>
            {/* Create ORD grid table with data from doclist */}
            <Grid item sm={"auto"}>
              <Paper>
                <table size="small" class="main-table-style">
                  <thead class="thead-style">
                    <tr>
                      {gridForm.gridFormOrd.sections.map(section => {
                        return (
                          <td colSpan={section.contents.length} class="td-head-style">{section.label}</td>
                        )
                      })}
                    </tr>
                    <tr>
                      {gridForm.gridFormOrd.sections.map(section =>
                        section.contents.map(contentItem => {
                          return (
                            <td rowSpan="2" class="td-head-style">{contentItem.label}</td>
                          )
                        })
                      )}
                    </tr>
                  </thead>
                  <TableBody>
                    {docListOrders !== null &&
                      docListOrders.map((dataItem, index) => (
                        gridForm.gridFormOrd.sections.map(section => {
                          return(
                            <tr style={{height: 30}}>
                              {section.contents.map(contentItem => (
                               <td align="left" style={{"color": "black", "fontSize": 12, "border": "1px solid grey"}}>{dataItem[contentItem.name]}</td>
                              ))}
                            </tr>
                          )
                        })
                      )
                    )}                 
                  </TableBody>
                </table>              
              </Paper>
            </Grid>
            <br></br>
          </Grid>
        }
      </Grid>  
    )
  }
  catch(error){
    console.log("ERROR", error)
    return <div>Error {props.userTask.docList}</div>
  }
}