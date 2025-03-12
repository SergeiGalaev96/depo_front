// Import material and react components
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import MaterialSelect from '@material-ui/core/Select';
// import MaskedInput from 'react-text-mask';
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
// import Input from '@material-ui/core/Input';
import Snackbar from '@material-ui/core/Snackbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@mui/material/Menu';
// PIN components
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
// Icons
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import DescriptionIcon from '@material-ui/icons/Description';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ReplayIcon from '@material-ui/icons/Replay';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
// Accordion
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// Import libraries
import swal from 'sweetalert'; // https://sweetalert.js.org/guides/
import hotkeys from 'hotkeys-js';
import * as rutoken from "rutoken";
import tableToExcel from "@linways/table-to-excel"; // https://github.com/linways/table-to-excel
var moment = require('moment');
var plugin;
var rutokenHandle, certHandle, certData, cmsData;

function FloatFormat(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      decimalSeparator={"."}
      thousandSeparator={" "}
      isNumericString
    />
  );
}
FloatFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}
function IntegerFormat(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator={" "}
      isNumericString
    />
  );
}
IntegerFormat.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

function getModalStyle() {
  const top = 35;
  const left = 45;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #AFAFAF',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}))
export default (props) => {
  // This.state
  const classes = useStyles()
  const [userProfile] = useState(props.userProfile)
  const [process_id] = useState(props.userTask.process_id)
  const [session_id] = useState(props.userTask.session_id)
  const [taskID] = useState(props.userTask.taskID)
  const [taskType] = useState(props.userTask.taskType)
  const [enumData] = useState(props.userTask.enumData)
  const [gridFormEnumData] = useState(props.userTask.gridFormEnumData)
  const [enumOptions, setEnumOptions] = useState({})
  const [Form] = useState(props.userTask.Form)
  const [gridForm, setGridForm] = useState(props.userTask.gridForm)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [fieldValue, setFieldValue] = useState({})
  const [docId] = useState(props.userTask.docId)
  const [buttons] = useState(props.userTask.buttons)
  const [gridFormButtons] = useState(props.userTask.gridFormButtons)
  const [formType] = useState(props.userTask.formType)
  const [docList, setDocList] = useState(null)
  const [filteredDocList, setFilteredDocList] = useState(null)
  const [initialDocList, setInitialDocList] = useState(null)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [selectedOptions, setSelectedOptions] = useState([])
  const [sectionColor] = useState("#B2E0C9")
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState(false)
  const [selectedInstructions, setSelectedInstructions] = useState({})
  const [signedInstructions, setSignedInstructions] = useState({})
  const [allInstructionsChecked, setAllInstructionsChecked] = useState(false)
  const [showModalCancelInstr, setShowModalCancelInstr] = useState(false)
  const [showModalEnterPin, setShowModalEnterPin] = useState(false)
  const [rutokenPin, setRutokenPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [wrongPin, setWrongPin] = useState(false)
  const [isSearchForm, setIsSearchForm] = useState(null)
  const [accordionExpanded, setAccordionExpanded] = useState(false)
  const [updateState, setUpdateState] = useState(false)
  const [sortedColumn, setSortedColumn] = useState("null")
  const [sortedColumnOrder, setSortedColumnOrder] = useState(1)
  const [modalStyle] = useState(getModalStyle)

  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)
  const [gridTableId] = useState(getUUID())
  const [gridFieldValue, setGridFieldValue] = useState({})
  const [hasRutoken] = useState(false)

  // Initializing
  useEffect(() => {
    console.log("REG_INST PROPS", props.userTask)
    if (props.userTask.docList !== "null" && props.userTask.docList !== null && props.userTask.docList !== undefined) {
      try {
        let s = parseInt(props.userTask.size)
        let p = parseInt(props.userTask.page)
        setSize(s)
        setPage(p)
        let parsedData = JSON.parse(props.userTask.docList)
        console.log("DOCL", parsedData)
        let sigInstructions = {}
        let selInstructions = {}
        for (let i = 0; i < parsedData.length; i++) {
          sigInstructions[parsedData[i].id] = parsedData[i].signed
          selInstructions[parsedData[i].id] = false
        }
        setSignedInstructions(sigInstructions)
        setSelectedInstructions(selInstructions)
        setFilteredDocList(parsedData)
        setInitialDocList(parsedData)
        setIsSearchForm(true)
        let sortedDocList = parsedData.sort(dynamicSort("id", 1, "Int"))
        if (props.userTask.selectedDoc !== "null") {
          filterDocList(0, s - 1, parsedData, JSON.parse(props.userTask.selectedDoc))
        }
        else { fetchBySize(0, s - 1, sortedDocList) }
        // console.log("DOCLIST", parsedData)
      }
      catch (er) {
        props.callErrorToast("Ошибка сбора списка данных " + props.userTask.taskType)
        setFilteredDocList([])
        setIsSearchForm(true)
        setInitialDocList([])
        setDocList([])
      }
    }
    else { setIsSearchForm(false) }
    if (props.userTask.selectedDoc !== "null" && props.userTask.selectedDoc !== undefined && props.userTask.selectedDoc !== null) {
      let parsedSelectedDoc = JSON.parse(props.userTask.selectedDoc)
      let fields = { "signed": false }
      for (let s = 0; s < Form.sections.length; s++) {
        for (let c = 0; c < Form.sections[s].contents.length; c++) {
          let fieldName = Form.sections[s].contents[c].name
          fields[fieldName] = parsedSelectedDoc[fieldName]
        }
      }
      console.log("SDOC", parsedSelectedDoc)
      console.log("INITIAL FIELDVALUES", fields)
      setSelectedDoc(parsedSelectedDoc)
      setFieldValue(fields)
    }
    if (props.userTask.enumData !== null && props.userTask.enumData !== undefined && props.userTask.enumData !== "null") {
      let newEnumOptions = {}
      for (let i = 0; i < props.userTask.enumData.length; i++) {
        if (props.userTask.enumData[i] !== null) {
          let options = [{
            "value": "",
            "label": "Пусто",
            "name": props.userTask.enumData[i].name
          }]
          for (let d = 0; d < props.userTask.enumData[i].data.length; d++) {
            options.push({
              "value": props.userTask.enumData[i].data[d].id,
              "label": props.userTask.enumData[i].data[d].label,
              "name": props.userTask.enumData[i].name
            })
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
    }
    if (gridForm !== null) {
      let newFields = {}
      for (let s = 0; s < gridForm.sections.length; s++) {
        for (let c = 0; c < gridForm.sections[s].contents.length; c++) {
          newFields[gridForm.sections[s].contents[c].name] = gridForm.sections[s].contents[c].show
        }
      }
      setGridFieldValue(newFields)
    }
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
  hotkeys('ctrl+b, enter', function (event, handler) {
    if (handler.key === "ctrl+b") {
      setAccordionExpanded(!accordionExpanded)
    }
  })

  const handleOpenModalCancelInstr = () => {
    setShowModalCancelInstr(true)
  }
  const handleCloseModalCancelInstr = () => {
    setShowModalCancelInstr(false)
  }
  const handleOpenModalEnterPin = () => {
    setShowModalEnterPin(true)
  }
  const handleCloseModalEnterPin = () => {
    setShowModalEnterPin(false)
  }
  function handleExpandAccordion() {
    setAccordionExpanded(!accordionExpanded)
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
        // alert("Не удаётся найти расширение 'Адаптер Рутокен Плагина'");
      }
    })
    // Загрузка плагина
    .then(function (result) {
      if (result) {
        return rutoken.loadPlugin()
      } else {
        // alert("Не удаётся найти Плагин");
      }
    })
    //Можно начинать работать с плагином
    .then(function (result) {
      if (!result) {
        return  // alert("Не удаётся загрузить Плагин")
      } else {
        plugin = result
        return Promise.resolve()
      }
    })
  // Sign instruction with rutoken
  function sign(commandJson) {
    try {
      if (plugin !== undefined) {
        // Перебор подключенных Рутокенов
        plugin.enumerateDevices()
          .then(function (devices) {
            if (devices.length > 0) {
              return Promise.resolve(devices[0]);
            } else {
              alert("Рутокен не обнаружен");
            }
          })
          // Проверка залогиненности
          .then(function (firstDevice) {
            rutokenHandle = firstDevice;
            return plugin.getDeviceInfo(rutokenHandle, plugin.TOKEN_INFO_IS_LOGGED_IN);
          })
          // Логин на первый токен в списке устройств PIN-кодом по умолчанию
          .then(function (isLoggedIn) {
            if (isLoggedIn) {
              return Promise.resolve();
            } else {
              return plugin.login(rutokenHandle, rutokenPin); // 240699
            }
          })
          // Перебор пользовательских сертификатов на токене
          .then(function () {
            return plugin.enumerateCertificates(rutokenHandle, plugin.CERT_CATEGORY_UNSPEC);
          })
          .then(function (certs) {
            if (certs.length > 0) {
              certHandle = certs[0];
              return plugin.parseCertificate(rutokenHandle, certs[0]);
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
                let bodyToSign = {
                  instructionList: commandJson.documentsToSign,
                  inn: inn,
                  signed_user_full_name: fullName
                }
                commandJson.variables.bodyToSign.value = JSON.stringify(bodyToSign)
                console.log("SIGN", commandJson)
                handleCloseModalEnterPin()
                props.sendFieldValues(commandJson)
                props.clearTabData(commandJson.process_id)
                return plugin.sign(rutokenHandle, certHandle, "textToSign", plugin.DATA_FORMAT_PLAIN, options);
              }
              else {
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
    catch (er) {
      console.log("Rutoken ERR", er)
    }
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
  // Input handlers
  const handleCheckboxChange = (event) => {
    setFieldValue({ ...fieldValue, [event.target.name]: event.target.checked })
    // console.log("Check change", event.target.checked)
  }
  const handleSelectInstructionChange = (event) => {
    // console.log("Check INSTR change", event.target)
    setSelectedInstructions({ ...selectedInstructions, [event.target.id]: event.target.checked })
  }
  const checkAllInstructions = (event) => {
    setAllInstructionsChecked(event.target.checked)
    for (let i = 0; i < filteredDocList.length; i++) {
      if (filteredDocList[i].signed !== true && filteredDocList[i].canceled !== true && filteredDocList[i].executed !== true && filteredDocList[i].filled === true) {
        selectedInstructions[filteredDocList[i].id] = event.target.checked
      }
    }
    setSelectedInstructions(selectedInstructions)
    // console.log("Check change", event.target.checked)
  }
  // Radio group handler
  const handleRadioGroupChange = (event) => {
    setFieldValue({ ...fieldValue, [event.target.name]: event.target.value })
  }
  function checkForDisabled(dataItem) {
    if (dataItem.filled === true & (dataItem.signed === true || dataItem.canceled === true || dataItem.executed === true)) {
      // console.log("DIS", dataItem.id)
      return true
    }
    else return false
  }
  function handleChange(event) {
    // console.log("EVENT", event.target.name, event.target.value)
    fieldValue[event.target.name] = event.target.value
    setFieldValue(fieldValue)
    console.log("FIELDVALUE", fieldValue)
  }
  function handlePinChange(event) {
    // console.log("EVENT", event.target.name, event.target.value)
    setRutokenPin(event.target.value)
    // console.log("PIN", event.target.value)
  }
  function handleClickShowPin() {
    setShowPin(!showPin)
  }
  // Integer input handler
  const handleIntChange = (event) => {
    // console.log("EVENT", event.target.name, event.target.value)
    let stringNum = event.target.value.toString().replace(/ /g, '')
    let int = parseInt(stringNum)
    setFieldValue({ ...fieldValue, [event.target.name]: int })
  }
  // Float input handler
  const handleFloatChange = (event) => {
    // console.log("FLOAT CHANGE", event.target.name, event.target.value)
    setFieldValue({ ...fieldValue, [event.target.name]: event.target.value })
  }
  // const handleIntChange = (event) => {
  //   console.log("EVENT", event.target.name, event.target.value)
  //   let stringNum = event.target.value.toString().replace(/ /g, '')
  //   let int = parseInt(stringNum)
  //   setFieldValue({ ...fieldValue, [event.target.name]: int })
  //   // setUpdateState(getUUID())
  // }
  // // Float input handler
  // const handleFloatChange = (event) => {
  //   let stringNum = event.target.value.toString().replace(/ /g, '');
  //   let float = parseFloat(stringNum)
  //   setFieldValue({ ...fieldValue, [event.target.name]: float })
  //   console.log("FLOAT CHANGE", event.target.name, fieldValue)
  // }
  function handleDateTimeChange(event) {
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
    // console.log("DATE CHANGE", event.target.value)
  }
  // Handler of select copmponet changes
  function handleSelectChange(option) {
    fieldValue[option.name] = option.value
    console.log("OPT", option.name, option.value)
    let updateSelectedOptions = selectedOptions.slice()
    let noSuchOption = true
    for (let i = 0; i < updateSelectedOptions.length; i++) {
      if (option.name === updateSelectedOptions[i].name) {
        updateSelectedOptions[i] = option
        setSelectedOptions(updateSelectedOptions)

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

  // Returns random id
  function getUUID() {
    const uuidv1 = require("uuid/v1")
    return uuidv1()
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
  // Main button click handler
  function buttonClick(buttonName, dataItem) {
    // console.log("Button", buttonName)
    if (buttonName === "findDocument") {
      if (accordionExpanded === false) {
        setAccordionExpanded(true)
      }
      else {
        filterDocList(0, size - 1, initialDocList, fieldValue)
      }
    }
    else if (buttonName === "signInstruction") {
      if (props.operDayIsOpened === false) {
        swal({
          text: "Операционный день закрыт дождитесь открытия операционного дня!",
          icon: "warning",
          buttons: { ok: "Ок" }
        })
      }
      else {
        if (props.esInn === null) {
          handleOpenModalEnterPin()
        }
        else {
          let documentsToSign = []
          if (taskType === "showInstructionsRegistrarsSearchForm") {
            for (let i = 0; i < docList.length; i++) {
              if (selectedInstructions[docList[i].id] === true) {
                documentsToSign.push(docList[i])
              }
            }
          }
          else if (taskType === "showInstructionsRegistrarsViewForm") {
            documentsToSign.push(selectedDoc)
          }
          let bodyToSign = {
            instructionList: documentsToSign,
            inn: props.esInn,
            signed_user_full_name: props.esUserFullName
          }
          let commandJson =
          {
            commandType: "completeTask",
            session_id: session_id,
            process_id: process_id,
            taskID: taskID,
            variables: {
              userAction: { value: "signInstruction" },
              userId: { value: userProfile.userId },
              userRole: { value: userProfile.userRole },
              bodyToSign: { value: JSON.stringify(bodyToSign) }
            }
          }
          console.log("button signInstruction: ", commandJson)
          props.sendFieldValues(commandJson)
          props.clearTabData(process_id)
        }
      }
    }
    else if (buttonName === "SignInstructionSaveButton") {
      let documentsToSign = []

      if (taskType === "showInstructionsRegistrarsSearchForm") {
        for (let i = 0; i < docList.length; i++) {
          if (selectedInstructions[docList[i].id] === true) {
            documentsToSign.push(docList[i])
          }
        }
      }
      else if (taskType === "showInstructionsRegistrarsViewForm") {
        documentsToSign.push(selectedDoc)
      }
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        documentsToSign: documentsToSign,
        variables: {
          userAction: { value: "signInstruction" },
          userId: { value: userProfile.userId },
          userRole: { value: userProfile.userRole },
          bodyToSign: { value: {} }
        }
      }
      console.log("button signInstruction: ", commandJson)
      sign(commandJson)
    }
    else if (buttonName === "CancelInstruction") {
      if (props.operDayIsOpened === false) {
        swal({
          text: "Операционный день закрыт дождитесь открытия операционного дня!",
          icon: "warning",
          buttons: { ok: "Ок" }
        })
      }
      else {
        handleOpenModalCancelInstr()
      }
    }
    else if (buttonName === "CancelInstructionSaveButton") {
      handleCloseModalCancelInstr()
      // const updateDocument = {} // getFieldValuesUpdateInstruction()
      // updateDocument["canceled"] = true
      // updateDocument["сanceledUser"] = userProfile.firstName + " " + userProfile.lastName + " " + userProfile.middleName
      let documentsToCancel = []

      if (taskType === "showInstructionsRegistrarsSearchForm") {
        for (let i = 0; i < docList.length; i++) {
          if (selectedInstructions[docList[i].id] === true) {
            documentsToCancel.push({ id: docList[i].id })
          }
        }
      }
      else if (taskType === "showInstructionsRegistrarsViewForm") {
        documentsToCancel.push({ id: selectedDoc.id })
      }
      const commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        variables: {
          userAction: { value: "cancelInstruction" },
          userId: { value: userProfile.userId },
          userRole: { value: userProfile.userRole },
          documentsToCancel: { value: JSON.stringify(documentsToCancel) },
          cancelationReason: { value: fieldValue.cancelationReason },
          // сanceledUser: { value: userProfile.firstName + " " + userProfile.lastName + " " + userProfile.middleName },
          status: { value: "canceled" }
        }
      }
      console.log("button CancelInstructionSaveButton: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "CancelInstructionCancelButton") {
      handleCloseModalCancelInstr()
      fieldValue["cancelationReason"] = null
      setFieldValue(fieldValue)
      console.log("FIELDS", fieldValue)
    }
    else if (buttonName === "downloadES") {
      swAlert("Внимание откройте скачанный файл и следуйте пошаговой иструкции!", "success")
    }
    else if (buttonName === "viewInstruction") {
      let signed = "true"
      if (dataItem.signed !== true && dataItem.canceled !== true) {
        signed = "false"
      }
      let editFormDefId = null
      let report = null
      for (let k = 0; k < enumData.length; k++) {
        if (enumData[k].name === "type") {
          for (let d = 0; d < enumData[k].data.length; d++) {
            if (dataItem.type === enumData[k].data[d].id) {
              editFormDefId = enumData[k].data[d].edit_form
              report = enumData[k].data[d].reportName
            }
          }
        }
      }
      const commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        variables: {
          userAction: { value: "viewInstruction" },
          userId: { value: userProfile.userId },
          docId: { value: dataItem.id },
          instructionType: { value: dataItem.type },
          signed: { value: signed },
          editFormDefId: { value: editFormDefId },
          reportName: { value: report },
          securities: { value: dataItem.currency === null ? "true" : "false" },
          searchDoc: { value: JSON.stringify(fieldValue) }
        }
      }
      console.log("button viewInstruction: ", commandJson, dataItem)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "showInstructionReport") {
      let reportName = null
      for (let k = 0; k < enumData.length; k++) {
        if (enumData[k].name === "type") {
          for (let d = 0; d < enumData[k].data.length; d++) {
            if (selectedDoc.type === enumData[k].data[d].id) {
              let reportId = enumData[k].data[d].instruction_registrar_report
              for (let e = 0; e < enumData.length; e++) {
                if (enumData[e].name === "instructionRegistrarReports") {
                  for (let t = 0; t < enumData[e].data.length; t++) {
                    if (reportId === enumData[e].data[t].id) {
                      reportName = enumData[e].data[t].reportName
                    }
                  }
                }
              }
            }
          }
        }
      }
      // let t = selectedDoc.type
      // if (t === 4 || t === 6 || t === 7 || t === 38) {
      //   reportName = "Svodnoe_peredatochnoe_rasporyajenie_na_zachislenie"
      // }
      // else {
      //   reportName = "Svodnoe_peredatochnoe_rasporyajenie_na_spisanie"
      // }
      // let reportExecutions = getFieldValuesReportExecutions("html", reportName)
      if (reportName === null) {
        props.callErrorToast("В типе поручения не указана форма отчета!")
      }
      else {
        let reportExecutions = {
          "reportUnitUri": "/reports/interactive/" + reportName,
          "async": true,
          "interactive": true,
          "freshData": false,
          "saveDataSnapshot": false,
          "outputFormat": "pdf", // html xlsx pdf docx
          "parameters": {
            "reportParameter": [{ name: "id", value: [selectedDoc.id.toString()] }]
          }
        }
        const commandJson =
        {
          commandType: "completeTask",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          variables: {
            userAction: { value: "showInstructionReport" },
            docId: { value: selectedDoc.id.toString() },
            reportName: { value: reportName },
            reportVars: { value: "?id=" + selectedDoc.id },
            reportExecutions: { value: JSON.stringify(reportExecutions) },
          }
        }
        console.log("button showInstructionReport: ", commandJson)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
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
    else {
      console.log("button: ", buttonName)
    }
  }
  // function getFieldValuesReportExecutions(format, reportName) {
  //   let reportParams = []
  //   for (let s = 0; s < Form.sections.length; s++) {
  //     for (let c = 0; c < Form.sections[s].contents.length; c++) {
  //       let fieldName = Form.sections[s].contents[c].name
  //       let type = Form.sections[s].contents[c].type
  //       if (type === "DateTime") {
  //         reportParams.push({ name: fieldName, value: [moment(fieldValue[fieldName]).format("DD.MM.YYYY")] })
  //       }
  //       else if (type === "FullDateTime") {
  //         reportParams.push({ name: fieldName, value: [moment(fieldValue[fieldName]).format("DD.MM.YYYYTHH:mm:ss")] })
  //       }
  //       else if (type === "JasperDate") {
  //         reportParams.push({ name: fieldName, value: [moment(fieldValue[fieldName]).format("YYYY-MM-DD")] })
  //       }
  //       else {
  //         reportParams.push({ name: fieldName, value: [fieldValue[fieldName]] })
  //       }
  //     }
  //   }
  //   let obj = {
  //     "reportUnitUri": "/reports/interactive/" + reportName,
  //     "async": true,
  //     "interactive": true,
  //     "freshData": false,
  //     "saveDataSnapshot": false,
  //     "outputFormat": format, // html xlsx pdf docx
  //     "parameters": {
  //       "reportParameter": reportParams
  //     }
  //   }
  //   // let xml = OBJtoXML(obj)
  //   return obj
  // }
  // // Returns Button component
  // function createButton(button, index) {
  //   return (
  //     <Button variant="outlined"
  //       // id = {()=> getUUID()}
  //       name={button.name}
  //       key={index}
  //       onClick={() => buttonClick(button.name)}
  //       style={{
  //         margin: 3,
  //         color: button.fontColor,
  //         backgroundColor: button.backgroundColor,
  //         height: 32,
  //         fontSize: 12
  //       }}
  //       value={button.name}
  //     >
  //       {button.label}
  //     </Button>
  //   )
  // }
  // Create sections with labels and call bodyBuilder function
  function sectionBuilder(section, index) {
    return (
      <Table size="small" key={index + "table"}>
        <TableHead>
          <TableRow style={{ height: 30 }}>
            <TableCell
              key={index = "head"}
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
            <TableRow key={index} style={{ height: 30 }}>
              <TableCell
                key={index + "cell1"}
                align="left"
                style={{ width: "40%" }}>
                {contentItem.label}
              </TableCell>
              <TableCell
                key={index + "cell2"}
                align="left"
                style={{ width: "60%", height: 30 }}
              >{contentBuilder(contentItem)}
              </TableCell>
            </TableRow>
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
          onKeyPress={onKeyPressText}
          multiline={!isSearchForm}
          onBlur={handleChange}
          name={contentItem.name}
          style={{ width: "100%" }}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          defaultValue={(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name] : ""}
        />
      )
    }
    else if (contentItem.type === "DateTime") {
      return (
        <TextField
          onKeyPress={onKeyPressDateTime}
          type="date"
          name={contentItem.name}
          style={{ width: "100%" }}
          defaultValue={(fieldValue[contentItem.name] !== undefined && fieldValue[contentItem.name] !== null) ? props.parseDate(fieldValue[contentItem.name]) : ""}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          InputLabelProps={{
            shrink: true,
          }}
        />
      )
    }
    else if (contentItem.type === "FullDateTime") {
      return (
        <TextField
          name={contentItem.name}
          onBlur={handleDateTimeChange}
          style={{ width: "100%" }}
          value={(fieldValue[contentItem.name] !== undefined && fieldValue[contentItem.name] !== null) ? props.parseFullDateTime(fieldValue[contentItem.name], "T") : ""}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          InputLabelProps={{
            shrink: true
          }}
        />
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
    else if (contentItem.type === "Int") {
      return (
        <TextField
          onKeyPress={onKeyPressInt}
          name={contentItem.name}
          // onBlur={handleIntChange}
          // value={(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name] : ""}
          value={(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name] : ""}
          onChange={handleIntChange}
          style={{ width: "100%" }}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          InputProps={{ inputComponent: IntegerFormat }}
        />
      )
    }
    else if (contentItem.type === "Float") {
      return (
        <TextField
          onKeyPress={onKeyPressFloat}
          name={contentItem.name}
          // onBlur={handleFloatChange}
          // value={fieldValue[contentItem.name]}
          value={(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name] : ""}
          onChange={handleFloatChange}
          style={{ width: "100%" }}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          InputProps={{ inputComponent: FloatFormat }}
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
    else if (contentItem.type === "RadioGroup") {
      let radioGroupItems = []
      for (let i = 0; i < enumData.length; i++) {
        if (enumData[i].name === contentItem.name) {
          radioGroupItems = enumData[i].data
        }
      }
      return (
        <RadioGroup
          name={contentItem.name}
          value={fieldValue[contentItem.name]}
          onChange={handleRadioGroupChange}
        >
          {radioGroupItems.map(groupItem => {
            return (
              <FormControlLabel
                value={groupItem.id}
                label={groupItem.label}
                control={<Radio style={{ height: "5px", color: "green" }} />}
                disabled={(formType === "view" || contentItem.edit === false) ? true : false}
              />
            )
          })}

        </RadioGroup>
      )
    }
  }
  // Key press handlers for some fields
  function onKeyPressText(event) {
    let code = event.charCode
    if (code === 13) {
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].name === "findDocument") {
          // console.log("CODE", code)
          handleChange(event)
          buttonClick("findDocument", null)
        }
      }
    }
  }
  function onKeyPressDateTime(event) {
    let code = event.charCode
    if (code === 13) {
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].name === "findDocument") {
          // console.log("CODE", code)
          handleDateTimeChange(event)
          buttonClick("findDocument", null)
        }
      }
    }
  }
  function onKeyPressInt(event) {
    let code = event.charCode
    if (code === 13) {
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].name === "findDocument") {
          // console.log("CODE", code)
          let stringNum = event.target.value.toString().replace(/ /g, '')
          let int = parseInt(stringNum)
          fieldValue[event.target.name] = int
          setFieldValue(fieldValue)
          filterDocList(0, size - 1, initialDocList, fieldValue)
        }
      }
    }
  }
  function onKeyPressFloat(event) {
    let code = event.charCode
    if (code === 13) {
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].name === "findDocument") {
          let stringNum = event.target.value.toString().replace(/ /g, '')
          let float = parseFloat(stringNum)
          fieldValue[event.target.name] = float
          setFieldValue(fieldValue)
          filterDocList(0, size - 1, initialDocList, fieldValue)
        }
      }
    }
  }
  function onKeyPressModalCancelInstruction(event) {
    let code = event.charCode
    if (code === 13) {
      buttonClick("CancelInstructionSaveButton", null)
    }
  }
  function onKeyPressModalEnterPin(event) {
    handlePinChange(event)
    let code = event.charCode
    if (code === 13) {
      buttonClick("SignInstructionSaveButton", null)
    }
  }
  // custom allerts
  function swAlert(text, icon) {
    return (
      swal({
        text: text,
        icon: icon,
        buttons: { ok: "Ок" },
        // dangerMode: true,
      })
        .then((click) => {
          if (click === "ok") {
            console.log("CLICK OK", click)
          }
        })
    )
  }
  // Create grid form components
  function getGridFormItems(value, type, dataItem, name) {
    if (type === "Enum") {
      if (value === null || value === "" || value === undefined) {
        return "-"
      }
      else {
        // console.log("ENUM", name, value, type)
        for (let i = 0; i < gridFormEnumData.length; i++) {
          if (gridFormEnumData[i] !== null) {
            if (name === gridFormEnumData[i].name) {
              for (let l = 0; l < gridFormEnumData[i].data.length; l++) {
                if (gridFormEnumData[i].data[l].id === parseInt(value)) {
                  return gridFormEnumData[i].data[l].label
                }
              }
            }
          }
        }
      }
    }
    else if (type === "Bool") {
      // console.log("ITEM", name, value, type)
      return (
        <Checkbox
          style={{ maxWidth: 20, height: 15, color: value === false ? "red" : "green" }}
          // name = {name}
          checked={(value === false || value === null || value === undefined) ? false : true}
        />
      )
    }
    else if (type === "DateTime") {
      if (value === null || value === "" || value === undefined) {
        return "-"
      }
      else {
        // console.log("ITEM", dataItem, value)
        let Date = value.substring(0, 10)
        let Time = value.substring(11, 16)
        return Date + " " + Time
      }
    }
    else if (type === "Text") {
      // console.log("ITEM", name, value, type)
      if (name === "instructionStatus") {
        let status = ""
        if (dataItem["filled"] === true) {
          status = "Введено"
        }
        if (dataItem["onExecution"] === true) {
          status = "На исполнении"
        }
        if (dataItem["executed"] === true) {
          status = "Исполнено"
        }
        if (dataItem["canceled"] === true) {
          status = "Отменено"
        }
        return status
      }
      else {
        if (value === null || value === "" || value === undefined) {
          return "-"
        }
        else {
          return (value)
        }
      }
    }
    else if (type === "Float") {
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
    else {
      if (value === null || value === "" || value === undefined) {
        return "-"
      }
      else {
        return (value)
      }
    }

  }
  function handleCloseSnackBar() {
    setShowSnackBar(false)
  }
  function getContentType(key) {
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        if (key === Form.sections[s].contents[c].name) {
          return Form.sections[s].contents[c].type
        }
      }
    }
  }
  // filter docList by filled parameters
  function filterDocList(fetchFrom, fetchTo, Data, fields) {
    var newDocList = []
    if (Object.keys(fields).length === 0) {
      newDocList = Data
    }
    else {
      for (let i = 0; i < Data.length; i++) {
        let match = false
        for (let key in fields) {
          if (fields[key] === null || fields[key] === "" || fields[key] === undefined) {
            match = true
          }
          else {
            if (Data[i][key] !== null) {
              let contentType = getContentType(key)
              if (contentType === "Text") {
                try {
                  let searchField = fields[key].toLowerCase().trim()
                  let dataField = Data[i][key].toLowerCase()
                  let includeSearch = dataField.includes(searchField)
                  if (includeSearch === true) {
                    match = true
                  }
                  else {
                    match = false
                    break
                  }
                }
                catch (er) {
                  console.log("ERR", er)
                  match = true
                }
              }
              else if (contentType === "Int" || contentType === "Float") {
                if (fields[key] >= 0 || fields[key] < 0) {
                  let searchField = fields[key].toString()
                  let dataField = Data[i][key].toString()
                  let includeSearch = dataField.includes(searchField)
                  if (includeSearch === true) {
                    match = true
                  }
                  else {
                    match = false
                    break
                  }
                }
                else { match = true }
              }
              else if (contentType === "Enum") {

                if (fields[key] === Data[i][key]) {
                  match = true
                }
                else {
                  match = false
                  break
                }
              }
              else if (contentType === "DateTime") {
                let searchField = props.parseDate(fields[key])
                let dataField = props.parseDate(Data[i][key])
                // console.log("DATES", searchField, dataField, searchField.includes(dataField))
                if (searchField === "NaN-NaN-NaN" || searchField === "Invalid date") {
                  match = true
                }
                else {
                  if (searchField.includes(dataField) === true) {
                    match = true
                  }
                  else {
                    match = false
                    break
                  }
                }
              }
              else if (contentType === "Bool") {
                if (key === "filled" || key === "onExecution" || key === "executed" || key === "canceled") {
                  let instrStatus = ""
                  let statusSelected = false
                  let fieldStatus = ""
                  // Check fields
                  if (fields["filled"] === true) {
                    fieldStatus = "filled"
                    statusSelected = true
                  }
                  if (fields["onExecution"] === true) {
                    fieldStatus = "onExecution"
                    statusSelected = true
                  }
                  if (fields["executed"] === true) {
                    fieldStatus = "executed"
                    statusSelected = true
                  }
                  if (fields["canceled"] === true) {
                    fieldStatus = "canceled"
                    statusSelected = true
                  }
                  if (statusSelected === true) {
                    // Check Instruction
                    if (Data[i]["filled"] === true) {
                      instrStatus = "filled"
                    }
                    if (Data[i]["onExecution"] === true) {
                      instrStatus = "onExecution"
                    }
                    if (Data[i]["executed"] === true) {
                      instrStatus = "executed"
                    }
                    if (Data[i]["canceled"] === true) {
                      instrStatus = "canceled"
                    }
                    // Check whether statuses are equal
                    if (fieldStatus === instrStatus) {
                      match = true
                    }
                    else {
                      match = false
                      break
                    }
                  }
                  else {
                    match = true
                  }
                }
                else {
                  if (Data[i][key] === null || fields[key] === Data[i][key]) {
                    match = true
                  }
                  else {
                    match = false
                    break
                  }
                }
              }
            }
            else {
              match = false
              break
            }
          }
        }
        if (match === true) {
          newDocList.push(Data[i])
        }
      }
    }
    setFilteredDocList(newDocList)
    fetchBySize(fetchFrom, fetchTo, newDocList)
  }
  // get rows amount of filtered docList by size
  function fetchBySize(fetchFrom, fetchTo, Data) {
    let newDocList = []
    for (let i = fetchFrom; i <= fetchTo; i++) {
      if (Data[i] !== undefined) {
        newDocList.push(Data[i])
      }
    }
    setDocList(newDocList)
    // setUpdateState(getUUID())
  }
  // Pagination functions
  function KeyboardArrowFirstClick() {
    if (page !== 1) {
      setPage(1)
      fetchBySize(0, size - 1, filteredDocList)
    }
    else {
      setSnackBarMessage("Вы на первой странице!")
      setShowSnackBar(true)
    }
  }
  function KeyboardArrowLeftClick(page) {
    if (page !== 1) {
      var prevPage = page - 1
      setPage(prevPage)
      let fetchFrom = ((prevPage - 1) * size) //10
      let fetchTo = (size * prevPage) - 1
      fetchBySize(fetchFrom, fetchTo, filteredDocList)
    }
    else {
      setSnackBarMessage("Вы на первой странице!")
      setShowSnackBar(true)
    }
  }
  function KeyboardArrowLastClick() {
    if (page !== getPageAmount()) {
      setPage(getPageAmount())
      fetchBySize((getPageAmount() - 1) * size, filteredDocList.length, filteredDocList)
    }
    else {
      setSnackBarMessage("Вы на последней странице!")
      setShowSnackBar(true)
    }
  }
  function KeyboardArrowRightClick(page) {
    if (docList.length < size - 1) {
      // console.log("NO DATA")
      setSnackBarMessage("Больше нет данных!")
      setShowSnackBar(true)
    }
    else {
      setPage(page + 1)
      let fetchFrom = (size * page)
      let fetchTo = ((page + 1) * size) - 1
      fetchBySize(fetchFrom, fetchTo, filteredDocList)
    }

  }
  function handleChangeRowsPerPage(event) {
    setSize(event.target.value)
    setPage(1)
    fetchBySize(0, event.target.value - 1, filteredDocList)
  }
  function GoToPage() {
    let fetchFrom = (page * size - 1) - size
    let fetchTo = page * size - 1
    fetchBySize(fetchFrom, fetchTo, filteredDocList)
  }
  function handlePageChange(event) {
    setPage(event.target.value)
  }
  function handleCloseSnackBar() {
    setShowSnackBar(false)
  }
  function getPageAmount() {
    let pagesFloat = (filteredDocList.length) / size
    let mathRoundOfPages = Math.floor(pagesFloat)
    if (pagesFloat > mathRoundOfPages) {
      return mathRoundOfPages + 1
    }
    else {
      return mathRoundOfPages
    }
  }
  function getBackgroundColor(dataItem) {
    let color = "#FCEAD3"
    if (dataItem.urgent === true && dataItem.signed === false && dataItem.executed === false) {
      color = "#EFB2B2"
    }
    if (dataItem.filled === false) {
      color = "#EFEFEF"
    }
    if (dataItem.canceled === true) {
      color = "#FFDED5"
    }
    if (dataItem.signed === true || dataItem.executed === true) {
      color = "#F4FFEE"
    }
    return color
  }
  function checkToShowSection(section) {
    let showSection = false
    for (let i = 0; i < section.contents.length; i++) {
      if (section.contents[i].show === true) {
        showSection = true
        break
      }
    }
    return showSection
  }
  function checkSectionOnLastChild(i) {
    let lastSection = true
    if (i === gridForm.sections.length - 1) { // The last section
      return true
    }
    else {
      let nextS = i + 1
      // console.log("IT", i, gridForm.sections[nextS])
      for (let s = nextS; s < gridForm.sections.length; s++) {
        for (let c = 0; c < gridForm.sections[s].contents.length; c++) { // Check next section
          if (gridForm.sections[s].contents[c].show === true) {
            lastSection = false
            break
          }
        }
      }
    }
    return lastSection
  }
  function getForm() {
    return (
      <Grid container direction="row" justify="flex-start" spacing={1}>
        <Grid item xs={isSearchForm === true ? 12 : 8}>
          <Paper>
            {isSearchForm === false &&
              <Grid container direction="row" justify="center" alignItems="center">
                <TableHead>
                  <TableRow style={{ maxHeight: 25 }}>
                    <TableCell style={{ fontSize: 16, color: "black" }}>{Form.label}</TableCell>
                  </TableRow>
                </TableHead>
              </Grid>
            }
            <Grid container direction="row" justify="center" alignItems="center">
              {Form.sections.map((section, index) => {
                let showSection = checkToShowSection(section)
                if (showSection === true) {
                  return sectionBuilder(section, index)
                }
              })}
            </Grid>
            {/* <Grid container  direction="row" justify="flex-start" alignItems="flex-start">
              {buttons.map((button, index) => {
                return createButton(button, index)
              })}
              <Button
                component="a"
                href="../Инструкция Рутокен.docx"
                download
                variant="outlined" 
                style={{
                  margin: 3,
                  backgroundColor: "#13611B",
                  color: "white",
                  height: 32,
                  fontSize: 12
                }}
                onClick={()=> buttonClick("downloadES")}
                startIcon={<DescriptionIcon/>}
              >Инструкция ЭЦП
              </Button>
              <Button
                component="a"
                target="_blank" 
                rel="noopener noreferrer"
                href="https://www.rutoken.ru/support/download/rutoken-plugin/"
                download
                variant="outlined" 
                style={{
                  margin: 3,
                  backgroundColor: "#13611B",
                  color: "white",
                  height: 32,
                  fontSize: 12
                }}
              >Плагин
              </Button>
              <Button
                component="a"
                target="_blank" 
                rel="noopener noreferrer"
                href="https://www.rutoken.ru/support/download/windows/"
                download
                variant="outlined" 
                style={{
                  margin: 3,
                  backgroundColor: "#13611B",
                  color: "white",
                  height: 32,
                  fontSize: 12
                }}
              >Драйвер
              </Button>
            </Grid>  */}
          </Paper>
        </Grid>
      </Grid>
    )
  }
  function getEnumLabel(name, id) {
    for (let i = 0; i < gridFormEnumData.length; i++) {
      if (gridFormEnumData[i].name === name) {
        for (let d = 0; d < gridFormEnumData[i].data.length; d++) {
          if (gridFormEnumData[i].data[d].id === id) {
            return gridFormEnumData[i].data[d].label
          }
        }
      }
    }
  }
  function dynamicSort(property, sortOrder, type) {
    if (type === "DateTime" || type === "Bool") {
      sortOrder = sortOrder * -1
    }
    // console.log("SORT", property, sortOrder, type)
    if (type === "DateTime") {
      return function (a, b) {
        if (a[property] !== null && b[property] !== null) {
          let dateA = new Date(a[property].substring(0, 19))
          let timeInSecA = dateA.getTime() / 1000
          // console.log("timeInSecA", timeInSecA)
          let dateB = new Date(b[property].substring(0, 19))
          let timeInSecB = dateB.getTime() / 1000
          // console.log("timeInSecB", timeInSecB)
          var result = (timeInSecA < timeInSecB) ? -1 : (timeInSecA > timeInSecB) ? 1 : 0
          return result * sortOrder
        }
        else {
          if (a[property] === null) {
            return -1 * sortOrder
          }
          return 1 * sortOrder
        }
      }
    }
    else if (type === "Int" || type === "Text" || type === "Float" || type === "Bool") {
      return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
        return result * -1 * sortOrder
      }
    }
    else if (type === "Enum") {
      return function (a, b) {
        let labelA = getEnumLabel(property, a[property])
        // console.log("A", property, a[property], labelA)
        let labelB = getEnumLabel(property, b[property])
        // console.log("labelB", labelB, property, b)
        var result = (labelA < labelB) ? -1 : (labelA > labelB) ? 1 : 0
        return result * sortOrder
      }
    }
  }
  function sortDataByColumn(name, type) {
    let sortOrder = 1
    if (sortedColumn === name) {
      sortOrder = sortedColumnOrder * -1
    }
    setSortedColumnOrder(sortOrder)
    setSortedColumn(name)
    let sortedDocList = filteredDocList.sort(dynamicSort(name, sortOrder, type))
    // let fetchFrom = (page*size-1)-size
    // let fetchTo = page*size-1
    setPage(1)
    let fetchFrom = 0
    let fetchTo = size - 1
    setFilteredDocList(sortedDocList)
    fetchBySize(fetchFrom, fetchTo, sortedDocList)
  }
  function calculateColSpan(contents) {
    let num = 0
    for (let i = 0; i < contents.length; i++) {
      if (contents[i].show === true) {
        num += 1
      }
    }
    return num
  }
  const handleContextMenu = (event) => {
    if (userProfile.userRole === "1") {
      event.preventDefault()
      setAnchorEl(event.currentTarget)
    }
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
    // console.log("CLOSE", fieldValue)
    for (let s = 0; s < gridForm.sections.length; s++) {
      for (let c = 0; c < gridForm.sections[s].contents.length; c++) {
        gridForm.sections[s].contents[c].show = gridFieldValue[gridForm.sections[s].contents[c].name]
      }
    }
    console.log("nForm", gridForm)
    setGridForm(gridForm)
    setUpdateState(getUUID())
  }
  function createMenuItems() {
    let columns = []
    columns.push(
      <tr>
        <td
          style={{ paddingLeft: 5, cursor: "pointer" }}
          name={"selectAll"}
          onClick={() => handleTableCheckboxChange("selectAll")}
        >
          Выбрать все
        </td>
        <td>
          <Checkbox
            style={{ maxWidth: 20, height: 15, color: "green" }}
            name={"selectAll"}
            onChange={handleGridCheckboxChange}
            checked={(gridFieldValue["selectAll"] === false || gridFieldValue["selectAll"] === null || gridFieldValue["selectAll"] === undefined) ? false : true}
          />
        </td>
      </tr>
    )
    for (let s = 0; s < gridForm.sections.length; s++) {
      for (let c = 0; c < gridForm.sections[s].contents.length; c++) {
        let name = gridForm.sections[s].contents[c].name
        columns.push(
          <tr>
            <td
              style={{ paddingLeft: 5, cursor: "pointer", background: gridFieldValue[name] === true ? "#E2E2E2" : "white" }}
              name={name}
              onClick={() => handleTableCheckboxChange(name)}
            >
              {gridForm.sections[s].contents[c].label}
            </td>
            <td>
              <Checkbox
                style={{ maxWidth: 20, height: 15, color: "green" }}
                name={name}
                onChange={handleGridCheckboxChange}
                checked={(gridFieldValue[name] === false || gridFieldValue[name] === null || gridFieldValue[name] === undefined) ? false : true}
              />
            </td>
          </tr>
        )
      }
    }
    return columns
  }
  function downloadExcel() {
    tableToExcel.convert(document.getElementById(gridTableId))
  }
  const handleGridCheckboxChange = (event) => {
    // console.log("CHBX", event.target.name, event.target.checked)
    if (event.target.name === "selectAll") {
      let newFields = { [event.target.name]: event.target.checked }
      for (let key in gridFieldValue) {
        newFields[key] = !gridFieldValue[event.target.name]
      }
      // console.log("selectAll", newFields)
      setGridFieldValue(newFields)
    }
    else {
      setGridFieldValue({ ...gridFieldValue, [event.target.name]: event.target.checked })
    }
  }
  const handleTableCheckboxChange = (name) => {
    // console.log("TD CHBX", name)
    if (name === "selectAll") {
      let newFields = { ...gridFieldValue }
      for (let key in newFields) {
        newFields[key] = !gridFieldValue[name]
      }
      setGridFieldValue(newFields)
    }
    else {
      setGridFieldValue({ ...gridFieldValue, [name]: !gridFieldValue[name] })
    }
  }
  try {
    return (
      <Grid>
        {isSearchForm !== null && isSearchForm === true ?
          <Grid container direction="row" justify="flex-start" spacing={1}>
            <Grid item xs={9}>
              <Accordion expanded={accordionExpanded} onChange={() => handleExpandAccordion()}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography>{Form.label}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {getForm()}
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>
          :
          getForm()
        }
        <Grid container direction="row" justify="flex-start" spacing={0}>
          {buttons.map((button, index) => (
            <Button
              name={button.name}
              variant="outlined"
              onClick={() => buttonClick(button.name, null)}
              style={{
                margin: 3,
                color: button.fontColor,
                backgroundColor: button.backgroundColor,
                height: 32,
                fontSize: 12
              }}
            >{button.label}
            </Button>
          ))}
          <Button
            component="a"
            href="../Инструкция Рутокен.docx"
            download
            variant="outlined"
            style={{
              margin: 3,
              backgroundColor: "#13611B",
              color: "white",
              height: 32,
              fontSize: 12
            }}
            onClick={() => buttonClick("downloadES")}
            startIcon={<DescriptionIcon />}
          >Инструкция ЭЦП
          </Button>
          <Button
            component="a"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.rutoken.ru/support/download/rutoken-plugin/"
            download
            variant="outlined"
            style={{
              margin: 3,
              backgroundColor: "#13611B",
              color: "white",
              height: 32,
              fontSize: 12
            }}
          >Плагин
          </Button>
          <Button
            component="a"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.rutoken.ru/support/download/windows/"
            download
            variant="outlined"
            style={{
              margin: 3,
              backgroundColor: "#13611B",
              color: "white",
              height: 32,
              fontSize: 12
            }}
          >Драйвер
          </Button>
        </Grid>
        {isSearchForm === true &&
          <ReplayIcon style={{ paddingTop: 3, cursor: "pointer" }} onClick={() => buttonClick("updateDocList")} />
        }
        {docList !== null &&
          <Grid container direction="row" justify="flex-start" alignItems="flex-start">
            <Grid item sm={"auto"}>
              <Paper>
                <div style={{ height: "500px", overflow: "auto" }}>
                  <table
                    size="small"
                    class="main-table-style"
                    id={gridTableId}
                  >
                    <thead class="thead-style" style={{ position: "sticky", top: 0 }}>
                      {/* 1st Row Sections Labels */}
                      <tr>
                        <td class="td-head-first-child" onContextMenu={(ev) => handleContextMenu(ev)}>Выбрать</td>
                        {gridForm.sections.map((section, index) => {
                          let showSection = checkToShowSection(section)
                          if (showSection === true) {
                            let lastSection = checkSectionOnLastChild(index)
                            return (
                              <td
                                colSpan={calculateColSpan(section.contents)}
                                class={lastSection === true ? "td-head-last-child" : "td-head-style"}
                                onContextMenu={(ev) => handleContextMenu(ev)}
                              >
                                {section.label}
                              </td>
                            )
                          }
                        })}
                      </tr>
                      {/* 2nd Row Sections Contents labels */}
                      <tr>
                        <td
                          class="td-head-style-2row"
                          rowSpan="2"
                          style={{ minWidth: 90 }}
                          onContextMenu={(ev) => handleContextMenu(ev)}
                        >
                          <Checkbox
                            style={{ maxWidth: 20, height: 15, color: "white" }}
                            onChange={checkAllInstructions}
                            checked={allInstructionsChecked === true ? true : false}
                          />
                        </td>
                        {gridForm.sections.map(section =>
                          section.contents.map(contentItem => {
                            if (contentItem.show === true) {
                              return (
                                <td
                                  class="td-head-style-2row"
                                  rowSpan="2"
                                  onClick={() => sortDataByColumn(contentItem.name, contentItem.type)}
                                  onContextMenu={(ev) => handleContextMenu(ev)}
                                >
                                  {contentItem.label}{sortedColumn === contentItem.name ? sortedColumnOrder === 1 ? <ArrowDropDownIcon style={{ marginBottom: -8 }} /> : <ArrowDropUpIcon style={{ marginBottom: -8 }} /> : ""}
                                </td>
                              )
                            }
                          })
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {docList !== null &&
                        docList.map(dataItem => (
                          <tr style={{ height: 30, backgroundColor: getBackgroundColor(dataItem) }}>
                            <td style={{ "text-align": "center", "border-bottom": "1px solid grey" }}>
                              <Button
                                variant="outlined"
                                onClick={() => buttonClick("viewInstruction", dataItem)}
                                style={{
                                  margin: 1,
                                  height: 24,
                                  fontSize: 10,
                                  maxWidth: 32,
                                  backgroundColor: "#E8FEE6",
                                  borderColor: "darkgreen",
                                  color: "darkgreen"
                                }}
                              >
                                Открыть
                              </Button>
                              <Checkbox
                                style={{ maxWidth: 20, height: 15, color: checkForDisabled(dataItem) === true ? "grey" : "green" }}
                                id={dataItem.id}
                                onChange={handleSelectInstructionChange}
                                disabled={checkForDisabled(dataItem)}
                                checked={selectedInstructions[dataItem.id] === true ? true : false}
                              />
                            </td>
                            {gridForm.sections.map(section => (
                              section.contents.map(contentItem => {
                                if (contentItem.show === true) {
                                  return (
                                    <td style={{ color: "black", fontSize: 12, "text-align": "center", "border-bottom": "1px solid grey" }}>
                                      {getGridFormItems(dataItem[contentItem.name], contentItem.type, dataItem, contentItem.name)}
                                    </td>
                                  )
                                }
                              })
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Paper>
              {/*Pagination*/}
              <Grid container direction="row" justify="flex-start">
                <Grid item sm={12}>
                  <Paper>
                    <table>
                      <tfoot>
                        <tr>
                          <td style={{ paddingLeft: "3px" }}>
                            <Button
                              variant="outlined"
                              style={{ background: "#047535", color: "white", height: 28 }}
                              onClick={() => downloadExcel()}
                            >В EXCEL
                            </Button>
                          </td>
                          <td>
                            <Button
                              variant="contained"
                              onClick={() => buttonClick("signInstruction", null)}
                              style={{
                                margin: 3,
                                backgroundColor: "#13611B",
                                color: "white",
                                height: 32,
                                fontSize: 12
                              }}
                            >
                              Подписать
                            </Button>
                            <Button
                              variant="contained"
                              onClick={() => buttonClick("CancelInstruction", null)}
                              style={{
                                margin: 3,
                                backgroundColor: "#B41111",
                                color: "white",
                                height: 32,
                                fontSize: 12
                              }}
                            >
                              Отклонить
                            </Button>
                          </td>
                          <td style={{ paddingLeft: "20px" }}>
                            <div style={{ minWidth: 90, color: "black" }}>Кол-во записей</div>
                          </td>
                          <td>
                            <FormControl
                              variant="outlined"
                              style={{ minWidth: 30 }}
                            >
                              <MaterialSelect
                                onChange={handleChangeRowsPerPage}
                                style={{ height: 25, color: "black" }}
                                value={size}
                              >
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                                <MenuItem value={200}>200</MenuItem>
                                <MenuItem value={500}>500</MenuItem>
                                <MenuItem value={1000}>1000</MenuItem>
                              </MaterialSelect>
                            </FormControl>
                          </td>

                          <td>
                            <Tooltip title="На первую страницу">
                              <IconButton onClick={() => KeyboardArrowFirstClick()}>
                                <FirstPageIcon style={{ fontSize: "large", color: "black" }} />
                              </IconButton>
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip title="На предыдущюю страницу">
                              <IconButton onClick={() => KeyboardArrowLeftClick(page)}>
                                <ArrowBackIosIcon style={{ fontSize: "medium", color: "black" }} />
                              </IconButton>
                            </Tooltip>
                          </td>
                          <td style={{ color: "black", fontSize: 16 }}>
                            <input style={{ maxWidth: 25 }} value={page} onChange={handlePageChange}></input>
                          </td>
                          <td style={{ paddingLeft: "3px" }}>
                            <Tooltip title="Перейти на указанную страницу">
                              <Button
                                onClick={() => GoToPage()}
                                variant="outlined"
                                style={{
                                  height: 22,
                                  backgroundColor: "#D1D6D6",
                                  fontSize: 12
                                }}
                              >перейти
                              </Button>
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip title="На следующюю страницу">
                              <IconButton onClick={() => KeyboardArrowRightClick(page)}>
                                <ArrowForwardIosIcon style={{ fontSize: "medium", color: "black" }} />
                              </IconButton>
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip title="На последнюю страницу">
                              <IconButton onClick={() => KeyboardArrowLastClick()}>
                                <LastPageIcon style={{ fontSize: "large", color: "black" }} />
                              </IconButton>
                            </Tooltip>
                          </td>
                          <td class="pagination-rows-amount-style">Стр. {page} из {getPageAmount()}</td>
                        </tr>
                      </tfoot>
                    </table>
                    <Menu
                      anchorEl={anchorEl}
                      open={openMenu}
                      onClose={handleCloseMenu}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                      style={{ paddingLeft: "100px" }}
                    >
                      <table>
                        {createMenuItems()}
                      </table>
                    </Menu>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        }
        <Snackbar
          open={showSnackBar}
          onClose={() => handleCloseSnackBar()}
          autoHideDuration={1200}
          message={snackBarMessage}
        />
        <Modal
          open={showModalCancelInstr}
          onClose={handleCloseModalCancelInstr}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.modal}>
            <h3 id="simple-modal-title">Введите причину отмены</h3>
            <TextField
              variant="outlined"
              multiline
              autoFocus
              name="cancelationReason"
              defaultValue={(fieldValue["cancelationReason"] >= 0) ? fieldValue["cancelationReason"] : ""}
              onChange={handleChange}
              onKeyPress={onKeyPressModalCancelInstruction}
              style={{ width: "100%" }}
            />
            {/* {props.esInn === null &&
              <div>
                <h3 id="simple-modal-title">Введите ПИН код Рутокена</h3>
                <FormControl variant="outlined" style={{ width: "100%" }} error={wrongPin}>
                  <InputLabel htmlFor="outlined-adornment-password">PIN</InputLabel>
                  <OutlinedInput
                    type={showPin ? 'text' : 'password'}
                    defaultValue={rutokenPin}
                    onChange={handlePinChange}
                    onKeyPress={onKeyPressModalEnterPin}
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
              </div>
            } */}
            <Button
              variant="contained"
              onClick={() => buttonClick("CancelInstructionSaveButton")}
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
              onClick={() => buttonClick("CancelInstructionCancelButton")}
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
              onClick={() => buttonClick("SignInstructionSaveButton")}
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
    return (
      <Grid container direction="row" justify="center" spacing={0}>
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      </Grid>
    )
  }
}