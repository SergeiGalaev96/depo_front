// Import material and react components
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Paper from '@material-ui/core/Paper';
import Modal from "@material-ui/core/Modal";
import FormControl from '@material-ui/core/FormControl';

// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import Stack from '@mui/material/Stack';
// import TimePicker from '@mui/lab/TimePicker';
// import dayjs, { Dayjs } from 'dayjs';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
// Icons
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
// PIN components
import FormControlLabel from '@material-ui/core/FormControlLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';

import { makeStyles } from '@material-ui/core/styles';
// Import libraries
import swal from 'sweetalert' // https://sweetalert.js.org/guides/
import { Markup } from 'interweave';
import * as rutoken from "rutoken";
// import is from 'date-fns/esm/locale/is/index.js';
var moment = require('moment');
const axios = require('axios');
var request = require("request-promise");
var plugin;
var rutokenHandle, certHandle, certData, cmsData;

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
      decimalSeparator={","}
      isNumericString
    />
  );
}
NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}
const useStyles = makeStyles((theme) => ({
  importFile: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  inputFile: {
    display: 'none',
  },
  modal: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #AFAFAF',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  paper: {
    width: "100%",
    height: 200,
    overflow: 'auto',
  },
  button: {
    // width: "5%",
    margin: theme.spacing(0),
  }
}))
function getModalStyle() {
  const top = 35;
  const left = 45;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}
