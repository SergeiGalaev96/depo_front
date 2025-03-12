import React, { useState, useEffect } from 'react';
// import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Table from "@material-ui/core/Table"; // Material ui table for usual form
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Snackbar from '@material-ui/core/Snackbar';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import Modal from "@material-ui/core/Modal";
// Accordion
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// Icons
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MenuItem from '@material-ui/core/MenuItem';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import GetAppIcon from '@material-ui/icons/GetApp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ReplayIcon from '@material-ui/icons/Replay';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
// Form components
import GridSelect from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import Checkbox from '@material-ui/core/Checkbox';
// Libraries
import swal from 'sweetalert' // https://sweetalert.js.org/guides/
import Tooltip from '@material-ui/core/Tooltip';
var moment = require('moment');
// var generator = require('generate-password');

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
const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
  },
  paper: {
    width: 400,
    height: 300,
    overflow: 'auto',
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  importFile: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  inputFile: {
    display: 'none',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))
export default (props) => {
  // This.state
  const classes = useStyles()
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
  const [gridForm] = useState(props.userTask.gridForm)
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
  const [showSavedDocuments, setShowSavedDocuments] = useState(false)
  const [showAttachedDocuments, setShowAttachedDocuments] = useState(false)

  const [openModal, setOpenModal] = useState(false)
  const [attachedImgs, setAttachedImgs] = useState([])
  const [attachedImgsFiles, setAttachedImgsFiles] = useState([])
  const [attachedDocs, setAttachedDocs] = useState([])
  const [Blobs, setBlobs] = useState([])
  const [selectedImg, setSelectedImg] = useState({})
  const [savedImgs, setSavedImgs] = useState([])
  const [savedImagesFiles, setSavedImagesFiles] = useState([])
  const [savedDocs, setSavedDocs] = useState([])
  const [buttonFilesWordPdfImgId, setButtonFilesWordPdfImgId] = useState(null)

  const [sortedColumn, setSortedColumn] = useState("null")
  const [sortedColumnOrder, setSortedColumnOrder] = useState(1)
  const [isSearchForm, setIsSearchForm] = useState(null)
  const [accordionExpanded, setAccordionExpanded] = useState(false)

  // Set data from props to state of component
  useEffect(() => {
    console.log("CONTRACTS PROPS", props)
    setButtonFilesWordPdfImgId(getUUID())
    if (props.userTask.docList !== "null" && props.userTask.docList !== null) {
      try {
        let parsedData = JSON.parse(props.userTask.docList)
        let s = parseInt(props.userTask.size)
        let p = parseInt(props.userTask.page)
        setSize(s)
        setPage(p)
        setIsSearchForm(true)
        setFilteredDocList(parsedData)
        setInitialDocList(parsedData)
        let sortedDocList = parsedData.sort(dynamicSort("id", -1, "Int"))
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
      let fields = {}
      // let Form = props.userTask.Form
      for (let s = 0; s < Form.sections.length; s++) {
        for (let c = 0; c < Form.sections[s].contents.length; c++) {
          let fieldName = Form.sections[s].contents[c].name
          fields[fieldName] = parsedSelectedDoc[fieldName]
        }
      }
      console.log("SDOC", parsedSelectedDoc)
      // console.log("FIELDVAL", fields)
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
    if (props.userTask.taskType === "showContractsCreatingForm" || props.userTask.taskType === "showExcertsCreatingForm") {
      setShowAttachedDocuments(true)
    }
    if (props.userTask.taskType === "showContractsEditForm" || props.userTask.taskType === "showExcertsEditForm") {
      setShowAttachedDocuments(true)
      setShowSavedDocuments(true)
    }
    if (props.userTask.savedDocs.length !== 0) {
      for (let d = 0; d < props.userTask.savedDocs.length; d++) {
        let extension = props.userTask.savedDocs[d].extension
        if (extension === ".png") {
          convertBase64ToFile("data:image/png;base64," + props.userTask.savedDocs[d].content, props.userTask.savedDocs[d].fileName)
        }
        else if (extension === ".jpeg" || extension === ".jpg") {
          convertBase64ToFile("data:image/jpeg;base64," + props.userTask.savedDocs[d].content, props.userTask.savedDocs[d].fileName)
        }
        else if (extension === ".doc") {
          convertBase64ToFile("data:application/msword;base64," + props.userTask.savedDocs[d].content, props.userTask.savedDocs[d].fileName)
        }
        else if (extension === ".docx") {
          convertBase64ToFile("data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64," + props.userTask.savedDocs[d].content, props.userTask.savedDocs[d].fileName)
        }
        else if (extension === ".xlsx") {
          convertBase64ToFile("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + props.userTask.savedDocs[d].content, props.userTask.savedDocs[d].fileName)
        }
        else if (extension === ".pdf") {
          convertBase64ToFile("data:application/pdf;base64," + props.userTask.savedDocs[d].content, props.userTask.savedDocs[d].fileName)
        }
      }
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
  function handleExpandAccordion() {
    setAccordionExpanded(!accordionExpanded)
  }
  const handleOpenModal = () => {
    setOpenModal(true)
  }
  const handleCloseModal = () => {
    setOpenModal(false)
  }
  const handleCheckboxChange = (event) => {
    setFieldValue({ ...fieldValue, [event.target.name]: event.target.checked });
  }
  // Integer input handler
  // const handleIntChange = (event) => {
  //   // console.log("INT CHANGE", event.target.name, event.target.value)
  //   setFieldValue({ ...fieldValue, [event.target.name]: event.target.value })
  // }
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
  //   let stringNum = event.target.value.toString().replace(/ /g, '');
  //   let int = parseInt(stringNum)
  //   setFieldValue({ ...fieldValue, [event.target.name]: int });
  // }
  // // Float input handler
  // const handleFloatChange = (event) => {
  //   let stringNum = event.target.value.toString().replace(/ /g, '');
  //   let float = parseFloat(stringNum)
  //   setFieldValue({ ...fieldValue, [event.target.name]: float })
  //   console.log("FLOAT CHANGE", event.target.name, fieldValue)
  // }
  function handleChange(event) {
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
  }
  function handleDateTimeChange(event) {
    // let fullDate = props.parseDate(event.target.value)
    // var hours = new Date().getHours()
    // var minutes = new Date().getMinutes()
    // var seconds = new Date().getSeconds()
    // var convertedDate = fullDate + " " + hours + ":" + minutes + ":" + seconds // + ".123456"
    // fieldValue[event.target.name] = convertedDate
    let fullDateTime = moment(event.target.value).format('YYYY-MM-DDTHH:mm:ss')
    fieldValue[event.target.name] = fullDateTime
    setFieldValue(fieldValue)
    console.log("DATE CHANGE", event.target.value)
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
  // // random numbers generator
  // function keyGen(length) {
  //   var password = generator.generate({
  //     length: length,
  //     numbers: true
  //   })
  //   return password
  // }
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
        else {
          docToSave[fieldName] = fieldValue[fieldName]
        }
      }
    }
    return docToSave
  }
  function getFieldValuesUpdateDocument() {
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
    let checkedSuccessfuly = false
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let fieldName = Form.sections[s].contents[c].name
        if (Form.sections[s].contents[c].required === true && (fieldValue[fieldName] === undefined ||
          fieldValue[fieldName] === null || fieldValue[fieldName] === "NaN.NaN.NaN" || fieldValue[fieldName].length === 0)) {
          checkedSuccessfuly = false
          swAllert("Внимание заполните поле \"" + Form.sections[s].contents[c].label + "\"")
          break
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
        // filterDocList(0, size, initialDocList, fieldValue)
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
    else if (buttonName === "updateDocument") {
      let updateBody = getFieldValuesUpdateDocument()
      updateBody.files_directory = selectedDoc.files_directory
      let commandJson =
      {
        commandType: "saveDocumentsWithFiles",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        blobs: Blobs,
        directory: selectedDoc.files_directory,
        variables: {
          userAction: { value: "updateDocument" },
          document: { value: JSON.stringify(updateBody) }
        }
      }
      let checkResult = checkForRequieredFields()
      if (checkResult === true) {
        console.log("updateDocument:", commandJson)
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
      let dir = getUUID()
      docToSave.files_directory = dir
      let commandJson =
      {
        commandType: "saveDocumentsWithFiles",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        blobs: Blobs,
        directory: dir,
        variables: {
          userAction: { value: "saveDocument" },
          document: { value: JSON.stringify(docToSave) }
        }
      }
      let checkResult = checkForRequieredFields()
      if (checkResult === true) {
        console.log("saveDocument:", commandJson)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
      // swAllert("Данные сохранены!", "success")
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
    else if (buttonName === "back") {
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
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
    else {
      console.log("UNKNOWN Button ", buttonName)
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
              }
            }
          }
        }
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
        // console.log("ITEM", dataItem, value)
        let Date = value.substring(0, 10)
        let Time = value.substring(11, 16)
        return Date + " " + Time
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
  // attached documents
  async function pushNewBlob(f) {
    // console.log("WRITING BLOBS")
    let docUrl = URL.createObjectURL(f)
    fetch(docUrl)
      .then(res => res.blob())
      .then(blob => {
        // blob.name = f.name
        var blobToBase64 = function (f, cb) {
          let reader = new FileReader()
          reader.onload = function () {
            // converts blob to base64
            var dataUrl = reader.result
            var base64 = dataUrl.split(",")[1]
            cb(base64)
          }
          reader.readAsDataURL(f)
        }
        blobToBase64(f, async function (base64) {
          // encode blobs to send to socket
          let newBlob = { "name": f.name, "blob": base64, "size": f.size }
          Blobs.push(newBlob)
          setBlobs(Blobs)
          // console.log("BLOBS", Blobs)
        })
      })
  }
  function handleAttachFile(e) {
    let selectedFiles = e.target.files
    console.log("A DOCS", selectedFiles)
    if (selectedFiles && selectedFiles[0]) {
      for (let i = 0; i < selectedFiles.length; i++) {
        if (selectedFiles[i].type === "application/pdf" ||
          selectedFiles[i].type === "application/msword" ||
          selectedFiles[i].type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          selectedFiles[i].type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          attachedDocs.push(selectedFiles[i])
          setAttachedDocs(attachedDocs)
          setUpdateState(getUUID())
          // console.log("A DOCS", attachedDocs)
        }
        else {
          let reader = new FileReader()
          reader.onload = async function (e) {
            // push new images to list and show in UI
            let image = { item: <img name={selectedFiles[i].name} height="150" width="auto" src={e.target.result} onClick={() => attachedImgClick(selectedFiles[i].name)} /> }
            attachedImgs.push(image)
            setAttachedImgs(attachedImgs)
            setUpdateState(getUUID())
            // console.log("IMGLIST", attachedImgs)
          }
          reader.readAsDataURL(selectedFiles[i])
          attachedImgsFiles.push(selectedFiles[i])
          // pushAttachedImage(selectedFiles[i])
          setAttachedImgsFiles(attachedImgsFiles)
          // console.log("A IMGS", attachedImgsFiles)
        }
        pushNewBlob(selectedFiles[i])
      }
    }

  }
  // async function pushAttachedImage(f){
  //   let reader = new FileReader()
  //   reader.onload = async function(e){
  //     // push new images to list and show in UI
  //     let image = {item: <img name={f.name} height="150" width="auto" src={e.target.result} onClick={()=> attachedImgClick(f.name)}/>}
  //     attachedImgs.push(image)
  //     setAttachedImgs(attachedImgs)
  //     // console.log("IMGLIST", attachedImgs)
  //   }
  //   reader.readAsDataURL(f)
  //   // setUpdateState(getUUID())
  // }
  async function attachedImgClick(name) {
    for (let l = 0; l < attachedImgs.length; l++) {
      if (attachedImgs[l].item.props.name === name) {
        console.log("IMG", attachedImgs[l])
        setSelectedImg({
          name: attachedImgs[l].item.props.name,
          height: "700",
          width: "auto",
          src: attachedImgs[l].item.props.src
        })
      }
    }
    handleOpenModal()
    let newId = getUUID()
    setUpdateState(newId)
  }
  function attachedDocsList() {
    console.log("A DOCS", attachedDocs)
    let selDocsList = []
    for (let i = 0; i < attachedDocs.length; i++) {
      selDocsList.push(
        <Card style={{ margin: 3, backgroundColor: "#E2E2E2", paddingLeft: 20, minWidth: "500px" }}>
          <table>
            <tr>
              <td style={{ color: "#1B2CE8", fontWeight: "bold", width: "95%" }}>
                {attachedDocs[i].name + " "}{"(" + Math.round(attachedDocs[i].size / 1000) + ")" + "КБ"}
              </td>
              <td>
                <IconButton>
                  <CloseIcon style={{ fontSize: "medium", color: "black" }} onClick={() => deleteAttachedDoc(attachedDocs[i].name)} />
                </IconButton>
              </td>
            </tr>
          </table>
        </Card>)

    }
    return (selDocsList)
  }
  function attachedImgsList() {
    var imgs = []
    for (let l = 0; l < attachedImgs.length; l++) {
      imgs.push(
        <TableBody>
          <TableRow>
            <TableCell>
              {attachedImgs[l].item}
            </TableCell>
          </TableRow>
          {/* <TableRow>
            <TableCell width="20%">
              {attachedImgs[l].item.props.name}
            </TableCell>
          </TableRow> */}
          <TableRow>
            <TableCell align="center">
              <IconButton onClick={() => deleteAttachedImage(attachedImgs[l].item.props.name)}>
                <DeleteForeverIcon fontSize="Large" style={{ color: "black", margin: 0 }} />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableBody>
      )
    }
    if (Object.keys(imgs).length !== 0) {
      return (
        <Grid container direction="row" justify="center" alignItems="flex-start">
          {imgs}
        </Grid>
      )
    }
  }
  function deleteAttachedDoc(name) {
    let newDocList = []
    for (let i = 0; i < attachedDocs.length; i++) {
      if (name !== attachedDocs[i].name) {
        newDocList.push(attachedDocs[i])
      }
      else {
        deleteBlob(attachedDocs[i].name)
      }
    }
    // attachedDocs = newDocList
    setAttachedDocs(newDocList)
    // setUpdateState(getUUID())
    // console.log("FILES", newDocList)
  }
  function deleteAttachedImage(name) {
    let newImgList = []
    let newImgFilesList = []
    for (let i = 0; i < attachedImgs.length; i++) {
      if (name !== attachedImgs[i].item.props.name) {
        newImgList.push(attachedImgs[i])
        newImgFilesList.push(attachedImgsFiles[i])
      }
      else {
        deleteBlob(attachedImgs[i].item.props.name)
      }
    }
    // deleteBlob(name)
    // attachedImgs = newImgList
    setAttachedImgs(newImgList)
    // attachedImgsFiles = newImgFilesList
    setAttachedImgsFiles(newImgFilesList)
    // setUpdateState(getUUID())
    // console.log("IMGS", newImgFilesList)
  }
  function deleteBlob(name) {
    console.log("NAME", name)
    let newBlobs = []
    for (let b = 0; b < Blobs.length; b++) {
      if (Blobs[b].name !== undefined) {
        if (name !== Blobs[b].name) {
          newBlobs.push(Blobs[b])
        }
        else {
          console.log("DEL", Blobs[b].name)
        }
      }
    }
    console.log("BLOBS", newBlobs)
    setBlobs(newBlobs)
  }
  // Previosly saved documents
  function convertBase64ToFile(dataurl, fileName) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    let convFile = new File([u8arr], fileName, { type: mime })
    handleAttachSavedFile(convFile)
    console.log("CONV FILE", convFile)
  }
  function handleAttachSavedFile(file) {
    console.log("FILE", file)
    if (file.type === "application/pdf" || file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      savedDocs.push(file)
      setSavedDocs(savedDocs)
    }
    else {
      savedImagesFiles.push(file)
      setSavedImagesFiles(savedImagesFiles)
      pushSavedImage(file)
    }
    // setUpdateState(getUUID())
  }
  async function pushSavedImage(f) {
    let reader = new FileReader()
    reader.onload = async function (e) {
      // push new images to list and show in UI
      let image = { item: <img name={f.name} height="150" width="auto" src={e.target.result} onClick={() => savedImgClick(f.name)} /> }
      savedImgs.push(image)
      // console.log("IMGLIST", savedImgs)
      setSavedImgs(savedImgs)
      setUpdateState(getUUID())
    }
    reader.readAsDataURL(f)
  }
  async function savedImgClick(name) {
    for (let l = 0; l < savedImgs.length; l++) {
      if (savedImgs[l].item.props.name === name) {
        console.log("IMG", savedImgs[l])
        setSelectedImg({
          name: savedImgs[l].item.props.name,
          height: "700",
          width: "auto",
          src: savedImgs[l].item.props.src
        })
      }
    }
    handleOpenModal()
    let newId = getUUID()
    setUpdateState(newId)
  }
  function savedDocsList() {
    console.log("SAVEDOCS", savedDocs)
    let savedDocsList = []
    for (let i = 0; i < savedDocs.length; i++) {
      savedDocsList.push(
        <Card style={{ margin: 3, backgroundColor: "#E2E2E2", paddingLeft: 20, minWidth: "500px" }}>
          <table>
            <tr>
              <td style={{ color: "#1B2CE8", fontWeight: "bold", width: "95%" }}>
                {savedDocs[i].name + " "}{"(" + Math.round(savedDocs[i].size / 1000) + ")" + "КБ"}
              </td>
              <td>
                <IconButton>
                  <CloseIcon style={{ fontSize: "medium", color: "black" }} onClick={() => deleteSavedDoc(savedDocs[i].name)} />
                </IconButton>
              </td>
              <td>
                <IconButton
                  component="a"
                  href={URL.createObjectURL(savedDocs[i])}
                  download={savedDocs[i].name}
                >
                  <GetAppIcon style={{ fontSize: "medium", color: "black" }} />
                </IconButton>
              </td>
            </tr>
          </table>
        </Card>)
      // console.log("FILE", savedDocs[i])
    }
    return (savedDocsList)
  }
  function savedImgsList() {
    console.log("SAVEDIMGS", savedImgs)
    var imgs = []
    for (let l = 0; l < savedImgs.length; l++) {
      let blob = converFileToBlob(savedImgs[l].item.props.src)
      imgs.push(
        <TableBody>
          <TableRow>
            <TableCell>
              {savedImgs[l].item}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center">
              <IconButton onClick={() => deleteSavedImage(savedImgs[l].item.props.name)}>
                <DeleteForeverIcon fontSize="Large" style={{ color: "black", margin: 0 }} />
              </IconButton>
              <IconButton
                component="a"
                href={URL.createObjectURL(blob)}
                download={savedImgs[l].item.props.name}
              >
                <GetAppIcon style={{ fontSize: "medium", color: "black" }} />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableBody>
      )
    }
    if (Object.keys(imgs).length !== 0) {
      return (
        <Grid container direction="row" justify="center" alignItems="flex-start">
          {imgs}
        </Grid>
      )
    }
  }
  function converFileToBlob(src) {
    var byteString = atob(src.split(',')[1])
    var ab = new ArrayBuffer(byteString.length)
    var ia = new Uint8Array(ab)

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: 'image/jpeg' })
  }
  function deleteSavedDoc(name) {
    swal({
      text: "Вы действительно хотите удалить этот файл?",
      icon: "warning",
      buttons: { ok: "Да", cancel: "Отмена" },
    })
      .then((click) => {
        if (click === "ok") {
          let newDocList = []
          for (let i = 0; i < savedDocs.length; i++) {
            if (name !== savedDocs[i].name) {
              newDocList.push(savedDocs[i])
            }
          }
          setSavedDocs(newDocList)
          let commandJson = {
            commandType: "deleteSavedDoc",
            userId: userProfile.userId,
            directory: selectedDoc.files_directory,
            fileName: name
          }
          props.sendFieldValues(commandJson)
        }
      })
  }
  function deleteSavedImage(name) {
    swal({
      text: "Вы действительно хотите удалить этот файл?",
      icon: "warning",
      buttons: { ok: "Да", cancel: "Отмена" },
    })
      .then((click) => {
        if (click === "ok") {
          let newImgList = []
          for (let i = 0; i < savedImgs.length; i++) {
            if (name !== savedImgs[i].item.props.name) {
              newImgList.push(savedImgs[i])
            }
          }
          setSavedImgs(newImgList)
          // setUpdateState(getUUID())
          let commandJson =
          {
            commandType: "deleteSavedDoc",
            userId: userProfile.userId,
            directory: selectedDoc.files_directory,
            fileName: name
          }
          props.sendFieldValues(commandJson)
        }
      })
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
      console.log("IT", i, gridForm.sections[nextS])
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
    // let fetchFrom = (page*size-1)-size
    // let fetchTo = page*size-1
    setPage(1)
    let fetchFrom = 0
    let fetchTo = size - 1
    setFilteredDocList(sortedDocList)
    fetchBySize(fetchFrom, fetchTo, sortedDocList)
  }
  function getEnumLabel(name, id) {
    for (let i = 0; i < enumData.length; i++) {
      if (enumData[i].name === name) {
        for (let d = 0; d < enumData[i].data.length; d++) {
          if (enumData[i].data[d].id === id) {
            return enumData[i].data[d].label
          }
        }
      }
    }
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
              {/* <Grid container  direction="row" justify="flex-start" alignItems="flex-start">
                {buttons.map((button, index) => (
                  <Button
                    name={button.name}
                    variant="outlined"
                    onClick = {() => buttonClick(button.name, null)}
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
              </Grid> */}
            </Table>
          </Paper>
        </Grid>
      </Grid>
    )
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
          onBlur={handleChange}
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
    else if (contentItem.type === "Int") {
      return (
        <TextField
          onKeyPress={onKeyPressInt}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          style={{ width: "100%" }}
          // defaultValue={(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name] : ""}
          // value={(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name] : ""}
          // onBlur={handleIntChange}
          value={(fieldValue[contentItem.name] !== undefined) ? fieldValue[contentItem.name] : ""}
          onChange={handleIntChange}
          name={contentItem.name}
          InputProps={{ inputComponent: IntegerFormat }}
        />
      )
    }
    else if (contentItem.type === "Float") {
      console.log("FLOAT VAL", fieldValue[contentItem.name])
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
  if (updateState !== null) {
    try {
      return (
        <Grid>
          {/* Create main search table */}
          {isSearchForm !== null &&
            isSearchForm === true
            ?
            <Grid container direction="row" justify="flex-start" spacing={1}>
              <Grid item xs={8}>
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
          {showAttachedDocuments === true &&
            <Paper>
              <Grid item>
                <Grid container direction="row">
                  <div className={classes.importFile}>
                    <input
                      accept="image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      className={classes.inputFile}
                      id={buttonFilesWordPdfImgId}
                      multiple
                      type="file"
                      onChange={handleAttachFile}
                    />
                    <label htmlFor={buttonFilesWordPdfImgId}>
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
                        endIcon={<AttachFileIcon />}
                      >Прикрепить файлы
                      </Button>
                    </label>
                  </div>
                </Grid>
              </Grid>
              <Grid container spacing={2} justify="flex-start" alignItems="flex-start" className={classes.root}>
                <Grid item xs={"auto"}>
                  <Grid container direction="column" spacing={1}>
                    <div style={{ paddingLeft: 10 }}>Прикрепленные документы</div>
                    {attachedDocsList()}
                    {attachedImgsList()}
                  </Grid>
                </Grid>
              </Grid>
              {showSavedDocuments === true &&
                <Grid container spacing={2} justify="flex-start" alignItems="flex-start" className={classes.root}>
                  <Grid item xs={"auto"}>
                    <Grid container direction="column" spacing={1}>
                      <div style={{ paddingLeft: 10 }}>Сохраненные документы</div>
                      {savedDocsList()}
                      {savedImgsList()}
                    </Grid>
                  </Grid>
                </Grid>
              }
            </Paper>
          }
          {docList !== null &&
            <Grid container direction="row" justify="flex-start" spacing={0}>
              <Grid item sm={"auto"}>
                <Paper>
                  <div style={{ height: "500px", overflow: "auto" }}>
                    <table size="small" class="main-table-style">
                      <thead class="thead-style" style={{ position: "sticky", top: 0 }}>
                        {/* 1st Row Sections Labels */}
                        <tr>
                          <td class="td-head-first-child" colSpan="1"></td>
                          {gridForm.sections.map((section, index) => {
                            let showSection = checkToShowSection(section)
                            if (showSection === true) {
                              let lastSection = checkSectionOnLastChild(index)
                              return (
                                <td
                                  class={lastSection === true ? "td-head-last-child" : "td-head-style"}
                                  colSpan={section.contents.length}
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
                              <td class="td-style" style={{ "maxWidth": 34 }}>
                                {gridFormButtons !== "null" &&
                                  gridFormButtons.map(button =>
                                    <Button
                                      key={button.name}
                                      name={button.name}
                                      variant="outlined"
                                      // id={dataItem.id}
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
                                      <td align="left" style={{ color: "black", fontSize: 12, "text-align": "center", "border-bottom": "1px solid grey" }}>
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
                      <td class="pagination-rows-amount-style">Стр. {page} из {getPageAmount()} Общее кол-во {filteredDocList.length}</td>
                    </tr>

                  </tfoot>
                </Paper>
              </Grid>
            </Grid>
          }
          <Modal
            className={classes.modal}
            open={openModal}
            onClose={handleCloseModal}
          >
            <div className={classes.imagePaper}>
              <img name={selectedImg.name} height={600} width="auto" src={selectedImg.src} />
            </div>
          </Modal>
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
}
