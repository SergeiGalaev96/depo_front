import React, { useState, useEffect } from 'react';
// import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Table from "@material-ui/core/Table"; // Material ui table for usual form
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
// import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';

// Icons
import AttachFileIcon from '@material-ui/icons/AttachFile';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
// import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import GetAppIcon from '@material-ui/icons/GetApp';

// Libraries
import swal from 'sweetalert' // https://sweetalert.js.org/guides/
// import Tooltip from '@material-ui/core/Tooltip';
// import txtimg from '../txt.png';

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
  const classes = useStyles();
  const [userProfile] = useState(props.userProfile)
  const [session_id] = useState(props.userTask.session_id)
  const [process_id] = useState(props.userTask.process_id)
  const [taskID] = useState(props.userTask.taskID)
  const [Form] = useState(props.userTask.Form)
  const [selectedDoc] = useState(props.userTask.selectedDoc)

  const [buttons] = useState(props.userTask.buttons)
  const [sectionColor] = useState("#B2E0C9")
  const [updateState, setUpdateState] = useState(false)
  // const [taskType] = useState(props.userTask.taskType)

  const [attachedDocs, setAttachedDocs] = useState([])
  const [Blobs, setBlobs] = useState([])
  const [savedDocs, setSavedDocs] = useState([])
  const [buttonFilesWordPdfImgId, setButtonFilesWordPdfImgId] = useState(null)


  // Set data from props to state of component
  useEffect(() => {
    console.log("TSFILES PROPS", props)
    setButtonFilesWordPdfImgId(getUUID())
    if (props.userTask.savedDocs.length !== 0) {
      console.log("S DOCS", props.userTask.savedDocs)
      for (let d = 0; d < props.userTask.savedDocs.length; d++) {
        let file = props.userTask.savedDocs[d]
        convertBase64ToFile("data:text/plain;base64," + file.content, file.fileName, file.birthTime)
      }
    }
    setUpdateState(getUUID())
  }, [])
  // Previosly saved documents
  function convertBase64ToFile(dataurl, fileName, bTime) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n)

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    let convFile = new File([u8arr], fileName, { type: mime })
    convFile.birthTime = bTime
    handleAttachSavedFile(convFile)
    console.log("CONV FILE", convFile)
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
  function buttonClick(buttonName, item) {
    if (buttonName === "saveDocs") {
      if (Blobs.length > 0) {
        let commandJson =
        {
          commandType: "saveTSFiles",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          userId: userProfile.userId,
          userRole: userProfile.userRole,
          newFiles: Blobs,
          directory: selectedDoc,
          variables: {
            userAction: { value: "saveDocument" }
          }
        }
        console.log("saveTSFiles:", commandJson)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
      else {
        swAllert("Прикрепите файлы доля сохранения!", "warning")
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
  function handleAttachFile(e) {
    let selectedFiles = e.target.files
    // console.log("A DOCS", selectedFiles)
    if (selectedFiles && selectedFiles[0]) {
      for (let i = 0; i < selectedFiles.length; i++) {
        attachedDocs.push(selectedFiles[i])
        setAttachedDocs(attachedDocs)
        setUpdateState(getUUID())
        pushNewBlob(selectedFiles[i])
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
          console.log("BLOBS", Blobs)
        })
      })
  }

  function attachedDocsList() {
    // console.log("A DOCS", attachedDocs)
    let selDocsList = []
    for (let i = 0; i < attachedDocs.length; i++) {
      selDocsList.push(
        <Card style={{ margin: 3, backgroundColor: "#E2E2E2", paddingLeft: 20, minWidth: "500px" }}>
          <table>
            <tr>
              <td><img src="../txt.png" height="35px" /></td>
              <td style={{ color: "#1B2CE8", width: "95%" }}>
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

  function handleAttachSavedFile(file) {
    // console.log("FILE", file)
    savedDocs.push(file)
    setSavedDocs(savedDocs)
  }
  function savedDocsList() {
    // console.log("SAVEDOCS", savedDocs)
    let savedDocsList = []
    for (let i = 0; i < savedDocs.length; i++) {
      savedDocsList.push(
        <Card style={{ margin: 3, backgroundColor: "#E2E2E2", paddingLeft: 20, minWidth: "500px" }}>
          <table>
            <tr>
              <td style={{ width: "95%" }}>
                <td><img src="../txt.png" height="35px" /></td>
                <td style={{ color: "#1B2CE8" }}>
                  {savedDocs[i].name + " "}{"(" + Math.round(savedDocs[i].size / 1000) + ")" + "КБ"}
                </td>
                <td style={{ color: "black" }}>
                  {savedDocs[i].birthTime}
                </td>
              </td>
              <td>
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
              </td>
            </tr>
          </table>
        </Card>
      )
      // console.log("FILE", savedDocs[i])
    }
    return (savedDocsList)
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
            commandType: "deleteSavedDocTS",
            userId: userProfile.userId,
            directory: selectedDoc,
            fileName: name
          }
          props.sendFieldValues(commandJson)
        }
      })
  }
  function getForm() {
    return (
      <Grid container direction="row" justify="flex-start" spacing={0}>
        <Grid item xs={8}>
          <Paper>
            <Table style={{ width: "100%", "border-collapse": "collapse" }}>
              <TableRow style={{ maxHeight: 25 }}>
                <TableCell style={{ fontSize: 16, color: "black" }}>{Form.label}</TableCell>
              </TableRow>
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
      </Table>
    )
  }
  if (updateState !== null) {
    try {
      return (
        <Grid>
          {/* Create main search table */}
          {getForm()}
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

          <Paper>
            <Grid item>
              <Grid container direction="row">
                <div className={classes.importFile}>
                  <input
                    accept="text/plain"
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
                </Grid>
              </Grid>
            </Grid>
            <Grid container spacing={2} justify="flex-start" alignItems="flex-start" className={classes.root}>
              <Grid item xs={"auto"}>
                <Grid container direction="column" spacing={1}>
                  <div style={{ paddingLeft: 10 }}>Сохраненные документы</div>
                  {savedDocsList()}
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )
    }
    catch (er) {
      console.log("ERROR", er)
      return <LinearProgress />
    }
  }
}
