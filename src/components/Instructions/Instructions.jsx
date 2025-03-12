// Import material and react components
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
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
import Menu from '@mui/material/Menu';
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
import GridSelect from '@material-ui/core/Select';
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
var plugin;
var rutokenHandle, certHandle, certData, cmsData;
var moment = require('moment');

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
  const [Form, setForm] = useState(props.userTask.Form)
  const [gridForm, setGridForm] = useState(props.userTask.gridForm)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [fieldValue, setFieldValue] = useState({}) // opened: false
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
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [modalStyle] = useState(getModalStyle)
  const [showModalCancelInstruction, setShowModalCancelInstruction] = useState(false)
  const [showModalEnterPin, setShowModalEnterPin] = useState(false)
  const [rutokenPin, setRutokenPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [wrongPin, setWrongPin] = useState(false)
  const [updateState, setUpdateState] = useState(null)
  const [isSearchForm, setIsSearchForm] = useState(null)
  const [accordionExpanded, setAccordionExpanded] = useState(false)
  const [sortedColumn, setSortedColumn] = useState("null")
  const [sortedColumnOrder, setSortedColumnOrder] = useState(1)
  const [selectedInstruction, setSelectedInstruction] = useState(null)

  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)
  const [gridTableId] = useState(getUUID())
  const [gridFieldValue, setGridFieldValue] = useState({})

  // Initializing
  useEffect(() => {
    console.log("INSTR PROPS", props)
    if (props.userTask.docList !== "null" && props.userTask.docList !== null) {
      try {
        let parsedData = JSON.parse(props.userTask.docList)
        console.log("DOCL", parsedData)
        let s = parseInt(props.userTask.size)
        let p = parseInt(props.userTask.page)
        setSize(s)
        setPage(p)
        setFilteredDocList(parsedData)
        if (taskType !== "showInstructionsTypeSelectingForm" || taskType !== "showInstructionsGIKTypeSelectingForm") {
          setIsSearchForm(true)
        }
        setInitialDocList(parsedData)
        let sortedDocList = parsedData.sort(dynamicSort("id", 1, "Int"))

        if (props.userTask.selectedDoc !== "null") {
          filterDocList(0, s - 1, sortedDocList, JSON.parse(props.userTask.selectedDoc))
        }
        else { fetchBySize(0, s - 1, sortedDocList) }
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
      let fields = { ...parsedSelectedDoc }
      if (taskType === "showInstructionsCreationForm") { // Creater instruction
        let ed = props.userTask.enumData
        if (userProfile.userRole === "3") { //Depositor  || userProfile.userRole === "4" || userProfile.userRole === "6" || userProfile.userRole === "8" Registrar, GIK, CorrDepo
          let newForm = Form
          let editDepositor = null
          let editDepositor2 = null
          let editAccFrom = null
          let editAccTo = null
          // 1 step check wheter both fields are allowed for input
          for (let s = 0; s < Form.sections.length; s++) {
            for (let c = 0; c < Form.sections[s].contents.length; c++) {
              if (Form.sections[s].contents[c].name === "depositor") {
                editDepositor = Form.sections[s].contents[c].edit
              }
              if (Form.sections[s].contents[c].name === "accFrom") { // if account from is allowed for input depositor is sender
                editAccFrom = Form.sections[s].contents[c].edit
              }
              if (Form.sections[s].contents[c].name === "depositor2") {
                editDepositor2 = Form.sections[s].contents[c].edit
              }
              if (Form.sections[s].contents[c].name === "accTo") { // if account to is allowed for input depositor is recipient
                editAccTo = Form.sections[s].contents[c].edit
              }
            }
          }
          console.log(editDepositor, editAccFrom, editDepositor2, editAccTo)
          // 2 step block field "accTo" for depositor who create the instruction
          // 1 Variant both fields are allowed
          if (editDepositor === true && editDepositor2 === true) {
            console.log("2 Fields alowed")
            for (let s = 0; s < Form.sections.length; s++) {
              for (let c = 0; c < Form.sections[s].contents.length; c++) {
                // separate by allowed account From/To fields
                if (Form.sections[s].contents[c].name === "depositor") {
                  if ((editAccFrom === true && editAccTo === false) || (editAccFrom === true && editAccTo === true)) { // if depositor is SENDER
                    newForm.sections[s].contents[c].edit = false // block field
                    // find partner for cur depositor and insert it to field depositor don't allow him to choose another depositor
                    // console.log("Block depositor")
                    for (let i = 0; i < ed.length; i++) {
                      if (ed[i].name === "depositor") {
                        for (let d = 0; d < ed[i].data.length; d++) {
                          // console.log("Put depositor", ed[i].data[d].id)
                          if (parseInt(props.userProfile.partner) === ed[i].data[d].partner) {
                            let depositorId = ed[i].data[d].id
                            fields["depositor"] = depositorId // set field from profile
                          }
                        }
                      }
                    }
                  }
                }
                if (Form.sections[s].contents[c].name === "accTo") {
                  if (editAccFrom === true && editAccTo === false) { // if depositor is SENDER
                    newForm.sections[s].contents[c].edit = false  // block field
                    newForm.sections[s].contents[c].show = false // hide field
                    // console.log("Block AccTo")
                  }
                }
                if (Form.sections[s].contents[c].name === "depositor2") {
                  if ((editAccFrom === false && editAccTo === true) || (editAccFrom === true && editAccTo === true)) { // if depositor is RECIPIENT
                    newForm.sections[s].contents[c].edit = false // block field
                    // find partner for cur depositor and insert it to field depositor2 don't allow him to choose another depositor
                    // console.log("Block depositor2")
                    for (let i = 0; i < ed.length; i++) {
                      if (ed[i].name === "depositor2") {
                        for (let d = 0; d < ed[i].data.length; d++) {
                          // console.log("Put depositor", ed[i].data[d].id)
                          if (parseInt(props.userProfile.partner) === ed[i].data[d].partner) {
                            let depositorId = ed[i].data[d].id
                            fields["depositor2"] = depositorId // set field from profile
                          }
                        }
                      }
                    }
                  }
                }
                if (Form.sections[s].contents[c].name === "accFrom") {
                  if (editAccFrom === false && editAccTo === true) { // if depositor is RECIPIENT
                    newForm.sections[s].contents[c].edit = false // block field
                    newForm.sections[s].contents[c].show = false // hide field
                    // console.log("Block AccFrom")
                  }
                }
              }
            }
          }
          // 2 Variant 1 fields allowed
          if ((editDepositor === true && editDepositor2 === false) || (editDepositor === false && editDepositor2 === true)) {
            // console.log("1 Field alowed")
            for (let s = 0; s < Form.sections.length; s++) {
              for (let c = 0; c < Form.sections[s].contents.length; c++) {
                // separate by allowed account From/To fields
                if (Form.sections[s].contents[c].name === "depositor") {
                  if (editDepositor === true) {
                    newForm.sections[s].contents[c].edit = false // block field
                    // find partner for cur depositor and insert it to field depositor don't allow him to choose another depositor
                    // console.log("Block depositor")
                    for (let i = 0; i < ed.length; i++) {
                      if (ed[i].name === "depositor") {
                        for (let d = 0; d < ed[i].data.length; d++) {
                          // console.log("Put depositor", ed[i].data[d].id)
                          if (parseInt(props.userProfile.partner) === ed[i].data[d].partner) {
                            let depositorId = ed[i].data[d].id
                            fields["depositor"] = depositorId // set field from profile
                          }
                        }
                      }
                    }
                  }
                }
                if (Form.sections[s].contents[c].name === "depositor2") {
                  if (editDepositor2 === true) {
                    newForm.sections[s].contents[c].edit = false // block field
                    // find partner for cur depositor and insert it to field depositor2 don't allow him to choose another depositor
                    // console.log("Block depositor2")
                    for (let i = 0; i < ed.length; i++) {
                      if (ed[i].name === "depositor2") {
                        for (let d = 0; d < ed[i].data.length; d++) {
                          // console.log("Put depositor", ed[i].data[d].id)
                          if (parseInt(props.userProfile.partner) === ed[i].data[d].partner) {
                            let depositorId = ed[i].data[d].id
                            fields["depositor2"] = depositorId // set field from profile
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          setForm(newForm)
        }
      }
      else {
        if (Object.keys(parsedSelectedDoc).length > 0) {
          for (let s = 0; s < Form.sections.length; s++) {
            for (let c = 0; c < Form.sections[s].contents.length; c++) {
              let fieldName = Form.sections[s].contents[c].name
              fields[fieldName] = parsedSelectedDoc[fieldName]
            }
          }
        }
      }
      console.log("SDOC", parsedSelectedDoc)
      console.log("FIELDVAL", fields)
      setSelectedDoc(parsedSelectedDoc)
      setFieldValue(fields)
    }
    if (taskType === "showInstructionsSearchForm") { // Search instructions
      if (userProfile.userRole === "3") { //Depositor  || userProfile.userRole === "4" || userProfile.userRole === "6" || userProfile.userRole === "8" Registrar, GIK, CorrDepo
        let newForm = Form
        // Hide field depositor
        for (let s = 0; s < Form.sections.length; s++) {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            // separate by allowed account From/To fields
            if (Form.sections[s].contents[c].name === "depositor" || Form.sections[s].contents[c].name === "depositor2") {
              newForm.sections[s].contents[c].show = false // hide field
            }
          }
        }
        setForm(newForm)
      }
    }
    if (props.userTask.enumData !== null && props.userTask.enumData !== undefined && props.userTask.enumData !== "null") {
      let eData = props.userTask.enumData
      let newEnumOptions = {}
      for (let i = 0; i < eData.length; i++) {
        if (eData[i] !== null) {
          let options = [{
            "value": "",
            "label": "Пусто",
            "name": eData[i].name
          }]
          if (eData[i].name === "type") {
            if (props.userTask.taskType === "showInstructionsTypeSelectingForm") {
              for (let d = 0; d < eData[i].data.length; d++) {
                if (props.userProfile[getInstructionTypeName(eData[i].data[d].id)] === true) {
                  options.push({
                    "value": eData[i].data[d].id,
                    "label": eData[i].data[d].label,
                    "name": eData[i].name
                  })
                }
              }
            }
            else {
              for (let d = 0; d < eData[i].data.length; d++) {
                options.push({
                  "value": eData[i].data[d].id,
                  "label": eData[i].data[d].label,
                  "name": eData[i].name
                })
              }
            }
          }
          else if (eData[i].name === "accFrom" || eData[i].name === "accTo") { // Filter allowed account types for selected instruction
            if (props.userTask.taskType === "showInstructionsCreationForm" || props.userTask.taskType === "showInstructionsViewForm") {
              console.log("CREATE TASK")
              // console.log("ACC")
              let parsedSelectedDoc = JSON.parse(props.userTask.selectedDoc)
              let instructionTypeId = parsedSelectedDoc.type
              let filteredRelations = [] // allowed account types
              for (let i = 0; i < eData.length; i++) {
                if (eData[i].name === "instructionAccountRelations") { // Find tabels that indicate allowed account types
                  for (let d = 0; d < eData[i].data.length; d++) {
                    if (eData[i].data[d].id === instructionTypeId) {
                      filteredRelations.push(eData[i].data[d])
                    }
                  }
                }
              }
              // console.log("filteredRelations", filteredRelations)
              for (let d = 0; d < eData[i].data.length; d++) {
                // if (filteredRelations.length > 0) { // Has relations to filter accounts
                let checkResult = checkForPushing(eData[i].data[d].label, instructionTypeId)
                if (checkResult.enableToPush === true) {
                  // console.log("PUSH ? ", eData[i].data[d].label, checkResult)
                  options.push({
                    "value": eData[i].data[d].id,
                    "label": eData[i].data[d].label,
                    "name": eData[i].name
                  })
                }
              }
            }
          }
          else if (eData[i].name === "account") {
            if (props.userTask.taskType === "showInstructionsSearchForm") {
              if (userProfile.userRole === "3") {
                console.log("SEASRCH TASK")
                // console.log("Clear ACC", parseInt(userProfile.partner))
                for (let d = 0; d < eData[i].data.length; d++) {
                  if (eData[i].data[d].partner === parseInt(userProfile.partner)) {
                    options.push({
                      "value": eData[i].data[d].id,
                      "label": eData[i].data[d].label,
                      "name": eData[i].name
                    })
                  }
                }
              }
              else {
                for (let d = 0; d < eData[i].data.length; d++) {
                  options.push({
                    "value": eData[i].data[d].id,
                    "label": eData[i].data[d].label,
                    "name": eData[i].name
                  })
                }
              }
              // console.log("Clear ACC", options)
            }
          }
          else {
            for (let d = 0; d < eData[i].data.length; d++) {
              options.push({
                "value": eData[i].data[d].id,
                "label": eData[i].data[d].label,
                "name": eData[i].name
              })
            }
          }
          newEnumOptions[eData[i].name] = options
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
      console.log("EN OPTS", newEnumOptions)
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
    // setUpdateState(getUUID())
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

  // CancelInstruction MODAL
  const handleOpenModalCancelInstruction = () => {
    setShowModalCancelInstruction(true)
  }
  const handleCloseModalCancelInstruction = () => {
    setShowModalCancelInstruction(false)
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

  function getInstructionTypeName(id) {
    for (let i = 0; i < props.userTask.enumData.length; i++) {
      if (props.userTask.enumData[i].name === "instructionTypesNames") {
        for (let d = 0; d < props.userTask.enumData[i].data.length; d++) {
          if (props.userTask.enumData[i].data[d].id === id) {
            return props.userTask.enumData[i].data[d].label
          }
        }
      }
    }
  }
  // filter accounts that can be selected by instruction type
  function checkForPushing(label, instructionTypeId) {
    // console.log("CHK", label, instructionTypeId)
    let checkResult = {
      enableToPush: false,
      // allowedAccountCode: null
    }
    for (let i = 0; i < props.userTask.enumData.length; i++) {
      if (props.userTask.enumData[i].name === "instructionAccountRelations") { // 1) Push accounts related to Instruction type
        let relations = props.userTask.enumData[i].data
        for (let d = 0; d < relations.length; d++) {
          if (relations[d].id === instructionTypeId) { // find allowed account types
            let splitedAccountName = relations[d].label.split("-")
            let allowedAccountCode = splitedAccountName[1]
            let splitedAccountLabel = label.split("-")
            let accCode = splitedAccountLabel[1]
            let accPartner = splitedAccountLabel[2]
            // console.log(allowedAccountCode, accCode)
            if (accCode === allowedAccountCode) {
              // if (userProfile.userRole === "2" || userProfile.userRole === "3" || userProfile.userRole === "4" || userProfile.userRole === "8") {
              // Operator, Broker, Registrar, CorrDepo
              if (userProfile.userRole === "1" || userProfile.userRole === "5" || userProfile.userRole === "7") { // Admin, Accountant, CD
                // console.log("ALOLOWED All", accCode)
                checkResult.enableToPush = true
                // checkResult["allowedAccountCode"] = allowedAccountCode
                break
              }
              else { // Other users
                if (accPartner === userProfile.partner) {// Depositor, Registrar, corrDepo, GIK, ...
                  // console.log("ALOLOWED", accCode, accPartner, userProfile.partner)
                  checkResult.enableToPush = true
                  // checkResult["allowedAccountCode"] = allowedAccountCode
                  break
                }
              }
            }
          }
        }
      }
    }
    return checkResult
  }
  // RuToken functions
  function handlePinChange(event) {
    // console.log("EVENT", event.target.name, event.target.value)
    setRutokenPin(event.target.value)
    console.log("PIN", event.target.value)
  }
  function handleClickShowPin() {
    setShowPin(!showPin)
  }
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
        return // alert("Не удаётся загрузить Плагин")
      } else {
        plugin = result
        return Promise.resolve()
      }
    })

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
  // Sign transfer order with rutoken
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
              return plugin.login(rutokenHandle, rutokenPin);
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
            console.log("RUTDATA", certData)
            let tokenRemainingTime = new Date(certData.validNotAfter).getTime() - Date.now()
            if (tokenRemainingTime > 0) {
              if (certHandle.length > 0) {
                var options = {};

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
                let instructionToSign = commandJson.variables.document.value
                if (selectedDoc.filled === undefined || selectedDoc.filled === null || selectedDoc.filled === false) { // Depositor
                  instructionToSign["filled"] = true
                  instructionToSign["filled_at"] = props.getCurrentFullDateTime()
                  instructionToSign["filledUser"] = userProfile.firstName + " " + userProfile.lastName + " " + userProfile.middleName
                  instructionToSign["signed_depositor_inn"] = inn
                  instructionToSign["signed_depositor_full_name"] = fullName
                  instructionToSign["signed_at_depositor"] = props.getCurrentFullDateTime()
                  commandJson.variables.status.value = "filled"
                }
                else { // Depository
                  instructionToSign["onExecution"] = true
                  instructionToSign["onExecutionUser"] = userProfile.firstName + " " + userProfile.lastName + " " + userProfile.middleName
                  instructionToSign["signed_cd_inn"] = inn
                  instructionToSign["signed_cd_full_name"] = fullName
                  instructionToSign["signed_at_cd"] = props.getCurrentFullDateTime()
                  commandJson.variables.status.value = "onExecution"
                }
                commandJson.variables.document.value = JSON.stringify(instructionToSign)
                console.log("SIGN", instructionToSign, commandJson.variables.document)
                handleCloseModalEnterPin()
                // swAllert("Поручение успешно подписано!", "success")
                props.sendFieldValues(commandJson)
                props.clearTabData(commandJson.process_id)
                return plugin.sign(rutokenHandle, certHandle, "textToSign", plugin.DATA_FORMAT_PLAIN, options);
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
    catch (er) {
      console.log("Rutoken ERR")
    }
  }
  // Input handlers
  const handleCheckboxChange = (event) => {
    setFieldValue({ ...fieldValue, [event.target.name]: event.target.checked })
    // console.log("Check change", event.target.checked)
  }
  // Radio group handler
  const handleRadioGroupChange = (event) => {
    setFieldValue({ ...fieldValue, [event.target.name]: event.target.value })
  }
  function handleTextChange(event) {
    // console.log("EVENT", event.target.name, event.target.value)
    fieldValue[event.target.name] = event.target.value
    setFieldValue(fieldValue)
    // console.log("FIELDVALUE", fieldValue)
  }

  // Float input handler
  const handleFloatChange = (event) => {
    // console.log("FLOAT CHANGE", event.target.name, event.target.value)
    setFieldValue({ ...fieldValue, [event.target.name]: event.target.value })
  }
  // Integer input handler
  const handleIntChange = (event) => {
    // console.log("EVENT", event.target.name, event.target.value)
    let stringNum = event.target.value.toString().replace(/ /g, '')
    let int = parseInt(stringNum)
    setFieldValue({ ...fieldValue, [event.target.name]: int })
  }
  // // Float input handler
  // const handleFloatChange = (event) => {
  //   let stringNum = event.target.value.toString().replace(/ /g, '');
  //   let float = parseFloat(stringNum)
  //   setFieldValue({ ...fieldValue, [event.target.name]: float })
  //   console.log("FLOAT CHANGE", event.target.name, fieldValue)
  // }
  function handleDateTimeChange(event) {
    // let fullDate = props.parseDate(event.target.value)
    // var hours = new Date().getHours()
    // var minutes = new Date().getMinutes()
    // var seconds = new Date().getSeconds()
    // var convertedDate = fullDate + " " + hours + ":" + minutes + ":" + seconds + ".123456"
    // fieldValue[event.target.name] = convertedDate
    // setFieldValue(fieldValue)
    fieldValue[event.target.name] = moment(event.target.value).format("YYYY-MM-DDTHH:mm:ss")
    setFieldValue(fieldValue)
    console.log("DATE CHANGE", fieldValue[event.target.name], event.target.value)
  }
  // Handler of select copmponet changes
  function handleSelectChange(option) {
    fieldValue[option.name] = option.value
    console.log("OPT", option.name, option.value)
    var updateSelectedOptions = selectedOptions.slice()
    let noSuchOption = true
    for (let i = 0; i < updateSelectedOptions.length; i++) {
      if (option.name === updateSelectedOptions[i].name) {
        updateSelectedOptions[i] = option
        noSuchOption = false
        setSelectedOptions(updateSelectedOptions)
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
    if (option.name === "depositor") {
      let newOptions = []
      let depositorPartner = getDepositorPartner(option.value) // find depositor partner id
      if (taskType === "showInstructionsCreationForm" || taskType === "showInstructionsViewForm") {
        // Первый депонент выбран нужно отфильтровать поле "Со счета" и отобразить счета только выбранного депонента

        // console.log("PARTNER", depositorPartner)
        for (let i = 0; i < enumData.length; i++) {
          if (enumData[i].name === "accFrom") {
            for (let d = 0; d < enumData[i].data.length; d++) {
              let checkResult = checkForPushing(enumData[i].data[d].label, fieldValue["type"])
              console.log("PUSH?", enumData[i].data[d].label, fieldValue["type"])
              if (checkResult.enableToPush === true) {
                if (enumData[i].data[d].partner === depositorPartner) { // compare depositor partner and account partner
                  newOptions.push({
                    "value": enumData[i].data[d].id,
                    "label": enumData[i].data[d].label,
                    "name": enumData[i].name
                  })
                }
              }
            }
          }
        }
        console.log("NEW ENUMS", newOptions)
        enumOptions["accFrom"] = newOptions
        setEnumOptions(enumOptions)
      }
      else if (taskType === "showInstructionsSearchForm") {
        // депонент выбран нужно отфильтровать поле "Счет" и отобразить счета только выбранного депонента
        // console.log("PARTNER", depositorPartner)
        for (let i = 0; i < enumData.length; i++) {
          if (enumData[i].name === "account") {
            for (let d = 0; d < enumData[i].data.length; d++) {
              if (enumData[i].data[d].partner === depositorPartner) { // compare depositor partner and account partner
                newOptions.push({
                  "value": enumData[i].data[d].id,
                  "label": enumData[i].data[d].label,
                  "name": enumData[i].name
                })
              }
            }
          }
        }
        enumOptions["account"] = newOptions
        setEnumOptions(enumOptions)
      }
    }
    else if (option.name === "depositor2" && (taskType === "showInstructionsCreationForm" || taskType === "showInstructionsViewForm")) {
      // Второй депонент выбран нужно отфильтровать поле "На счет" и отобразить счета только выбранного депонента
      let newOptions = []
      let depositorPartner = getDepositorPartner(option.value) // find depositor partner id
      // console.log("PARTNER", depositorPartner)

      for (let i = 0; i < enumData.length; i++) {
        if (enumData[i].name === "accTo") {
          for (let d = 0; d < enumData[i].data.length; d++) {
            if (enumData[i].data[d].partner === depositorPartner) { // compare depositor partner and account partner
              let checkResult = checkForPushing(enumData[i].data[d].label, fieldValue["type"])
              // console.log("PUSH", enumData[i].data[d].label)
              if (checkResult.enableToPush === true) {
                newOptions.push({
                  "value": enumData[i].data[d].id,
                  "label": enumData[i].data[d].label,
                  "name": enumData[i].name
                })
              }
            }
          }
        }
      }
      // console.log("NEW ENUMS", newOptions)
      enumOptions["accTo"] = newOptions
      setEnumOptions(enumOptions)
    }
    else if (option.name === "security" && (taskType === "showInstructionsCreationForm" || taskType === "showInstructionsViewForm")) {
      // выбрана ценная бумага нужно найти эмитента и отобразить
      for (let i = 0; i < enumData.length; i++) {
        if (enumData[i].name === "security") {
          for (let d = 0; d < enumData[i].data.length; d++) {
            if (enumData[i].data[d].id === option.value) {
              let issuerId = enumData[i].data[d].issuer
              fieldValue["issuer"] = issuerId
              for (let j = 0; j < enumData.length; j++) {
                if (enumData[j].name === "issuer") {
                  // console.log("issuerID", issuerId)
                  for (let h = 0; h < enumData[j].data.length; h++) {
                    if (enumData[j].data[h].id === issuerId) {
                      let issuerOption = {
                        value: issuerId,
                        name: "issuer",
                        label: enumData[j].data[h].label
                      }
                      console.log("issuerOption", issuerOption)
                      let noIssuerOption = true
                      for (let y = 0; y < updateSelectedOptions.length; y++) {
                        if (updateSelectedOptions[y].name === "issuer") {
                          updateSelectedOptions[y] = issuerOption
                          noIssuerOption = false
                          setSelectedOptions(updateSelectedOptions)
                          break
                        }
                        else {
                          noIssuerOption = true
                        }
                      }
                      if (noIssuerOption === true) {
                        updateSelectedOptions.push(issuerOption)
                        setSelectedOptions(updateSelectedOptions)
                        // console.log("NO Issuer", updateSelectedOptions)
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      // console.log("NEW ENUMS", newOptions)
      // enumOptions["issuer"] = newOptions
      // setEnumOptions(enumOptions)
    }
    setFieldValue(fieldValue)
  }
  function getDepositorPartner(depId) {
    for (let i = 0; i < enumData.length; i++) {
      if (enumData[i].name === "depositor") {
        for (let d = 0; d < enumData[i].data.length; d++) {
          if (enumData[i].data[d].id === depId) {
            return enumData[i].data[d].partner
          }
        }
      }
    }
  }
  // Returns random id
  function getUUID() {
    const uuidv1 = require("uuid/v1")
    return uuidv1()
  }
  // Collecting all field values and return as attributes
  function getFieldValuesCreateDocument() {
    let fields = {}
    for (let key in fieldValue) {
      if (fieldValue[key] !== null && fieldValue[key] !== "" && fieldValue[key] !== "NaN-NaN-NaN") {
        fields[key] = fieldValue[key]
      }
    }
    return (fields)
  }
  function getFieldValuesSaveInstruction() {
    let fields = {}
    for (let key in fieldValue) {
      if (fieldValue[key] !== null && fieldValue[key] !== "" && fieldValue[key] !== "NaN-NaN-NaN" && key !== "id") {
        fields[key] = fieldValue[key]
      }
    }
    fields.filled = false
    fields.onExecution = false
    fields.executed = false
    fields.canceled = false
    fields.opened = false
    fields.signed = false
    fields.created_user_partner = getCreatedPartner()
    return (fields)
  }
  function getCreatedPartner() {
    let partner = parseInt(userProfile.partner)
    if (userProfile.userRole === "3") { // Depositor
      partner = parseInt(userProfile.partner)
    }
    else {
      let editDepositor = null
      let editDepositor2 = null
      let editAccFrom = null
      let editAccTo = null
      // 1 step check wheter both fields are allowed for input
      for (let s = 0; s < Form.sections.length; s++) {
        for (let c = 0; c < Form.sections[s].contents.length; c++) {
          let ed = Form.sections[s].contents[c].edit
          let sh = Form.sections[s].contents[c].show
          if (Form.sections[s].contents[c].name === "depositor") {
            editDepositor = (ed === true && sh === true) ? true : false
          }
          if (Form.sections[s].contents[c].name === "accFrom") { // if account from is allowed for input depositor is sender
            editAccFrom = (ed === true && sh === true) ? true : false
          }
          if (Form.sections[s].contents[c].name === "depositor2") {
            editDepositor2 = (ed === true && sh === true) ? true : false
          }
          if (Form.sections[s].contents[c].name === "accTo") { // if account to is allowed for input depositor is recipient
            editAccTo = (ed === true && sh === true) ? true : false
          }
        }
      }
      console.log(editDepositor, editAccFrom, editDepositor2, editAccTo)
      // 1 Variant Depositor is sender
      if (editDepositor === true && editAccFrom === true) {
        partner = getDepositorPartnerId(fieldValue.depositor)
        console.log("SENDER P", partner)
      }
      // 2 Depositor is recipient
      if (editDepositor2 === true && editAccTo === true) {
        partner = getDepositorPartnerId(fieldValue.depositor2)
        console.log("RECIPIENT P", partner)
      }
    }
    return partner
  }
  function getDepositorPartnerId(id) {
    for (let i = 0; i < enumData.length; i++) {
      if (enumData[i].name === "depositor") {
        for (let d = 0; d < enumData[i].data.length; d++) {
          if (enumData[i].data[d].id === id) {
            return enumData[i].data[d].partner
          }
        }
      }
    }
  }
  // Collect data to update doc
  function getFieldValuesUpdateInstruction() {
    let docToUpdate = selectedDoc
    // docToUpdate["created_at"] = selectedDoc.created_at
    // docToUpdate["id"] = selectedDoc.id
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let fieldName = Form.sections[s].contents[c].name
        if (Form.sections[s].contents[c].type === "Bool" && (fieldValue[fieldName] === undefined || fieldValue[fieldName] === null)) {
          docToUpdate[fieldName] = false
        }
        else {
          docToUpdate[fieldName] = fieldValue[fieldName]
        }
      }
    }
    return docToUpdate
  }
  function checkForRequieredFields() {
    let checkedSuccessfuly = null
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let fieldName = Form.sections[s].contents[c].name
        if (Form.sections[s].contents[c].required === true) {
          if (fieldValue[fieldName] === undefined || fieldValue[fieldName] === null ||
            fieldValue[fieldName] === "NaN.NaN.NaN" || fieldValue[fieldName] === "") {
            checkedSuccessfuly = false
            swAllert("Внимание заполните поле \"" + Form.sections[s].contents[c].label + "\"", "warning")
            return checkedSuccessfuly
          }
          else {
            checkedSuccessfuly = true
          }
        }
        else {
          checkedSuccessfuly = true
        }
      }
    }
    return checkedSuccessfuly
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
    else if (buttonName === "createDocument") {
      if (props.operDayIsOpened === false) {
        swal({
          text: "Операционный день закрыт вы не можете создавать поручения!",
          icon: "warning",
          buttons: { ok: "Ок" }
        })
      }
      else {
        const createDocument = getFieldValuesCreateDocument()
        const commandJson =
        {
          commandType: "completeTask",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          variables: {
            userAction: { value: "createDocument" },
            selectedDoc: { value: JSON.stringify(createDocument) },
            searchDoc: { value: JSON.stringify(fieldValue) },
            userId: { value: userProfile.userId },
            userRole: { value: userProfile.userRole }
          }
        }
        console.log("button createDocument: ", commandJson)
        let checkResult = checkForRequieredFields()
        if (checkResult === true) {
          props.sendFieldValues(commandJson)
          props.clearTabData(process_id)
        }
      }
    }
    // else if(buttonName === "selectSample"){
    //   if(props.operDayIsOpened === false){
    //     swal({
    //       text: "Операционный день закрыт вы не можете создавать поручения!",
    //       icon: "warning",
    //       buttons: {ok: "Ок"}
    //     })
    //   }
    //   else{
    //     const commandJson = 
    //     {
    //       commandType: "completeTask",
    //       session_id: session_id,
    //       process_id: process_id,
    //       taskID: taskID,
    //       variables: {
    //         userAction: {value: "selectSample"},
    //         searchDoc: {value: JSON.stringify(fieldValue)}
    //       }
    //     }
    //     console.log("button selectSample: ", commandJson)
    //     props.sendFieldValues(commandJson)
    //     props.clearTabData(process_id)
    //   }
    // }
    else if (buttonName === "selectInstruction") {
      let createFormDefId = null
      let report = null
      for (let k = 0; k < enumData.length; k++) {
        if (enumData[k].name === "type") {
          for (let d = 0; d < enumData[k].data.length; d++) {
            if (dataItem.type === enumData[k].data[d].id) {
              createFormDefId = enumData[k].data[d].create_form
              report = enumData[k].data[d].reportName
            }
          }
        }
      }
      let copyFields = {}
      copyFields.type = dataItem.type
      copyFields.urgent = dataItem.urgent
      copyFields.depositor = dataItem.depositor
      copyFields.accFrom = dataItem.accFrom
      copyFields.depositor2 = dataItem.depositor2
      copyFields.accTo = dataItem.accTo
      copyFields.issuer = dataItem.issuer
      copyFields.security = dataItem.security
      copyFields.currency = dataItem.currency
      copyFields.quantity = dataItem.quantity
      copyFields.basis = dataItem.basis
      copyFields.ownerName = dataItem.ownerName
      copyFields.ownerDocument = dataItem.ownerDocument
      copyFields.ownerAddress = dataItem.ownerAddress
      copyFields.additional_information = dataItem.additional_information
      copyFields.payment_account = dataItem.payment_account
      copyFields.payment_bank = dataItem.payment_bank
      copyFields.payment_bik = dataItem.payment_bik
      copyFields.payment_purpose = dataItem.payment_purpose
      copyFields.payment_recipient = dataItem.payment_recipient
      copyFields.tradingSystem = dataItem.tradingSystem

      // for(let s=0; s<Form.sections.length; s++){
      //   for(let c=0; c<Form.sections[s].contents.length; c++){
      //     let fieldName = Form.sections[s].contents[c].name
      //     if(Form.sections[s].contents[c].show === true){
      //       copyFields[fieldName] = dataItem[fieldName]
      //     }
      //   }
      // }
      const commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        variables: {
          userAction: { value: "createInstruction" },
          selectedDoc: { value: JSON.stringify(copyFields) },
          instructionType: { value: fieldValue["type"] },
          createFormDefId: { value: createFormDefId },
          reportName: { value: report },
          searchDoc: { value: JSON.stringify(fieldValue) }
        }
      }
      console.log("button selectInstruction: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "editDocument") {
      const commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        variables: {
          userAction: { value: "editDocument" },
          userId: { value: userProfile.userId },
          userRole: { value: userProfile.userRole }
        }
      }
      console.log("button editDocument: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "updateDocument") {
      const updateDocument = getFieldValuesUpdateInstruction()
      const commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        variables: {
          userAction: { value: "updateDocument" },
          document: { value: JSON.stringify(updateDocument) },
          userId: { value: userProfile.userId },
          userRole: { value: userProfile.userRole }
        }
      }
      console.log("button updateDocument: ", commandJson)
      let checkResult = checkForRequieredFields()
      if (checkResult === true) {
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (buttonName === "createInstruction") {
      if (props.operDayIsOpened === false) {
        swal({
          text: "Операционный день закрыт вы не можете создавать поручения!",
          icon: "warning",
          buttons: { ok: "Ок" }
        })
      }
      else {
        let createFormDefId = null
        let report = null
        for (let k = 0; k < enumData.length; k++) {
          if (enumData[k].name === "type") {
            for (let d = 0; d < enumData[k].data.length; d++) {
              if (fieldValue["type"] === enumData[k].data[d].id) {
                createFormDefId = enumData[k].data[d].create_form
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
            userAction: { value: "createInstruction" },
            userId: { value: userProfile.userId },
            userRole: { value: userProfile.userRole },
            selectedDoc: { value: JSON.stringify({ type: fieldValue["type"] }) },
            instructionType: { value: fieldValue["type"] },
            createFormDefId: { value: createFormDefId },
            reportName: { value: report }
          }
        }
        console.log("button createInstruction: ", commandJson)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (buttonName === "saveInstruction") {
      const createDocument = getFieldValuesSaveInstruction()
      let notBody = {
        variables:
        {
          user_session_id: { value: session_id },
          userAction: { value: "getNotificationsCount" }
        }
      }
      let showTransferOrder = true
      let transferOrder = {
        instruction_id: "null",
        registered_person: fieldValue["ownerName"],
        address: fieldValue["ownerAddress"],
        security: fieldValue["security"],
        issuer: fieldValue["issuer"],
        quantity_int: fieldValue["quantity"],
        basis: fieldValue["basis"]
      }
      for (let t = 0; t < enumData.length; t++) {
        if (enumData[t].name === "security") {
          for (let dt = 0; dt < enumData[t].data.length; dt++) {
            if (fieldValue["security"] === enumData[t].data[dt].id) {
              transferOrder["security_type"] = enumData[t].data[dt].security_type
              transferOrder["registrar"] = enumData[t].data[dt].registrar // Find registrar of security
            }
          }
        }
        if (enumData[t].name === "type") {
          for (let dt = 0; dt < enumData[t].data.length; dt++) {
            if (fieldValue["type"] === enumData[t].data[dt].id) {
              showTransferOrder = enumData[t].data[dt].transfer_order // Check to show transfer order create form
            }
          }
        }
      }
      const commandJson =
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: { value: "saveInstruction" },
          saveBody: { value: JSON.stringify(createDocument) },
          selectedDoc: { value: JSON.stringify(createDocument) },
          notificationsBody: { value: JSON.stringify(notBody) },
          userId: { value: userProfile.userId },
          userRole: { value: userProfile.userRole },
          // reportName: {value: reportName},
          showTransferOrder: { value: showTransferOrder },
          transferOrder: { value: JSON.stringify(transferOrder) }
        }
      }
      if (fieldValue["urgent"] === true) {
        swal({
          text: "ВНИМАНИЕ поручения со статусом \"СРОЧНОЕ\" будет тарифицироваться в соответствии с тарифами ЦД на срочные поручения, хотите продолжить?",
          icon: "warning",
          buttons: { ok: "Ок", cancel: "Отмена" },
          // dangerMode: true,
        })
          .then((click) => {
            if (click === "ok") {
              let checkResult = checkForRequieredFields()
              if (checkResult === true) {
                props.sendFieldValues(commandJson)
                props.clearTabData(process_id)
              }
            }
          })
      }
      else {
        let checkResult = checkForRequieredFields()
        // console.log("PASSED", checkResult)
        if (checkResult === true) {
          props.sendFieldValues(commandJson)
          props.clearTabData(process_id)
        }
      }
      console.log("button saveInstruction: ", commandJson)
    }
    else if (buttonName === "saveInstructionGIK") {
      const createDocument = getFieldValuesCreateDocument()
      createDocument.status = 1
      const commandJson =
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: { value: "saveInstructionGIK" },
          saveBody: { value: JSON.stringify(createDocument) },
          selectedDoc: { value: JSON.stringify(createDocument) },
          userId: { value: userProfile.userId },
          userRole: { value: userProfile.userRole }
        }
      }
      let checkResult = checkForRequieredFields()
      // console.log("PASSED", checkResult)
      if (checkResult === true) {
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
      console.log("button saveInstruction: ", commandJson)
    }
    else if (buttonName === "viewInstruction") {
      let currentStatus = "saved"
      let notBody = {
        variables:
        {
          user_session_id: { value: session_id },
          userAction: { value: "getNotificationsCount" }
        }
      }
      if (dataItem.filled === true) {
        currentStatus = "filled"
        if (dataItem.onExecution === true) {
          currentStatus = "onExecution"
          if (dataItem.executed === true) {
            currentStatus = "executed"
          }
          else {
            if (dataItem.canceled === true) {
              currentStatus = "canceled"
            }
          }
        }
        else {
          if (dataItem.canceled === true) {
            currentStatus = "canceled"
          }
        }
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
          notificationsBody: { value: JSON.stringify(notBody) },
          userAction: { value: "viewInstruction" },
          userId: { value: userProfile.userId },
          docId: { value: dataItem.id },
          instructionType: { value: dataItem.type },
          status: { value: currentStatus },
          editFormDefId: { value: editFormDefId },
          reportName: { value: report },
          searchDoc: { value: JSON.stringify(fieldValue) },
        }
      }
      console.log("button viewInstruction: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "viewInstructionGIK") {
      let editFormDefId = null
      for (let k = 0; k < enumData.length; k++) {
        if (enumData[k].name === "type") {
          for (let d = 0; d < enumData[k].data.length; d++) {
            if (dataItem.type === enumData[k].data[d].id) {
              editFormDefId = enumData[k].data[d].edit_form
              // report = enumData[k].data[d].reportName
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
          userAction: { value: "viewInstructionGik" },
          userId: { value: userProfile.userId },
          docId: { value: dataItem.id },
          instructionType: { value: dataItem.type },
          status: { value: dataItem.status },
          editFormDefId: { value: editFormDefId },
          searchDoc: { value: JSON.stringify(fieldValue) },
        }
      }
      console.log("button viewInstruction: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "cancelInstructionGIK") {
      if (props.operDayIsOpened === false) {
        swal({
          text: "Операционный день закрыт дождитесь открытия операционного дня!",
          icon: "warning",
          buttons: { ok: "Ок" }
        })
      }
      else {
        handleOpenModalCancelInstruction()
      }
    }
    
    else if (buttonName === "executeGIK") {
      const updateDocument = getFieldValuesUpdateInstruction()
      updateDocument.status = 2
      updateDocument.executed_user = userProfile.firstName + " " + userProfile.lastName + " " + userProfile.middleName
      updateDocument.execution_time = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss")
      const commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        variables: {
          userAction: { value: "executeGIK" },
          userId: { value: userProfile.userId },
          userRole: { value: userProfile.userRole },
          selectedDoc: { value: JSON.stringify(updateDocument) },
          document: { value: JSON.stringify(updateDocument) },
          // cancelationReason: { value: fieldValue.cancelationReason },
          status: { value: 3 }
        }
      }
      console.log("button CancelInstructionSaveButtonGIK: ", commandJson.variables)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "sendToCD") {
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
          let updateDocument = getFieldValuesUpdateInstruction()
          updateDocument["filled"] = true
          updateDocument["filled_at"] = props.getCurrentFullDateTime()
          updateDocument["filledUser"] = userProfile.firstName + " " + userProfile.lastName + " " + userProfile.middleName
          updateDocument["signed_depositor_inn"] = props.esInn
          updateDocument["signed_depositor_full_name"] = props.esUserFullName
          updateDocument["signed_at_depositor"] = props.getCurrentFullDateTime()
          const commandJson =
          {
            commandType: "completeTask",
            session_id: session_id,
            process_id: process_id,
            taskID: taskID,
            variables: {
              userAction: { value: "updateDocument" },
              userId: { value: userProfile.userId },
              userRole: { value: userProfile.userRole },
              document: { value: JSON.stringify(updateDocument) },
              status: { value: "filled" }
            }
          }
          // console.log(buttonName, commandJson)
          props.sendFieldValues(commandJson)
          props.clearTabData(process_id)
        }
      }
    }
    else if (buttonName === "sendToCDWithoutES") {
      const updateDocument = getFieldValuesUpdateInstruction()
      updateDocument.filled = true
      updateDocument.filledUser = userProfile.firstName + " " + userProfile.lastName + " " + userProfile.middleName
      updateDocument.signed_at_depositor = props.getCurrentFullDateTime()
      updateDocument.filled_at = props.getCurrentFullDateTime()
      const commandJson = {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        variables: {
          userAction: { value: "updateDocument" },
          userId: { value: userProfile.userId },
          userRole: { value: userProfile.userRole },
          document: { value: JSON.stringify(updateDocument) },
          status: { value: "filled" }
        }
      }
      console.log("button sendToCDWithoutES: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "SignInstructionSaveButton") {
      const updateDocument = getFieldValuesUpdateInstruction()
      const commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        variables: {
          userAction: { value: "updateDocument" },
          userId: { value: userProfile.userId },
          userRole: { value: userProfile.userRole },
          document: { value: updateDocument },
          status: { value: "" }
        }
      }
      console.log("button signInstruction: ", commandJson)
      sign(commandJson)
    }
    else if (buttonName === "deleteDocument") {
      let docToDelete = selectedDoc.id
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "deleteDocument" },
          document: { value: docToDelete.toString() }
        }
      }
      console.log("deleteDocument:", commandJson)
      swal({
        text: "ВНИМАНИЕ! Вы действительно удалить это поручение?",
        icon: "warning",
        buttons: { yes: "Да", cancel: "Отмена" },
      })
        .then((click) => {
          if (click === "yes") {
            props.sendFieldValues(commandJson)
            props.clearTabData(process_id)
          }
        })
    }
    else if (buttonName === "onExecution") {
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
          let updateDocument = getFieldValuesUpdateInstruction()
          updateDocument["onExecution"] = true
          updateDocument["onExecutionUser"] = userProfile.firstName + " " + userProfile.lastName + " " + userProfile.middleName
          updateDocument["onExecutionDate"] = props.getCurrentFullDateTime()
          updateDocument["signed_cd_inn"] = props.esInn
          updateDocument["signed_cd_full_name"] = props.esUserFullName
          updateDocument["signed_at_cd"] = props.getCurrentFullDateTime()
          const commandJson =
          {
            commandType: "completeTask",
            session_id: session_id,
            process_id: process_id,
            taskID: taskID,
            variables: {
              userAction: { value: "updateDocument" },
              userId: { value: userProfile.userId },
              userRole: { value: userProfile.userRole },
              document: { value: JSON.stringify(updateDocument) },
              status: { value: "onExecution" }
            }
          }
          console.log("onExecution:", commandJson, updateDocument)
          props.sendFieldValues(commandJson)
          props.clearTabData(process_id)
        }
      }
    }
    else if (buttonName === "Execute") {
      if (props.operDayIsOpened === false) {
        swal({
          text: "Операционный день закрыт дождитесь открытия операционного дня!",
          icon: "warning",
          buttons: { ok: "Ок" }
        })
      }
      else {
        const updateDocument = getFieldValuesUpdateInstruction()
        updateDocument["executed"] = true
        updateDocument["executedUser"] = userProfile.firstName + " " + userProfile.lastName + " " + userProfile.middleName
        updateDocument["executedDate"] = props.getCurrentFullDateTime()
        const commandJson =
        {
          commandType: "completeTask",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          variables: {
            userAction: { value: "updateDocument" },
            userId: { value: userProfile.userId },
            userRole: { value: userProfile.userRole },
            document: { value: JSON.stringify(updateDocument) },
            status: { value: "executed" }
          }
        }
        console.log("button Execute: ", commandJson)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
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
        handleOpenModalCancelInstruction()
      }
    }
    else if (buttonName === "CancelInstructionSaveButton") {
      if (taskType === "showInstructionsGIKViewForm") {
        buttonClick("CancelInstructionSaveButtonGIK")
      }
      else {
        handleCloseModalCancelInstruction()
        const updateDocument = getFieldValuesUpdateInstruction()
        updateDocument["canceled"] = true
        updateDocument["canceledUser"] = userProfile.firstName + " " + userProfile.lastName + " " + userProfile.middleName
        updateDocument["cancelationReason"] = fieldValue.cancelationReason
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
            selectedDoc: { value: JSON.stringify(updateDocument) },
            documentsToCancel: { value: JSON.stringify([{ id: selectedDoc.id }]) },
            cancelationReason: { value: fieldValue.cancelationReason },
            status: { value: "canceled" }
          }
        }
        console.log("button CancelInstructionSaveButton: ", commandJson, selectedDoc)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }

    }
    else if (buttonName === "CancelInstructionSaveButtonGIK") {
      handleCloseModalCancelInstruction()
      const updateDocument = getFieldValuesUpdateInstruction()
      updateDocument.status = 3
      updateDocument.canceled_user = userProfile.firstName + " " + userProfile.lastName + " " + userProfile.middleName
      updateDocument.cancelation_reason = fieldValue.cancelationReason
      updateDocument.cancelation_time = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss")
      const commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        variables: {
          userAction: { value: "cancelInstructionGIK" },
          userId: { value: userProfile.userId },
          userRole: { value: userProfile.userRole },
          selectedDoc: { value: JSON.stringify(updateDocument) },
          document: { value: JSON.stringify(updateDocument) },
          // cancelationReason: { value: fieldValue.cancelationReason },
          status: { value: 3 }
        }
      }
      console.log("button CancelInstructionSaveButtonGIK: ", commandJson.variables)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "CancelInstructionCancelButton") {
      handleCloseModalCancelInstruction()
      fieldValue["cancelationReason"] = null
      setFieldValue(fieldValue)
      console.log("FIELDS", fieldValue)
    }
    else if (buttonName === "uploadToXML") {
      // Create xml
      let xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?><InstructionsList xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\"><instructions>"
      for (let i = 0; i < filteredDocList.length; i++) {
        xml += "<instruction>"
        for (let prop in filteredDocList[i]) {
          xml += "<" + prop + ">"
          xml += filteredDocList[i][prop]
          xml += "</" + prop + ">"
        }
        xml += "</instruction>"
      }
      xml += "</instructions></InstructionsList>"
      let finalxml = xml.replace(/<\/?[0-9]{1,}>/g, '').toString()

      // Download xml
      let pom = document.createElement('a')
      let filename = "UploadInstructions.xml"
      let bb = new Blob([finalxml], { type: 'text/plain' })

      pom.setAttribute('href', window.URL.createObjectURL(bb))
      pom.setAttribute('download', filename)

      pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':')
      pom.draggable = true
      pom.classList.add('dragout')
      pom.click()
    }
    else if (buttonName === "showInstructionReport") {
      let reportName = null
      for (let k = 0; k < enumData.length; k++) {
        if (enumData[k].name === "type") {
          for (let d = 0; d < enumData[k].data.length; d++) {
            if (selectedDoc.type === enumData[k].data[d].id) {
              let reportId = enumData[k].data[d].report
              for (let e = 0; e < enumData.length; e++) {
                if (enumData[e].name === "instructionReports") {
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
      let reportExecutions = {
        "reportUnitUri": "/reports/interactive/" + reportName,
        "async": true,
        "interactive": true,
        "freshData": false,
        "saveDataSnapshot": false,
        "outputFormat": "pdf", // html xlsx pdf docx
        "parameters": {
          "reportParameter": [
            { name: "id", value: [selectedDoc.id.toString()] },
            { name: "first_n", value: [userProfile.firstName.trim()] },
            { name: "last_n", value: [userProfile.lastName.trim()] },
            { name: "middle_n", value: [userProfile.middleName.trim()] }
          ]
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
          instructionType: { value: selectedDoc.type },
          reportName: { value: reportName },
          reportVars: { value: "?id=" + selectedDoc.id + "&first_n=" + userProfile.firstName.trim() + "&last_n=" + userProfile.lastName.trim() + "&middle_n=" + userProfile.middleName.trim() },
          reportExecutions: { value: JSON.stringify(reportExecutions) }

        }
      }
      console.log("button showInstructionReport: ", commandJson)
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
    else if (buttonName === "test") {
      const commandJson =
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: { value: "test" },
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
  // Returns Button component
  function createButton(button, index) {
    return (
      <Button variant="outlined"
        name={button.name}
        key={index}
        onClick={() => buttonClick(button.name)}
        style={{
          margin: 3,
          color: button.fontColor,
          backgroundColor: button.backgroundColor,
          height: 32,
          fontSize: 12
        }}
        value={button.name}
      >
        {button.label}
      </Button>
    )
  }
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
          onBlur={handleTextChange}
          name={contentItem.name}
          style={{ width: "100%" }}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          defaultValue={(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name] : ""}
        />
      )
    }
    else if (contentItem.type === "DateTime") {
      let d = (fieldValue[contentItem.name] !== undefined && fieldValue[contentItem.name] !== null) ? moment(fieldValue[contentItem.name]).format('YYYY-MM-DD') : ""
      return (
        <input
          onKeyPress={onKeyPressDateTime}
          type="date"
          name={contentItem.name}
          onBlur={handleDateTimeChange}
          style={{ width: "100%", border: "0px", fontFamily: "sans-serif", fontSize: "15px", color: (formType === "view" || contentItem.edit === false) ? "#ABABAB" : "black", background: "white"}}
          defaultValue={(fieldValue[contentItem.name] !== undefined && fieldValue[contentItem.name] !== null) ? props.parseDate(fieldValue[contentItem.name]) : ""}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
        >
        </input>
        // <TextField
        //   onKeyPress={onKeyPressDateTime}
        //   type="date",
        //   name={contentItem.name}
        //   onBlur={handleDateTimeChange}
        //   style={{ width: "100%" }}
        //   // value={d}
        //   defaultValue={(fieldValue[contentItem.name] !== undefined && fieldValue[contentItem.name] !== null) ? props.parseDate(fieldValue[contentItem.name]) : ""}
        //   disabled={(formType === "view" || contentItem.edit === false) ? true : false}
        //   InputLabelProps={{
        //     shrink: true,
        //   }}
        // />
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
          // console.log("F SEL", contentItem.name, fieldValue[contentItem.name])
          if (fieldValue[contentItem.name] === enumOptions[contentItem.name][i].value) {
            // console.log("F SEL", contentItem.name, fieldValue[contentItem.name])
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
          // defaultValue = {(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name]: ""}
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
          handleTextChange(event)
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
  function onKeyPressModalEnterPin(event) {
    let code = event.charCode
    if (code === 13) {
      buttonClick("SignInstructionSaveButton", null)
    }
  }
  function onKeyPressModalCancelInstruction(event) {
    let code = event.charCode
    if (code === 13) {
      buttonClick("CancelInstructionSaveButton", null)
    }
  }

  // custom allerts
  function swAlert(text, icon) {
    return (
      swal({
        text: text,
        icon: icon,
        buttons: { ok: "Ок" }
      })
    )
  }
  function getGridFormEnumLabel(name, value) {
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
  // Create grid form components
  function getGridFormItems(value, type, dataItem, name) {
    if (type === "Enum") {
      if (value === null || value === "" || value === undefined) {
        return "-"
      }
      else {
        return getGridFormEnumLabel(name, value)
      }
    }
    else if (type === "Bool") {
      return (
        <Checkbox
          style={{ maxWidth: 20, height: 15, color: value === false ? "red" : "green" }}
          checked={(value === false || value === null || value === undefined) ? false : true}
        />
      )
    }
    else if (type === "DateTime") {
      if (value === null || value === "" || value === undefined) {
        return "-"
      }
      else {
        return props.parseFullDateTime(value, " ")
        // return moment(value).format('YYYY-MM-DD HH:MM')
      }
    }
    else if (type === "Text") {
      if (name === "instructionStatus") {
        return getInstructionStatus(dataItem)
      }
      else {
        if (value === null || value === "" || value === undefined) {
          return "-"
        }
        else {
          return (<td>{value}</td>)
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
        return (<td>{value}</td>)
      }
    }

  }
  function getInstructionStatus(dataItem) {
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
            // if(Data[i][key] !== null){
            let contentType = getContentType(key)
            if (contentType === "Text") {
              if (Data[i][key] !== null) {
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
              else {
                match = false
                break
              }
            }
            else if (contentType === "Int" || contentType === "Float") {
              if (Data[i][key] !== null) {
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
              else {
                match = false
                break
              }
            }
            else if (contentType === "Enum") {
              if (key === "depositor") {
                // console.log("DEPOSITOR", fields[key], Data[i]["depositor2"])
                if (fields[key] === Data[i][key] || fields[key] === Data[i]["depositor2"]) {
                  match = true
                }
                else {
                  match = false
                  break
                }
              }
              else if (key === "account") {
                if (fields[key] === Data[i]["accFrom"] || fields[key] === Data[i]["accTo"]) {
                  match = true
                }
                else {
                  match = false
                  break
                }
              }
              else {
                if (fields[key] === Data[i][key]) {
                  match = true
                }
                else {
                  match = false
                  break
                }
              }

            }
            else if (contentType === "DateTime") {
              if (Data[i][key] !== null) {
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
              else {
                match = false
                break
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
            // }
            // else{
            //   match = false
            //   break
            // }
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
  function getBackgroundColor(signed, urgent) {
    if (signed !== undefined) {
      if (signed === true) {
        return "white"
      }
      else {
        if (urgent === true) {
          return "#EFB2B2"
        }
        else {
          return "#FCEAD3"
        }
      }
    }
    else return "white"
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
        <Grid item xs={isSearchForm === true ? 12 : 9}>
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
    // if (type === "DateTime" || type === "Bool") {
    //   sortOrder = sortOrder * -1
    // }
    // console.log("SORT", property, sortOrder, type)
    if (type === "DateTime") {
      sortOrder = sortOrder * -1
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
    else if (type === "Int" || type === "Text" || type === "Float") {
      if (property === "instructionStatus") {
        return function (a, b) {
          // console.log("A", a)
          let statusA = getInstructionStatus(a)
          let statusB = getInstructionStatus(b)
          var result = (statusA < statusB) ? -1 : (statusA > statusB) ? 1 : 0
          return result * sortOrder
        }
      }
      else {
        return function (a, b) {
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
          return result * -1 * sortOrder
        }
      }

    }
    else if (type === "Bool" || type === "BoolCustom") {
      sortOrder = sortOrder * -1
      return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
        return result * sortOrder
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
    setPage(1)
    let fetchFrom = 0
    let fetchTo = size - 1
    setFilteredDocList(sortedDocList)
    fetchBySize(fetchFrom, fetchTo, sortedDocList)
  }
  function getSecType(id) {
    let type = 1
    for (let i = 0; i < gridFormEnumData.length; i++) {
      if (gridFormEnumData[i] !== null) {
        if (gridFormEnumData[i].name === "security") {
          for (let d = 0; d < gridFormEnumData[i].data.length; d++) {
            if (gridFormEnumData[i].data[d].id === id) {
              type = gridFormEnumData[i].data[d].type
            }
          }
        }
      }
    }
    for (let i = 0; i < gridFormEnumData.length; i++) {
      if (gridFormEnumData[i] !== null) {
        if (gridFormEnumData[i].name === "securityTypes") {
          for (let d = 0; d < gridFormEnumData[i].data.length; d++) {
            if (gridFormEnumData[i].data[d].id === type) {
              return gridFormEnumData[i].data[d].label
            }
          }
        }
      }
    }
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
  function previewInstruction(instr) {
    // console.log("SELECTED INSTR", instr)
    setSelectedInstruction(instr)
  }
  try {
    return (
      <Grid>
        {isSearchForm !== null &&
          isSearchForm === true
          ?
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
        <Grid container direction="row" justify="flex-start" alignItems="flex-start">
          {buttons.map((button, index) => {
            return createButton(button, index)
          })}
          {taskType !== "showInstructionsGIKSearchForm" &&
            taskType !== "showInstructionsGIKViewForm" &&
            taskType !== "showInstructionsGIKTypeSelectingForm" &&
            taskType !== "showInstructionsGIKCreationForm" &&

            <>
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
            </>
          }
        </Grid>
        {isSearchForm === true &&
          <ReplayIcon style={{ paddingTop: 3, cursor: "pointer" }} onClick={() => buttonClick("updateDocList")} />
        }
        {/* Create grid table with data from doclist */}
        {docList !== null &&
          <Grid container direction="row" justify="flex-start" spacing={0}>
            <Grid item sm={"auto"}>
              <Paper>
                <div style={{ height: "500px", overflow: "auto" }}>
                  <table size="small" class="main-table-style" id={gridTableId}>
                    <thead class="thead-style" style={{ position: "sticky", top: 0 }}>
                      {/* 1st Row Sections Labels */}
                      <tr>
                        <td class="td-head-first-child" colSpan="1" onContextMenu={(ev) => handleContextMenu(ev)}></td>
                        {gridForm.sections.map((section, index) => {
                          let showSection = checkToShowSection(section)
                          if (showSection === true) {
                            let lastSection = checkSectionOnLastChild(index)
                            return (
                              <td
                                class={lastSection === true ? "td-head-last-child" : "td-head-style"}
                                colSpan={calculateColSpan(section.contents)}
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
                          style={{ "minWidth": "65px" }}
                          onContextMenu={(ev) => handleContextMenu(ev)}
                        >
                          Действие
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
                      {Object.keys(docList).length !== 0 &&
                        docList.map(dataItem => (
                          <tr style={{ "height": 30, "backgroundColor": getBackgroundColor(dataItem.opened, dataItem.urgent), cursor: "pointer" }}>
                            <td style={{ "width": 34, "border-bottom": "1px solid grey" }}>
                              {gridFormButtons !== "null" &&
                                gridFormButtons.map(button =>
                                  <Button
                                    key={button.name}
                                    name={button.name}
                                    variant="outlined"
                                    value={button.name}
                                    onClick={() => buttonClick(button.name, dataItem)}
                                    style={{
                                      margin: 1,
                                      height: 24,
                                      fontSize: 10,
                                      maxWidth: 32,
                                      backgroundColor: button.backgroundColor,
                                      borderColor: "darkgreen",
                                      color: "darkgreen"
                                    }}
                                  >{button.label}
                                  </Button>
                                )}
                            </td>
                            {gridForm.sections.map(section => {
                              return (
                                section.contents.map(contentItem => {
                                  if (contentItem.show === true) {
                                    return (
                                      <td class="td-body-style" style={{ color: (selectedInstruction !== null ? (selectedInstruction.id === dataItem.id ? "blue" : "black") : "black") }} onClick={() => previewInstruction(dataItem)}>
                                        {getGridFormItems(dataItem[contentItem.name], contentItem.type, dataItem, contentItem.name)}
                                      </td>
                                    )
                                  }
                                })
                              )
                            })}
                          </tr>
                        )
                        )}
                    </tbody>
                  </table>
                </div>
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
                    <td style={{ paddingLeft: "20px" }}>
                      <div style={{ minWidth: 90, color: "black" }}>Кол-во записей</div>
                    </td>
                    <td style={{ paddingLeft: "3px" }}>
                      <FormControl
                        variant="outlined"
                        style={{ minWidth: 30 }}
                      >
                        <GridSelect
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
                          <MenuItem value={500}>1000</MenuItem>
                        </GridSelect>
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
                    <td style={{ paddingLeft: "30px" }}>
                      <div style={{ minWidth: 90, color: "black" }}>Общее кол-во {filteredDocList !== null ? filteredDocList.length : 0}</div>
                    </td>
                  </tr>
                </tfoot>
              </Paper>
              {selectedInstruction !== null &&
                <table size="small" style={{ width: "100%" }}>
                  {selectedInstruction.depositor !== null &&
                    <tr>
                      <td style={{ fontSize: 11 }}>Депонент(Со счёта):</td>
                      <td style={{ fontSize: 11, border: "1px solid black" }}>{getGridFormEnumLabel("depositor", selectedInstruction.depositor)}</td>
                    </tr>
                  }
                  {selectedInstruction.accFrom !== null &&
                    <tr>
                      <td style={{ fontSize: 11 }}>Со счёта:</td>
                      <td style={{ fontSize: 11, border: "1px solid black" }}>{getGridFormEnumLabel("accFrom", selectedInstruction.accFrom)}</td>
                    </tr>
                  }
                  {selectedInstruction.depositor2 !== null &&
                    <tr>
                      <td style={{ fontSize: 11 }}>Депонент(На счёт):</td>
                      <td style={{ fontSize: 11, border: "1px solid black" }}>{getGridFormEnumLabel("depositor2", selectedInstruction.depositor2)}</td>
                    </tr>
                  }
                  {selectedInstruction.accTo !== null &&
                    <tr>
                      <td style={{ fontSize: 11 }}>На счёт:</td>
                      <td style={{ fontSize: 11, border: "1px solid black" }}>{getGridFormEnumLabel("accTo", selectedInstruction.accTo)}</td>
                    </tr>
                  }
                  {selectedInstruction.security !== null &&
                    <tr>
                      <td style={{ fontSize: 11 }}>Ценная бумага:</td>
                      <td style={{ fontSize: 11, border: "1px solid black" }}>{getGridFormEnumLabel("security", selectedInstruction.security) + " " + getSecType(selectedInstruction.security)}</td>
                    </tr>

                  }
                  {selectedInstruction.currency !== null &&
                    <tr>
                      <td style={{ fontSize: 11 }}>Валюта:</td>
                      <td style={{ fontSize: 11, border: "1px solid black" }}>{getGridFormEnumLabel("currency", selectedInstruction.currency)}</td>
                    </tr>

                  }
                  {selectedInstruction.security !== null &&
                    <tr>
                      <td style={{ fontSize: 11 }}>Эмитент:</td>
                      <td style={{ fontSize: 11, border: "1px solid black" }}>{getGridFormEnumLabel("issuer", selectedInstruction.issuer)}</td>
                    </tr>
                  }
                  {selectedInstruction.tradingSystem !== null &&
                    <tr>
                      <td style={{ fontSize: 11 }}>Торговая система:</td>
                      <td style={{ fontSize: 11, border: "1px solid black" }}>{getGridFormEnumLabel("tradingSystem", selectedInstruction.tradingSystem)}</td>
                    </tr>
                  }
                  {selectedInstruction.corrDepository !== null &&
                    <tr>
                      <td style={{ fontSize: 11 }}>Корр. депозитарий:</td>
                      <td style={{ fontSize: 11, border: "1px solid black" }}>{getGridFormEnumLabel("corrDepository", selectedInstruction.corrDepository)}</td>
                    </tr>
                  }
                  {(selectedInstruction.ownerName !== null || selectedInstruction.ownerDocument !== null || selectedInstruction.ownerAddress !== null) &&
                    <tr>
                      <td style={{ fontSize: 11 }}>Данные о владельце:</td>
                      <td style={{ fontSize: 11, border: "1px solid black" }}>{selectedInstruction.ownerName + " " + selectedInstruction.ownerDocument + " " + selectedInstruction.ownerAddress}</td>
                    </tr>
                  }
                  {selectedInstruction.quantity !== null &&
                    <tr>
                      <td style={{ fontSize: 11 }}>Количество:</td>
                      <td style={{ fontSize: 11, border: "1px solid black" }}>{selectedInstruction.quantity}</td>
                    </tr>
                  }
                  {selectedInstruction.basis !== null &&
                    <tr>
                      <td style={{ fontSize: 11 }}>Основание:</td>
                      <td style={{ fontSize: 11, border: "1px solid black" }}>{selectedInstruction.basis}</td>
                    </tr>
                  }
                </table>
              }
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
          open={showModalCancelInstruction}
          onClose={handleCloseModalCancelInstruction}
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
              onChange={handleTextChange}
              onKeyPress={onKeyPressModalCancelInstruction}
              style={{ width: "100%" }}
            />
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