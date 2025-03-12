import React, { useState, useEffect } from 'react';
// import clsx from 'clsx';
// import { makeStyles} from '@material-ui/core/styles';
import MTable from "@material-ui/core/Table"; // Material ui table for usual form
import TableFooter from '@material-ui/core/TableFooter';
import { Table } from 'reactstrap';  // Core ui table for grid form
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
// Icons
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import LinearProgress from '@material-ui/core/LinearProgress';
import Snackbar from '@material-ui/core/Snackbar';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ReplayIcon from '@material-ui/icons/Replay';
// Form components
import TextField from '@material-ui/core/TextField';
import Select from 'react-select';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
// Libraries
import swal from 'sweetalert' // https://sweetalert.js.org/guides/

export default (props) => {
  // This.state
  const [userProfile] = useState(props.userProfile)
  const [session_id] = useState(props.userTask.session_id)
  const [process_id] = useState(props.userTask.process_id)
  const [taskID] = useState(props.userTask.taskID)
  const [Form] = useState(props.userTask.Form)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [userEnabled, setUserEnabled] = useState(null)
  const [formType] = useState(props.userTask.formType)
  const [docList, setDocList] = useState([])
  const [filteredDocList, setFilteredDocList] = useState([])
  const [initialDocList, setInitialDocList] = useState([])
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
  const [isSearchForm, setIsSearchForm] = useState(null)

  const [sortedColumn, setSortedColumn] = useState("null")
  const [sortedColumnOrder, setSortedColumnOrder] = useState(1)

  // Set data from props to state of component
  useEffect(() => {
    console.log("User PROPS", props.userTask)
    if (props.userTask.docList !== "null" && props.userTask.docList !== null) {
      try {
        let parsedDocList = JSON.parse(props.userTask.docList)
        // console.log("DOCL", parsedDocList)
        let s = parseInt(props.userTask.size)
        let p = parseInt(props.userTask.page)
        setSize(s)
        setPage(p)
        let newDocList = []
        for (let i = 0; i < parsedDocList.length; i++) {
          try {
            let newUser = {
              id: parsedDocList[i].id,
              enabled: parsedDocList[i].enabled,
              username: parsedDocList[i].username,
              firstName: parsedDocList[i].firstName,
              lastName: parsedDocList[i].lastName,
              email: parsedDocList[i].email,
              online: parsedDocList[i].online,
              lastAccess: parsedDocList[i].lastAccess,
              userRole: parseInt(parsedDocList[i].attributes.userRole[0]),
              partner: parsedDocList[i].attributes.partner ? parseInt(parsedDocList[i].attributes.partner[0]) : null,
              middleName: parsedDocList[i].attributes.middleName[0],
              phone: parsedDocList[i].attributes.phone[0]
            }
            newDocList.push(newUser)
          }
          catch (er) { console.log("ERR", er) }
        }
        let sortedDocList = newDocList.sort(dynamicSort("online", 1, "Bool"))
        console.log("DOCL", sortedDocList)
        setInitialDocList(sortedDocList)
        setFilteredDocList(sortedDocList)
        if (props.userTask.selectedDoc !== "null") {
          let parsedDoc = JSON.parse(props.userTask.selectedDoc)
          // console.log("SHDOC", parsedDoc)
          setFieldValue(parsedDoc)
          setSelectedDoc(parsedDoc)
          filterDocList(0, s - 1, sortedDocList, parsedDoc)
        }
        else { fetchBySize(0, s - 1, sortedDocList) }
        setIsSearchForm(true)
      }
      catch (er) {
        props.callErrorToast("Ошибка сбора списка данных " + props.userTask.taskType)
        setFilteredDocList([])
        setIsSearchForm(true)
        setInitialDocList([])
        setDocList([])
      }
    }
    if (props.userTask.selectedDoc !== "null" && props.userTask.selectedDoc !== null && props.userTask.docList === "null") {
      let parsedDoc = JSON.parse(props.userTask.selectedDoc)
      setUserEnabled(parsedDoc.enabled)
      let fields = {
        // id: parsedDoc.id,
        username: parsedDoc.username,
        firstName: parsedDoc.firstName,
        lastName: parsedDoc.lastName,
        email: parsedDoc.email
      }
      for (let i in parsedDoc.attributes) {
        let value = parsedDoc.attributes[i][0] === "true" ? true : parsedDoc.attributes[i][0] === "false" ? false : parsedDoc.attributes[i][0]
        fields[i] = value
      }
      setFieldValue(fields)
      setSelectedDoc(parsedDoc)
      console.log("SDOC", fields)
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
    // var d = new Date(1628246614000)
    // let nd = d.toLocaleString()
    // console.log("TIME", nd)
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

  const handleCheckboxChange = (event) => {
    console.log("CHECK", event.target.name, event.target.checked)
    if (event.target.name === "selectAllAdminFunctions") {
      for (let s = 0; s < Form.sections.length; s++) {
        if (Form.sections[s].name === "administartor") {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            fieldValue[Form.sections[s].contents[c].name] = event.target.checked
            setFieldValue(fieldValue)
          }
        }
      }
    }
    else if (event.target.name === "selectAllTradingFunctions") {
      for (let s = 0; s < Form.sections.length; s++) {
        if (Form.sections[s].name === "tradingSystems") {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            fieldValue[Form.sections[s].contents[c].name] = event.target.checked
            setFieldValue(fieldValue)
          }
        }
      }
    }
    else if (event.target.name === "selectAllMainFunctions") {
      for (let s = 0; s < Form.sections.length; s++) {
        if (Form.sections[s].name === "mainFunctions") {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            fieldValue[Form.sections[s].contents[c].name] = event.target.checked
            setFieldValue(fieldValue)
          }
        }
      }
    }
    else if (event.target.name === "selectAllAccountingFunctions") {
      for (let s = 0; s < Form.sections.length; s++) {
        if (Form.sections[s].name === "accountingDepartment") {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            fieldValue[Form.sections[s].contents[c].name] = event.target.checked
            setFieldValue(fieldValue)
          }
        }
      }
    }
    else if (event.target.name === "selectAllMortgageFunctions") {
      for (let s = 0; s < Form.sections.length; s++) {
        if (Form.sections[s].name === "mortgageCoverage") {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            fieldValue[Form.sections[s].contents[c].name] = event.target.checked
            setFieldValue(fieldValue)
          }
        }
      }
    }
    else if (event.target.name === "selectAllInstructionTypes") {
      for (let s = 0; s < Form.sections.length; s++) {
        if (Form.sections[s].name === "InstructionsAccessSection") {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            fieldValue[Form.sections[s].contents[c].name] = event.target.checked
            setFieldValue(fieldValue)
          }
        }
      }
    }
    else if (event.target.name === "selectAllReportTypes") {
      for (let s = 0; s < Form.sections.length; s++) {
        if (Form.sections[s].name === "ReportsAccessSection") {
          for (let c = 0; c < Form.sections[s].contents.length; c++) {
            fieldValue[Form.sections[s].contents[c].name] = event.target.checked
            setFieldValue(fieldValue)
          }
        }
      }
    }
    else {
      setFieldValue({ ...fieldValue, [event.target.name]: event.target.checked })
    }
    setUpdateState(getUUID())
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
  // get rows amount of filtered users by size
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
  function handleTextChange(event) {
    // console.log("EVENT", event.target.name, event.target.value)
    fieldValue[event.target.name] = event.target.value
    setFieldValue(fieldValue)
    console.log("FIELDVALUE", fieldValue)
  }
  function handleSelectChange(event) {
    console.log("SO", event, fieldValue)
    fieldValue[event.name] = event.value
    setFieldValue(fieldValue)
    let updateSelectedOptions = selectedOptions.slice()
    let noSuchOption = true
    for (let i = 0; i < updateSelectedOptions.length; i++) {
      if (event.name === updateSelectedOptions[i].name) {
        updateSelectedOptions[i] = event
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
      updateSelectedOptions.push(event)
      setSelectedOptions(updateSelectedOptions)
      // console.log("SO", selectedOptions)
    }

    if (event.name === "userRole" && props.userTask.taskType === "showCreateUser") {
      if (event.value === 1) {
        // console.log("SO", event.name, event.value)
        for (let i = 0; i < Form.sections.length; i++) {
          for (let c = 0; c < Form.sections[i].contents.length; c++) {
            if (Form.sections[i].contents[c].type === "Bool") {
              fieldValue[Form.sections[i].contents[c].name] = true
              setFieldValue(fieldValue)
            }
          }
        }
      }
    }
  }
  // Collect data to create new user in REST
  function getFieldValuesRest(keycloakUser) {
    let restUser = {
      user_id: null,
      name: fieldValue["username"],
      lastname: fieldValue["lastName"],
      firstname: fieldValue["firstName"],
      email: fieldValue["email"],
      attributes: JSON.stringify(keycloakUser.attributes)
    }
    for (let key in keycloakUser.attributes) {
      if (key === "userId") {
        restUser["user_id"] = keycloakUser.attributes[key]
      }
    }
    return restUser
  }
  // Collect data to create new user
  function getFieldValuesKeycloakCreate() {
    let attrs = {
      locale: "ru",
      userId: getUUID(),
      enabled: true
    }
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let name = Form.sections[s].contents[c].name
        let type = Form.sections[s].contents[c].type
        // console.log("NAME ", name, "VAL", fieldValue[name])
        if (name !== "username" && name !== "firstName" && name !== "lastName" && name !== "email") {
          if (type === "Enum") {
            if (fieldValue[name] === "" || fieldValue[name] === undefined) {
              attrs[name] = null
            }
            else {
              let value = fieldValue[name]
              attrs[name] = value
            }
          }
          else if (type === "Text") {
            if (fieldValue[name] === "" || fieldValue[name] === undefined) {
              attrs[name] = "-"
            }
            else {
              let value = fieldValue[name]
              attrs[name] = value
            }
          }
          else if (type === "Bool") {
            if (fieldValue[name] === undefined) {
              attrs[name] = false
            }
            else {
              let value = fieldValue[name]
              attrs[name] = value
            }
          }

        }

      }
    }
    let newUser = {
      username: fieldValue["username"],
      firstName: fieldValue["firstName"],
      lastName: fieldValue["lastName"],
      email: fieldValue["email"],
      emailVerified: true,
      enabled: true,
      requiredActions: ["UPDATE_PASSWORD"],
      attributes: attrs,
      credentials: [
        {
          type: "password",
          value: "12345"
        }
      ]
    }
    // console.log("USER", newUser)
    return newUser
  }
  // Collect data to update existed user
  function getFieldValuesKeycloakUpdate() {
    let attrs = {
      locale: "ru",
      userId: fieldValue["userId"],
      enabled: selectedDoc.enabled
    }
    for (let s = 0; s < Form.sections.length; s++) {
      for (let c = 0; c < Form.sections[s].contents.length; c++) {
        let name = Form.sections[s].contents[c].name
        let type = Form.sections[s].contents[c].type
        if (name !== "username" && name !== "firstName" && name !== "lastName" && name !== "email" && name !== "selectAllAdminFunctions"
          && name !== "selectAllTradingFunctions" && name !== "selectAllMainFunctions" && name !== "selectAllAccountingFunctions"
          && name !== "selectAllMortgageFunctions" && name !== "selectAllInstructionTypes" && name !== "selectAllReportTypes") {
          if (type === "Enum") {
            if (fieldValue[name] === "" || fieldValue[name] === undefined) {
              attrs[name] = null
            }
            else {
              let value = fieldValue[name]
              attrs[name] = value
            }
          }
          else if (type === "Text") {
            if (fieldValue[name] === "" || fieldValue[name] === undefined) {
              attrs[name] = "-"
            }
            else {
              let value = fieldValue[name]
              attrs[name] = value
            }
          }
          else if (type === "Bool") {
            if (fieldValue[name] === undefined) {
              attrs[name] = false
            }
            else {
              let value = fieldValue[name]
              attrs[name] = value
            }
          }
        }

      }
    }
    let updateUser = {
      username: fieldValue["username"],
      firstName: fieldValue["firstName"],
      lastName: fieldValue["lastName"],
      email: fieldValue["email"],
      emailVerified: true,
      enabled: selectedDoc.enabled,
      attributes: attrs
    }
    // console.log("UPDATE", updateUser)
    return updateUser
  }
  // Collect data to reset existed user password
  function getFieldValuesKeycloakResetPassword() {
    let attrs = {}
    for (let key in selectedDoc.attributes) {
      attrs[key] = selectedDoc.attributes[key][0]
    }

    let updateUser = {
      username: selectedDoc.username,
      firstName: selectedDoc["firstName"],
      lastName: selectedDoc["lastName"],
      email: selectedDoc["email"],
      emailVerified: true,
      enabled: selectedDoc.enabled,
      requiredActions: ["UPDATE_PASSWORD"],
      attributes: attrs,
      credentials: [
        {
          type: "password",
          value: "12345"
        }
      ]
    }
    return updateUser
  }
  // Collect data to set state deleted
  function getFieldValuesKeycloakChangeAccesUser(access) {
    console.log("ACC", access)
    let attrs = {}
    for (let key in selectedDoc.attributes) {
      if (key === "enabled") {
        attrs[key] = access
      }
      else {
        attrs[key] = selectedDoc.attributes[key][0]
      }
    }
    let updateUser = {
      username: selectedDoc.username,
      firstName: selectedDoc["firstName"],
      lastName: selectedDoc["lastName"],
      email: selectedDoc["email"],
      emailVerified: true,
      enabled: access,
      attributes: attrs
    }
    return updateUser
  }

  // // Validate input data
  // function checkForWrongFields(commandJson) {
  //   let enabledToSend = false
  //   var parsedGridFormData = JSON.parse(props.userTask.docList)
  //   if (fieldValue["userRole"] !== undefined && fieldValue["userRole"] !== "") {
  //     if (fieldValue["username"] !== undefined && fieldValue["username"] !== "") {
  //       if (fieldValue["firstName"] !== undefined && fieldValue["firstName"] !== "") {
  //         if (fieldValue["lastName"] !== undefined && fieldValue["lastName"] !== "") {
  //           if (fieldValue["username"] !== undefined && fieldValue["username"] !== "") {
  //             if (fieldValue["partner"] !== undefined && fieldValue["partner"] !== "") {
  //               for (let i = 0; i < parsedGridFormData.length; i++) {
  //                 if (parsedGridFormData[i].username === fieldValue["username"]) {
  //                   enabledToSend = false
  //                   return props.callErrorToast("Пользователь с таким логином уже существует", "warning")
  //                 } else enabledToSend = true
  //               }
  //             } else props.callErrorToast("Введите Контрагента", "warning")
  //           } else props.callErrorToast("Введите Email", "warning")
  //         } else props.callErrorToast("Введите Имя", "warning")
  //       } else props.callErrorToast("Введите Фамилию", "warning")
  //     } else props.callErrorToast("Введите Логин", "warning")
  //   } else props.callErrorToast("Введите Роль", "warning")
  //   if (enabledToSend === true) {
  //     props.sendFieldValues(commandJson)
  //     props.clearTabData(process_id)
  //   }
  // }
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
  async function buttonClick(buttonName, item) {
    if (buttonName === "createUser") {
      // let KeycloakDoc = getFieldValuesSelectedDoc()
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          authorization: { value: "token" },
          userAction: { value: "createUser" },
          searchDoc: { value: JSON.stringify(fieldValue) }
        }
      }
      console.log("button createUser: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "saveUser") {
      // console.log("button saveUser: ", keycloakUser, restUser)
      let keycloakUser = getFieldValuesKeycloakCreate()
      // let role = getEnumLabelById("userRole")
      let restUser = getFieldValuesRest(keycloakUser)
      // let userMgment = role === "Администратор" ? "true" : "false"
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          authorization: { value: "token" },
          userAction: { value: "saveUser" },
          keycloakUserData: { value: JSON.stringify(keycloakUser) },
          restUserData: { value: JSON.stringify(restUser) },
          createdUserName: { value: fieldValue["username"] }
        }
      }
      let checkResult = checkForRequieredFields()
      if (checkResult === true) {
        console.log("updateUser:", commandJson)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (buttonName === "findUser") {
      filterDocList(0, size, initialDocList, fieldValue)
    }
    else if (buttonName === "editUser") {
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
          authorization: { value: "token" },
          userAction: { value: "editUser" },
          keycloakUserId: { value: item.id },
          searchDoc: { value: JSON.stringify(fieldValue) }
        }
      }
      console.log("button editUser: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (buttonName === "updateUser") {
      let keycloakUser = getFieldValuesKeycloakUpdate()
      // let role = getEnumLabelById("userRole")
      let restUser = getFieldValuesRest(keycloakUser)
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          authorization: { value: "token" },
          userAction: { value: "updateUser" },
          keycloakUserId: { value: selectedDoc.id },
          keycloakUserData: { value: JSON.stringify(keycloakUser) },
          restUserData: { value: JSON.stringify(restUser) },
          setRoleBody: { value: JSON.stringify([{ "id": "b9bc93bb-7915-485b-8c46-925098613a59", "name": "userManagement" }]) }
        }
      }
      let checkResult = checkForRequieredFields()
      if (checkResult === true) {
        console.log("updateUser:", commandJson)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (buttonName === "resetPassword") {
      swal({
        text: "Вы точно хотите сбросить пароль?",
        icon: "warning",
        buttons: { ok: "Да", cancel: "Отмена" }
      })
        .then((click) => {
          if (click === "ok") {
            var keycloakUser = getFieldValuesKeycloakResetPassword()
            let commandJson =
            {
              commandType: "completeTask",
              session_id: session_id,
              process_id: process_id,
              taskID: taskID,
              userId: userProfile.userId,
              userRole: userProfile.userRole,
              variables: {
                authorization: { value: "token" },
                userAction: { value: "resetPassword" },
                keycloakUserId: { value: selectedDoc.id },
                keycloakUserData: { value: JSON.stringify(keycloakUser) }
              }
            }
            props.sendFieldValues(commandJson)
            props.clearTabData(process_id)
            console.log("REST PWD:", commandJson)
          }
        })
    }
    else if (buttonName === "disableUser") {
      swal({
        text: "Вы точно хотите заблокировать пользователя?",
        icon: "warning",
        buttons: { ok: "Да", cancel: "Отмена" }
      })
        .then((click) => {
          if (click === "ok") {
            let keycloakUser = getFieldValuesKeycloakChangeAccesUser(false)
            let restUser = getFieldValuesRest(keycloakUser)
            let commandJson =
            {
              commandType: "completeTask",
              session_id: session_id,
              process_id: process_id,
              taskID: taskID,
              userId: userProfile.userId,
              userRole: userProfile.userRole,
              variables: {
                userAction: { value: "disableUser" },
                keycloakUserId: { value: selectedDoc.id },
                keycloakUserData: { value: JSON.stringify(keycloakUser) },
                restUserData: { value: JSON.stringify(restUser) }
              }
            }
            console.log("disableUser:", commandJson)
            props.sendFieldValues(commandJson)
            props.clearTabData(process_id)
          }
        })
    }
    else if (buttonName === "enableUser") {
      let keycloakUser = getFieldValuesKeycloakChangeAccesUser(true)
      let restUser = getFieldValuesRest(keycloakUser)
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "enableUser" },
          keycloakUserId: { value: selectedDoc.id },
          keycloakUserData: { value: JSON.stringify(keycloakUser) },
          restUserData: { value: JSON.stringify(restUser) }
        }
      }
      console.log("enableUser:", commandJson)
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
      console.log("Button ", buttonName)
    }
  }

  // Create sections with labels and call bodyBuilder function
  function sectionBuilder(section, index) {
    return (
      <MTable size="small" key={index + "table"}>
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
      </MTable>
    )
  }
  // Create body of each section and call contentBuilder function
  function bodyBuilder(section) {
    return (
      <MTable size="small">
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
      </MTable>
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
          // key={this.getUUID()}
          style={{ maxWidth: 20, height: 15, color: (formType === "view" || contentItem.edit === false) ? "grey" : "green" }}
          name={contentItem.name}
          onChange={handleCheckboxChange}
          disabled={(formType === "view" || contentItem.edit === false) ? true : false}
          checked={fieldValue[contentItem.name] === true ? true : false}
        />
      )
    }
  }
  function onKeyPressText(event) {
    let code = event.charCode
    if (code === 13) {
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].name === "findUser") {
          console.log("CODE", code)
          handleTextChange(event)
          buttonClick("findUser", null)
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
              }
            }
          }
          else {
            // console.log("Ошибка сбора справочной информации ")
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
  function handleCloseSnackBar() {
    setShowSnackBar(false)
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
  function getFontColor(dataItem) {
    if (dataItem.enabled === true) {
      if (dataItem.online === true) {
        return "green"
      }
      else {
        return "black"
      }
    }
    else {
      return "#FE6767"
    }
  }
  if (docList === null && props.userTask.taskType === "showSearchUser") {
    return <LinearProgress />
  }
  else {
    return (
      <Grid>
        {/* Create main search table */}
        <Grid container direction="row" justify="flex-start" spacing={1}>
          <Grid item xs={9}>
            <Paper>
              <MTable>
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
              </MTable>
            </Paper>
          </Grid>
          <Grid container direction="row" justify="flex-start" alignItems="flex-start">
            {buttons.map((button, index) => {
              if (button.name === "disableUser") {
                if (userEnabled === true) {
                  return (
                    <Button
                      key={index}
                      name={button.name}
                      variant="outlined"
                      value={button.name}
                      onClick={() => buttonClick(button.name, null)}
                      style={{
                        margin: 3,
                        backgroundColor: button.backgroundColor,
                        height: 32,
                        fontSize: 12
                      }}
                    >{button.label}
                    </Button>
                  )
                }
              }
              else if (button.name === "enableUser") {
                if (userEnabled === false) {
                  return (
                    <Button
                      key={button.name + index}
                      name={button.name}
                      variant="outlined"
                      value={button.name}
                      onClick={() => buttonClick(button.name, null)}
                      style={{
                        margin: 3,
                        backgroundColor: button.backgroundColor,
                        height: 32,
                        fontSize: 12
                      }}
                    >{button.label}
                    </Button>
                  )
                }
              }
              else {
                return (
                  <Button
                    key={button.name + index}
                    name={button.name}
                    variant="outlined"
                    value={button.name}
                    onClick={() => buttonClick(button.name, null)}
                    style={{
                      margin: 3,
                      backgroundColor: button.backgroundColor,
                      height: 32,
                      fontSize: 12
                    }}
                  >{button.label}
                  </Button>
                )
              }
            }
            )}
          </Grid>
        </Grid>
        {isSearchForm === true &&
          <ReplayIcon style={{ paddingTop: 3, cursor: "pointer" }} onClick={() => buttonClick("updateDocList")} />
        }
        {/* Create grid table with data from doclist */}
        {docList !== null && props.userTask.taskType === "showSearchUser" &&
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
                    <TableBody>
                      {Object.keys(docList).length !== 0 &&
                        docList.map(dataItem => (
                          <tr style={{ "height": 30 }}>
                            <td class="td-style" style={{ "maxWidth": 34 }}>
                              {gridFormButtons !== "null" &&
                                gridFormButtons.map(button =>
                                  <Button
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
                                    <td align="left" style={{ color: getFontColor(dataItem), fontWeight: dataItem.online === true ? "bold" : "normal", fontSize: 12, "text-align": "center", "border-bottom": "1px solid grey" }}>
                                      {getGridFormItems(dataItem, contentItem)}
                                    </td>
                                  )
                                }
                              })
                            ))}
                          </tr>
                        )
                        )}
                    </TableBody>
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
        <Snackbar
          open={showSnackBar}
          onClose={() => handleCloseSnackBar()}
          autoHideDuration={1200}
          message={snackBarMessage}
        />
      </Grid>
    )
  }
};
