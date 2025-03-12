import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table"; // Material ui table for usual form
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import GridSelect from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@mui/material/Menu';
// Accordion
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// Icons
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ReplayIcon from '@material-ui/icons/Replay';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
// Form components
import TextField from '@material-ui/core/TextField';
import Select from 'react-select'; // https://react-select.com/home
import Checkbox from '@material-ui/core/Checkbox';
// Libraries
import swal from 'sweetalert'; // https://sweetalert.js.org/guides/
import hotkeys from 'hotkeys-js'; // https://github.com/jaywcjlove/hotkeys
import tableToExcel from "@linways/table-to-excel"; // https://github.com/linways/table-to-excel
// Custom components
import "../../components/GridForm/GridFormCSS.css"
var moment = require('moment');
var generator = require('generate-password');

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
        })
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
const useStyles = makeStyles(theme => ({
}))
export default (props) => {
  // This.state
  const [userProfile] = useState(props.userProfile)
  const [session_id] = useState(props.userTask.session_id)
  const [process_id] = useState(props.userTask.process_id)
  const [taskID] = useState(props.userTask.taskID)
  const [Form, setForm] = useState(props.userTask.Form)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [docId, setDocId] = useState(props.userTask.docId)
  const [formType] = useState(props.userTask.formType)
  const [docList, setDocList] = useState(null)
  const [filteredDocList, setFilteredDocList] = useState(null)
  const [initialDocList, setInitialDocList] = useState(null)
  const [gridForm, setGridForm] = useState(props.userTask.gridForm)
  const [gridFormButtons] = useState(props.userTask.gridFormButtons)
  const [enumData] = useState(props.userTask.enumData)
  const [enumOptions, setEnumOptions] = useState({})
  const [gridFormEnumData] = useState(props.userTask.gridFormEnumData)
  const [fieldValue, setFieldValue] = useState({})
  const [selectedOptions, setSelectedOptions] = useState([])
  const [buttons] = useState(props.userTask.buttons)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState("")
  const [sectionColor] = useState("#B2E0C9")
  const [updateState, setUpdateState] = useState(false)
  const [taskType] = useState(props.userTask.taskType)
  const [isSearchForm, setIsSearchForm] = useState(null)
  const [accordionExpanded, setAccordionExpanded] = useState(false)
  const [sortedColumn, setSortedColumn] = useState("null")
  const [sortedColumnOrder, setSortedColumnOrder] = useState(1)
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = useState(null)
  const openMenu = Boolean(anchorEl)
  const [gridTableId] = useState(getUUID())
  const [gridFieldValue, setGridFieldValue] = useState({})

  // Set data from props to state of component
  useEffect(() => {
    console.log("MAINFORM PROPS", props.userTask, props.userProfile)
    if (props.userTask.docList !== "null" && props.userTask.docList !== null) {
      try {
        let parsedData = JSON.parse(props.userTask.docList)
        console.log("DOCL", parsedData)
        let s = parseInt(props.userTask.size)
        let p = parseInt(props.userTask.page)
        setSize(s)
        setPage(p)
        setFilteredDocList(parsedData)
        setIsSearchForm(true)
        setInitialDocList(parsedData)
        let sortedDocList = parsedData.sort(dynamicSort("id", -1, "Int"))
        let newSortedDocList = []
        if (props.userTask.taskType === "showStockSecuritySearchForm" || props.userTask.taskType === "showStockCurrencySearchForm") {
          if (userProfile.userRole !== "1") {
            for (let sd = 0; sd < sortedDocList.length; sd++) {
              if (parseInt(userProfile.partner) === sortedDocList[sd].partner) {
                newSortedDocList.push(sortedDocList[sd])
              }
            }
            sortedDocList = newSortedDocList
          }
        }
        else if (props.userTask.taskType === "showSecuritiesEditForm") {
          setIsSearchForm(false)
        }
        if (props.userTask.selectedDoc !== "null" && props.userTask.taskType !== "showSecuritiesEditForm") {
          let parsedSelectedDoc = JSON.parse(props.userTask.selectedDoc)
          console.log("SHDOC", parsedSelectedDoc)
          filterDocList(0, s - 1, sortedDocList, parsedSelectedDoc)
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
      let fields = {}
      // let Form = props.userTask.Form
      for (let s = 0; s < Form.sections.length; s++) {
        for (let c = 0; c < Form.sections[s].contents.length; c++) {
          let fieldName = Form.sections[s].contents[c].name
          fields[fieldName] = parsedSelectedDoc[fieldName]
        }
      }
      console.log("SDOC", parsedSelectedDoc)
      console.log("FIELDVAL", fields)
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
  hotkeys('ctrl+b, enter', function (event, handler) {
    if (handler.key === "ctrl+b") {
      setAccordionExpanded(!accordionExpanded)
    }
  })
  const handleCheckboxChange = (event) => {
    console.log("CHBX", event.target.name, event.target.checked)
    if (event.target.name === "is_resident") {
      console.log("IS_RES")
      if (taskType === "showPartnersCreatingForm" || taskType === "showPartnersEditForm"
        || taskType === "showIssuersCreatingForm" || taskType === "showIssuersEditForm") {
        // let newFields = fieldValue
        fieldValue["country"] = 1
        fieldValue["is_resident"] = event.target.checked

        var updateSelectedOptions = selectedOptions.slice()
        let noSuchOption = true
        let countryOption = {
          name: "country",
          value: 1,
          label: "Кыргызская Республика"
        }
        for (let l = 0; l < updateSelectedOptions.length; l++) {
          if (updateSelectedOptions[l].name === "country") {
            updateSelectedOptions[l] = countryOption
            setSelectedOptions(updateSelectedOptions)
            break
          }
          else {
            noSuchOption = true
          }
        }
        if (noSuchOption === true) {
          updateSelectedOptions.push(countryOption)
          setSelectedOptions(updateSelectedOptions)
        }
        if (taskType === "showIssuersCreatingForm" || taskType === "showIssuersEditForm") {
          fieldValue["is_not_resident"] = false
        }
        console.log("FVAL", fieldValue)
        setFieldValue(fieldValue)
      }
    }
    if (event.target.name === "is_not_resident") {
      console.log("NOT_RES")
      fieldValue["is_resident"] = false
      fieldValue["is_not_resident"] = event.target.checked
      fieldValue["country"] = null
      setFieldValue(fieldValue)
      console.log("FVAL", fieldValue)
    }
    else {
      setFieldValue({ ...fieldValue, [event.target.name]: event.target.checked })
    }
    setUpdateState(getUUID())
  }
  const handleBoolCustomChange = (event) => {
    console.log("BoolCustom", fieldValue)
    setFieldValue({ ...fieldValue, [event.target.name]: event.target.checked });
  }
  // Integer input handler
  const handleIntChange = (event) => {
    console.log("INT", event.target.name, event.target.value)
    let stringNum = event.target.value.toString().replace(/ /g, '')
    let int = parseInt(stringNum)
    setFieldValue({ ...fieldValue, [event.target.name]: int })
  }
  // Float input handler
  const handleFloatChange = (event) => {
    // console.log("FLOAT CHANGE", event.target.name, event.target.value)
    setFieldValue({ ...fieldValue, [event.target.name]: event.target.value })
  }
  // Text input handler
  function handleTextChange(event) {
    // console.log("EVENT", event.target.name, event.target.value)
    fieldValue[event.target.name] = event.target.value
    setFieldValue(fieldValue)
    console.log("FIELDVALUE", fieldValue)
  }
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
    // if (option.name === "issuer" && (taskType === "showSecuritiesCreatingForm" || taskType === "showSecuritiesEditForm")) {
    //   // выбран Эмитент нужно найти ргистратора и отобразить
    //   for (let j = 0; j < enumData.length; j++) {
    //     if (enumData[j] !== null) {
    //       if (enumData[j].name === "issuer") {
    //         for (let h = 0; h < enumData[j].data.length; h++) {
    //           if (enumData[j].data[h].id === option.value) {
    //             // Find registrar of issuer
    //             let registrarId = enumData[j].data[h].registrar

    //             for (let e = 0; e < enumData.length; e++) {
    //               if (enumData[e] !== null) {
    //                 if (enumData[e].name === "registrar") {
    //                   for (let r = 0; r < enumData[e].data.length; r++) {
    //                     if (enumData[e].data[r].id === registrarId) {
    //                       // Set registrar option 

    //                       fieldValue["registrar"] = registrarId
    //                       // console.log("ISSUER SEC", fieldValue)
    //                       let registrarOption = {
    //                         value: enumData[e].data[r].id,
    //                         name: "registrar",
    //                         label: enumData[e].data[r].label
    //                       }
    //                       let noRegistrarOption = true
    //                       for (let y = 0; y < updateSelectedOptions.length; y++) {
    //                         if (updateSelectedOptions[y].name === "registrar") {
    //                           updateSelectedOptions[y] = registrarOption
    //                           noRegistrarOption = false
    //                           setSelectedOptions(updateSelectedOptions)
    //                           break
    //                         }
    //                         else {
    //                           noRegistrarOption = true
    //                         }
    //                       }
    //                       if (noRegistrarOption === true) {
    //                         updateSelectedOptions.push(registrarOption)
    //                         setSelectedOptions(updateSelectedOptions)
    //                       }
    //                     }
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }

    //   }
    // }
    if (option.name === "payer_type" && (taskType === "showPaymentsForCDServicesCreatingForm" ||
      taskType === "showPaymentsForCDServicesViewForm" || taskType === "showPaymentsForCDServicesSearchForm")) {
      // console.log("SEL", option.name, option.value)
      for (let s = 0; s < Form.sections.length; s++) {
        for (let c = 0; c < Form.sections[s].contents.length; c++) {
          if (Form.sections[s].contents[c].name === "depositor") {
            if (option.value === 1) { // block registrat and issuer
              Form.sections[s].contents[c].show = true
              Form.sections[s].contents[c].edit = true
              fieldValue["issuer"] = null
              fieldValue["registrar"] = null
              for (let i = 0; i < updateSelectedOptions.length; i++) {
                if (updateSelectedOptions[i].name === "issuer") {
                  updateSelectedOptions[i] = {
                    "value": "",
                    "label": "Пусто",
                    "name": "issuer"
                  }
                }
                if (updateSelectedOptions[i].name === "registrar") {
                  updateSelectedOptions[i] = {
                    "value": "",
                    "label": "Пусто",
                    "name": "registrar"
                  }
                }
                setSelectedOptions(updateSelectedOptions)
              }
            }
            else {
              Form.sections[s].contents[c].show = false
              Form.sections[s].contents[c].edit = false
            }
          }
          if (Form.sections[s].contents[c].name === "issuer") {
            if (option.value === 2) { // block depositor and registrar
              Form.sections[s].contents[c].show = true
              Form.sections[s].contents[c].edit = true
              fieldValue["depositor"] = null
              fieldValue["registrar"] = null
              for (let i = 0; i < updateSelectedOptions.length; i++) {
                if (updateSelectedOptions[i].name === "depositor") {
                  updateSelectedOptions[i] = {
                    "value": "",
                    "label": "Пусто",
                    "name": "depositor"
                  }
                }
                if (updateSelectedOptions[i].name === "registrar") {
                  updateSelectedOptions[i] = {
                    "value": "",
                    "label": "Пусто",
                    "name": "registrar"
                  }

                }
                setSelectedOptions(updateSelectedOptions)
              }
            }
            else {
              Form.sections[s].contents[c].show = false
              Form.sections[s].contents[c].edit = false
            }
          }
          if (Form.sections[s].contents[c].name === "registrar") {
            if (option.value === 3) { // block depositor and issuer
              Form.sections[s].contents[c].show = true
              Form.sections[s].contents[c].edit = true
              fieldValue["depositor"] = null
              fieldValue["issuer"] = null
              for (let i = 0; i < updateSelectedOptions.length; i++) {
                if (updateSelectedOptions[i].name === "depositor") {
                  updateSelectedOptions[i] = {
                    "value": "",
                    "label": "Пусто",
                    "name": "depositor"
                  }
                }
                if (updateSelectedOptions[i].name === "issuer") {
                  updateSelectedOptions[i] = {
                    "value": "",
                    "label": "Пусто",
                    "name": "issuer"
                  }
                }
                setSelectedOptions(updateSelectedOptions)
              }
            }
            else {
              Form.sections[s].contents[c].show = false
              Form.sections[s].contents[c].edit = false
            }
          }
        }
      }
      setForm(Form)


    }
    else if (option.name === "recipient_type" && (
      taskType === "showTransitChargeForCDServicesSearchForm" ||
      taskType === "showTransitChargeForCDServicesCreatingForm" ||
      taskType === "showTransitChargeForCDServicesEditForm" ||
      taskType === "showTransitPaymentsForCDServicesSearchForm" ||
      taskType === "showTransitPaymentsForCDServicesCreatingForm" ||
      taskType === "showTransitPaymentsForCDServicesEditForm")) {
      // console.log("RECIPIENT", option.name, option.value, fieldValue)
      for (let s = 0; s < Form.sections.length; s++) {
        for (let c = 0; c < Form.sections[s].contents.length; c++) {
          if (Form.sections[s].contents[c].name === "registrar") {
            if (option.value === 1) {
              Form.sections[s].contents[c].show = true
              Form.sections[s].contents[c].edit = true
              fieldValue["corr_depository"] = null
              for (let i = 0; i < updateSelectedOptions.length; i++) {
                if (updateSelectedOptions[i].name === "corr_depository") {
                  updateSelectedOptions[i] = {
                    "value": "",
                    "label": "Пусто",
                    "name": "corr_depository"
                  }
                  setSelectedOptions(updateSelectedOptions)
                  break
                }
              }
            }
            else {
              Form.sections[s].contents[c].show = false
              Form.sections[s].contents[c].edit = false
            }
          }
          if (Form.sections[s].contents[c].name === "corr_depository") {
            if (option.value === 2) {
              Form.sections[s].contents[c].show = true
              Form.sections[s].contents[c].edit = true
              fieldValue["registrar"] = null
              for (let i = 0; i < updateSelectedOptions.length; i++) {
                if (updateSelectedOptions[i].name === "registrar") {
                  updateSelectedOptions[i] = {
                    "value": "",
                    "label": "Пусто",
                    "name": "registrar"
                  }
                  setSelectedOptions(updateSelectedOptions)
                  break
                }
              }
            }
            else {
              Form.sections[s].contents[c].show = false
              Form.sections[s].contents[c].edit = false
            }
          }
        }
      }
      setForm(Form)
      // console.log("NEW ENUMS")
    }
    // show partner ID & depositor_code when depositor has been changed
    else if (option.name === "depositor") {
      if (taskType === "showTradesEditForm" || taskType === "showTradesCreatingForm") {
        for (let e = 0; e < enumData.length; e++) {
          if (enumData[e].name === "depositor") {
            for (let d = 0; d < enumData[e].data.length; d++) {
              if (enumData[e].data[d].id === option.value) {
                setFieldValue({ ...fieldValue, ["partner"]: enumData[e].data[d].partner, ["depositor_code"]: enumData[e].data[d].partner })
                break
              }
            }
          }
        }
      }
    }
    if (option.name === "partner" && (taskType === "showStockSecurityCreatingForm" || taskType === "showStockCurrencyCreatingForm")) {
      // партнер выбран нужно отфильтровать поле "Счет" и отобразить счета только выбранного контрагента
      let newOptions = []
      let partner = option.value
      // console.log("PARTNER", partner)
      for (let i = 0; i < enumData.length; i++) {
        if (enumData[i].name === "account") {
          for (let d = 0; d < enumData[i].data.length; d++) {
            if (enumData[i].data[d].partner === partner) { // compare depositor partner and account partner
              newOptions.push({
                "value": enumData[i].data[d].id,
                "label": enumData[i].data[d].label,
                "name": enumData[i].name
              })
            }
          }
        }
      }
      // console.log("NEW ENUMS", newOptions)
      enumOptions["account"] = newOptions
      setEnumOptions(enumOptions)
    }
    console.log("F VAL", fieldValue)
    // setFieldValue(fieldValue)
  }
  function handleDateTimeChange(event) {
    // // console.log("EVENT", event.target.name, event.target.value)
    // let fullDate = props.parseDate(event.target.value)
    // var hours = new Date().getHours()
    // var minutes = new Date().getMinutes()
    // var seconds = new Date().getSeconds()
    // var convertedDate = fullDate + " " + hours + ":" + minutes + ":" + seconds // + ".123456"
    // fieldValue[event.target.name] = convertedDate
    let fullDateTime = moment(event.target.value).format('YYYY-MM-DDTHH:mm:ss')
    fieldValue[event.target.name] = fullDateTime
    setFieldValue(fieldValue)
    // console.log("DATE CHANGE", event.target.value)
  }
  function handleExpandAccordion() {
    setAccordionExpanded(!accordionExpanded)
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
    console.log("FILTER", fields)
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
                  console.log("ERR TEXT SEARCH", er, Data[i][key])
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
                  // console.log("ENUMS", key, fields[key], Data[i][key])
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
                if (fields[key] === Data[i][key]) {
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
    // console.log("fetchFrom", "fetchTo")
    let newDocList = []
    for (let i = fetchFrom; i <= fetchTo; i++) {
      if (Data[i] !== undefined) {
        newDocList.push(Data[i])
      }
    }
    setFilteredDocList(Data)
    setDocList(newDocList)
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
  // random UUID generator
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
  // Collect data to save doc
  function getFieldValuesSaveDocument() {
    let docToSave = {}
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let fieldName = Form.sections[s].contents[c].name
        if (Form.sections[s].contents[c].type === "Bool" && fieldValue[fieldName] === undefined) {
          docToSave[fieldName] = false
        }
        else if (Form.sections[s].contents[c].type === "BoolCustom") {
          if (fieldValue[fieldName] === true || fieldValue[fieldName] === Form.sections[s].contents[c].valueTrue) {
            docToSave[fieldName] = Form.sections[s].contents[c].valueTrue
          }
          else {
            docToSave[fieldName] = Form.sections[s].contents[c].valueFalse
          }
        }
        else {
          docToSave[fieldName] = fieldValue[fieldName]
        }
      }
    }
    return docToSave
  }
  // Collect data to update doc
  function getFieldValuesUpdateDocument() {
    let docToUpdate = selectedDoc
    // docToUpdate["created_at"] = selectedDoc.created_at
    // docToUpdate["id"] = parseInt(docId)
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let fieldName = Form.sections[s].contents[c].name
        if (Form.sections[s].contents[c].type === "Bool" && (fieldValue[fieldName] === undefined || fieldValue[fieldName] === null)) {
          docToUpdate[fieldName] = false
        }
        else if (Form.sections[s].contents[c].type === "BoolCustom") {
          // console.log("BOOLCUST", fieldName, fieldValue[fieldName])
          if (fieldValue[fieldName] === true || fieldValue[fieldName] === Form.sections[s].contents[c].valueTrue) {
            docToUpdate[fieldName] = Form.sections[s].contents[c].valueTrue
          }
          else {
            docToUpdate[fieldName] = Form.sections[s].contents[c].valueFalse
          }
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
            props.callErrorToast("Внимание заполните поле \"" + Form.sections[s].contents[c].label + "\"", "warning")
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
  function buttonClick(buttonName, item) {
    if (buttonName === "findDocument") {
      if (accordionExpanded === false) {
        setAccordionExpanded(true)
      }
      else {
        filterDocList(0, size - 1, initialDocList, fieldValue)
      }
    }
    else if (buttonName === "openDocument") {
      // console.log("ITEM", item)
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          selectedDoc: { value: JSON.stringify(item) },
          userAction: { value: "openDocument" },
          docId: { value: item.id },
          searchDoc: { value: JSON.stringify(fieldValue) }
        }
      }
      console.log("button openDocument: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "openStockDocument") {
      // console.log("ITEM", item)
      item.account = item.account_id
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          selectedDoc: { value: JSON.stringify(item) },
          userAction: { value: "openDocument" },
          docId: { value: item.id },
          searchDoc: { value: JSON.stringify(fieldValue) }
        }
      }
      console.log("button openStockDocument: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }

    else if (buttonName === "editDocument") {
      // console.log("ITEM", item)
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "editDocument" }
        }
      }
      console.log("button editDocument: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "openReferenceDocument") {
      // console.log("ITEM", item)
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          apiName: { value: item.controller },
          userAction: { value: "openReferenceDocument" },
          searchFormDefId: { value: item.search_form },
          gridFormDefId: { value: item.grid_form },
          creatingFormDefId: { value: item.creating_form },
          editFormDefId: { value: item.edit_form },
          searchDocMain: { value: JSON.stringify(fieldValue) }
        }
      }
      console.log("button openReferenceDocument: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "updateDocument") {
      let updateBody = getFieldValuesUpdateDocument()
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "updateDocument" },
          document: { value: JSON.stringify(updateBody) }
        }
      }
      console.log("updateDocument:", commandJson)
      let checkResult = checkForRequieredFields()
      if (checkResult === true) {
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (buttonName === "createDocument") {
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "createDocument" },
          searchDoc: { value: JSON.stringify(fieldValue) }
        }
      }
      console.log("createDocument:", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "saveDocument") {
      let docToSave = getFieldValuesSaveDocument()
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "saveDocument" },
          document: { value: JSON.stringify(docToSave) }
        }
      }
      console.log("saveDocument:", commandJson)
      let checkResult = checkForRequieredFields()
      if (checkResult === true) {
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (buttonName === "saveSecurity") {
      let checkForCode = null
      let docToSave = getFieldValuesSaveDocument()
      for (let i = 0; i < enumData.length; i++) {
        if (enumData[i].name === "securities") {
          for (let d = 0; d < enumData[i].data.length; d++) {
            if (enumData[i].data[d].code === fieldValue["code"]) {
              checkForCode = false
              swAllert("ЦБ с таким кодом уже существует", "warning")
              break
            }
            if (d === enumData[i].data.length - 1 && enumData[i].data[d].isin !== fieldValue["code"]) {
              checkForCode = true
            }
          }
        }
      }
      let checkResult = checkForRequieredFields()
      console.log("CODE", checkForCode)
      if (checkForCode !== null && checkForCode !== false) {
        let commandJson =
        {
          commandType: "completeTask",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          userId: userProfile.userId,
          userRole: userProfile.userRole,
          variables: {
            userAction: { value: "saveDocument" },
            document: { value: JSON.stringify(docToSave) }
          }
        }
        console.log("saveSecurity:", commandJson)
        if (checkResult === true) {
          props.sendFieldValues(commandJson)
          props.clearTabData(process_id)
        }
      }
    }
    else if (buttonName === "blockSecurity") {
      if (selectedDoc.blocked !== true) {
        let commandJson =
        {
          commandType: "completeTask",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          userId: userProfile.userId,
          userRole: userProfile.userRole,
          variables: {
            userAction: { value: "blockSecurity" },
            security_id: { value: selectedDoc.id }
          }
        }
        swal({
          text: "ВНИМАНИЕ! Вы действительно Заблокировать выпуск ЦБ?",
          icon: "warning",
          buttons: { yes: "Да", cancel: "Отмена" },
        })
          .then((click) => {
            if (click === "yes") {
              console.log("blockSecurity:", commandJson)
              props.sendFieldValues(commandJson)
              props.clearTabData(process_id)
            }
          })
      }
      else {
        swAllert("ЦБ уже заблокирована!", "warning")
      }
    }
    else if (buttonName === "unblockSecurity") {
      if (selectedDoc.blocked === true) {
        let commandJson =
        {
          commandType: "completeTask",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          userId: userProfile.userId,
          userRole: userProfile.userRole,
          variables: {
            userAction: { value: "unblockSecurity" },
            security_id: { value: selectedDoc.id }
          }
        }
        swal({
          text: "ВНИМАНИЕ! Вы действительно разблокировать выпуск ЦБ?",
          icon: "warning",
          buttons: { yes: "Да", cancel: "Отмена" },
        })
          .then((click) => {
            if (click === "yes") {
              console.log("unblockSecurity:", commandJson)
              props.sendFieldValues(commandJson)
              props.clearTabData(process_id)
            }
          })
      }
      else {
        swAllert("ЦБ не была блокирована ранее!", "warning")
      }
    }
    else if (buttonName === "blockIssuerSecurities") {
      if (selectedDoc.blocked !== true) {
        let commandJson =
        {
          commandType: "completeTask",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          userId: userProfile.userId,
          userRole: userProfile.userRole,
          variables: {
            userAction: { value: "blockIssuerSecurities" },
            issuer_id: { value: selectedDoc.id }
          }
        }
        swal({
          text: "ВНИМАНИЕ! Вы действительно Заблокировать ЦБ эмитента?",
          icon: "warning",
          buttons: { yes: "Да", cancel: "Отмена" },
        })
          .then((click) => {
            if (click === "yes") {
              console.log("blockIssuerSecurities:", commandJson)
              props.sendFieldValues(commandJson)
              props.clearTabData(process_id)
            }
          })
      }
      else {
        swAllert("ЦБ эмитента уже заблокированы!", "warning")
      }
    }
    else if (buttonName === "unblockIssuerSecurities") {
      if (selectedDoc.blocked === true) {
        let commandJson =
        {
          commandType: "completeTask",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          userId: userProfile.userId,
          userRole: userProfile.userRole,
          variables: {
            userAction: { value: "unblockIssuerSecurities" },
            issuer_id: { value: selectedDoc.id }
          }
        }
        swal({
          text: "ВНИМАНИЕ! Вы действительно Разблокировать ЦБ эмитента?",
          icon: "warning",
          buttons: { yes: "Да", cancel: "Отмена" },
        })
          .then((click) => {
            if (click === "yes") {
              console.log("unblockIssuerSecurities:", commandJson)
              props.sendFieldValues(commandJson)
              props.clearTabData(process_id)
            }
          })
      }
      else {
        swAllert("ЦБ эмитента не были блокированы ранее!", "warning")
      }
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
        text: "ВНИМАНИЕ! Вы действительно удалить данную запись?",
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
    else if (buttonName === "savePartnerContact") {
      let docToSave = getFieldValuesSaveDocument()
      docToSave["partner"] = docId
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "saveDocument" },
          document: { value: JSON.stringify(docToSave) }
        }
      }
      console.log("saveDocument:", commandJson)
      let checkResult = checkForRequieredFields()
      if (checkResult === true) {
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (buttonName === "saveAccount") {
      const createDocument = getFieldValuesSaveDocument()
      if (fieldValue["account_type"] === 3001 || fieldValue["account_type"] === 3101 || fieldValue["account_type"] === 3301) {
        createDocument["accnumber"] = "1-" + fieldValue["account_type"] + "-" + fieldValue["partner"]
      }
      else {
        for (let i = 0; i < enumData.length; i++) {
          if (enumData[i].name === "account_type") {
            for (let d = 0; d < enumData[i].data.length; d++) {
              if (enumData[i].data[d].id === fieldValue["account_type"]) {
                createDocument["accnumber"] = enumData[i].data[d].status + "-" + enumData[i].data[d].code + "-" + fieldValue["partner"]
              }
            }
          }
        }
      }
      // for(let i=0; i<enumData.length; i++){
      //   if(enumData[i].name === "account_type"){
      //     for(let d=0; d<enumData[i].data.length; d++){
      //       if(enumData[i].data[d].id === fieldValue["account_type"]){
      //         if(fieldValue["istrading_account"] === true){
      //           createDocument["accnumber"] = "1-" + enumData[i].data[d].code + "-" + fieldValue["partner"]
      //         }
      //         else{
      //           createDocument["accnumber"] = enumData[i].data[d].status + "-" + enumData[i].data[d].code + "-" + fieldValue["partner"]
      //         }
      //         // createDocument["account_type"] = enumData[i].data[d].code
      //       }
      //     }
      //   }
      // }
      createDocument["isactive"] = true
      createDocument["isclosed"] = false
      createDocument["dateopen"] = props.getCurrentFullDateTime()

      const commandJson =
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: { value: "saveAccount" },
          document: { value: JSON.stringify(createDocument) },
          userId: { value: userProfile.userId },
          userRole: { value: userProfile.userRole }
        }
      }
      console.log("button saveAccount: ", commandJson)
      let checkResult = checkForRequieredFields()
      if (checkResult === true) {
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (buttonName === "updateAccount") {
      const updateDocument = getFieldValuesUpdateDocument()
      if (fieldValue["account_type"] === 3001 || fieldValue["account_type"] === 3101 || fieldValue["account_type"] === 3301) {
        updateDocument["accnumber"] = "1-" + fieldValue["account_type"] + "-" + fieldValue["partner"]
      }
      else {
        for (let i = 0; i < enumData.length; i++) {
          if (enumData[i].name === "account_type") {
            for (let d = 0; d < enumData[i].data.length; d++) {
              if (enumData[i].data[d].id === fieldValue["account_type"]) {
                updateDocument["accnumber"] = enumData[i].data[d].status + "-" + enumData[i].data[d].code + "-" + fieldValue["partner"]
              }
            }
          }
        }
      }
      // for(let i=0; i<enumData.length; i++){
      //   if(enumData[i].name === "account_type"){
      //     for(let d=0; d<enumData[i].data.length; d++){
      //       if(enumData[i].data[d].id === fieldValue["account_type"]){
      //         if(fieldValue["istrading_account"] === true){
      //           updateDocument["accnumber"] = "1-" + enumData[i].data[d].code + "-" + fieldValue["partner"]
      //         }
      //         else{
      //           updateDocument["accnumber"] = enumData[i].data[d].status + "-" + enumData[i].data[d].code + "-" + fieldValue["partner"]
      //         }
      //       }
      //     }
      //   }
      // }

      const commandJson =
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: { value: "updateAccount" },
          document: { value: JSON.stringify(updateDocument) },
          selectedDoc: { value: JSON.stringify(updateDocument) },
          userId: { value: userProfile.userId },
          userRole: { value: userProfile.userRole }
        }
      }
      console.log("button updateAccount: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "saveAccountGIK") {
      const createDocument = getFieldValuesSaveDocument()
      for (let i = 0; i < enumData.length; i++) {
        if (enumData[i].name === "acc_type") {
          for (let d = 0; d < enumData[i].data.length; d++) {
            if (enumData[i].data[d].id === fieldValue["acc_type"]) {
              createDocument["acc_number"] = enumData[i].data[d].label + "-" + fieldValue["depositor"]
            }
          }
        }
      }
      createDocument["is_active"] = true
      createDocument["is_closed"] = false
      createDocument["open_date"] = props.getCurrentFullDateTime()

      const commandJson =
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: { value: "saveAccountGIK" },
          document: { value: JSON.stringify(createDocument) },
          userId: { value: userProfile.userId },
          userRole: { value: userProfile.userRole }
        }
      }
      console.log("button saveInstruction: ", commandJson)
      let checkResult = checkForRequieredFields()
      if (checkResult === true) {
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (buttonName === "blockAccount") {
      let updateBody = getFieldValuesUpdateDocument()
      updateBody["isactive"] = false
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "blockAccount" },
          document: { value: JSON.stringify(updateBody) }
        }
      }
      console.log("blockAccount:", commandJson)
      swal({
        text: "ВНИМАНИЕ! Вы действительно хотите заблокировать данный счет?",
        icon: "warning",
        buttons: { yes: "Да", cancel: "Отмена" },
      })
        .then((click) => {
          if (click === "yes") {
            props.sendFieldValues(commandJson)
            props.clearTabData(process_id)
            // swAllert("Данные успешно обновлены!", "success")
          }
        })

    }
    else if (buttonName === "blockAccountGIK") {
      let updateBody = getFieldValuesUpdateDocument()
      updateBody["is_active"] = false
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "blockAccountGIK" },
          document: { value: JSON.stringify(updateBody) }
        }
      }
      console.log("blockAccountGIK:", commandJson)
      swal({
        text: "ВНИМАНИЕ! Вы действительно хотите заблокировать данный счет?",
        icon: "warning",
        buttons: { yes: "Да", cancel: "Отмена" },
      })
        .then((click) => {
          if (click === "yes") {
            props.sendFieldValues(commandJson)
            props.clearTabData(process_id)
            // swAllert("Данные успешно обновлены!", "success")
          }
        })

    }
    else if (buttonName === "unblockAccount") {
      let updateBody = getFieldValuesUpdateDocument()
      updateBody["isactive"] = true
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "unblockAccount" },
          document: { value: JSON.stringify(updateBody) }
        }
      }
      console.log("unblockAccount:", commandJson)
      swal({
        text: "ВНИМАНИЕ! Вы действительно хотите разблокировать данный счет?",
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
    else if (buttonName === "unblockAccountGIK") {
      let updateBody = getFieldValuesUpdateDocument()
      updateBody["is_active"] = true
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "unblockAccountGIK" },
          document: { value: JSON.stringify(updateBody) }
        }
      }
      console.log("unblockAccountGIK:", commandJson)
      swal({
        text: "ВНИМАНИЕ! Вы действительно хотите разблокировать данный счет?",
        icon: "warning",
        buttons: { yes: "Да", cancel: "Отмена" },
      })
        .then((click) => {
          if (click === "yes") {
            props.sendFieldValues(commandJson)
            props.clearTabData(process_id)
            // swAllert("Данные успешно обновлены!", "success")
          }
        })

    }
    else if (buttonName === "closeAccount") {
      let updateBody = getFieldValuesUpdateDocument()
      updateBody["isclosed"] = true
      updateBody["isactive"] = false
      // updateBody["deleted"] = true
      updateBody["dateclosed"] = props.getCurrentFullDateTime()
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "closeAccount" },
          document: { value: JSON.stringify(updateBody) }
        }
      }
      console.log("closeAccount:", commandJson)
      swal({
        text: "ВНИМАНИЕ! Вы действительно хотите ЗАКРЫТЬ данный счет? Данную операцию невозможно отменить",
        icon: "warning",
        buttons: { yes: "Да", cancel: "Отмена" },
      })
        .then((click) => {
          if (click === "yes") {
            props.sendFieldValues(commandJson)
            props.clearTabData(process_id)
            // swAllert("Данные успешно обновлены!", "success")
          }
        })

    }
    else if (buttonName === "closeAccountGIK") {
      let updateBody = getFieldValuesUpdateDocument()
      updateBody["is_closed"] = true
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "closeAccountGIK" },
          document: { value: JSON.stringify(updateBody) }
        }
      }
      console.log("closeAccountGIK:", commandJson)
      swal({
        text: "ВНИМАНИЕ! Вы действительно хотите ЗАКРЫТЬ данный счет? Данную операцию невозможно отменить",
        icon: "warning",
        buttons: { yes: "Да", cancel: "Отмена" },
      })
        .then((click) => {
          if (click === "yes") {
            props.sendFieldValues(commandJson)
            props.clearTabData(process_id)
            // swAllert("Данные успешно обновлены!", "success")
          }
        })

    }
    else if (buttonName === "contacs") {
      // console.log("ITEM", item)
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "contacs" },
          partnerId: { value: docId }
        }
      }
      console.log("button contacs: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "setAccountManager") {
      console.log("ITEM", item)
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "setAccountManager" },
          manager_id: { value: selectedDoc.acc_manager }
        }
      }
      console.log("button setAccountManager: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "saveAccountManager") {
      let doc = null
      let userAct = "updateAccountManager"
      if (selectedDoc === null) {
        userAct = "createAccountManager"
        doc = getFieldValuesSaveDocument()
      }
      else {
        doc = getFieldValuesUpdateDocument()
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
          userAction: { value: userAct },
          document: { value: JSON.stringify(doc) }
        }
      }
      console.log("button createUpdateACCManager: ", commandJson)
      let checkResult = checkForRequieredFields()
      if (checkResult === true) {
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (buttonName === "deleteAccountManager") {
      if (selectedDoc !== null) {
        let commandJson =
        {
          commandType: "completeTask",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          userId: userProfile.userId,
          userRole: userProfile.userRole,
          variables: {
            userAction: { value: "deleteAccountManager" },
            docIdToDelete: { value: selectedDoc.id.toString() }
          }
        }
        console.log("deleteAccountManager:", commandJson)
        swal({
          text: "ВНИМАНИЕ! Вы действительно хотите снять управляющего?",
          icon: "warning",
          buttons: { yes: "Да", cancel: "Отмена" },
        })
          .then((click) => {
            if (click === "yes") {
              props.sendFieldValues(commandJson)
              props.clearTabData(process_id)
              // swAllert("Данные успешно обновлены!", "success")
            }
          })
      }
    }
    else if (buttonName === "showInstructionTypeCreatingForm") {
      let instructionTypeDoc = getFieldValuesSaveDocument()
      instructionTypeDoc.create_form = ""
      instructionTypeDoc.edit_form = ""
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "showInstructionTypeCreatingForm" },
          instructionTypeDoc: { value: JSON.stringify(instructionTypeDoc) },
          newInstructionLabel: { value: fieldValue["name"] }
        }
      }
      console.log("showInstructionTypeCreatingForm:", commandJson)
      props.sendFieldValues(commandJson)
    }
    else if (buttonName === "updatePartnerContacts") {
      let updateBody = getFieldValuesUpdateDocument()
      updateBody["partner"] = selectedDoc.partner
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "updateDocument" },
          document: { value: JSON.stringify(updateBody) }
        }
      }
      console.log("updateDocument:", commandJson)
      let checkResult = checkForRequieredFields()
      if (checkResult === true) {
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (buttonName === "getFiles") {
      if (fieldValue["date"] !== undefined && fieldValue["date"] !== "NaN.NaN.NaN") {
        let newDate = new Date(fieldValue["date"]) // "2020-01-26"
        let dd = String(newDate.getDate()).padStart(2, '0')
        let mm = String(newDate.getMonth() + 1).padStart(2, '0') //January is 0!
        let yyyy = newDate.getFullYear()
        let fileDir = dd + mm + yyyy
        let commandJson =
        {
          commandType: "completeTask",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          userId: userProfile.userId,
          userRole: userProfile.userRole,
          variables: {
            userAction: { value: "getFiles" },
            selectedDoc: { value: fileDir }
          }
        }
        console.log("getFiles:", commandJson)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
      else { swAllert("Введите дату", "warning") }
    }
    else if (buttonName === "updateInstructionType") {
      let updateBody = getFieldValuesUpdateDocument()
      updateBody["create_form"] = selectedDoc.create_form
      updateBody["edit_form"] = selectedDoc.edit_form
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "updateDocument" },
          document: { value: JSON.stringify(updateBody) }
        }
      }
      let checkResult = checkForRequieredFields()
      if (checkResult === true) {
        console.log("updateInstructionType:", updateBody)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }

    }
    else if (buttonName === "continue") {
      // console.log("ITEM", item)
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "continue" }
        }
      }
      console.log("button contacs: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "history") {
      if (selectedDoc !== null) {
        let commandJson =
        {
          commandType: "completeTask",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          userId: userProfile.userId,
          userRole: userProfile.userRole,
          variables: {
            userAction: { value: "history" },
            docId: { value: selectedDoc.id }
          }
        }
        console.log("history:", commandJson)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (buttonName === "showSystemChargeReportSelecting") {
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "showSystemChargeReportSelecting" },
          searchDoc: { value: JSON.stringify(fieldValue) }
        }
      }
      console.log("button setAccountManager: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "saveDepositor") {
      let doc = getFieldValuesSaveDocument()
      let tradesBody = {
        depositor: 0,
        trading_systems: 1,
        depositor_code: doc.partner
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
          userAction: { value: "saveDepositor" },
          document: { value: JSON.stringify(doc) },
          createInTrades: { value: false },
          tradesBody: { value: JSON.stringify(tradesBody) }
        }
      }
      swal({
        text: "Добавить депонента в торги??",
        icon: "warning",
        buttons: { yes: "Да", cancel: "Нет" },
      })
        .then((click) => {
          if (click === "yes") {
            commandJson.variables.createInTrades.value = true
            props.sendFieldValues(commandJson)
            props.clearTabData(process_id)
            console.log("button saveDepositor:", commandJson)
          }
          else {
            console.log("button saveDepositor: ", commandJson)
            props.sendFieldValues(commandJson)
            props.clearTabData(process_id)
          }
        })
    }
    else if (buttonName === "selectLocation") {
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "selectLocation" },
          location: { value: fieldValue.location }
        }
      }
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
      console.log("button selectLocation:", commandJson)
    }
    else if (buttonName === "createPayment") {
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "createPayment" },
          selectedDoc: { value: JSON.stringify({ security: selectedDoc.id }) }
          // docListPayments: { value: props.userTask.docList }
        }
      }
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
      console.log("button createPayment:", commandJson)
    }
    else if (buttonName === "viewPayment") {
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "viewPayment" },
          selectedDoc: { value: JSON.stringify(item) }
        }
      }
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
      console.log("button viewPayment:", commandJson)
    }

    else if (buttonName === "downloadCliringResult") {
      let trdResult = ""
      for (let i = 0; i < docList.length; i++) {
        trdResult += docList[i]["id"] + "\t"
        trdResult += docList[i]["status_code"] + "\t"
        trdResult += docList[i]["status_message"]
        if (i < docList.length - 1) { trdResult += "\n" }
      }
      // Download trdResult
      let pomTrdResult = document.createElement('a')
      let filenameOrd = "CliringResult" + moment(new Date).format('DDMMYYYY') + ".txt"
      let bbOrd = new Blob([trdResult], { type: 'text/plain' })
      pomTrdResult.setAttribute('href', window.URL.createObjectURL(bbOrd))
      pomTrdResult.setAttribute('download', filenameOrd)
      pomTrdResult.dataset.downloadurl = ['text/plain', pomTrdResult.download, pomTrdResult.href].join(':')
      pomTrdResult.draggable = true
      pomTrdResult.classList.add('dragout')
      pomTrdResult.click()
    }

    else if (buttonName === "back") {
      let commandJson =
      {
        commandType: "completeTask",
        // session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "back" },
        }
      }
      console.log("button back:", commandJson)
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
        userRole: userProfile.userRole,
        variables: {
          authorization: { value: "token" },
          userAction: { value: "cancel" },
        }
      }
      console.log("button cancel: ", commandJson)
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
          searchDoc: { value: JSON.stringify(fieldValue) }
        }
      }
      console.log("button updateDocList: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else {
      console.log("UNKNOWN Button ", buttonName)
    }
  }
  // Create sections with labels and call bodyBuilder function
  function sectionBuilder(section) {
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
          {section.contents.map(contentItem => (
            contentItem.show === true &&
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
          ))}
        </TableBody>
      </Table>
    )
  }
  // Creating components by it's type
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
          defaultValue={(fieldValue[contentItem.name]) ? fieldValue[contentItem.name] : ""}
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
          if (parseInt(fieldValue[contentItem.name]) === enumOptions[contentItem.name][i].value) {
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
    else if (contentItem.type === "Bool") {
      return (
        <Checkbox
          style={{ maxWidth: 20, height: 15, color: (formType === "view" || contentItem.edit === false) ? "grey" : "green" }}
          name={contentItem.name}
          onChange={handleCheckboxChange}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          checked={(fieldValue[contentItem.name] === false || fieldValue[contentItem.name] === null || fieldValue[contentItem.name] === undefined) ? false : true}
        />
      )
    }
    else if (contentItem.type === "BoolCustom") {
      return (
        <Checkbox
          style={{ maxWidth: 20, height: 15, color: (formType === "view" || contentItem.edit === false) ? "grey" : "green" }}
          name={contentItem.name}
          onChange={handleBoolCustomChange}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          checked={(fieldValue[contentItem.name] === false || fieldValue[contentItem.name] === null || fieldValue[contentItem.name] === undefined || fieldValue[contentItem.name] === contentItem.valueFalse) ? false : true}
        />
      )
    }
    else if (contentItem.type === "Int") {
      // console.log("FVAL", fieldValue)
      return (
        <TextField
          name={contentItem.name}
          onKeyPress={onKeyPressInt}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          style={{ width: "100%" }}
          // defaultValue={(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name] : ""}
          // onBlur={handleIntChange}
          value={(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name] : ""}
          onChange={handleIntChange}
          InputProps={{ inputComponent: IntegerFormat }}
        />
      )
    }
    else if (contentItem.type === "Float") {
      // console.log("FLOAT VAL", fieldValue[contentItem.name])
      return (
        <TextField
          onKeyPress={onKeyPressFloat}
          name={contentItem.name}
          // defaultValue = {(fieldValue[contentItem.name]) ? fieldValue[contentItem.name]: ""}
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
    else if (contentItem.type === "DateTime") {
      return (
        <TextField
          onKeyPress={onKeyPressDateTime}
          type="date"
          name={contentItem.name}
          onBlur={handleDateTimeChange}
          style={{ width: "100%" }}
          defaultValue={(fieldValue[contentItem.name] !== undefined && fieldValue[contentItem.name] !== null) ? props.parseDate(fieldValue[contentItem.name]) : ""}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          InputLabelProps={{
            shrink: true,
          }}
        />
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
  // Create grid form components
  function getGridFormItems(dataItem, contentItem) {
    let value = dataItem[contentItem.name]
    let name = contentItem.name
    let type = contentItem.type
    if (type === "Enum") {
      if (value === null || value === "" || value === undefined) {
        return "-"
      }
      else {
        for (let i = 0; i < gridFormEnumData.length; i++) {
          if (gridFormEnumData[i] !== null) {
            if (name === gridFormEnumData[i].name) {
              for (let l = 0; l < gridFormEnumData[i].data.length; l++) {
                if (gridFormEnumData[i].data[l].id === parseInt(value)) {
                  return gridFormEnumData[i].data[l].label
                }
                if (l === gridFormEnumData[i].data.length - 1 && gridFormEnumData[i].data[l].id !== parseInt(value)) {
                  return value + " not found"
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
          checked={(value === false || value === null || value === undefined) ? false : true}
        />
      )
    }
    else if (type === "BoolCustom") {
      // console.log("ITEM", name, value, type)
      return (
        <Checkbox
          style={{ maxWidth: 20, height: 15, color: "green" }}
          checked={(value === contentItem.valueTrue) ? true : false}
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
        let status = "-"
        if (dataItem["filled"] === true) {
          status = "Введено"
        }
        if (dataItem["onExecution"] === true) {
          status = "Введено -> На исполнении"
        }
        if (dataItem["executed"] === true) {
          status = "На исполнении -> Исполнено"
        }
        if (dataItem["canceled"] === true) {
          status = "На исполнении -> Отменено"
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
      <Grid container direction="row" justify="flex-start" spacing={0}>
        <Grid item xs={isSearchForm === true ? 12 : 8}>
          <Paper>
            <Table style={{ width: "100%", "border-collapse": "collapse" }}>
              {isSearchForm === false &&
                <TableRow style={{ maxHeight: 25 }}>
                  <TableCell style={{ fontSize: 16, color: "black" }}>{Form.label}</TableCell>
                </TableRow>
              }
              <Grid container direction="row" justify="center" alignItems="center">
                {Form.sections.map(section => {
                  return sectionBuilder(section)
                })}
              </Grid>
            </Table>
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
    console.log("PP", property, type)
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
      return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0
        return result * sortOrder
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
        if (a[property] === null) {
          return 1 * sortOrder
        }
        else {
          let labelA = getEnumLabel(property, a[property])
          // console.log("A", property, a[property], labelA)
          let labelB = getEnumLabel(property, b[property])
          // console.log("labelB", labelB, property, b)
          var result = (labelA < labelB) ? -1 : (labelA > labelB) ? 1 : 0
          return result * sortOrder
        }
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
  function calculateColSpan(contents) {
    let num = 0
    for (let i = 0; i < contents.length; i++) {
      if (contents[i].show === true) {
        num += 1
      }
    }
    return num
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
  if (updateState !== null) {
    try {
      return (
        <Grid key={updateState}>
          {isSearchForm !== null &&
            isSearchForm === true
            ?
            <Grid container direction="row" justify="flex-start" spacing={0}>
              <Grid item xs={11}>
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
                                  onContextMenu={(ev) => handleContextMenu(ev)}
                                  class={lastSection === true ? "td-head-last-child" : "td-head-style"}
                                  colSpan={calculateColSpan(section.contents)}
                                >{section.label}</td>
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
                                    {contentItem.label}
                                    {sortedColumn === contentItem.name ? sortedColumnOrder === 1 ? <ArrowDropDownIcon style={{ marginBottom: -8 }} /> : <ArrowDropUpIcon style={{ marginBottom: -8 }} /> : ""}
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
                            <tr style={{ "height": 30 }}>
                              <td
                                class="td-style"
                                style={{ "maxWidth": 34 }}
                              >
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
                              {gridForm.sections.map(section => (
                                section.contents.map(contentItem => {
                                  if (contentItem.show === true) {
                                    return (
                                      <td style={{ color: "black", fontSize: 12, "text-align": "center", "border-bottom": "1px solid grey" }}>
                                        {getGridFormItems(dataItem, contentItem)}
                                      </td>
                                    )
                                  }
                                })
                              ))}
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
                            <MenuItem value={1000}>1000</MenuItem>
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
                      <td class="pagination-rows-amount-style">Стр. {page} из {getPageAmount()} Общее кол-во {filteredDocList.length}
                      </td>
                    </tr>
                  </tfoot>
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
          }
          <Snackbar
            open={showSnackBar}
            onClose={() => handleCloseSnackBar()}
            autoHideDuration={1200}
            message={snackBarMessage}
          />
        </Grid>
      )
    }
    catch (er) {
      console.log("ERROR", er)
      return <LinearProgress />
    }
  }
};
