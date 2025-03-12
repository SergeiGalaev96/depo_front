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
import TextField from '@material-ui/core/TextField';
import Modal from '@material-ui/core/Modal';
// Icons
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import LinearProgress from '@material-ui/core/LinearProgress';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
// Form components
import Checkbox from '@material-ui/core/Checkbox';
// Libraries
import swal from 'sweetalert' // https://sweetalert.js.org/guides/

var generator = require('generate-password');

const useStyles = makeStyles(theme => ({
  modal: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #AFAFAF',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
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

export default (props) => {
  // This.state
  const classes = useStyles()
  const [userProfile] = useState(props.userProfile)
  const [session_id] = useState(props.userTask.session_id)
  const [process_id] = useState(props.userTask.process_id)
  const [taskID] = useState(props.userTask.taskID)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [fieldValue, setFieldValue] = useState({})
  const [buttons] = useState(props.userTask.buttons)
  const [sectionColor] = useState("#B2E0C9")
  const [updateState, setUpdateState] = useState(false)
  const [selectedRow, setSelectedRow] = useState("")

  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("create")
  const [selectedSectionName, setSelectedSectionName] = useState("")
  const [modalStyle] = useState(getModalStyle)
  const [modalFieldValue, setModalFieldValue] = useState({ type: "Text", name: "", label: "", enumDef: "", edit: true, show: true, required: false })

  // Set data from props to state of component
  useEffect(() => {
    console.log("FORMS PROPS", props)
    if (props.userTask.selectedDoc !== "null" && props.userTask.selectedDoc !== undefined && props.userTask.selectedDoc !== null) {
      let parsedSelectedDoc = JSON.parse(props.userTask.selectedDoc)
      if (typeof parsedSelectedDoc === "string") {
        parsedSelectedDoc = JSON.parse(parsedSelectedDoc)
      }
      let fields = {}
      console.log("SDOC", parsedSelectedDoc)
      for (let s = 0; s < parsedSelectedDoc.sections.length; s++) {
        for (let c = 0; c < parsedSelectedDoc.sections[s].contents.length; c++) {
          let contName = parsedSelectedDoc.sections[s].contents[c].name
          // console.log("ITEM", parsedSelectedDoc.sections[s].contents[c])
          // fields[contName] = {
          //   type: parsedSelectedDoc.sections[s].contents[c].type,
          //   name: parsedSelectedDoc.sections[s].contents[c].name,
          //   label: parsedSelectedDoc.sections[s].contents[c].label,
          //   enumDef: parsedSelectedDoc.sections[s].contents[c].enumDef !== undefined ? parsedSelectedDoc.sections[s].contents[c].enumDef : "",
          //   edit: parsedSelectedDoc.sections[s].contents[c].edit,
          //   show: parsedSelectedDoc.sections[s].contents[c].show,
          //   required: parsedSelectedDoc.sections[s].contents[c].required !== undefined ? parsedSelectedDoc.sections[s].contents[c].required : false
          // }
          fields[contName] = parsedSelectedDoc.sections[s].contents[c]
        }
      }
      console.log("FORM FIELDS", fields)
      // Check form items to be checked
      if (props.userTask.docId !== "null") {
        let instructionTypeDoc = JSON.parse(props.userTask.docId)
        console.log("DOC", parsedSelectedDoc, instructionTypeDoc)
        parsedSelectedDoc.label = parsedSelectedDoc.label + instructionTypeDoc.name
        if (instructionTypeDoc.account_from === 1) {
          for (let s = 0; s < parsedSelectedDoc.sections.length; s++) {
            for (let c = 0; c < parsedSelectedDoc.sections[s].contents.length; c++) {
              let cItem = parsedSelectedDoc.sections[s].contents[c]
              let contName = cItem.name
              if (contName === "accFrom") {
                parsedSelectedDoc.sections[s].contents[c].show = true
                cItem.show = true
                cItem.required = cItem.required !== undefined ? cItem.required : false
                fields[contName] = cItem
                // fields[contName] = {
                //   edit: parsedSelectedDoc.sections[s].contents[c].edit,
                //   show: true,
                //   required: parsedSelectedDoc.sections[s].contents[c].required !== undefined ? parsedSelectedDoc.sections[s].contents[c].required : false
                // }
              }
              if (contName === "depositor") {
                parsedSelectedDoc.sections[s].contents[c].show = true
                cItem.show = true
                cItem.required = cItem.required !== undefined ? cItem.required : false
                fields[contName] = cItem
                // fields[contName] = {
                //   edit: parsedSelectedDoc.sections[s].contents[c].edit,
                //   show: true,
                //   required: parsedSelectedDoc.sections[s].contents[c].required !== undefined ? parsedSelectedDoc.sections[s].contents[c].required : false
                // }
              }
            }
          }
        }
        if (instructionTypeDoc.account_to === 1) {
          for (let s = 0; s < parsedSelectedDoc.sections.length; s++) {
            for (let c = 0; c < parsedSelectedDoc.sections[s].contents.length; c++) {
              let cItem = parsedSelectedDoc.sections[s].contents[c]
              let contName = cItem.name
              if (contName === "accTo") {
                parsedSelectedDoc.sections[s].contents[c].show = true
                cItem.show = true
                cItem.required = cItem.required !== undefined ? cItem.required : false
                fields[contName] = cItem
                // fields[contName] = {
                //   edit: parsedSelectedDoc.sections[s].contents[c].edit,
                //   show: true,
                //   required: parsedSelectedDoc.sections[s].contents[c].required !== undefined ? parsedSelectedDoc.sections[s].contents[c].required : false
                // }
              }
              if (contName === "depositor2") {
                parsedSelectedDoc.sections[s].contents[c].show = true
                cItem.show = true
                cItem.required = cItem.required !== undefined ? cItem.required : false
                fields[contName] = cItem
                // fields[contName] = {
                //   edit: parsedSelectedDoc.sections[s].contents[c].edit,
                //   show: true,
                //   required: parsedSelectedDoc.sections[s].contents[c].required !== undefined ? parsedSelectedDoc.sections[s].contents[c].required : false
                // }
              }
            }
          }
        }
        if (instructionTypeDoc.corr === 1) {
          for (let s = 0; s < parsedSelectedDoc.sections.length; s++) {
            for (let c = 0; c < parsedSelectedDoc.sections[s].contents.length; c++) {
              let cItem = parsedSelectedDoc.sections[s].contents[c]
              let contName = cItem.name
              if (contName === "corrDepository") {
                parsedSelectedDoc.sections[s].contents[c].show = true
                cItem.show = true
                cItem.required = cItem.required !== undefined ? cItem.required : false
                fields[contName] = cItem
                // fields[contName] = {
                //   edit: parsedSelectedDoc.sections[s].contents[c].edit,
                //   show: true,
                //   required: parsedSelectedDoc.sections[s].contents[c].required !== undefined ? parsedSelectedDoc.sections[s].contents[c].required : false
              }
            }
          }
        }
        if (instructionTypeDoc.owner === 1) {
          for (let s = 0; s < parsedSelectedDoc.sections.length; s++) {
            for (let c = 0; c < parsedSelectedDoc.sections[s].contents.length; c++) {
              let cItem = parsedSelectedDoc.sections[s].contents[c]
              let contName = cItem.name
              if (contName === "ownerName") {
                parsedSelectedDoc.sections[s].contents[c].show = true
                cItem.show = true
                cItem.required = cItem.required !== undefined ? cItem.required : false
                fields[contName] = cItem
                // fields[contName] = {
                //   edit: parsedSelectedDoc.sections[s].contents[c].edit,
                //   show: true,
                //   required: parsedSelectedDoc.sections[s].contents[c].required !== undefined ? parsedSelectedDoc.sections[s].contents[c].required : false
                // }
              }
              if (contName === "ownerDocument") {
                parsedSelectedDoc.sections[s].contents[c].show = true
                cItem.show = true
                cItem.required = cItem.required !== undefined ? cItem.required : false
                fields[contName] = cItem
                // fields[contName] = {
                //   edit: parsedSelectedDoc.sections[s].contents[c].edit,
                //   show: true,
                //   required: parsedSelectedDoc.sections[s].contents[c].required !== undefined ? parsedSelectedDoc.sections[s].contents[c].required : false
                // }
              }
              if (contName === "ownerAddress") {
                parsedSelectedDoc.sections[s].contents[c].show = true
                cItem.show = true
                cItem.required = cItem.required !== undefined ? cItem.required : false
                fields[contName] = cItem
                // fields[contName] = {
                //   edit: parsedSelectedDoc.sections[s].contents[c].edit,
                //   show: true,
                //   required: parsedSelectedDoc.sections[s].contents[c].required !== undefined ? parsedSelectedDoc.sections[s].contents[c].required : false
                // }
              }
            }
          }
        }
        if (instructionTypeDoc.trade === 1) {
          for (let s = 0; s < parsedSelectedDoc.sections.length; s++) {
            for (let c = 0; c < parsedSelectedDoc.sections[s].contents.length; c++) {
              let cItem = parsedSelectedDoc.sections[s].contents[c]
              let contName = cItem.name
              if (contName === "tradingSystem") {
                parsedSelectedDoc.sections[s].contents[c].show = true
                cItem.show = true
                cItem.required = cItem.required !== undefined ? cItem.required : false
                fields[contName] = cItem
                // cItem.show = true
                // cItem.required = cItem.required !== undefined ? cItem.required : false
                // fields[contName] = cItem
                // fields[contName] = {
                //   edit: parsedSelectedDoc.sections[s].contents[c].edit,
                //   show: true,
                //   required: parsedSelectedDoc.sections[s].contents[c].required !== undefined ? parsedSelectedDoc.sections[s].contents[c].required : false
                // }
              }
            }
          }
        }
        if (instructionTypeDoc.it_base === 1) {
          for (let s = 0; s < parsedSelectedDoc.sections.length; s++) {
            for (let c = 0; c < parsedSelectedDoc.sections[s].contents.length; c++) {
              let cItem = parsedSelectedDoc.sections[s].contents[c]
              let contName = cItem.name
              if (contName === "security") {
                parsedSelectedDoc.sections[s].contents[c].show = true
                cItem.show = true
                cItem.required = cItem.required !== undefined ? cItem.required : false
                fields[contName] = cItem
                // fields[contName] = {
                //   edit: parsedSelectedDoc.sections[s].contents[c].edit,
                //   show: true,
                //   required: parsedSelectedDoc.sections[s].contents[c].required !== undefined ? parsedSelectedDoc.sections[s].contents[c].required : false
                // }
              }
              if (contName === "issuer") {
                parsedSelectedDoc.sections[s].contents[c].show = true
                cItem.show = true
                cItem.required = cItem.required !== undefined ? cItem.required : false
                fields[contName] = cItem
                // fields[contName] = {
                //   edit: parsedSelectedDoc.sections[s].contents[c].edit,
                //   show: true,
                //   required: parsedSelectedDoc.sections[s].contents[c].required !== undefined ? parsedSelectedDoc.sections[s].contents[c].required : false
                // }
              }
            }
          }
        }
        if (instructionTypeDoc.it_base === 2) {
          for (let s = 0; s < parsedSelectedDoc.sections.length; s++) {
            for (let c = 0; c < parsedSelectedDoc.sections[s].contents.length; c++) {
              let cItem = parsedSelectedDoc.sections[s].contents[c]
              let contName = cItem.name
              if (contName === "currency") {
                parsedSelectedDoc.sections[s].contents[c].show = true
                cItem.show = true
                cItem.required = cItem.required !== undefined ? cItem.required : false
                fields[contName] = cItem
                // fields[contName] = {
                //   edit: parsedSelectedDoc.sections[s].contents[c].edit,
                //   show: true,
                //   required: parsedSelectedDoc.sections[s].contents[c].required !== undefined ? parsedSelectedDoc.sections[s].contents[c].required : false
                // }
              }
              if (contName === "quantity") {
                parsedSelectedDoc.sections[s].contents[c].show = true
                cItem.show = true
                cItem.required = cItem.required !== undefined ? cItem.required : false
                fields[contName] = cItem
                // fields[contName] = {
                //   edit: parsedSelectedDoc.sections[s].contents[c].edit,
                //   show: true,
                //   required: parsedSelectedDoc.sections[s].contents[c].required !== undefined ? parsedSelectedDoc.sections[s].contents[c].required : false
                // }
              }
            }
          }
        }
      }
      setFieldValue(fields)
      setSelectedDoc(parsedSelectedDoc)
    }
    setUpdateState(getUUID())
  }, [])

  // random UUID generator
  function getUUID() {
    const uuidv1 = require("uuid/v1")
    return uuidv1()
  }
  // Collect data to update doc
  function getFieldValuesCreateUpdateForm() {
    let formToUpdate = selectedDoc
    for (let s = 0; s < selectedDoc.sections.length; s++) {
      for (let c = 0; c < selectedDoc.sections[s].contents.length; c++) {
        let contName = selectedDoc.sections[s].contents[c].name
        formToUpdate.sections[s].contents[c].type = fieldValue[contName].type
        formToUpdate.sections[s].contents[c].name = fieldValue[contName].name
        formToUpdate.sections[s].contents[c].label = fieldValue[contName].label
        formToUpdate.sections[s].contents[c].enumDef = fieldValue[contName].enumDef
        formToUpdate.sections[s].contents[c].edit = fieldValue[contName].edit
        formToUpdate.sections[s].contents[c].show = fieldValue[contName].show
        formToUpdate.sections[s].contents[c].required = fieldValue[contName].required
      }
    }
    return formToUpdate
  }
  function buttonClick(name, item) {
    if (name === "updateDocument") {
      let form = getFieldValuesCreateUpdateForm()
      let updateBody = {
        "defid": selectedDoc.defid,
        "created_at": selectedDoc.created_at,
        "data": JSON.stringify(form)
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
          userAction: { value: "updateDocument" },
          document: { value: JSON.stringify(updateBody) }
        }
      }
      console.log("updateForm:", form)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (name === "showInstructionTypeEditForm") {
      let defid = getUUID()
      let form = getFieldValuesCreateUpdateForm()
      form.defid = defid
      let createBody = {
        "defid": defid,
        "data": JSON.stringify(form)
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
          userAction: { value: "showInstructionTypeEditForm" },
          instructionTypeCreateFormDefId: { value: defid },
          instructionTypeCreateFormBody: { value: JSON.stringify(createBody) }
        }
      }
      console.log("showInstructionTypeEditForm:", commandJson)
      props.sendFieldValues(commandJson)
    }
    else if (name === "saveInstructionType") {
      let defid = getUUID()
      let form = getFieldValuesCreateUpdateForm()
      form.defid = defid
      let createBody = {
        "defid": defid,
        "data": JSON.stringify(form)
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
          userAction: { value: "saveInstructionType" },
          instructionTypeEditFormDefId: { value: defid },
          instructionTypeEditFormBody: { value: JSON.stringify(createBody) }
        }
      }
      console.log("saveInstructionType:", commandJson)
      props.sendFieldValues(commandJson)
    }
    else if (name === "saveContentItem") {
      if (modalType === "create") {
        // console.log("create", modalFieldValue)
        let newSelDoc = { ...selectedDoc }
        for (let s = 0; s < selectedDoc.sections.length; s++) {
          if (selectedDoc.sections[s].name === selectedSectionName) {
            newSelDoc.sections[s].contents.push(modalFieldValue)
          }
        }
        setFieldValue({ ...fieldValue, [modalFieldValue.name]: modalFieldValue })
        setSelectedDoc(newSelDoc)
        setShowModal(false)
        setModalFieldValue({ type: "Text", name: "", label: "", enumDef: "", edit: true, show: true, required: false })
      }
      else {
        let newSelDoc = { ...selectedDoc }
        for (let s = 0; s < selectedDoc.sections.length; s++) {
          for (let c = 0; c < selectedDoc.sections[s].contents.length; c++) {
            if (selectedDoc.sections[s].contents[c].name === modalFieldValue.name) {
              newSelDoc.sections[s].contents[c] = modalFieldValue
            }
          }
        }
        setFieldValue({ ...fieldValue, [modalFieldValue.name]: modalFieldValue })
        setSelectedDoc(newSelDoc)
        setShowModal(false)
        setModalFieldValue({ type: "Text", name: "", label: "", enumDef: "", edit: true, show: true, required: false })
        // console.log("edit")
      }

    }

    else if (name === "back") {
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
    else if (name === "cancel") {
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
      console.log("UNKNOWN Button ", name)
    }
  }
  function handleFormLabelChange(event) {
    selectedDoc.label = event.target.value
    setSelectedDoc(selectedDoc)
  }
  function handleSectionLabelChange(event) {
    for (let s = 0; s < selectedDoc.sections.length; s++) {
      if (event.target.name === selectedDoc.sections[s].name) {
        selectedDoc.sections[s].label = event.target.value
        setSelectedDoc(selectedDoc)
        break
      }
    }
    // console.log("SECT LABEL", selectedDoc)
  }
  function handleContentItemLabelChange(event) {
    let contFields = fieldValue[event.target.name]
    contFields.label = event.target.value
    setFieldValue({ ...fieldValue, [event.target.name]: contFields })
    // console.log("FIELDVAL", fieldValue)
  }
  function handleModalContentItemTextChange(event) {
    setModalFieldValue({ ...modalFieldValue, [event.target.name]: event.target.value })
    console.log("MOD FIELDVAL", modalFieldValue)
  }
  const handleModalContentItemCheckBoxChange = (event) => {
    setModalFieldValue({ ...modalFieldValue, [event.target.name]: event.target.checked })
    // console.log("FIELDVAL", fieldValue)
  }

  function handleContentItemTypeChange(event) {
    let contFields = fieldValue[event.target.name]
    contFields.type = event.target.value
    setFieldValue({ ...fieldValue, [event.target.name]: contFields })
    // console.log("FIELDVAL", fieldValue)
  }
  function handleContentItemEnumDefChange(event) {
    let contFields = fieldValue[event.target.name]
    contFields.enumDef = event.target.value
    setFieldValue({ ...fieldValue, [event.target.name]: contFields })
    // console.log("FIELDVAL", fieldValue)
  }

  const handleCheckboxEditChange = (event) => {
    let contFields = fieldValue[event.target.name]
    contFields.edit = event.target.checked
    setFieldValue({ ...fieldValue, [event.target.name]: contFields })
    // console.log("FIELDVAL", fieldValue)
  }
  const handleCheckboxShowChange = (event) => {
    let contFields = fieldValue[event.target.name]
    contFields.show = event.target.checked
    setFieldValue({ ...fieldValue, [event.target.name]: contFields })
    // console.log("FIELDVAL", fieldValue)
  }
  const handleCheckboxRequiredChange = (event) => {
    let contFields = fieldValue[event.target.name]
    contFields.required = event.target.checked
    setFieldValue({ ...fieldValue, [event.target.name]: contFields })
    // console.log("FIELDVAL", fieldValue)
  }
  // Pick up selected row
  function contentItemArrowUpClick(itemName) {
    for (let s = 0; s < selectedDoc.sections.length; s++) {
      for (let c = 0; c < selectedDoc.sections[s].contents.length; c++) {
        if (selectedDoc.sections[s].contents[c].name === itemName) {
          if (c > 0) {
            let prevItem = selectedDoc.sections[s].contents[c - 1]
            let currItem = selectedDoc.sections[s].contents[c]
            selectedDoc.sections[s].contents[c - 1] = currItem
            selectedDoc.sections[s].contents[c] = prevItem
            // console.log("UP", selectedDoc.sections[s].contents[c])
            break
          }
        }
      }
    }
    setUpdateState(getUUID())
  }
  // Put down selected row
  function contentItemArrowDownClick(itemName) {
    for (let s = 0; s < selectedDoc.sections.length; s++) {
      for (let c = 0; c < selectedDoc.sections[s].contents.length; c++) {
        if (selectedDoc.sections[s].contents[c].name === itemName) {
          if (c < selectedDoc.sections[s].contents.length - 1) {
            let nextItem = selectedDoc.sections[s].contents[c + 1]
            let currItem = selectedDoc.sections[s].contents[c]
            selectedDoc.sections[s].contents[c + 1] = currItem
            selectedDoc.sections[s].contents[c] = nextItem
            // console.log("DOWN", selectedDoc.sections[s].contents[c])
            break
          }
        }
      }
    }
    setUpdateState(getUUID())
  }
  function contentItemDeleteClick(itemName) {
    return (
      swal({
        text: "Удалить данное поле?",
        icon: "warning",
        buttons: { ok: "Ок", cancel: "Отмена" },
      })
        .then((click) => {
          if (click === "ok") {
            let newSelDoc = { ...selectedDoc }
            for (let s = 0; s < selectedDoc.sections.length; s++) {
              let newContents = []
              for (let c = 0; c < selectedDoc.sections[s].contents.length; c++) {
                if (selectedDoc.sections[s].contents[c].name !== itemName) {
                  newContents.push(selectedDoc.sections[s].contents[c])
                }
              }
              newSelDoc.sections[s].contents = newContents
            }
            setSelectedDoc(newSelDoc)
          }
        })
    )

  }
  function contentItemEditClick(item, sectionName) {
    setModalFieldValue(item)
    setShowModal(true)
    setModalType("edit")
    setSelectedSectionName(sectionName)
  }

  function rowSelected(rowName) {
    setSelectedRow(rowName)
    // console.log("rowSelected", rowName)
  }
  function showContentItemCreateForm(sectionName) {
    setShowModal(true)
    setModalType("create")
    setSelectedSectionName(sectionName)
  }

  // Create sections with labels and call bodyBuilder function
  function sectionBuilder(section) {
    return (
      <Table>
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
                <TextField
                  name={section.name}
                  onBlur={handleSectionLabelChange}
                  style={{ "width": "50%" }}
                  defaultValue={section.label}
                />
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
        {section.contents.length > 0 &&
          bodyBuilder(section)
        }
      </Table>
    )
  }

  // Create body of each section and call contentBuilder function
  function bodyBuilder(section) {
    return (
      <Table size="small" style={{ "border-collapse": "collapse" }}>
        <TableHead>
          <TableRow >
            <TableCell
              align="center"
              style={{ border: "1px solid grey", fontWeight: "bold" }}>
              Наименование
            </TableCell>
            {/* <TableCell
              align="center"
              style={{ border: "1px solid grey", fontWeight: "bold" }}
            >
              Тип
            </TableCell>
            <TableCell
              align="center"
              style={{ border: "1px solid grey", fontWeight: "bold" }}
            >
              ID справочника
            </TableCell> */}
            <TableCell
              align="center"
              style={{ border: "1px solid grey", fontWeight: "bold" }}
            >
              Редактируемое
            </TableCell>
            <TableCell
              align="center"
              style={{ border: "1px solid grey", fontWeight: "bold" }}
            >
              Отображаемое
            </TableCell>
            <TableCell
              align="center"
              style={{ border: "1px solid grey", fontWeight: "bold" }}
            >
              Обязательное
            </TableCell>
            <TableCell
              align="center"
              style={{ border: "1px solid grey", fontWeight: "bold" }}
            >
              Порядок
            </TableCell>
            <TableCell
              align="center"
              style={{ border: "1px solid grey", fontWeight: "bold" }}
            >
              -
            </TableCell>
            <TableCell
              align="center"
              style={{ border: "1px solid grey", fontWeight: "bold", cursor: "pointer" }}
              onClick={() => showContentItemCreateForm(section.name)}
            >
              +
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {section.contents.map(contentItem => (
            <TableRow style={{ backgroundColor: (selectedRow === contentItem.name ? "#B8E9F8" : "white") }} onClick={() => rowSelected(contentItem.name)}>
              <TableCell
                align="center"
                style={{ border: "1px solid grey" }}
                width="20%"
              >
                <TextField
                  name={contentItem.name}
                  onChange={handleContentItemLabelChange}
                  style={{ "width": "100%" }}
                  value={fieldValue[contentItem.name].label}
                  multiline
                />
              </TableCell>
              {/* <TableCell
                align="center"
                style={{ border: "1px solid grey" }}
              >
                <TextField
                  name={contentItem.name}
                  onChange={handleContentItemTypeChange}
                  style={{ "width": "100%" }}
                  value={fieldValue[contentItem.name].type}
                />
              </TableCell>
              <TableCell
                align="center"
                style={{ border: "1px solid grey" }}
              >
                <TextField
                  name={contentItem.name}
                  onChange={handleContentItemEnumDefChange}
                  style={{ "width": "100%" }}
                  value={fieldValue[contentItem.name].enumDef}
                  multiline
                />
              </TableCell> */}
              <TableCell
                align="center"
                style={{ border: "1px solid grey" }}
              >
                <Checkbox
                  style={{ maxWidth: 20, height: 15, color: "green" }}
                  name={contentItem.name}
                  onChange={handleCheckboxEditChange}
                  checked={fieldValue[contentItem.name].edit}
                />
              </TableCell>
              <TableCell
                align="center"
                style={{ border: "1px solid grey" }}
              >
                <Checkbox
                  style={{ maxWidth: 20, height: 15, color: "green" }}
                  name={contentItem.name}
                  onChange={handleCheckboxShowChange}
                  checked={fieldValue[contentItem.name].show}
                />
              </TableCell>
              <TableCell
                align="center"
                style={{ height: 30, border: "1px solid grey" }}
              >
                <Checkbox
                  style={{ maxWidth: 20, height: 15, color: "green" }}
                  name={contentItem.name}
                  onChange={handleCheckboxRequiredChange}
                  checked={fieldValue[contentItem.name].required}
                />
              </TableCell>
              <TableCell
                align="center"
                style={{ height: 30, border: "1px solid grey" }}
              >
                <Grid container direction="row" justify="space-around" alignItems="center">
                  <ArrowUpwardIcon fontSize="middle" style={{ color: "green", cursor: "pointer" }} onClick={() => contentItemArrowUpClick(contentItem.name)} />
                  <ArrowDownwardIcon fontSize="middle" style={{ color: "orange", cursor: "pointer" }} onClick={() => contentItemArrowDownClick(contentItem.name)} />
                </Grid>
              </TableCell>
              <TableCell
                align="center"
                style={{ height: 30, border: "1px solid grey" }}
              >
                <DeleteForeverIcon fontSize="middle" style={{ cursor: "pointer" }} onClick={() => contentItemDeleteClick(contentItem.name)} />
              </TableCell>
              <TableCell
                align="center"
                style={{ height: 30, border: "1px solid grey" }}
              >
                <EditIcon fontSize="middle" style={{ cursor: "pointer" }} onClick={() => contentItemEditClick(contentItem, section.name)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

  if (updateState !== null && selectedDoc !== null) {
    try {
      return (
        <Grid key={updateState}>
          <Grid container direction="row" justify="flex-start" spacing={1}>
            <Grid item xs={12}>
              <Paper>
                <Table style={{ "border-collapse": "collapse", "align": "center" }}>
                  <TableHead>
                    <TableRow style={{ "maxHeight": 25 }}>
                      <TableCell style={{ "fontSize": 16, "color": "black" }}>
                        <TextField
                          onBlur={handleFormLabelChange}
                          style={{ "width": "80%" }}
                          defaultValue={selectedDoc.label}
                        />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <Grid container direction="row" justify="center" alignItems="center">
                    {selectedDoc.sections.map(section => {
                      return sectionBuilder(section)
                    })}
                  </Grid>
                  <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                    {buttons.map((button, index) => (
                      <Button
                        key={index}
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
                    )
                    )}
                  </Grid>
                </Table>
              </Paper>
              <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
              >
                <div style={modalStyle} className={classes.modal}>
                  <table width="100%">
                    <tr>
                      <td width="30%">type</td>
                      <td width="60%">
                        <TextField
                          name={"type"}
                          onChange={handleModalContentItemTextChange}
                          style={{ "width": "100%" }}
                          value={modalFieldValue.type}
                          multiline
                        />
                      </td>
                    </tr>
                    <tr>
                      <td width="30%">name</td>
                      <td width="60%">
                        <TextField
                          name={"name"}
                          onChange={handleModalContentItemTextChange}
                          style={{ "width": "100%" }}
                          value={modalFieldValue.name}
                          multiline
                        />
                      </td>
                    </tr>
                    <tr>
                      <td width="30%">label</td>
                      <td width="60%">
                        <TextField
                          name={"label"}
                          onChange={handleModalContentItemTextChange}
                          style={{ "width": "100%" }}
                          value={modalFieldValue.label}
                          multiline
                        />
                      </td>
                    </tr>
                    <tr>
                      <td width="30%">enumDef</td>
                      <td width="60%">
                        <TextField
                          name={"enumDef"}
                          onChange={handleModalContentItemTextChange}
                          style={{ "width": "100%" }}
                          value={modalFieldValue.enumDef}
                          multiline
                        />
                      </td>
                    </tr>
                    <tr>
                      <td width="30%">edit</td>
                      <td width="60%">
                        <Checkbox
                          style={{ color: "green" }}
                          name={"edit"}
                          onChange={handleModalContentItemCheckBoxChange}
                          checked={modalFieldValue.edit}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td width="30%">show</td>
                      <td width="60%">
                        <Checkbox
                          style={{ color: "green" }}
                          name={"show"}
                          onChange={handleModalContentItemCheckBoxChange}
                          checked={modalFieldValue.show}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td width="30%">required</td>
                      <td width="60%">
                        <Checkbox
                          style={{ color: "green" }}
                          name={"required"}
                          onChange={handleModalContentItemCheckBoxChange}
                          checked={modalFieldValue.required}
                        />
                      </td>
                    </tr>
                  </table>
                  <Button
                    variant="contained"
                    onClick={() => buttonClick("saveContentItem")}
                    style={{
                      margin: 3,
                      height: 32,
                      fontSize: 12,
                      color: "#2862F4",
                      backgroundColor: "white"
                    }}
                  >Сохранить
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setShowModal(false)}
                    style={{
                      margin: 3,
                      height: 32,
                      fontSize: 12,
                      color: "#2862F4",
                      backgroundColor: "white"
                    }}
                  >Отмена
                  </Button>
                </div>
              </Modal>
            </Grid>
          </Grid>
        </Grid>
      )
    }
    catch (er) {
      console.log("ERROR", er)
      return <LinearProgress />
    }
  }
  else { return <LinearProgress /> }
};