function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}
export default (props) => {
  // This.state
  const classes = useStyles();
  const [userProfile] = useState(props.userProfile)
  const [process_id] = useState(props.userTask.process_id)
  const [session_id] = useState(props.userTask.session_id)
  const [taskID] = useState(props.userTask.taskID)
  const [taskType] = useState(props.userTask.taskType)
  const [enumOptions, setEnumOptions] = useState({})
  const [Form, setForm] = useState(props.userTask.Form)
  const [enumData] = useState(props.userTask.enumData)
  const [selectedOptions, setSelectedOptions] = useState([])

  // const [multiSelectData] = useState(props.userTask.multiSelectData)
  // const [multiSelectDataOptions, setMultiSelectDataOptions] = useState({})
  // const [multiSelectedOptions, setMultiSelectedOptions] = useState({})
  // const [gridForm] = useState(props.userTask.gridForm)
  const [reportName] = useState(props.userTask.reportName)
  const [fieldValue, setFieldValue] = useState({})
  const [docId] = useState(props.userTask.docId)
  const [buttons] = useState(props.userTask.buttons)
  const [formType] = useState(props.userTask.formType)

  const [sectionColor] = useState("#B2E0C9")
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [updateState, setUpdateState] = useState(false)
  const [reportVars, setReportVars] = useState(props.userTask.reportVars)

  // modals
  const [showModalEnterPin, setShowModalEnterPin] = useState(false)
  const [rutokenPin, setRutokenPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [wrongPin, setWrongPin] = useState(false)
  const [modalStyle] = useState(getModalStyle)
  // TRANSFER LIST
  const [transferList, setTransferList] = useState({ reg_id: [], sec_id: [], acc_type_code: [], dep_id: [], corr_dep_id: [], currency_id: [], service_type_id: [], issuer_id: [] })
  const [checked, setChecked] = useState({ reg_id: [], sec_id: [], acc_type_code: [], dep_id: [], corr_dep_id: [], currency_id: [], service_type_id: [], issuer_id: [] })
  const [selectedTransferList, setSelectedTransferList] = useState({ reg_id: [], sec_id: [], acc_type_code: [], dep_id: [], corr_dep_id: [], currency_id: [], service_type_id: [], issuer_id: [] })
  const [transferListSearchFileds, setTransferListSearchFileds] = useState({})
  const [selectedTransferListSearchFileds, setSelectedTransferListSearchFileds] = useState({})
  const [autofocusFieldTrList, setAutofocusFieldTrList] = useState(null)
  const [autofocusFieldSelTrList, setAutofocusFieldSelTrList] = useState(null)

  // const [value, setValue] = React.useState < Dayjs | null > (dayjs('2022-04-07'));

  function leftChecked(name) {
    return intersection(checked[name], transferList[name])
  }
  function rightChecked(name) {
    return intersection(checked[name], selectedTransferList[name])
  }

  // Initializing
  useEffect(() => {
    repserverlogin()
    console.log("REP PROPS", props.userTask, props.userProfile)
    if (props.userTask.enumData !== null && props.userTask.enumData !== undefined && props.userTask.enumData !== "null") {
      let newEnumOptions = {}
      for (let i = 0; i < props.userTask.enumData.length; i++) {
        if (props.userTask.enumData[i] !== null) {
          let options = [{
            "value": "",
            "label": "Пусто",
            "name": props.userTask.enumData[i].name
          }]
          if (props.userTask.enumData[i].name === "report_name") {
            if (props.userTask.taskType === "showReportsSelectingForm") {
              for (let d = 0; d < props.userTask.enumData[i].data.length; d++) {
                if (props.userProfile[props.userTask.enumData[i].data[d].report_name] === true) {
                  options.push({
                    "value": props.userTask.enumData[i].data[d].id,
                    "label": props.userTask.enumData[i].data[d].label,
                    "name": props.userTask.enumData[i].name
                  })
                }
              }
            }
          }
          else {
            for (let d = 0; d < props.userTask.enumData[i].data.length; d++) {
              options.push({
                "value": props.userTask.enumData[i].data[d].id,
                "label": props.userTask.enumData[i].data[d].label,
                "name": props.userTask.enumData[i].name
              })
            }
          }
          newEnumOptions[props.userTask.enumData[i].name] = options
        }
        else {
          let options = [{
            "value": "",
            "label": "Ошибка...",
            "name": getLostEnumName(i)
          }]
          newEnumOptions[getLostEnumName(i)] = options
          props.callErrorToast("Ошибка сбора справочной информации " + getLostEnumName(i))
        }
      }
      setEnumOptions(newEnumOptions)
      let newTrListOpts = createTransferListOptions(props.userTask.Form, props.userTask.enumData)

      if (userProfile.userRole === "3") { // Depositor
        for (let s = 0; s < Form.sections.length; s++) {  // Block depositor field
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            let n = Form.sections[s].contents[c].name
            if (n === "dep_id") {
              Form.sections[s].contents[c].edit = false
              // console.log("BLOCK", Form.sections[s].contents[c])
              let ed = props.userTask.enumData
              for (let e = 0; e < ed.length; e++) {
                if (ed[e].name === "depositors") {
                  for (let d = 0; d < ed[e].data.length; d++) {
                    if (ed[e].data[d].partner === parseInt(userProfile.partner)) {
                      // setSelectedTransferList({ ...selectedTransferList, "dep_id": [ed[e].data[d].id] })
                      newTrListOpts.trList.dep_id = [ed[e].data[d].id]
                    }
                  }
                }
              }
            }
          }
        }
        setForm(Form)
        // for(let i=0; i<multiSelectData.length; i++){// find accounts of depositor
        //   let options = [{
        //     "value": "all",
        //     "label": "Все"
        //   }]
        //   if(multiSelectData[i].name === "acc_id"){
        //     for(let d=0; d<multiSelectData[i].data.length; d++){
        //       if(multiSelectData[i].data[d].partner === parseInt(userProfile.partner)){
        //         options.push({
        //           "value": multiSelectData[i].data[d].id,
        //           "label": multiSelectData[i].data[d].label,
        //         })
        //       }
        //     } 
        //   }
        //   newMultiSelectDatamOptions[multiSelectData[i].name] = options
        // }
        // setMultiSelectDataOptions(newMultiSelectDatamOptions)
      }
      if (userProfile.userRole === "4") { // Registrar
        // console.log("REGS", userProfile)
        for (let s = 0; s < Form.sections.length; s++) {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            let n = Form.sections[s].contents[c].name
            if (n === "reg_id") {
              Form.sections[s].contents[c].edit = false // Block registrar field
              // console.log("BLOCK", Form.sections[s].contents[c])
              let ed = props.userTask.enumData
              for (let e = 0; e < ed.length; e++) {
                if (ed[e].name === "registrars") {
                  for (let d = 0; d < ed[e].data.length; d++) {
                    if (ed[e].data[d].partner === parseInt(userProfile.partner)) {
                      // newTrListOpts.selTrList.reg_id = [ed[e].data[d].id]
                      newTrListOpts.trList.reg_id = [ed[e].data[d].id]
                      // setTransferList({ ...transferList, "registrars": [] })
                      // setSelectedTransferList({ ...selectedTransferList, "registrars": [ed[e].data[d].id] })
                    }
                  }
                }
              }

            }
            else if (n === "sec_id") {
              let regId = null
              let filteredSecurities = []
              let ed = props.userTask.enumData
              for (let e = 0; e < ed.length; e++) {
                if (ed[e].name === "registrars") {
                  for (let d = 0; d < ed[e].data.length; d++) {
                    if (ed[e].data[d].partner === parseInt(userProfile.partner)) {
                      regId = ed[e].data[d].id
                    }
                  }
                }
              }
              for (let e = 0; e < ed.length; e++) {
                if (ed[e].name === "sec_id") {
                  for (let d = 0; d < ed[e].data.length; d++) {
                    if (ed[e].data[d].registrar === regId) {
                      filteredSecurities.push(ed[e].data[d].id)
                    }
                  }
                }
              }
              newTrListOpts.trList.sec_id = filteredSecurities
            }
          }
        }
        setForm(Form)
      }
      if (userProfile.userRole === "8") { // CorrDepository
        for (let s = 0; s < Form.sections.length; s++) {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            let n = Form.sections[s].contents[c].name
            if (n === "corr_dep_id") {
              Form.sections[s].contents[c].edit = false // Block corrDepositories field
              // console.log("BLOCK", Form.sections[s].contents[c])
              let ed = props.userTask.enumData
              for (let e = 0; e < ed.length; e++) {
                if (ed[e].name === "corrDepositories") {
                  for (let d = 0; d < ed[e].data.length; d++) {
                    if (ed[e].data[d].partner === parseInt(userProfile.partner)) {
                      newTrListOpts.trList.corr_dep_id = [ed[e].data[d].id]
                      // setSelectedTransferList({ ...selectedTransferList, "corrDepositories": [ed[e].data[d].id] })
                    }
                  }
                }
              }

            }
          }
        }
        setForm(Form)
      }
      setTransferList(newTrListOpts.trList)
      setSelectedTransferList(newTrListOpts.selTrList)
    }
    // let newMultiSelectDatamOptions = {}
    // if(props.userTask.multiSelectData !== null && props.userTask.multiSelectData !== undefined && props.userTask.multiSelectData !== "null"){
    //   for(let i=0; i<multiSelectData.length; i++){
    //     let options = [{
    //       "value": "all",
    //       "label": "Все"
    //     }]
    //     if(multiSelectData[i].name !== "acc_id"){
    //       for(let d=0; d<multiSelectData[i].data.length; d++){
    //         options.push({
    //           "value": multiSelectData[i].data[d].id,
    //           "label": multiSelectData[i].data[d].label,
    //         })
    //       }
    //     }
    //     else{
    //       for(let d=0; d<multiSelectData[i].data.length; d++){
    //         if(multiSelectData[i].data[d].partner === parseInt(userProfile.partner)){
    //           options.push({
    //             "value": multiSelectData[i].data[d].id,
    //             "label": multiSelectData[i].data[d].label,
    //           })
    //         }
    //       }
    //     }
    //     newMultiSelectDatamOptions[multiSelectData[i].name] = options
    //   }
    //   setMultiSelectDataOptions(newMultiSelectDatamOptions)
    //   console.log("MS DATA OPTS", newMultiSelectDatamOptions)
    // }
    if (props.userTask.selectedDoc !== "null" && props.userTask.selectedDoc !== undefined) {
      // console.log("SDOC", props.userTask.selectedDoc)
      setSelectedDoc(props.userTask.selectedDoc)
    }
    if (props.userTask.reportVars !== "null" && props.userTask.reportVars !== undefined) {
      try {
        let parsedVars = JSON.parse(props.userTask.reportVars)
        setReportVars(parsedVars)
        console.log("VARS", parsedVars)
      }
      catch (er) {
        console.log("VARS", props.userTask.reportVars)
      }

    }

    let newFields = {}
    for (let s = 0; s < Form.sections.length; s++) { // Set current date to DateTime fields
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        if (Form.sections[s].contents[c].type === "FullDateTime")
          newFields[Form.sections[s].contents[c].name] = new Date()
      }
    }
    console.log("NEW F", newFields)
    setFieldValue(newFields)
    setUpdateState(getUUID())
  }, [])
  function getLostEnumName(i) {
    let enumI = 0
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        if (Form.sections[s].contents[c].type === "Enum") {
          if (enumI === i) {
            return Form.sections[s].contents[c].name
          }
          else { enumI += 1 }
        }
      }
    }
  }
  function createTransferListOptions(form, enums) {
    let newTransferList = {}
    let newSelectedTransferList = {}
    for (let s = 0; s < form.sections.length; s++) {
      for (let c = 0; c < form.sections[s].contents.length; c++) {
        if (form.sections[s].contents[c].type === "TransferList") {
          let newTrItems = []
          let newSelTrItems = []
          let cName = form.sections[s].contents[c].name
          for (let e = 0; e < enums.length; e++) {
            if (enums[e] !== null) {
              if (enums[e].name === cName) {
                for (let d = 0; d < enums[e].data.length; d++) {
                  newTrItems.push(enums[e].data[d].id)
                }
              }
            }
            else {
              props.callErrorToast("Ошибка сбора справочной информации " + cName)
            }
          }
          newTransferList[cName] = newTrItems
          newSelectedTransferList[cName] = newSelTrItems
        }
      }
    }
    return (
      {
        trList: newTransferList,
        selTrList: newSelectedTransferList
      }
    )
  }
  // RuToken functions
  rutoken.ready
    // Проверка установки расширение 'Адаптера Рутокен Плагина' в Google Chrome
    .then(function () {
      if (window.chrome || typeof InstallTrigger !== 'undefined') {
        return rutoken.isExtensionInstalled()
      } else {
        return Promise.resolve(true)
      }
    })
    // Проверка установки Рутокен Плагина
    .then(function (result) {
      if (result) {
        return rutoken.isPluginInstalled()
      } else {
        // alert("Не удаётся найти расширение 'Адаптер Рутокен Плагина'")
      }
    })
    // Загрузка плагина
    .then(function (result) {
      if (result) {
        return rutoken.loadPlugin();
      } else {
        // alert("Не удаётся найти Плагин");
      }
    })
    //Можно начинать работать с плагином
    .then(function (result) {
      if (!result) {
        return // alert("Не удаётся загрузить Плагин");
      } else {
        plugin = result;
        return Promise.resolve();
      }
    })
  function getUUID() {
    const uuidv1 = require("uuid/v1")
    return uuidv1()
  }

  // Rutoken MODAL
  const handleCloseModalEnterPin = () => {
    setShowModalEnterPin(false)
  }
  function handlePinChange(event) {
    // console.log("EVENT", event.target.name, event.target.value)
    setRutokenPin(event.target.value)
    console.log("PIN", event.target.value)
  }
  function handleClickShowPin() {
    setShowPin(!showPin)
  }

  // Sign transfer order with rutoken
  function sign() {
    // reportToPDFES("ФИО", "ИНН", "25.03.2023")
    // handleCloseModalEnterPin()

    // Перебор подключенных Рутокенов
    if (plugin !== undefined) {
      plugin.enumerateDevices()
        .then(function (devices) {
          if (devices.length > 0) {
            return Promise.resolve(devices[0])
          } else {
            alert("Рутокен не обнаружен")
          }
        })
        // Проверка залогиненности
        .then(function (firstDevice) {
          rutokenHandle = firstDevice
          return plugin.getDeviceInfo(rutokenHandle, plugin.TOKEN_INFO_IS_LOGGED_IN)
        })
        // Логин на первый токен в списке устройств PIN-кодом по умолчанию
        .then(function (isLoggedIn) {
          if (isLoggedIn) {
            return Promise.resolve()
          } else {
            return plugin.login(rutokenHandle, rutokenPin) // 240699
          }
        })
        // Перебор пользовательских сертификатов на токене
        .then(function () {
          return plugin.enumerateCertificates(rutokenHandle, plugin.CERT_CATEGORY_UNSPEC)
        })
        .then(function (certs) {
          if (certs.length > 0) {
            certHandle = certs[0]
            return plugin.parseCertificate(rutokenHandle, certs[0])
          } else {
            alert("Сертификат на Рутокен не обнаружен");
          }
        })
        // Подписание данных из текстового поля на первом найденом сертификате
        .then(function (certs) {
          certData = certs
          let tokenRemainingTime = new Date(certData.validNotAfter).getTime() - Date.now()
          if (tokenRemainingTime > 0) {
            if (certHandle.length > 0) {
              var options = {}
              let inn = ""
              let fullName = ""
              for (let i = 0; i < certData.subject.length; i++) {
                if (certData.subject[i].rdn === "serialNumber") {
                  inn = certData.subject[i].value
                }
                if (certData.subject[i].rdn === "commonName") {
                  fullName = certData.subject[i].value
                }
              }
              props.setEsInn(inn)
              props.setEsUserFullName(fullName)
              props.setEsExpiredDate(certData.validNotAfter.substring(0, certData.validNotAfter.length - 1))
              handleCloseModalEnterPin()
              // swAllert("Отчет успешно подписан!", "success")
              reportToPDFES(fullName, inn, certData.validNotAfter.substring(0, certData.validNotAfter.length - 1))
              return plugin.sign(rutokenHandle, certHandle, "textToSign", plugin.DATA_FORMAT_PLAIN, options)
            } else {
              alert("Сертификат на Рутокен не обнаружен")
            }
          }
          else {
            plugin.logout(rutokenHandle)
            props.callErrorToast("Рутокен просрочен", "warning")
          }
        })
        // Закрытие сессии
        .then(function () {
          plugin.logout(rutokenHandle)
        }, handleError)
    }
    else { props.callErrorToast("Вставьте рутокен, либо установите расширение для вашего браузера", "warning") }
  }
  // catch errors while signing docs
  function handleError(reason) {
    if (isNaN(reason.message)) {
      console.log(reason);
    } else {
      var errorCodes = plugin.errorCodes;
      switch (parseInt(reason.message)) {
        case errorCodes.PIN_INCORRECT:
          // alert("Неверный PIN");
          setWrongPin(true)
          break;
        default:
          console.log("Неизвестная ошибка");
      }
    }
  }
  function onKeyPressModalEnterPin(event) {
    let code = event.charCode
    if (code === 13) {
      buttonClick("SignReportSaveButton", null)
    }
  }
  // Integer input handlers
  function handleChange(event) {
    console.log("EV", event)
    fieldValue[event.target.name] = event.target.value
    setFieldValue(fieldValue)
    console.log("FIELDVALUE", fieldValue)
  }
  function handleDateChange(event) {
    // let fullDate = new Date(event.target.value)
    // // console.log("DATE CHANGE", fullDate)
    // if (fieldValue[event.target.name] !== undefined && fieldValue[event.target.name] !== null) {
    //   let fullDate = moment(fullDate).format("YYYY-MM-DDTHH:mm:ss")
    // }
    // fieldValue[event.target.name] = fullDate
    // setFieldValue(fieldValue)
    // console.log("DATE CHANGE", fullDate)
    // console.log("FVAL", fieldValue)
    // // setUpdateState(getUUID())

    // console.log("EV", event)
    fieldValue[event.target.name] = event.target.value
    setFieldValue(fieldValue)
    console.log("FIELDVALUE", fieldValue)
  }
  function handleTimeChange(name, value) {
    let fullDate = new Date(value)
    if (fieldValue[name] !== undefined && fieldValue[name] !== null) {
      // let nDate = props.parseDate(fieldValue[name])
      // let hours = new Date(value).getHours()
      // let minutes = new Date(value).getMinutes()
      // let seconds = new Date(value).getSeconds()
      // fullDate = new Date(nDate + "T" + hours + ":" + minutes + ":" + seconds)
      let date = moment(fieldValue[name]).format("YYYY-MM-DD")
      let time = moment(value).format("HH:mm:ss")
      fullDate = date + "T" + time
    }
    fieldValue[name] = fullDate
    setFieldValue(fieldValue)
    console.log("FULL DATE CHANGE", name, value, fieldValue)
    console.log("FVAL", fieldValue)
    setUpdateState(getUUID())
  }
  function handleDateTimeChange(event) {
    // console.log("FULL DATE TIME CHANGE", event.target.name, event.target.value)
    setFieldValue({ ...fieldValue, [event.target.name]: event.target.value })
  }
  const handleCheckboxChange = (event) => {
    setFieldValue({ ...fieldValue, [event.target.name]: event.target.checked })
  }
  function swAllert(text, icon) {
    return (
      swal({
        text: text,
        icon: icon,
        buttons: { ok: "Ок" },
      })
    )
  }
  // Handler of select copmponet changes
  function handleSelectChange(option) {
    console.log("SEL CHANGE", option.name, option.value)
    fieldValue[option.name] = option.value
    let updateSelectedOptions = selectedOptions.slice()
    let noSuchOption = true
    for (let i = 0; i < updateSelectedOptions.length; i++) {
      if (option.name === updateSelectedOptions[i].name) {
        updateSelectedOptions[i] = option
        setSelectedOptions(updateSelectedOptions)
        // console.log("SO", selectedOptions)
        noSuchOption = false
        break
      }
      else {
        noSuchOption = true
      }
    }
    if (noSuchOption === true) {
      updateSelectedOptions.push(option)
      setSelectedOptions(updateSelectedOptions)
    }
    setFieldValue(fieldValue)
  }
  // function handleMultiSelectChange(value, {action, removedValue, name}) {
  //   // console.log("MSOP", multiSelectedOptions)
  //   console.log("NAME",name)
  //   if(action === "select-option"){
  //     let putAll = false
  //     for(let i=0; i<value.length; i++){
  //       if(value[i].value === "all"){
  //         putAll = true
  //       }
  //     }
  //     if(putAll === true){
  //       multiSelectedOptions[name] = multiSelectDataOptions[name]
  //     }
  //     else{
  //       multiSelectedOptions[name] = value
  //     }
  //   }
  //   else if(action === "remove-value"){
  //     // console.log("RV", removedValue, "NAME", name)
  //     if(removedValue.value === "all"){
  //       multiSelectedOptions[name] = null
  //     }
  //     else{
  //       multiSelectedOptions[name] = value
  //     }
  //   }
  //   else if(action === "clear"){
  //     multiSelectedOptions[name] = null
  //   }
  //   if(name === "dep_id"){
  //     if(multiSelectedOptions[name] !== null){
  //       console.log("MS", multiSelectedOptions["acc_id"])
  //       let partnersList = []
  //       let depositors = []
  //       for(let i=0; i<enumData.length; i++){
  //         if(enumData[i].name === "depositors"){
  //           depositors = enumData[i].data // Find partner for each selected depositor
  //         }
  //       }
  //       for(let m=0; m<multiSelectedOptions[name].length; m++){
  //         for(let d=0; d<depositors.length; d++){
  //           if(depositors[d].id === multiSelectedOptions[name][m].value){
  //             partnersList.push(depositors[d].partner)
  //           }
  //         }
  //       }
  //       // for(let ms=0; ms<multiSelectData.length; ms++){
  //       //   if(multiSelectData[ms].name === "acc_id"){
  //       //     let options = [{
  //       //       "value": "all",
  //       //       "label": "Все"
  //       //     }]
  //       //     for(let msd=0; msd<multiSelectData[ms].data.length; msd++){
  //       //       for(let p=0; p<partnersList.length; p++){
  //       //         if(partnersList[p] === multiSelectData[ms].data[msd].partner){

  //       //           options.push({
  //       //             "value": multiSelectData[ms].data[msd].id,
  //       //             "label": multiSelectData[ms].data[msd].label,
  //       //           })
  //       //         }  
  //       //       }
  //       //     }
  //       //     multiSelectDataOptions["acc_id"] = options
  //       //   }
  //       // }
  //     }
  //     else{
  //       multiSelectedOptions["acc_id"] = null
  //       // multiSelectDataOptions["acc_id"] = null
  //     }
  //   }
  //   if(name === "corr_dep_id"){
  //     if(multiSelectedOptions[name] !== null){
  //       console.log("MS", multiSelectedOptions["acc_id"])
  //       let partnersList = []
  //       let corr_depositors = []
  //       for(let i=0; i<enumData.length; i++){
  //         if(enumData[i].name === "corrDepositories"){
  //           corr_depositors = enumData[i].data // Find partner for each selected corr depositories
  //         }
  //       }
  //       for(let m=0; m<multiSelectedOptions[name].length; m++){
  //         for(let d=0; d<corr_depositors.length; d++){
  //           if(corr_depositors[d].id === multiSelectedOptions[name][m].value){
  //             partnersList.push(corr_depositors[d].partner)
  //           }
  //         }
  //       }
  //       // for(let ms=0; ms<multiSelectData.length; ms++){
  //       //   if(multiSelectData[ms].name === "acc_id"){
  //       //     let options = [{
  //       //       "value": "all",
  //       //       "label": "Все"
  //       //     }]
  //       //     for(let msd=0; msd<multiSelectData[ms].data.length; msd++){
  //       //       for(let p=0; p<partnersList.length; p++){
  //       //         if(partnersList[p] === multiSelectData[ms].data[msd].partner){

  //       //           options.push({
  //       //             "value": multiSelectData[ms].data[msd].id,
  //       //             "label": multiSelectData[ms].data[msd].label,
  //       //           })
  //       //         }  
  //       //       }
  //       //     }
  //       //     multiSelectDataOptions["acc_id"] = options
  //       //   }
  //       // }
  //     }
  //     else{
  //       multiSelectedOptions["acc_id"] = null
  //       multiSelectDataOptions["acc_id"] = null
  //     }
  //   }
  //   if(name === "reg_id"){
  //     if(multiSelectedOptions[name] !== null){
  //       console.log("MS", multiSelectedOptions["acc_id"])
  //       let partnersList = []
  //       let registrars = []
  //       for(let i=0; i<enumData.length; i++){
  //         if(enumData[i].name === "registrars"){
  //           registrars = enumData[i].data // Find partner for each selected corr depositories
  //         }
  //       }
  //       for(let m=0; m<multiSelectedOptions[name].length; m++){
  //         for(let d=0; d<registrars.length; d++){
  //           if(registrars[d].id === multiSelectedOptions[name][m].value){
  //             partnersList.push(registrars[d].partner)
  //           }
  //         }
  //       }
  //       // for(let ms=0; ms<multiSelectData.length; ms++){
  //       //   if(multiSelectData[ms].name === "acc_id"){
  //       //     let options = [{
  //       //       "value": "all",
  //       //       "label": "Все"
  //       //     }]
  //       //     for(let msd=0; msd<multiSelectData[ms].data.length; msd++){
  //       //       for(let p=0; p<partnersList.length; p++){
  //       //         if(partnersList[p] === multiSelectData[ms].data[msd].partner){

  //       //           options.push({
  //       //             "value": multiSelectData[ms].data[msd].id,
  //       //             "label": multiSelectData[ms].data[msd].label,
  //       //           })
  //       //         }  
  //       //       }
  //       //     }
  //       //     multiSelectDataOptions["acc_id"] = options
  //       //   }
  //       // }
  //     }
  //     else{
  //       multiSelectedOptions["acc_id"] = null
  //       // multiSelectDataOptions["acc_id"] = null
  //     }
  //   }
  //   setMultiSelectedOptions(multiSelectedOptions)
  //   setUpdateState(getUUID())
  // }


  const handleIntChange = (event) => {
    // console.log("EVENT", event.target.name, event.target.value)
    let stringNum = event.target.value.toString().replace(/ /g, '')
    let int = parseInt(stringNum)
    setFieldValue({ ...fieldValue, [event.target.name]: int })
  }
  // function handleIntChange(event) {
  //   console.log("EVENT", event.target.name, event.target.value)
  //   fieldValue[event.target.name] = parseInt(event.target.value)
  //   setFieldValue(fieldValue)
  // }
  // Create sections with labels and call bodyBuilder function
  function sectionBuilder(section, index) {
    return (
      <Table size="small">
        <TableHead>
          <TableRow style={{ height: 30 }}>
            <TableCell
              style={{
                color: "black",
                fontSize: 14,
                backgroundColor: sectionColor,
                width: "100%"
              }}>
              {section.label}
            </TableCell>
          </TableRow>
        </TableHead>
        {bodyBuilder(section)}
      </Table>
    )
  }
  // Create body of each section and call contentBuilder function
  function bodyBuilder(section) {
    return (
      <Table size="small">
        <TableBody>
          {section.contents.map((contentItem, index) => (
            contentItem.show === true &&
              contentItem.type === "TransferList" ?
              <table size="small" align="center">
                <tr>
                  <th colSpan="3">{contentItem.label}</th>
                </tr>
                <tr>
                  <td width="43%" style={{ padding: "10px" }}>поиск <input
                    autoFocus={autofocusFieldTrList === contentItem.name ? true : false}
                    name={contentItem.name}
                    onChange={handleSearchTransferListChange}
                    value={transferListSearchFileds[contentItem.name]}
                  // disabled={!contentItem.edit}
                  />
                  </td>
                  <td width="4%"></td>
                  <td width="43%" style={{ padding: "10px" }}>поиск <input
                    autoFocus={autofocusFieldSelTrList === contentItem.name ? true : false}
                    name={contentItem.name}
                    onChange={handleSearchSelectedTransferListChange}
                    value={selectedTransferListSearchFileds[contentItem.name]}
                  // disabled={!contentItem.edit}
                  /></td>
                </tr>
                <tr>
                  <td width="43%">
                    <Grid item>{getTransferList(transferList[contentItem.name], contentItem.name, contentItem.edit)}</Grid>
                  </td>
                  <td width="4%">
                    <Grid item>
                      <Grid container direction="column">
                        <Button
                          variant="outlined"
                          size="small"
                          className={classes.button}
                          onClick={() => handleAllRight(contentItem.name)}
                          disabled={transferList[contentItem.name].length === 0 ? true : false}
                        // disabled={(transferList[contentItem.name].length === 0 || contentItem.edit === false) ? true : false}  
                        >
                          ≫
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          className={classes.button}
                          onClick={() => handleCheckedRight(contentItem.name)}
                          disabled={leftChecked(contentItem.name).length === 0 ? true : false}
                        // disabled={(leftChecked(contentItem.name).length === 0 || contentItem.edit === false) ? true : false}
                        >
                          &gt;
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          className={classes.button}
                          onClick={() => handleCheckedLeft(contentItem.name)}
                          disabled={rightChecked(contentItem.name).length === 0 ? true : false}
                        // disabled={(rightChecked(contentItem.name).length === 0 || contentItem.edit === false) ? true : false}
                        >
                          &lt;
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          className={classes.button}
                          onClick={() => handleAllLeft(contentItem.name)}
                          disabled={selectedTransferList[contentItem.name].length === 0 ? true : false}
                        // disabled={(selectedTransferList[contentItem.name].length === 0 || contentItem.edit === false) ? true : false}
                        >
                          ≪
                        </Button>
                      </Grid>
                    </Grid>
                  </td>
                  <td width="43%">
                    <Grid item>{getTransferList(selectedTransferList[contentItem.name], contentItem.name, contentItem.edit)}</Grid>
                  </td>
                </tr>
              </table>
              :
              <Table size="small">
                <TableRow style={{ height: 30 }}>
                  <TableCell
                    align="left"
                    style={{ width: "40%" }}>
                    {contentItem.label}
                  </TableCell>
                  <TableCell
                    align="left"
                    style={{ width: "60%", height: 30 }}
                  >{contentBuilder(contentItem)}
                  </TableCell>
                </TableRow>
              </Table>
          ))}
        </TableBody>
      </Table>
    )
  }
  // Create component by it's type
  function contentBuilder(contentItem) {
    if (contentItem.type === "Text") {
      return (
        <TextField
          multiline
          onBlur={handleChange}
          name={contentItem.name}
          style={{ width: "100%" }}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          defaultValue={(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name] : ""}
        />
      )
    }
    else if (contentItem.type === "Int") {
      return (
        <TextField
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          style={{ width: "100%" }}
          // defaultValue={(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name] : ""}
          // value = {(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name]: ""}
          // onBlur={handleIntChange}
          value={(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name] : ""}
          onChange={handleIntChange}
          name={contentItem.name}
          InputProps={{ inputComponent: NumberFormatCustom }}
        />
      )
    }
    else if (contentItem.type === "DateTime" || contentItem.type === "JasperDate") {
      return (
        <TextField
          type="date"
          name={contentItem.name}
          onBlur={handleDateChange}
          style={{ width: "100%" }}
          defaultValue={(fieldValue[contentItem.name] !== undefined && fieldValue[contentItem.name] !== null) ? fieldValue[contentItem.name] : "NaN.NaN.NaN"}
          // defaultValue = {fieldValue[contentItem.name]}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          InputLabelProps={{
            shrink: true,
          }}
        />
      )
    }
    else if (contentItem.type === "FullDateTime") {
      return (
        // <table>
        //   <tr>
        //     <td style={{width: "45%"}}>
        //       <TextField
        //         key={fieldValue[contentItem.name]}
        //         type="date"
        //         name={contentItem.name}
        //         onChange={handleDateChange}
        //         style={{width: "100%"}}
        //         defaultValue={(fieldValue[contentItem.name] !== undefined && fieldValue[contentItem.name] !== null) ? props.parseDate(fieldValue[contentItem.name]) : "NaN.NaN.NaN" }
        //         disabled={(formType === "view" || contentItem.edit === false) ? true : false}
        //         InputLabelProps={{
        //           shrink: true,
        //         }}
        //       />
        //     </td>
        //     <td style={{width: "45%"}}>
        //       <LocalizationProvider dateAdapter={AdapterDayjs}>
        //         <Stack>
        //           <TimePicker
        //             // key={fieldValue[contentItem.name]}
        //             ampm={false}
        //             openTo="hours"
        //             views={['hours', 'minutes', 'seconds']}
        //             inputFormat="HH:mm:ss"
        //             mask="__:__:__"
        //             // value={dVal}
        //             value={(fieldValue[contentItem.name] !== undefined && fieldValue[contentItem.name] !== null) ? fieldValue[contentItem.name] : "NaN.NaN.NaN" }
        //             onChange={(newValue) => {handleTimeChange(contentItem.name, newValue)}}
        //             renderInput={(params) => <TextField {...params} />}
        //           />
        //         </Stack>
        //     </LocalizationProvider>
        //   </td>
        //   </tr>
        // </table>


        <TextField
          name={contentItem.name}
          onChange={handleDateTimeChange}
          type="datetime-local"
          // defaultValue="2017-05-24T10:30"
          defaultValue={(fieldValue[contentItem.name] !== undefined && fieldValue[contentItem.name] !== null) ? moment(fieldValue[contentItem.name]).format("YYYY-MM-DDTHH:MM") : moment(new Date()).format("YYYY-MM-DDTHH:MM")}
          InputLabelProps={{
            shrink: true,
          }}
        />

        //   <LocalizationProvider dateAdapter={AdapterDateFns}>

        //     <TimePicker
        //       ampm={false}
        //       openTo="hours"
        //       views={['hours', 'minutes', 'seconds']}
        //       inputFormat="HH:mm:ss"
        //       mask="__:__:__"
        //       value={value}
        //       // onChange={(newValue) => {
        //       //   setValue(newValue);
        //       // }}
        //       renderInput={(params) => <TextField {...params} />}
        //     />
        // </LocalizationProvider>

      )
    }
    else if (contentItem.type === "Enum") {
      let selectedOption = {
        "value": "",
        "label": "Пусто",
        "name": contentItem.name
      }
      if (fieldValue[contentItem.name] !== undefined) {
        for (let i = 0; i < enumOptions[contentItem.name].length; i++) {
          if (fieldValue[contentItem.name] === enumOptions[contentItem.name][i].value) {
            selectedOption = enumOptions[contentItem.name][i]
            break
          }
        }
      }
      if (selectedOptions.length !== 0) {
        for (let i = 0; i < selectedOptions.length; i++) {
          if (contentItem.name === selectedOptions[i].name) {
            selectedOption = selectedOptions[i]
          }
        }
      }
      return (
        <Select
          name={contentItem.name}
          value={selectedOption}
          onChange={handleSelectChange}
          options={enumOptions[contentItem.name]}
          isDisabled={(formType === "view" || contentItem.edit === false) ? true : false}
          menuPortalTarget={document.body}
          styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
        />
      )
    }
    // else if (contentItem.type === "MultiSelect"){
    //   return (
    //     // <div style={{height: "40px", overflow: "auto"}}>
    //       <Select
    //         name={contentItem.name}
    //         className="basic-multi-select"
    //         classNamePrefix="select"
    //         value={multiSelectedOptions[contentItem.name]}
    //         onChange={handleMultiSelectChange}
    //         closeMenuOnSelect={false}
    //         isMulti
    //         options={multiSelectDataOptions[contentItem.name]}
    //         isDisabled ={(formType === "view" || contentItem.edit === false) ? true : false}
    //         style={{height: "120px"}}
    //       />
    //     // </div>
    //   )
    // }
    else if (contentItem.type === "Currency") {
      return (
        <TextField
          value={fieldValue[contentItem.name] ? fieldValue[contentItem.name] : ""}
          onBlur={handleChange}
          name={contentItem.name}
          style={{ minWidth: 300 }}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          InputProps={{ inputComponent: NumberFormatCustom }}
        />
      )
    }
    else if (contentItem.type === "Bool") {
      return (
        <Checkbox
          style={{ maxWidth: 20, height: 15, color: (formType === "view" || contentItem.edit === false) ? "grey" : "green" }}
          name={contentItem.name}
          onChange={handleCheckboxChange}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          checked={(fieldValue[contentItem.name] === "True" || fieldValue[contentItem.name] === true) ? true : false}
        />
      )
    }
  }
  // Main button click handler
  function buttonClick(buttonName) {
    console.log("Button", buttonName)
    if (buttonName === "selectReportType") {
      let reportFormDefId = null
      let reportName = null
      for (let i = 0; i < enumData.length; i++) {
        if (props.userTask.enumData[i] !== null) {
          if (enumData[i].name === "report_name") {
            for (let d = 0; d < enumData[i].data.length; d++) {
              if (enumData[i].data[d].id === fieldValue["report_name"]) {
                reportFormDefId = enumData[i].data[d].form_def_id
                reportName = enumData[i].data[d].report_name
              }
            }
          }
        }
        else {
          props.callErrorToast("Ошибка сбора справочной информации " + getLostEnumName(i))
        }
      }
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "selectReportType" },
          reportName: { value: reportName },
          reportFormDefId: { value: reportFormDefId }
        }
      }
      console.log("button selectReportType:", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "createReport") {
      let checkResult = checkForRequieredFields()
      if (checkResult === true) {
        let reportExecutions = getFieldValuesReportExecutions("html")
        // let reportExecutionsXML = getFieldValuesCreateReportXML()
        // let reportVars = getFieldValuesCreateReport()
        let commandJson =
        {
          commandType: "completeTask",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          userId: userProfile.userId,
          userRole: userProfile.userRole,
          variables: {
            reportExecutions: { value: JSON.stringify(reportExecutions) },
            // reportExecutionsXML: { value: reportExecutionsXML },
            userAction: { value: "createReport" }
          }
        }
        console.log("button createReport:", commandJson)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (buttonName === "createChargeForCDServiceReport") {
      let checkResult = checkForRequieredFields()
      if (checkResult === true) {
        // let reportVars = getFieldValuesCreateReport()
        let reportExecutions = getFieldValuesReportExecutions("html")
        let chargeBody = {
          startDate: fieldValue.start_date,
          endDate: fieldValue.end_date,
          depositorId: selectedTransferList.dep_id,
          serviceTypeId: selectedTransferList.service_type_id
        }
        let commandJson =
        {
          commandType: "completeTask",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          userId: userProfile.userId,
          userRole: userProfile.userRole,
          variables: {
            // reportVars: { value: reportVars },
            reportExecutions: { value: JSON.stringify(reportExecutions) },
            userAction: { value: "createReport" },
            chargeBody: { value: JSON.stringify(chargeBody) }
          }
        }
        console.log("button createChargeForCDServiceReport:", commandJson)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (buttonName === "createCharge") {

      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "createCharge" },
        }
      }
      console.log("button createCharge:", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }


    else if (buttonName === "reportToExcel") {
      downloadReport("xlsx", "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,")
      console.log("button reportToExcel: ")
    }
    else if (buttonName === "reportToPDF") {
      downloadReport("pdf", "data:application/pdf;base64,")
      // console.log("button reportToPDF: ", reportVars)
    }
    else if (buttonName === "reportToWord") {
      downloadReport("docx", "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,")
      console.log("button reportToWord: ")
    }
    else if (buttonName === "reportToPDFES") {
      if (props.esInn === null) {
        setShowModalEnterPin(true)
      }
      else {
        reportToPDFES(props.esUserFullName, props.esInn, props.esExpiredDate)
      }
    }
    else if (buttonName === "SignReportSaveButton") {
      sign()
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
    else if (buttonName === "back") {
      const commandJson =
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: { value: "back" },
        }
      }
      console.log("button back: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "finish") {
      const commandJson =
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: { value: "finish" },
        }
      }
      console.log("button finish: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
  }
  // Transfer List functions
  const handleToggle = (value, name) => () => {
    const currentIndex = checked[name].indexOf(value)
    const newChecked = [...checked[name]]

    if (currentIndex === -1) {
      newChecked.push(value)
    }
    else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked({ ...checked, [name]: newChecked })
  }
  const handleAllRight = (name) => {
    setSelectedTransferList({ ...selectedTransferList, [name]: selectedTransferList[name].concat(transferList[name]) })
    setTransferList({ ...transferList, [name]: [] })
  }
  function handleCheckedRight(name) {
    // console.log("CHECKED RIGHT", name)
    setSelectedTransferList({ ...selectedTransferList, [name]: selectedTransferList[name].concat(leftChecked(name)) })
    setTransferList({ ...transferList, [name]: not(transferList[name], leftChecked(name)) })
    setChecked({ ...checked, [name]: not(checked[name], leftChecked(name)) })
  }
  function handleCheckedLeft(name) {
    setTransferList({ ...transferList, [name]: transferList[name].concat(rightChecked(name)) })
    setSelectedTransferList({ ...selectedTransferList, [name]: not(selectedTransferList[name], rightChecked(name)) })
    setChecked({ ...checked, [name]: not(checked[name], rightChecked(name)) })
  }
  const handleAllLeft = (name) => {
    setTransferList({ ...transferList, [name]: transferList[name].concat(selectedTransferList[name]) })
    setSelectedTransferList({ ...selectedTransferList, [name]: [] })
  }
  function getTransferList(items, name, edit) {
    // console.log("G TR L", items, name)
    return (
      <Paper className={classes.paper}>
        <List dense component="div" role="list">
          {items.map((value) => {
            const labelId = `transfer-list-item-${value}-label`
            let chkd = checked[name].indexOf(value) !== -1
            let label = getTranserListItemLabel(name, value)
            return (
              <ListItem
                size="small"
                key={value}
                role="listitem"
                button onClick={handleToggle(value, name)}
                style={{ height: label.length > 50 ? 40 : 24 }}
              // disabled={edit === false ? true : false}
              >
                <Checkbox
                  size="small"
                  checked={chkd}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                  style={{ color: chkd === true ? "green" : "grey" }}
                />
                {/* <ListItemText id={labelId} primary={value} /> */}
                <ListItemText id={labelId} primary={label} />
              </ListItem>
            )
          })}
          <ListItem />
        </List>
      </Paper>
    )
  }
  function getTranserListItemLabel(name, value) {
    // console.log("G TRL LABEL", name, value)
    for (let e = 0; e < enumData.length; e++) {
      if (enumData[e].name === name) {
        for (let d = 0; d < enumData[e].data.length; d++) {
          if (enumData[e].data[d].id === value) {
            return enumData[e].data[d].label
          }
        }
      }
    }
  }
  function handleSearchTransferListChange(event) {
    let name = event.target.name
    let value = event.target.value
    setAutofocusFieldTrList(name)
    setTransferListSearchFileds({ ...transferListSearchFileds, [name]: value })
    let filteredTrListOpts = []
    for (let e = 0; e < enumData.length; e++) {
      if (enumData[e].name === name) {
        for (let d = 0; d < enumData[e].data.length; d++) {
          let label = enumData[e].data[d].label.toLowerCase()
          let searchField = value.toLowerCase()
          let includeSearch = label.includes(searchField)
          if (includeSearch === true) {
            filteredTrListOpts.push(enumData[e].data[d].id)
          }
        }
      }
    }
    // console.log("N TR L", newTrListOpts)
    let newTrListOpts = []
    if (selectedTransferList[name].length > 0) {
      for (let i = 0; i < filteredTrListOpts.length; i++) {
        let include = true
        for (let s = 0; s < selectedTransferList[name].length; s++) {
          if (filteredTrListOpts[i] === selectedTransferList[name][s]) {
            include = false
            break
          }
        }
        if (include === true) {
          newTrListOpts.push(filteredTrListOpts[i])
        }
      }
    }
    else {
      newTrListOpts = filteredTrListOpts
    }
    setTransferList({ ...transferList, [name]: newTrListOpts })
  }
  function handleSearchSelectedTransferListChange(event) {
    let name = event.target.name
    let value = event.target.value
    setAutofocusFieldSelTrList(name)
    setSelectedTransferListSearchFileds({ ...selectedTransferListSearchFileds, [name]: value })
    let filteredTrListOpts = []
    for (let e = 0; e < enumData.length; e++) {
      if (enumData[e].name === name) {
        for (let d = 0; d < enumData[e].data.length; d++) {
          let label = enumData[e].data[d].label.toLowerCase()
          let searchField = value.toLowerCase()
          let includeSearch = label.includes(searchField)
          if (includeSearch === true) {
            filteredTrListOpts.push(enumData[e].data[d].id)
          }
        }
      }
    }
    let newSelTrListOpts = []
    if (transferList[name].length > 0) {
      for (let i = 0; i < filteredTrListOpts.length; i++) {
        let include = true
        for (let s = 0; s < transferList[name].length; s++) {
          if (filteredTrListOpts[i] === transferList[name][s]) {
            include = false
            break
          }
        }
        if (include === true) {
          newSelTrListOpts.push(filteredTrListOpts[i])
        }
      }
    }
    else {
      newSelTrListOpts = filteredTrListOpts
    }
    setSelectedTransferList({ ...selectedTransferList, [name]: newSelTrListOpts })
  }
  function getFieldValuesCreateReport() {
    let reportVars = {}
    let strReportVars = ""
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let fieldName = Form.sections[s].contents[c].name
        let type = Form.sections[s].contents[c].type
        if (type === "DateTime") {
          reportVars[fieldName] = moment(fieldValue[fieldName]).format("DD.MM.YYYY")
        }
        else if (type === "FullDateTime") {
          let convertedDate = moment(fieldValue[fieldName]).format("DD.MM.YYYYTHH:mm:ss")
          reportVars[fieldName] = convertedDate
        }
        else if (type === "JasperDate") {
          reportVars[fieldName] = moment(fieldValue[fieldName]).format("YYYY-MM-DD")
        }
        else if (type === "TransferList") {
          // console.log("TTTTTT", selectedTransferList[fieldName])
          let strVals = ""
          if (selectedTransferList[fieldName].length > 0) {
            for (let i = 0; i < selectedTransferList[fieldName].length; i++) {
              let value = selectedTransferList[fieldName][i]
              if (i === selectedTransferList[fieldName].length - 1) {
                strVals += value
              }
              else {
                strVals += value + ","
              }
            }
          }
          reportVars[fieldName] = strVals
          // console.log("TR LIST", strVals)
        }
        // else if(type === "MultiSelect"){
        //   if(Object.keys(multiSelectedOptions).length > 0){
        //     let strVals = ""
        //     for(let i=0; i<multiSelectedOptions[fieldName].length; i++){
        //       let value = multiSelectedOptions[fieldName][i].value
        //       if(value !== "all"){
        //         if(i === multiSelectedOptions[fieldName].length-1){
        //           strVals += value
        //         }
        //         else{
        //           strVals += value + ","
        //         }
        //       }
        //     }
        //     reportVars[fieldName] = strVals
        //     console.log("MULTI", strVals)
        //   }
        // }
        else {
          reportVars[fieldName] = fieldValue[fieldName]
        }


      }
    }
    // console.log("REP VARS", reportVars)
    if (Object.keys(reportVars).length > 0) {
      strReportVars = "?"
      for (let key in reportVars) {
        let newVar = key + "=" + reportVars[key] + "&"
        strReportVars = strReportVars + newVar
      }
      strReportVars = strReportVars.substring(0, strReportVars.length - 1)
    }
    return strReportVars
  }
  function getFieldValuesReportExecutions(format) {
    let reportParams = []
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let fieldName = Form.sections[s].contents[c].name
        let type = Form.sections[s].contents[c].type
        if (type === "DateTime") {
          reportParams.push({ name: fieldName, value: [moment(fieldValue[fieldName]).format("DD.MM.YYYY")] })
        }
        else if (type === "FullDateTime") {
          reportParams.push({ name: fieldName, value: [moment(fieldValue[fieldName]).format("DD.MM.YYYYTHH:mm:ss")] })
        }
        else if (type === "JasperDate") {
          reportParams.push({ name: fieldName, value: [moment(fieldValue[fieldName]).format("YYYY-MM-DD")] })
        }
        else if (type === "TransferList") {
          // console.log("TTTTTT", selectedTransferList[fieldName])
          // let vals = []
          let strVals = ""
          let list = selectedTransferList
          if (selectedTransferList[fieldName].length === 0) {
            list = transferList
          }
          for (let i = 0; i < list[fieldName].length; i++) {
            let value = list[fieldName][i]
            if (i === list[fieldName].length - 1) {
              strVals += value
            }
            else {
              strVals += value + ","
            }
          }
          // if (selectedTransferList[fieldName].length > 0) {
          //   for (let i = 0; i < selectedTransferList[fieldName].length; i++) {
          //     let value = selectedTransferList[fieldName][i]
          //     if (i === selectedTransferList[fieldName].length - 1) {
          //       strVals += value
          //       // vals.push(selectedTransferList[fieldName][i])
          //     }
          //     else {
          //       strVals += value + ","
          //     }
          //   }
          // }
          reportParams.push({ name: fieldName, value: [strVals] })
          // console.log("TR LIST", strVals)
        }
        else {
          reportParams.push({ name: fieldName, value: [fieldValue[fieldName]] })
        }
      }
    }
    let obj = {
      "reportUnitUri": "/reports/interactive/" + reportName,
      "async": true,
      "interactive": true,
      "freshData": false,
      "saveDataSnapshot": false,
      "outputFormat": format, // html xlsx pdf docx
      "parameters": {
        "reportParameter": reportParams
      }
    }
    // let xml = OBJtoXML(obj)
    return obj
  }
  // function getFieldValuesCreateReportXML() {
  //   let reportVars = []
  //   for (let s = 0; s < Form.sections.length; s++) {
  //     for (let c = 0; c < Form.sections[s].contents.length; c++) {
  //       let fieldName = Form.sections[s].contents[c].name
  //       let type = Form.sections[s].contents[c].type
  //       if (type === "DateTime") {
  //         reportVars.push({ reportParameter: fieldName, value: { value: moment(fieldValue[fieldName]).format("DD.MM.YYYY") } })
  //       }
  //       else if (type === "FullDateTime") {
  //         reportVars.push({ reportParameter: fieldName, value: { value: moment(fieldValue[fieldName]).format("DD.MM.YYYYTHH:mm:ss") } })
  //       }
  //       else if (type === "JasperDate") {
  //         reportVars.push({ reportParameter: fieldName, value: { value: moment(fieldValue[fieldName]).format("YYYY-MM-DD") } })
  //       }
  //       else if (type === "TransferList") {
  //         // console.log("TTTTTT", selectedTransferList[fieldName])
  //         let strVals = ""
  //         if (selectedTransferList[fieldName].length > 0) {
  //           for (let i = 0; i < selectedTransferList[fieldName].length; i++) {
  //             let value = selectedTransferList[fieldName][i]
  //             if (i === selectedTransferList[fieldName].length - 1) {
  //               strVals += value
  //             }
  //             else {
  //               strVals += value + ","
  //             }
  //           }
  //         }
  //         reportVars.push({ reportParameter: fieldName, value: { value: strVals } })
  //         // console.log("TR LIST", strVals)
  //       }
  //       else {
  //         reportVars.push({ reportParameter: fieldName, value: { value: fieldValue[fieldName] } })
  //       }
  //     }
  //   }
  //   let obj = {
  //     "reportExecutionRequest": {
  //       "reportUnitUri": "/reports/interactive/" + reportName,
  //       "async": "true",
  //       "freshData": "false",
  //       "saveDataSnapshot": "false",
  //       "outputFormat": "pdf",
  //       "interactive": "true",
  //       "parameters": { "reportParameter": reportVars }
  //     }
  //   }
  //   let xml = OBJtoXML(obj)
  //   return xml
  // }
  function OBJtoXML(obj) {
    var xml = '';
    for (var prop in obj) {
      xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
      if (obj[prop] instanceof Array) {
        // for (var array in obj[prop]) {
        for (let array = 0; array < obj[prop].length; array++) {
          xml += "<" + prop + " name=\"" + obj[prop][array].reportParameter + "\">";
          xml += OBJtoXML(new Object(obj[prop][array].value));
          xml += "</" + prop + ">";
        }
      } else if (typeof obj[prop] == "object") {
        xml += OBJtoXML(new Object(obj[prop]));
      } else {
        xml += obj[prop];
      }
      xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
    }
    var xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml
  }
  function checkForRequieredFields() {
    // console.log("MOPTS", multiSelectedOptions)
    let checkedSuccessfuly = null
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let fieldName = Form.sections[s].contents[c].name
        if (Form.sections[s].contents[c].required === true) {
          // if(Form.sections[s].contents[c].type === "MultiSelect"){
          //   if(multiSelectedOptions[fieldName] === undefined || multiSelectedOptions[fieldName] === null ||
          //     multiSelectedOptions[fieldName].length === 0){
          //     checkedSuccessfuly = false
          //     swAllert("Внимание заполните поле \"" +  Form.sections[s].contents[c].label + "\"", "warning")
          //     return checkedSuccessfuly
          //   }
          //   else{
          //     checkedSuccessfuly = true
          //   }
          // }
          if (Form.sections[s].contents[c].type === "TransferList") {
            // Don't check
            checkedSuccessfuly = true
            
            // if (selectedTransferList[fieldName] === undefined || selectedTransferList[fieldName] === null ||
            //   selectedTransferList[fieldName].length === 0) {
            //   checkedSuccessfuly = false
            //   props.callErrorToast("Внимание заполните поле \"" + Form.sections[s].contents[c].label + "\"")
            //   return checkedSuccessfuly
            // }
            // else {
            //   checkedSuccessfuly = true
            // }
          }
          else {
            if (fieldValue[fieldName] === undefined || fieldValue[fieldName] === null ||
              fieldValue[fieldName] === "NaN.NaN.NaN" || fieldValue[fieldName] === "") {
              checkedSuccessfuly = false
              // swAllert("Внимание заполните поле \"" + Form.sections[s].contents[c].label + "\"", "warning")
              props.callErrorToast("Внимание заполните поле \"" + Form.sections[s].contents[c].label + "\"")
              return checkedSuccessfuly
            }
            else {
              checkedSuccessfuly = true
            }
          }
        }
        else {
          checkedSuccessfuly = true
        }
      }
    }
    return checkedSuccessfuly
  }

  async function repserverlogin() {
    await fetch(
      `/jasperserver/rest_v2/login?j_username=jasperadmin&j_password=jasperadmin`,
      {
        mode: 'no-cors',
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'text/html; charset=utf-8'
        }
      }
    )
      .then(response => {
        // response.text().then(string => {
        console.log("JASPERT AUTH", response)
        // })
      })
      .catch(error => console.error(error));
  }
  async function downloadReport(outputFormat, fileType) {
    let b64 = await getReportB64(outputFormat, fileType)
    let fileName = reportName + "." + outputFormat
    // console.log("B64", b64)
    let convFile = convertBase64ToFile(b64, fileName)
    var url = window.URL.createObjectURL(convFile)
    var a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
    a.click()
    a.remove()
  }
  async function getReportB64(outputFormat, fileType) {
    let body = reportVars
    body.outputFormat = outputFormat
    console.log("BB", JSON.stringify(body))
    let resp = await fetch(
      props.api + "/Reports/Retranslator?headerValue=amFzcGVyYWRtaW46amFzcGVyYWRtaW4=",
      {
        // "mode": 'no-cors',
        "headers": { "content-Type": "application/json" },
        "method": 'POST',
        "body": JSON.stringify(body)
      }
    )
      .then(response => response.text())
      .then(result => {
        let b64 = fileType + result.substring(1, result.length - 1)
        return b64
      })
      .catch(error => console.error(error))
    return resp
  }
  function convertBase64ToFile(b64, fileName) {
    var arr = b64.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    let convFile = new File([u8arr], fileName, { type: mime })
    return convFile
    // console.log("CONV FILE", convFile)
  }

  async function reportToPDFES(fullName, inn, expiredDate) {
    let b64 = await getReportB64("pdf", "data:application/pdf;base64,")
    let fileName = reportName + ".pdf"
    // console.log("B64", b64)
    let convFile = convertBase64ToFile(b64, fileName)
    let formData = new FormData()
    formData.append("formFile", convFile, reportName + ".pdf")
    let url = props.api + "/Template/AddWatermark?text=ФИО: " + fullName + " ПИН: " + inn + " " + expiredDate
    var requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    }

    await fetch(url, requestOptions)
      .then(response => response.blob())
      .then(bl => {
        console.log("RES", bl)
        var pdf = new Blob([bl], { type: "application/pdf" })
        var docUrl = window.URL.createObjectURL(pdf)
        var a = document.createElement('a')
        a.href = docUrl
        a.download = `${reportName}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
      .catch(error => console.log('error', error))


    // await repserverlogin()
    // await fetch("/jasperserver/rest_v2/reports/reports/interactive/" + reportName + ".pdf" + reportVars,
    //   {
    //     mode: 'no-cors',
    //     method: 'GET',
    //     withCredentials: true,
    //     credentials: 'include',
    //     headers: {
    //       'Content-Type': 'text/html; charset=utf-8',
    //       'Authorization': 'Basic amFzcGVyYWRtaW46amFzcGVyYWRtaW4='
    //     }
    //   }
    // )
    //   .then(response => response.blob())
    //   .then(blob => {
    //     // console.log("REPORT", blob);
    //     blob.name = reportName + ".pdf"
    //     let formData = new FormData()
    //     formData.append("formFile", blob, reportName + ".pdf")
    //     let url = props.api + "/Template/AddWatermark?text=ФИО: " + fullName + " ПИН: " + inn + " " + expiredDate
    //     var requestOptions = {
    //       method: 'POST',
    //       body: formData,
    //       redirect: 'follow'
    //     }

    //     fetch(url, requestOptions)
    //       .then(response => response.blob())
    //       .then(bl => {
    //         console.log("RES", bl)
    //         var pdf = new Blob([bl], { type: "application/pdf" })
    //         var docUrl = window.URL.createObjectURL(pdf)
    //         var a = document.createElement('a')
    //         a.href = docUrl
    //         a.download = `${reportName}.pdf`
    //         document.body.appendChild(a)
    //         a.click()
    //         a.remove()
    //       })
    //       .catch(error => console.log('error', error))
    //   })
    //   .catch(error => console.error(error));
  }

  try {
    return (
      <Grid>
        <a name="top" />
        <Grid container direction="row" justify="flex-start" spacing={1}>
          <Grid item xs={12}>
            <Paper>
              <Grid container direction="row" justify="center" alignItems="center">
                <TableHead>
                  <TableRow style={{ maxHeight: 25 }}>
                    <TableCell style={{ fontSize: 16, color: "black" }}>{Form.label}</TableCell>
                  </TableRow>
                </TableHead>
              </Grid>
              <Grid container direction="row" justify="center" alignItems="center">
                {Form.sections.map((section, index) => {
                  return sectionBuilder(section, index)
                })}
              </Grid>
              <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                {buttons.map((button, index) => (
                  <Button
                    variant="outlined"
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
                ))}
              </Grid>
            </Paper>
            <br></br>
            {/* {selectedDoc !== null &&
              <div>{getReport()}</div>
            } */}

            {selectedDoc !== null &&
              <Markup id="reportContainer" content={selectedDoc} />
            }
          </Grid>
        </Grid>
        <Modal
          open={showModalEnterPin}
          onClose={handleCloseModalEnterPin}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.modal}>
            <h3 id="simple-modal-title">Введите ПИН код Рутокена</h3>
            <FormControl variant="outlined" style={{ width: "100%" }} error={wrongPin}>
              <InputLabel htmlFor="outlined-adornment-password">PIN</InputLabel>
              <OutlinedInput
                type={showPin ? 'text' : 'password'}
                defaultValue={rutokenPin}
                onChange={handlePinChange}
                onKeyPress={onKeyPressModalEnterPin}
                autoFocus
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPin}
                      edge="end"
                    >
                      {showPin ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                labelWidth={25}
              />
            </FormControl>
            {wrongPin === true && <p color="red">Не верный PIN</p>}
            <Button
              variant="contained"
              onClick={() => buttonClick("SignReportSaveButton")}
              style={{
                margin: 3,
                height: 32,
                fontSize: 12,
                color: "white",
                backgroundColor: "#2862F4"
              }}
            >Ок
            </Button>
            <Button
              variant="contained"
              onClick={handleCloseModalEnterPin}
              style={{
                margin: 3,
                height: 32,
                fontSize: 12,
                color: "white",
                backgroundColor: "#E73639"
              }}
            >Отмена
            </Button>
          </div>
        </Modal>
      </Grid>
    )
  }
  catch (error) {
    console.log("ERROR", error)
    return <div>error</div>
  }
}