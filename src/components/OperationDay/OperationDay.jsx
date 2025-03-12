// Import material and react components
import React, { useState, useEffect } from 'react';
// import Select from 'react-select';
// import MaskedInput from 'react-text-mask';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// import Checkbox from '@material-ui/core/Checkbox';
// import Table from "@material-ui/core/Table";
// import TableHead from "@material-ui/core/TableHead";
// import TableBody from "@material-ui/core/TableBody";
// import Typography from '@material-ui/core/Typography';
// import Input from '@material-ui/core/Input';
// import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
// Import libraries
import swal from 'sweetalert' // https://sweetalert.js.org/guides/
// import Calendar from 'react-calendar' // https://github.com/wojtekmaj/react-calendar
import 'react-calendar/dist/Calendar.css';

import TodayIcon from '@material-ui/icons/Today';
import moment from 'moment';

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      // decimalScale={3}
      decimalSeparator={","}
      isNumericString
    />
  );
}
NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}
export default (props) => {
  // This.state
  const [userProfile] = useState(props.userProfile)
  const [process_id] = useState(props.userTask.process_id)
  const [session_id] = useState(props.userTask.session_id)
  const [taskID] = useState(props.userTask.taskID)
  const [fieldValue, setFieldValue] = useState({})
  const [buttons] = useState(props.userTask.buttons)
  const [updateState, setUpdateState] = useState(null)


  // Initializing
  useEffect(() => {
    console.log("Oper Day PROPS", props.userTask)
    if (props.userTask.selectedDoc !== "null" && props.userTask.selectedDoc !== undefined) {
      try {
        let parsedSelectedDoc = JSON.parse(props.userTask.selectedDoc)
        for (let i = 0; i < parsedSelectedDoc.length; i++) {
          fieldValue[parsedSelectedDoc[i].currency] = parsedSelectedDoc[i].rate
          console.log("CUR", parsedSelectedDoc[i])
        }
        setFieldValue(fieldValue)
        console.log("FIELDS", fieldValue)
      }
      catch (er) { console.log("ER") }
      // setSelectedDoc(props.userTask.selectedDoc)
    }
    let today = props.parseDate(new Date())
    fieldValue["operatingDay"] = today
    setFieldValue(fieldValue)
    setUpdateState(getUUID())
  }, [])
  // Integer input handlers
  function handleChange(event) {
    fieldValue[event.target.name] = event.target.value
    setFieldValue(fieldValue)
    setUpdateState(getUUID())
    console.log("FIELDVALUE", event.target.name, event.target.value)
  }
  // Returns random id
  function getUUID() {
    const uuidv1 = require("uuid/v1")
    return uuidv1()
  }
  function calendarChange(value) {
    let newDate = props.parseDate(value)
    // setOperatingDay(newDate)
    fieldValue["operatingDay"] = newDate
    setFieldValue(fieldValue)
    setUpdateState(getUUID())
    // console.log("CALENDAR", fieldValue)
  }

  // Returns Button component
  function createButton(button, index) {
    let create = true
    if (button.name === "openOperationDay" && props.operDayIsOpened === true) {
      create = false
    }
    else if (button.name === "closeOperationDay" && props.operDayIsOpened === false) {
      create = false
    }
    if (create === true) {
      return (
        <Button variant="outlined"
          name={button.name}
          onClick={() => buttonClick(button.name)}
          style={{
            margin: 3,
            backgroundColor: button.backgroundColor,
            height: 32,
            fontSize: 12,
            color: button.fontColor
          }}
          value={button.name}
        >
          {button.label}
        </Button>
      )
    }

  }
  function getCurrentDateTime() {
    // let newDate = new Date()
    // let dd = String(newDate.getDate()).padStart(2, '0')
    // let mm = String(newDate.getMonth() + 1).padStart(2, '0') //January is 0!
    // let yyyy = newDate.getFullYear()
    // let hours = new Date().getHours()
    // if (hours < 10) {
    //   hours = "0" + hours
    // }
    // let minutes = new Date().getMinutes()
    // if (minutes < 10) {
    //   minutes = "0" + minutes
    // }
    // let seconds = new Date().getSeconds()
    // if (seconds < 10) {
    //   seconds = "0" + seconds
    // }
    // let currentDateTime = "\"" + yyyy + '-' + mm + '-' + dd + "T00:00:00+00" + "\"" // + hours + ":" + minutes + ":" + seconds + ".111Z" + "\""
    let newDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
    let currentDateTime = "\"" + newDate + "\"" // + hours + ":" + minutes + ":" + seconds + ".111Z" + "\""
    return currentDateTime
    // return moment(new Date()).format('YYYY-MM-DDTHH:mm:ss')
  }
  // Main button click handler
  function buttonClick(buttonName) {
    console.log("Button", buttonName)
    if (buttonName === "openOperationDay") {
      if (props.operDayIsOpened === true) {
        swal({
          text: "Операционный день уже открыт!",
          icon: "warning",
          buttons: { ok: "Ок" }
        })
      }
      else {
        let currentDateTime = getCurrentDateTime()
        const commandJson =
        {
          commandType: "completeTask",
          process_id: process_id,
          session_id: session_id,
          taskID: taskID,
          variables: {
            userAction: { value: "openOperationDay" },
            date: { value: currentDateTime }
          }
        }
        console.log("button openOperationDay: ", commandJson)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    if (buttonName === "closeOperationDay") {
      if (props.operDayIsOpened === false) {
        swal({
          text: "Операционный день уже закрыт!",
          icon: "warning",
          buttons: { ok: "Ок" }
        })
      }
      else {
        let currentDateTime = getCurrentDateTime()
        const commandJson =
        {
          commandType: "completeTask",
          process_id: process_id,
          session_id: session_id,
          taskID: taskID,
          variables: {
            userAction: { value: "closeOperationDay" },
            date: { value: currentDateTime }
          }
        }
        console.log("button closeOperationDay: ", commandJson)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (buttonName === "cancel") {
      const commandJson =
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: { value: "cancel" },
        }
      }
      console.log("button cancel: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
  }
  try {
    console.log("Rend FIELDS", fieldValue)
    return (
      updateState !== null &&
      <Grid>
        <Grid item xs={10}>
          <Paper>
            <div align="center"><th>Форма открытия/закрытия операционного дня</th></div>
            <Grid container direction="row" justify="center" alignItems="center">
              <TextField
                style={{ width: "90px" }}
                value={fieldValue["operatingDay"]}
                readOnly={true}
              />
              <TodayIcon style={{ marginRight: "20px" }} />
              {/* <Calendar
                name="calendar"
                minDate={new Date("2001.01.01")}
                maxDate={new Date("2050.01.01")}
                onChange={calendarChange}
              />                 */}
              <table style={{ marginLeft: "20px", border: "1px solid grey", width: "150px" }}>
                <tr><th style={{ align: "center" }}>Курсы валют</th></tr>
                <table>
                  <tr>
                    <td style={{ paddingLeft: "25px" }}>USD :</td>
                    <td>
                      {
                        <TextField
                          name={2}
                          value={fieldValue[2]}
                          onBlur={handleChange}
                          style={{ width: "60px" }}
                          InputProps={{ inputComponent: NumberFormatCustom }}
                          disabled={(props.userProfile["exchangeRates"] === false) ? true : false}
                        />
                      }
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: "25px" }}>KZT :</td>
                    <td>
                      {
                        <TextField
                          name={3}
                          value={fieldValue[3]}
                          style={{ width: "60px" }}
                          onBlur={handleChange}
                          InputProps={{ inputComponent: NumberFormatCustom }}
                          disabled={(props.userProfile["exchangeRates"] === false) ? true : false}
                        />
                      }
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: "25px" }}>RUB :</td>
                    <td>
                      {
                        <TextField
                          name={4}
                          value={fieldValue[4]}
                          style={{ width: "60px" }}
                          onBlur={handleChange}
                          InputProps={{ inputComponent: NumberFormatCustom }}
                          disabled={(props.userProfile["exchangeRates"] === false) ? true : false}
                        />
                      }
                    </td>
                  </tr>
                  <tr>
                    <td style={{ paddingLeft: "25px" }}>EUR :</td>
                    <td>
                      {
                        <TextField
                          name={7}
                          value={fieldValue[7]}
                          style={{ width: "60px" }}
                          onBlur={handleChange}
                          InputProps={{ inputComponent: NumberFormatCustom }}
                          disabled={(props.userProfile["exchangeRates"] === false) ? true : false}
                        />
                      }
                    </td>
                  </tr>
                </table>
              </table>
            </Grid>
            <Grid container direction="row" justify="center" alignItems="flex-start">
              {buttons.map((button, index) => {
                return createButton(button, index)
              })}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    )
  }
  catch (error) {
    console.log("ERROR", error)
    return <div>error</div>
  }
}