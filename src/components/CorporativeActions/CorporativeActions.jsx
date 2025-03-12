import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import NumberFormat from 'react-number-format';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
// Form components
import { fade, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from "@material-ui/core/Typography";

import FormControl from '@material-ui/core/FormControl';
import MaterialSelect from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Modal from "@material-ui/core/Modal";
import Menu from '@material-ui/core/Menu';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
// Icons
import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";
import DraftsIcon from '@material-ui/icons/Drafts';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import SearchIcon from '@material-ui/icons/Search';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
// Libraries
import swal from 'sweetalert' // https://sweetalert.js.org/guides/
import Tooltip from '@material-ui/core/Tooltip';
// import axios from 'axios';
import * as rutoken from "rutoken";
var plugin;
var rutokenHandle, certHandle, certData, cmsData;
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
  },
  modalRutoken: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #AFAFAF',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
}))
function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}
function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
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
export default (props) => {
  // This.state
  const classes = useStyles();
  const [userProfile] = useState(props.userProfile)
  const [session_id] = useState(props.userTask.session_id)
  const [process_id] = useState(props.userTask.process_id)
  const [taskID] = useState(props.userTask.taskID)
  const [enumData] = useState(props.userTask.enumData)
  const [enumOptions, setEnumOptions] = useState({})
  const [fieldValue, setFieldValue] = useState({ subject: "", body: "", esDate: "", esFullName: "", esInn: "" })
  const [searchFieldValue, setSearchFieldValue] = useState("")
  const [selectedOptions, setSelectedOptions] = useState([])
  const [updateState, setUpdateState] = useState(false)
  const [taskType] = useState(props.userTask.taskType)
  const [docList, setDocList] = useState(null)
  const [filteredDocList, setFilteredDocList] = useState(null)
  const [initialDocList, setInitialDocList] = useState(null)
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [showSnackBar, setShowSnackBar] = useState(false)
  const [snackBarMessage, setSnackBarMessage] = useState(false)
  const [clickedMessagesType, setClickedMessagesType] = useState("inbox")

  const [checked, setChecked] = useState([])
  const [partners, setPartners] = useState([])
  const [selectedPartners, setSelectedPartners] = useState([])
  const leftChecked = intersection(checked, partners)
  const rightChecked = intersection(checked, selectedPartners)
  const [partnersSearchField, setPartnersSearchField] = useState("")
  const [selectedPartnersSearchField, setSelectedPartnersSearchField] = useState("")
  const [focusField, setFocusField] = useState("")
  const [files, setFiles] = useState([])
  const [Blobs, setBlobs] = useState([])
  const [corpActionsAttachFileButtonId, setCorpActionsAttachFileButtonId] = useState(null)

  const [menuId, setMenuId] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [mailAnchorEl, setMailAnchorEl] = useState(null)
  const openMailMenu = Boolean(mailAnchorEl)

  const [writeMessage, setWriteMessage] = useState(false)
  const [messageType, setMessageType] = useState(1)
  const [allMessagesSelected, setAllMessagesSelected] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState({})
  const [selectedMessage, setSelectedMessage] = useState({})
  const [selectedDoc, setSelectedDoc] = useState(null)
  // Saved Docs
  const [savedImgs, setSavedImgs] = useState([])
  const [savedImagesFiles, setSavedImagesFiles] = useState([])
  const [savedDocs, setSavedDocs] = useState([])
  const [selectedImg, setSelectedImg] = useState({})
  const [openModal, setOpenModal] = useState(false)
  // const [idFromUsers, setIdFromUsers] = useState(false)
  // Rutoken
  const [modalStyle] = useState(getModalStyle)
  const [showModalEnterPin, setShowModalEnterPin] = useState(false)
  const [rutokenPin, setRutokenPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [wrongPin, setWrongPin] = useState(false)
  const [disableButtons, setDisableButtons] = useState(false)

  // Set data from props to state of component
  useEffect(() => {
    console.log("CORPACTS PROPS", props)
    setCorpActionsAttachFileButtonId(getUUID())
    setMenuId(getUUID())
    if (props.userTask.enumData !== null && props.userTask.enumData !== undefined && props.userTask.enumData !== "null") {
      for (let i = 0; i < props.userTask.enumData.length; i++) {
        if (props.userTask.enumData[i] !== null) {
          if (props.userTask.enumData[i].name === "partners") {
            let newPartners = []
            if (userProfile.userRole === "1" || userProfile.userRole === "2" || userProfile.userRole === "5") {
              for (let d = 0; d < props.userTask.enumData[i].data.length; d++) {
                newPartners.push(props.userTask.enumData[i].data[d].id)
              }
            }
            else {
              newPartners.push(1)
            }
            setPartners(newPartners)
          }
        }
        else {
          if (i === 0) {
            setPartners([])
            props.callErrorToast("Ошибка сбора справочной информации Partners")
          }
          else {
            props.callErrorToast("Ошибка сбора справочной информации Users")
          }
        }
      }
    }
    if (props.userTask.docList !== "null" && props.userTask.docList !== null) {
      try {
        let parsedData = JSON.parse(props.userTask.docList)
        console.log("DOCL", parsedData)
        setInitialDocList(parsedData)
        let filteredDocL = []
        for (let i = 0; i < parsedData.recipient.length; i++) {
          if (parsedData.recipient[i].recipient_status === 1 || parsedData.recipient[i].recipient_status === 2) {
            filteredDocL.push(parsedData.recipient[i])
          }
        }
        fetchBySize(0, 9, filteredDocL)
        setFilteredDocList(filteredDocL)
      }
      catch (er) {
        props.callErrorToast("Ошибка сбора списка данных " + props.userTask.taskType)
        setFilteredDocList([])
        setInitialDocList([])
        setDocList([])
      }
    }
    if (props.userTask.selectedDoc !== "null" && props.userTask.selectedDoc !== undefined && props.userTask.selectedDoc !== null) {
      let parsedSelectedDoc = JSON.parse(props.userTask.selectedDoc)
      console.log("SDOC", parsedSelectedDoc)
      setSelectedDoc(parsedSelectedDoc)
    }
    if (props.userTask.savedDocs.length !== 0) {
      console.log("SAVED DOCS", props.userTask.savedDocs)
      for (let d = 0; d < props.userTask.savedDocs.length; d++) {
        let extension = props.userTask.savedDocs[d].extension
        let type = ""
        if (extension === ".png") {
          type = "image/png"
        }
        else if (extension === ".jpeg" || extension === ".jpg") {
          type = "image/jpeg"
        }
        else if (extension === ".doc") {
          type = "application/msword"
        }
        else if (extension === ".docx") {
          type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        }
        else if (extension === ".xlsx") {
          type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
        else if (extension === ".pdf" || extension === ".PDF") {
          type = "application/pdf"
        }
        let convFile = convertBase64ToFile(props.userTask.savedDocs[d].content, props.userTask.savedDocs[d].fileName, type)
        handleAttachSavedFile(convFile)
      }
    }
    setUpdateState(getUUID())
  }, [])
  // RuToken functions
  function handlePinChange(event) {
    // console.log("EVENT", event.target.name, event.target.value)
    setRutokenPin(event.target.value)
    // console.log("PIN", event.target.value)
  }
  function handleClickShowPin() {
    setShowPin(!showPin)
  }
  const handleCloseModalEnterPin = () => {
    setShowModalEnterPin(false)
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
        props.callErrorToast("Не удаётся найти расширение 'Адаптер Рутокен Плагина'");
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
          console.log("RUT ERROR", reason.message);
      }
    }
  }
  // Sign transfer order with rutoken
  function sign(commandJson) {
    try {
      // Получение текста для подписи
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
          .then(async function (certs) {
            certData = certs
            // console.log("RUTDATA", certData)
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
                let newMailBody = JSON.parse(commandJson.variables.mailBody.value)
                newMailBody.mails.es_date = moment(new Date()).format()
                newMailBody.mails.es_full_name = fullName
                newMailBody.mails.es_inn = inn
                let newCommandJson = commandJson
                newCommandJson.variables.mailBody.value = JSON.stringify(newMailBody)
                props.setEsInn(inn)
                props.setEsUserFullName(fullName)
                props.setEsExpiredDate(certData.validNotAfter.substring(0, certData.validNotAfter.length - 1))
                handleCloseModalEnterPin()
                let signedBlobs = await signBlobs(fullName, inn, certData.validNotAfter.substring(0, certData.validNotAfter.length - 1))
                newCommandJson.blobs = signedBlobs
                console.log("SIGNED CJ", newCommandJson)
                await sendMails(signedBlobs)
                props.sendFieldValues(newCommandJson)
                props.clearTabData(process_id)
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
  async function signBlobs(fullName, inn, expiredDate) {
    let signedBlobs = []
    for (let i = 0; i < Blobs.length; i++) {
      if (Blobs[i].type === "application/pdf") {
        for (let a = 0; a < files.length; a++) {
          if (Blobs[i].name === files[a].name) {
            console.log("SIGN", fullName)
            let formData = new FormData()
            formData.append("formFile", files[a], files[a].name)
            let url = props.api + "/Template/AddWatermark?text=ФИО: " + fullName + " ПИН: " + inn + " " + expiredDate
            var requestOptions = {
              method: 'POST',
              body: formData,
              redirect: 'follow'
            }
            let signedBlob = await fetch(url, requestOptions)
              .then(response => response.blob())
              .then(bl => {
                let pdf = new Blob([bl], { type: "application/pdf" })
                async function blobToBase64(blob) {
                  return new Promise((resolve, _) => {
                    const reader = new FileReader()
                    reader.onloadend = () => resolve(reader.result.split(",")[1])
                    reader.readAsDataURL(blob)
                  })
                }
                // let newBlob = {}
                let newBlob = blobToBase64(pdf)
                  .then(base64 => {
                    return newBlob = { "name": Blobs[i].name, "blob": base64, "size": bl.size, type: Blobs[i].type }
                  })
                return newBlob
              })
              .catch(error => console.log('error', error))
            signedBlobs.push(signedBlob)
          }
        }
      }
      else {
        signedBlobs.push(Blobs[i])
      }
    }
    console.log("signedBlobs", signedBlobs)
    return signedBlobs
  }
  // Documents attached to mail
  function convertBase64ToFile(content, fileName, type) {
    // let du = ""
    // if (extension === ".png") {
    //   du = "data:image/png;base64,"
    // }
    // else if (extension === ".jpeg" || extension === ".jpg") {
    //   du = "data:image/jpeg;base64,"
    // }
    // else if (extension === ".doc") {
    //   du = "data:application/msword;base64,"
    // }
    // else if (extension === ".docx") {
    //   du = "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,"
    // }
    // else if (extension === ".xlsx") {
    //   du = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"
    // }
    // else if (extension === ".pdf" || extension === ".PDF") {
    //   du = "data:application/pdf;base64,"
    // }
    let dataurl = "data:" + type + ";base64," + content
    var arr = dataurl.split(','),
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
  function handleAttachSavedFile(file) {
    // console.log("FILE", file)
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
  const handleOpenModal = () => {
    setOpenModal(true)
  }
  const handleCloseModal = () => {
    setOpenModal(false)
  }
  const openMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const closeMenuClick = () => {
    setAnchorEl(null)
  }
  const handleContextMenu = (event) => {
    if (userProfile.userRole === "1") {
      event.preventDefault()
      setAnchorEl(event.currentTarget)
    }
  }

  function handleChange(event) {
    // console.log("EVENT", event.target.name, event.target.value)
    fieldValue[event.target.name] = event.target.value
    setFieldValue(fieldValue)
    // console.log("FIELDVALUE", fieldValue)
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
  function getEmail(id) {
    for (let i = 0; i < enumData.length; i++) {
      if (enumData[i].name === "partners") {
        for (let d = 0; d < enumData[i].data.length; d++) {
          if (enumData[i].data[d].id === id) {
            return enumData[i].data[d].email
          }
        }
      }
    }
  }
  async function buttonClick(name, item) {
    if (name === "send") {
      if (selectedPartners.length === 0) {
        swAllert("Выберите как минимум одного получателя!", "warning")
      }
      else {
        setDisableButtons(true)
        sendMails(Blobs)
        // Create Mail Body for local notifications
        let files_dir = getUUID()
        let mailBody = {
          mails: {
            type: messageType,
            subject: fieldValue.subject,
            body: fieldValue.body,
            files_directory: files_dir,
            status: 3,
            sender: parseInt(userProfile.partner),
            es_date: null,
            es_full_name: null,
            es_inn: null
          },
          mail_distributions: []
        }

        // Push recipient of local system mail
        for (let s = 0; s < selectedPartners.length; s++) {
          let newDistribution = {
            sender: parseInt(userProfile.partner),
            sender_status: 3,
            recipient_status: 1,
            recipient: selectedPartners[s]
          }
          mailBody.mail_distributions.push(newDistribution)
          console.log("mailBody", mailBody)
        }
        // Files attached to mail
        let blobs = []
        for (let f = 0; f < files.length; f++) {
          for (let b = 0; b < Blobs.length; b++) {
            if (files[f].name === Blobs[b].name) {
              // console.log("MATCH", files[f].name, Blobs[b])
              blobs.push(Blobs[b])
            }
          }
        }
        const commandJson =
        {
          commandType: "sendMails",
          process_id: process_id,
          session_id: session_id,
          taskID: taskID,
          directory: files_dir,
          blobs: blobs,
          variables: {
            userAction: { value: "sendMail" },
            mailBody: { value: JSON.stringify(mailBody) }
          }
        }
        // console.log("button sendMail: ", commandJson)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
      }
    }
    else if (name === "sendWithES") {
      if (selectedPartners.length === 0) {
        swAllert("Выберите как минимум одного получателя!", "warning")
      }
      else {
        // Create Mail Body for local notifications
        setDisableButtons(true)
        let files_dir = getUUID()
        let mailBody = {
          mails: {
            type: messageType,
            subject: fieldValue.subject,
            body: fieldValue.body,
            files_directory: files_dir,
            status: 3,
            sender: parseInt(userProfile.partner),
            es_date: moment(new Date()).format(),
            es_full_name: props.esFullName,
            es_inn: props.esInn
          },
          mail_distributions: []
        }
        console.log("mailBody", mailBody)
        // Push recipient of local system mail
        for (let s = 0; s < selectedPartners.length; s++) {
          let newDistribution = {
            sender: parseInt(userProfile.partner),
            sender_status: 3,
            recipient_status: 1,
            recipient: selectedPartners[s]
          }
          mailBody.mail_distributions.push(newDistribution)
        }
        // Files attached to mail
        let blobs = []
        for (let f = 0; f < files.length; f++) {
          for (let b = 0; b < Blobs.length; b++) {
            if (files[f].name === Blobs[b].name) {
              // console.log("MATCH", files[f].name, Blobs[b])
              blobs.push(Blobs[b])
            }
          }
        }

        const commandJson =
        {
          commandType: "sendMails",
          process_id: process_id,
          session_id: session_id,
          taskID: taskID,
          directory: files_dir,
          blobs: blobs,
          variables: {
            userAction: { value: "sendMail" },
            mailBody: { value: JSON.stringify(mailBody) }
          }
        }

        if (props.esInn !== null) {
          let signedBlobs = await signBlobs(props.fullName, props.inn, props.certData.validNotAfter.substring(0, props.certData.validNotAfter.length - 1))
          commandJson.blobs = signedBlobs
          // props.sendFieldValues(commandJson)
          // props.clearTabData(process_id)
        }
        else {
          sign(commandJson)
        }
        console.log("button sendMailES: ", commandJson)
      }
    }
    else if (name === "showReport") {
      let commandJson =
      {
        commandType: "completeTask",
        session_id: session_id,
        process_id: process_id,
        taskID: taskID,
        userId: userProfile.userId,
        userRole: userProfile.userRole,
        variables: {
          userAction: { value: "showReport" },
          reportName: { value: "Message_alert" },
          reportVars: { value: "?id=" + selectedDoc.mail_id },
        }
      }
      console.log("button showReport:", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (name === "backToSearchForm") {
      setMessageType(1)
      setSelectedPartners([])
      setFieldValue({})
      setWriteMessage(false)
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
  }
  async function sendMails(f) {
    // console.log("SEND MAILS", f)
    // Create FormData
    let formData = new FormData()
    formData.append("subject", fieldValue["subject"])
    formData.append("body", fieldValue["body"])
    for (let i = 0; i < f.length; i++) {
      let convFile = convertBase64ToFile(f[i].blob, f[i].name, f[i].type)
      formData.append('attachments', convFile, f[i].name)
      // formData.append('attachments', f[i], f[i].name)
    }
    for (let p = 0; p < selectedPartners.length; p++) {
      formData.append("toEmail", getEmail(selectedPartners[p]))
      await fetch(
        props.api + "/Mail/SendMail",
        {
          mode: 'no-cors',
          method: 'POST',
          body: formData
        }
      )
        .then(response => {
          console.log("RES SEND MAIL", response)
        })
        .catch(error => console.error(error))
    }
  }
  function getRecipientId(partner) {
    console.log("Partner ID", partner)
    let recipientId = null
    for (let e = 0; e < enumData.length; e++) {
      if (enumData[e].name === "users") {
        for (let d = 0; d < enumData[e].data.length; d++) {
          let parsedAttr = JSON.parse(enumData[e].data[d].attributes)
          if (partner === parseInt(parsedAttr["partner"])) {
            recipientId = enumData[e].data[d].id
          }
        }
      }
    }
    console.log("RES ID", recipientId)
    return recipientId
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
  function handleCloseSnackBar() {
    setShowSnackBar(false)
  }
  // get rows amount of filtered docs by size
  function fetchBySize(fetchFrom, fetchTo, Data) {
    let newDocList = []
    for (let i = fetchFrom; i <= fetchTo; i++) {
      if (Data[i] !== undefined) {
        newDocList.push(Data[i])
      }
    }
    setDocList(newDocList)
    setUpdateState(getUUID())
  }
  // Convert date to approptiate format
  function beautifyDate(date) {
    try {
      var newDate = new Date(date) // "2020-01-26"
      var dd = String(newDate.getDate()).padStart(2, '0')
      var mm = String(newDate.getMonth() + 1).padStart(2, '0') //January is 0!
      var yyyy = newDate.getFullYear()
      let beautyDate = ""
      if (parseInt(dd) < 10) {
        let shortdd = dd.substring(1, 2)
        dd = shortdd + " "
      }
      else { beautyDate += dd }
      switch (mm) {
        case "01": {
          mm = "янв."
          break
        }
        case "02": {
          mm = "февр."
          break
        }
        case "03": {
          mm = "мар."
          break
        }
        case "04": {
          mm = "апр."
          break
        }
        case "05": {
          mm = "мая"
          break
        }
        case "06": {
          mm = "июня"
          break
        }
        case "07": {
          mm = "июля"
          break
        }
        case "08": {
          mm = "авг."
          break
        }
        case "09": {
          mm = "сент."
          break
        }
        case "10": {
          mm = "окт."
          break
        }
        case "11": {
          mm = "ноя."
          break
        }
        case "12": {
          mm = "дек."
          break
        }
        default: {
          break
        }
      }
      beautyDate += " " + mm + " " + yyyy.toString().substring(2, 4) + "г."
      // console.log("beautyDate", beautyDate)
      return beautyDate
    }
    catch (er) {
      return "NaN.NaN.NaN"
    }
  }
  // multiple selector functions
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  }
  const handleAllRight = () => {
    if (partnersSearchField === "") {
      setSelectedPartners(selectedPartners.concat(partners))
      setPartners([])
    }
    else {
      let filteredSelectedPartners = []
      let filteredPartners = []
      for (let p = 0; p < partners.length; p++) {
        let searchField = partnersSearchField.toLowerCase()
        let listItemLabel = getPartnerName(partners[p]).toLowerCase()
        let includeSearch = listItemLabel.includes(searchField)
        if (includeSearch === true) {
          filteredSelectedPartners.push(partners[p])
        }
        else {
          filteredPartners.push(partners[p])
        }
      }
      setSelectedPartners(filteredSelectedPartners.concat(selectedPartners))
      setPartners(filteredPartners)
    }
  }
  const handleCheckedRight = () => {
    setSelectedPartners(selectedPartners.concat(leftChecked));
    setPartners(not(partners, leftChecked));
    setChecked(not(checked, leftChecked));
  }
  const handleCheckedLeft = () => {
    setPartners(partners.concat(rightChecked));
    setSelectedPartners(not(selectedPartners, rightChecked));
    setChecked(not(checked, rightChecked));
  }
  const handleAllLeft = () => {
    if (selectedPartnersSearchField === "") {
      setPartners(partners.concat(selectedPartners))
      setSelectedPartners([])
    }
    else {
      let filteredPartners = []
      let filteredSelectedPartners = []
      for (let p = 0; p < selectedPartners.length; p++) {
        let searchField = selectedPartnersSearchField.toLowerCase()
        let listItemLabel = getPartnerName(selectedPartners[p]).toLowerCase()
        let includeSearch = listItemLabel.includes(searchField)
        if (includeSearch === true) {
          filteredPartners.push(selectedPartners[p])
        }
        else {
          filteredSelectedPartners.push(selectedPartners[p])
        }
      }
      setSelectedPartners(filteredSelectedPartners)
      setPartners(filteredPartners.concat(partners))
    }
  }
  const partnersList = (items) => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value}-label`;
          if (partnersSearchField === "") {
            return (
              <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
                <ListItemText id={labelId} primary={getPartnerName(value)} />
              </ListItem>
            )
          }
          else {
            let searchField = partnersSearchField.toLowerCase()
            let listItemLabel = getPartnerName(value).toLowerCase()
            let includeSearch = listItemLabel.includes(searchField)
            if (includeSearch === true) {
              return (
                <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                  <ListItemText id={labelId} primary={getPartnerName(value)} />
                </ListItem>
              )
            }
          }

        })}
        <ListItem />
      </List>
    </Paper>
  )
  function partnersSearchFieldChange(event) {
    setPartnersSearchField(event.target.value)
    setFocusField("partnersSearhField")
  }
  const selectedPartnersList = (items) => (
    <Paper className={classes.paper}>
      <List dense component="div" role="list">
        {items.map((value) => {
          const labelId = `transfer-list-item-${value}-label`;
          if (selectedPartnersSearchField === "") {
            return (
              <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
                <ListItemText id={labelId} primary={getPartnerName(value)} />
              </ListItem>
            )
          }
          else {
            let searchField = selectedPartnersSearchField.toLowerCase()
            let listItemLabel = getPartnerName(value).toLowerCase()
            let includeSearch = listItemLabel.includes(searchField)
            if (includeSearch === true) {
              return (
                <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
                  <Checkbox
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                  <ListItemText id={labelId} primary={getPartnerName(value)} />
                </ListItem>
              )
            }
          }

        })}
        <ListItem />
      </List>
    </Paper>
  )
  function selectedPartnersSearchFieldChange(event) {
    setSelectedPartnersSearchField(event.target.value)
    setFocusField("selectedPartnersSearhField")
  }
  function getPartnerName(id) {
    for (let i = 0; i < props.userTask.enumData.length; i++) {
      if (props.userTask.enumData[i].name === "partners") {
        for (let d = 0; d < props.userTask.enumData[i].data.length; d++) {
          if (props.userTask.enumData[i].data[d].id === id) {
            return props.userTask.enumData[i].data[d].label
            break
          }
        }
      }
    }
  }
  const writeMessgeClick = (type) => {
    setMessageType(type)
    setAnchorEl(null)
    setWriteMessage(true)
  }
  const handleSelectAllMessagesChange = (event) => {
    setAllMessagesSelected(event.target.checked)
    for (let i = 0; i < filteredDocList.length; i++) {
      selectedMessages[filteredDocList[i].mail_id] = event.target.checked
    }
    setSelectedMessages(selectedMessages)
  }
  const handleSelectMessage = (event) => {
    console.log("Check MESS", event.target.id, "CH ", event.target.checked)
    setSelectedMessages({ ...selectedMessages, [event.target.id]: event.target.checked })
  }
  // file attachment functions
  function handleAttachFile(e) {
    let selectedFiles = e.target.files
    if (selectedFiles && selectedFiles[0]) {
      for (let i = 0; i < selectedFiles.length; i++) {
        files.push(selectedFiles[i])
        pushNewBlob(selectedFiles[i])
      }
      setFiles(files)
    }
    setUpdateState(getUUID())
    console.log("FILES", files)
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
          let newBlob = { "name": f.name, "blob": base64, "size": f.size, type: f.type }
          Blobs.push(newBlob)
          setBlobs(Blobs)
          // console.log("BLOBS", Blobs)
        })
      })
  }
  function deleteFile(name) {
    let newFilesList = []
    for (let i = 0; i < files.length; i++) {
      if (name !== files[i].name) {
        newFilesList.push(files[i])
      }
    }
    setFiles(newFilesList)
    console.log("FILES", newFilesList)
  }
  function filesList() {
    let selFilesList = []
    for (let i = 0; i < files.length; i++) {
      selFilesList.push(
        <Card style={{ margin: 3, backgroundColor: "#E2E2E2", paddingLeft: 20 }}>
          <table>
            <tr minWidth="500px">
              <td style={{ color: "#1B2CE8", fontWeight: "bold", width: "95%" }}>
                {files[i].name + " "}{"(" + Math.round(files[i].size / 1000) + ")" + "КБ"}
              </td>
              <td align="right">
                <IconButton>
                  <CloseIcon style={{ fontSize: "medium", color: "black" }} onClick={() => deleteFile(files[i].name)} />
                </IconButton>
              </td>
            </tr>
          </table>
        </Card>)
      // console.log("FILE", files[i])
    }
    return (selFilesList)
  }
  function handleSearchChange(event) {
    setSearchFieldValue(event.target.value)
    console.log("FIELDVALUE", event.target.value)
  }
  function handleClickSearch() {
    console.log("SEARCH", searchFieldValue, clickedMessagesType, filteredDocList)
    if (searchFieldValue === "") {
      if (clickedMessagesType === "inbox") {
        handleInboxMessagesClick()
      }
      else if (clickedMessagesType === "sent") {
        handleSentMessagesClick()
      }
      else if (clickedMessagesType === "trash") {
        handleTrashMessagesClick()
      }
    }
    else {
      let newDocList = []
      if (clickedMessagesType === "inbox") {
        for (let i = 0; i < initialDocList.recipient.length; i++) {
          if (initialDocList.recipient[i].recipient_status === 1 || initialDocList.recipient[i].recipient_status === 2) {
            try {
              let subject = initialDocList.recipient[i].subject.toLowerCase()
              let body = initialDocList.recipient[i].body.toLowerCase()
              let searchField = searchFieldValue.toLowerCase()
              if (subject.includes(searchField) || body.includes(searchField)) {
                // console.log("FIND", initialDocList.recipient[i].subject, initialDocList.recipient[i].body)
                newDocList.push(initialDocList.recipient[i])
              }
            }
            catch (er) { console.log(er) }
          }
        }
      }
      else if (clickedMessagesType === "sent") {
        for (let i = 0; i < initialDocList.sender.length; i++) {
          if (initialDocList.sender[i].sender_status === 3) {
            try {
              let subject = initialDocList.sender[i].subject.toLowerCase()
              let body = initialDocList.sender[i].body.toLowerCase()
              let searchField = searchFieldValue.toLowerCase()
              if (subject.includes(searchField) || body.includes(searchField)) {
                // console.log("FIND", initialDocList.sender[i].subject, initialDocList.sender[i].body)
                newDocList.push(initialDocList.sender[i])
              }
            }
            catch (er) { console.log(er) }
          }
        }
      }
      else if (clickedMessagesType === "trash") {
        for (let i = 0; i < initialDocList.sender.length; i++) {
          if (initialDocList.sender[i].sender_status === 4) {
            try {
              let subject = initialDocList.sender[i].subject.toLowerCase()
              let body = initialDocList.sender[i].body.toLowerCase()
              let searchField = searchFieldValue.toLowerCase()
              if (subject.includes(searchField) || body.includes(searchField)) {
                // console.log("FIND", initialDocList.sender[i].subject, initialDocList.sender[i].body)
                newDocList.push(initialDocList.sender[i])
              }
            }
            catch (er) { console.log(er) }
          }
        }
        for (let i = 0; i < initialDocList.recipient.length; i++) {
          if (initialDocList.recipient[i].recipient_status === 4) {
            try {
              let subject = initialDocList.recipient[i].subject.toLowerCase()
              let body = initialDocList.recipient[i].body.toLowerCase()
              let searchField = searchFieldValue.toLowerCase()
              if (subject.includes(searchField) || body.includes(searchField)) {
                // console.log("FIND", initialDocList.recipient[i].subject, initialDocList.recipient[i].body)
                newDocList.push(initialDocList.recipient[i])
              }
            }
            catch (er) { console.log(er) }
          }
        }
      }

      fetchBySize(0, 9, newDocList)
      setFilteredDocList(newDocList)
    }

  }
  function handleInboxMessagesClick() {
    setClickedMessagesType("inbox")
    setAllMessagesSelected(false)
    let filteredDocL = []
    for (let i = 0; i < initialDocList.recipient.length; i++) {
      if (initialDocList.recipient[i].recipient_status === 1 || initialDocList.recipient[i].recipient_status === 2) {
        filteredDocL.push(initialDocList.recipient[i])
      }
    }
    fetchBySize(0, 9, filteredDocL)
    setFilteredDocList(filteredDocL)
    console.log("INBOX")
  }
  function handleSentMessagesClick() {
    setClickedMessagesType("sent")
    setAllMessagesSelected(false)
    let filteredDocL = []
    for (let i = 0; i < initialDocList.sender.length; i++) {
      if (initialDocList.sender[i].sender_status === 3) {
        filteredDocL.push(initialDocList.sender[i])
      }
    }
    fetchBySize(0, 9, filteredDocL)
    setFilteredDocList(filteredDocL)
    console.log("SENT")
  }
  function handleTrashMessagesClick() {
    setClickedMessagesType("trash")
    setAllMessagesSelected(false)
    let filteredDocL = []
    for (let i = 0; i < initialDocList.recipient.length; i++) {
      if (initialDocList.recipient[i].recipient_status === 4) {
        filteredDocL.push(initialDocList.recipient[i])
      }
    }
    for (let i = 0; i < initialDocList.sender.length; i++) {
      if (initialDocList.sender[i].sender_status === 4) {
        filteredDocL.push(initialDocList.sender[i])
      }
    }
    fetchBySize(0, 9, filteredDocL)
    setFilteredDocList(filteredDocL)
    console.log("TRASH")
  }
  function getSenderName(sender) {
    // console.log("enumData", enumData)
    for (let e = 0; e < enumData.length; e++) {
      if (enumData[e].name === "partners") {
        for (let d = 0; d < enumData[e].data.length; d++) {
          if (enumData[e].data[d].id === sender) {
            return enumData[e].data[d].label
          }
        }
      }
    }
    // for (let e = 0; e < enumData.length; e++) {
    //   if (enumData[e].name === "users") {
    //     for (let d = 0; d < enumData[e].data.length; d++) {
    //       if (enumData[e].data[d].id === sender) {
    //         return enumData[e].data[d].firstname + " " + enumData[e].data[d].lastname
    //       }
    //     }
    //   }
    // }
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
  function getBackround(status) {
    if (status === 1) {// message is unread
      return "#FFDCA5"
    }
    else {
      return "#F0F1F1"
    }
  }
  function getFontWeight(status) {
    if (status === 1) {
      return "bold"
    }
    else {
      return "nornal"
    }
  }
  function checkToShowDeleteButton() {
    let showButton = false
    if (Object.keys(selectedMessages).length > 0) {
      for (let key in selectedMessages) {
        if (selectedMessages[key] === true) {
          showButton = true
          break
        }
      }
    }
    return showButton
  }
  function openMessage(message) {
    if (clickedMessagesType === "inbox") {
      // let user_id = null
      // for (let e = 0; e < enumData.length; e++) {
      //   if (enumData[e].name === "users") {
      //     for (let d = 0; d < enumData[e].data.length; d++) {
      //       if (enumData[e].data[d].user_id === userProfile.userId) {
      //         user_id = enumData[e].data[d].id
      //       }
      //     }
      //   }
      // }
      let mailDistrBody = {
        id: message.distribution_id,
        mail_id: message.mail_id,
        sender: message.sender,
        recipient: message.recipient,
        recipient_status: 2,
        created_at: message.created_at,
        updated_at: message.updated_at
      }
      // let unreadDistributionsBody = {
      //   variables: {
      //     user_session_id: { value: session_id },
      //     userAction: { value: "getUnreadDistributions" },
      //     // depoRESTApi: { value: "" },
      //     user_id_recipient: { value: message.recipient }
      //   }
      // }
      let commandJson =
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: { value: "openMailDistribution" },
          mailDistrBody: { value: JSON.stringify(mailDistrBody) },
          selectedDoc: { value: JSON.stringify(message) },
          // unreadDistributionsBody: { value: JSON.stringify(unreadDistributionsBody) }
        }
      }
      console.log("button openMail: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
      props.reduceMailDistributions()
    }
    else {
      const commandJson =
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: { value: "openMail" },
          selectedDoc: { value: JSON.stringify(message) },
        }
      }
      console.log("button openMail: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
  }
  function deleteMessages() {
    console.log("LISTS", selectedMessages, docList)
    if (clickedMessagesType === "inbox") {
      let mailDistrList = []
      for (let d = 0; d < docList.length; d++) {
        for (let key in selectedMessages) {
          if (selectedMessages[key] === true) {
            if (docList[d].mail_id === parseInt(key)) {
              let mailToDelete = {
                id: docList[d].distribution_id,
                sender: docList[d].sender,
                recipient: docList[d].recipient,
                recipient_status: 4,
                mail_id: docList[d].mail_id,
                created_at: docList[d].created_at,
                updated_at: docList[d].updated_at
              }
              mailDistrList.push(mailToDelete)
              console.log("DEL", mailToDelete)
            }
          }
        }
      }
      let unreadDistributionsBody = {
        variables: {
          user_session_id: { value: session_id },
          userAction: { value: "getUnreadDistributions" },
          depoRESTApi: { value: "" },
          user_id_recipient: { value: docList[0].recipient }
        }
      }
      let commandJson =
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: { value: "putMailsToTrash" },
          mailDistrList: { value: JSON.stringify(mailDistrList) },
          mailList: { value: "[]" },
          unreadDistributionsBody: { value: JSON.stringify(unreadDistributionsBody) }
        }
      }
      console.log("button putInboxMailsToTrash: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
      props.reduceMailDistributions()
    }
    else if (clickedMessagesType === "sent") {
      let mailList = []
      for (let d = 0; d < docList.length; d++) {
        for (let key in selectedMessages) {
          if (selectedMessages[key] === true) {
            if (docList[d].mail_id === parseInt(key)) {
              let mailToDelete = {
                id: docList[d].mail_id,
                sender: docList[d].sender,
                subject: docList[d].subject,
                body: docList[d].body,
                status: 4,
                files_directory: docList[d].files_directory,
                created_at: docList[d].created_at,
                updated_at: docList[d].updated_at
              }
              mailList.push(mailToDelete)
              console.log("DEL", mailToDelete)
            }
          }
        }
      }
      let commandJson =
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: { value: "putMailsToTrash" },
          mailDistrList: { value: "[]" },
          mailList: { value: JSON.stringify(mailList) }
        }
      }
      console.log("button putSentMailsToTrash: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else if (clickedMessagesType === "trash") {
      swal({
        text: "Вы действительно хотите удалить сообщения безвозвратно?",
        icon: "warning",
        buttons: { yes: "Да", cancel: "Отмена" },
      })
        .then((click) => {
          if (click === "yes") {
            let mailList = []
            let mailDistrList = []
            for (let key in selectedMessages) {
              if (selectedMessages[key] === true) {
                console.log("TRUE?", key, selectedMessages[key])
                for (let d = 0; d < docList.length; d++) {
                  if (docList[d].mail_id === parseInt(key)) {
                    console.log("DEL", docList[d].subject)
                    // I'm sender of mail
                    // if (docList[d].sender === idFromUsers) {
                    if (docList[d].sender === parseInt(userProfile.partner)) {
                      console.log("IM SENDER", docList[d].mail_id)
                      let mailToDelete = {
                        id: docList[d].mail_id,
                        sender: docList[d].sender,
                        subject: docList[d].subject,
                        body: docList[d].body,
                        status: 5,
                        files_directory: docList[d].files_directory,
                        created_at: docList[d].created_at,
                        updated_at: docList[d].updated_at,
                        deleted: true
                      }
                      mailList.push(mailToDelete)
                    }
                    // i'm recipient of mail
                    else {
                      console.log("IM RECIPIENT", docList[d].mail_id)
                      let mailToDelete = {
                        id: docList[d].distribution_id,
                        sender: docList[d].sender,
                        recipient: docList[d].recipient,
                        recipient_status: 5,
                        mail_id: docList[d].mail_id,
                        created_at: docList[d].created_at,
                        updated_at: docList[d].updated_at,
                        deleted: true
                      }
                      mailDistrList.push(mailToDelete)
                    }
                  }
                }
              }
            }
            let unreadDistributionsBody = {
              variables: {
                user_session_id: { value: session_id },
                userAction: { value: "getUnreadDistributions" },
                depoRESTApi: { value: "" },
                user_id_recipient: { value: docList[0].recipient }
              }
            }
            let commandJson =
            {
              commandType: "completeTask",
              process_id: process_id,
              session_id: session_id,
              taskID: taskID,
              variables: {
                userAction: { value: "putMailsToTrash" },
                mailDistrList: { value: JSON.stringify(mailDistrList) },
                mailList: { value: JSON.stringify(mailList) },
                unreadDistributionsBody: { value: JSON.stringify(unreadDistributionsBody) }
              }
            }
            console.log("button deleteMails: ", commandJson)
            props.sendFieldValues(commandJson)
            props.clearTabData(process_id)
            // console.log("mailList", mailList)
            // console.log("mailDistrList", mailDistrList)
          }
        })
    }
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
  function getMenuItemStyle(name) {
    if (name === clickedMessagesType) {
      return {
        background: "#F0F1F1",
        color: "black",
        fontWeight: "bold"
      }
    }
  }
  function onKeyPressModalEnterPin(event) {
    let code = event.charCode
    if (code === 13) {
      buttonClick("sendWithES")
    }
  }
  function useMessageAsSample() {
    console.log("SEL MES", selectedMessage)
    setMessageType(selectedMessage.type)
    setSelectedPartners([selectedMessage.recipient])
    setFieldValue({ subject: selectedMessage.subject, body: selectedMessage.body })
    setWriteMessage(true)
    setMailAnchorEl(null)
  }
  if (updateState !== null) {
    try {
      if (taskType === "corporativeActionsMainForm") {
        if (writeMessage === false) {
          return (
            <Grid container direction="row" justify="flex-start" alignItems="flex-start" spacing={1}>
              <Grid item xs={3}>
                <Paper>
                  <MenuList>
                    <MenuItem onClick={() => handleInboxMessagesClick()} style={getMenuItemStyle("inbox")}>
                      <ListItemIcon>
                        <MailOutlineIcon fontSize="small" style={getMenuItemStyle("inbox")} />
                      </ListItemIcon>
                      <Typography variant="inherit">Входящие</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => handleSentMessagesClick()} style={getMenuItemStyle("sent")}>
                      <ListItemIcon>
                        <SendIcon fontSize="small" style={getMenuItemStyle("sent")} />
                      </ListItemIcon>
                      <Typography variant="inherit">Отправленные</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => handleTrashMessagesClick()} style={getMenuItemStyle("trash")}>
                      <ListItemIcon>
                        <DeleteOutlineIcon fontSize="small" style={getMenuItemStyle("trash")} />
                      </ListItemIcon>
                      <Typography variant="inherit">Корзина</Typography>
                    </MenuItem>
                  </MenuList>
                </Paper>
              </Grid>
              <Grid item xs={9}>
                <Grid container direction="column" spacing={1}>
                  <Grid item xs={12} align="left">
                    <Paper>
                      <Checkbox
                        style={{ color: "green" }}
                        onChange={handleSelectAllMessagesChange}
                        checked={allMessagesSelected === true ? true : false}
                      />
                      {checkToShowDeleteButton() === true &&
                        <IconButton aria-label="delete" size="small">
                          <DeleteIcon onClick={() => deleteMessages()} />
                        </IconButton>
                      }
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<CreateIcon />}
                        style={{ margin: 5, color: "green", background: "white", fontSize: 14 }}
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={openMenuClick}
                      >
                        Написать
                      </Button>
                      <Menu
                        id={menuId}
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={closeMenuClick}
                      >
                        <MenuItem onClick={() => writeMessgeClick(1)}>Извещение</MenuItem>
                        <MenuItem onClick={() => writeMessgeClick(2)}>Запрос на раскрытие</MenuItem>
                        <MenuItem onClick={() => writeMessgeClick(3)}>Информационное сообщение</MenuItem>
                        <MenuItem onClick={() => writeMessgeClick(4)}>Уведомление о КД</MenuItem>
                        <MenuItem onClick={() => writeMessgeClick(5)}>Исходящее письмо</MenuItem>
                      </Menu>
                      <TextField
                        size="small"
                        variant="outlined"
                        placeholder="Поиск в почте"
                        style={{ width: "50%", paddingLeft: 50, margin: 3 }}
                        onChange={handleSearchChange}
                        InputProps={{
                          endAdornment:
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => handleClickSearch()}
                                edge="end"
                              >
                                <SearchIcon size="small" />
                              </IconButton>
                            </InputAdornment>,
                        }}
                      />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} align="left">
                    <Paper style={{ minHeight: "76px", paddingTop: docList === null ? "25px" : 0 }}>
                      {docList !== null ?
                        <div>
                          <table class="main-table-style">
                            <thead class="thead-style">
                              <tr>
                                <td class="td-head-first-child"></td>
                                <td class="td-head-style-2row">Дата</td>
                                <td class="td-head-style-2row">Тип</td>
                                <td class="td-head-style-2row">Отправитель</td>
                                <td class="td-head-style-2row">Заголовок</td>
                                <td class="td-head-last-child">Содержание</td>
                              </tr>
                            </thead>
                            <tbody class="body-style">
                              {Object.keys(docList).length !== 0 &&
                                docList.map(docListItem => (
                                  <tr
                                    width="100%"
                                    style={{
                                      "fontSize": 13,
                                      "height": 30,
                                      "background": clickedMessagesType === "inbox" ? getBackround(docListItem.recipient_status) : "#F0F1F1",
                                      "fontWeight": clickedMessagesType === "inbox" ? getFontWeight(docListItem.recipient_status) : "normal",
                                      "cursor": "pointer"
                                    }}
                                    onMouseDown={() => setSelectedMessage(docListItem)}
                                  >
                                    <td style={{ "border-bottom": "1px solid grey" }}>
                                      <Checkbox
                                        style={{ height: 15, color: "green", maxWidth: 25 }}
                                        id={docListItem.mail_id}
                                        onChange={handleSelectMessage}
                                        onContextMenu={(ev) => handleContextMenu(ev)}
                                        checked={selectedMessages[docListItem.mail_id] === true ? true : false}
                                      />
                                    </td>
                                    <td
                                      style={{ "border-bottom": "1px solid grey" }}
                                      align="center"
                                      width={150}
                                      onClick={() => openMessage(docListItem)}
                                      onContextMenu={(ev) => handleContextMenu(ev)}
                                    >
                                      {beautifyDate(docListItem.created_at)}
                                    </td>
                                    <td
                                      style={{ "border-bottom": "1px solid grey" }}
                                      align="center"
                                      width={150}
                                      onClick={() => openMessage(docListItem)}
                                      onContextMenu={(ev) => handleContextMenu(ev)}
                                    >
                                      {getEnumLabel("mailTypes", docListItem.type)}
                                    </td>
                                    <td
                                      style={{ "border-bottom": "1px solid grey" }}
                                      width={150}
                                      onClick={() => openMessage(docListItem)}
                                      onContextMenu={(ev) => handleContextMenu(ev)}
                                    >
                                      {getSenderName(docListItem.sender)}
                                    </td>
                                    <td
                                      style={{ "border-bottom": "1px solid grey" }}
                                      onClick={() => openMessage(docListItem)}
                                      onContextMenu={(ev) => handleContextMenu(ev)}
                                    >
                                      {docListItem.subject}
                                    </td>
                                    <td
                                      style={{ "border-bottom": "1px solid grey", "white-space": "wrap" }}
                                      onClick={() => openMessage(docListItem)}
                                      onContextMenu={(ev) => handleContextMenu(ev)}
                                    >
                                      {docListItem.body.substring(0, 50)}{docListItem.body.length > 50 ? "..." : ""}
                                    </td>
                                  </tr>
                                )
                                )}
                            </tbody>
                          </table>

                          <table size="small" style={{ "border-collapse": "collapse", "white-space": "nowrap", fontSize: 13 }}>
                            <tfoot>
                              <tr>
                                <td style={{ paddingLeft: "20px" }}>
                                  <div style={{ minWidth: 80, color: "black" }}>Кол-во записей</div>
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
                                <td style={{ color: "black", fontSize: 13 }}>Стр. {page} из {getPageAmount()}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                        :
                        <Typography variant="inherit" noWrap>
                          В этой папке нет писем!
                        </Typography>
                      }
                      <Menu
                        anchorEl={mailAnchorEl}
                        open={openMailMenu}
                        onClose={() => setMailAnchorEl(null)}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                        style={{ paddingLeft: "100px" }}
                      >
                        <MenuItem onClick={() => useMessageAsSample()}>Использовать как шаблон</MenuItem>
                      </Menu>
                    </Paper>
                  </Grid>
                  <Snackbar
                    open={showSnackBar}
                    onClose={() => handleCloseSnackBar()}
                    autoHideDuration={1200}
                    message={snackBarMessage}
                  />
                </Grid>
              </Grid>
            </Grid>
          )
        }
        else if (writeMessage === true) {
          return (
            <Paper key={updateState}>
              <Grid container spacing={1} justify="center" alignItems="center" className={classes.root}>
                <Grid item>
                  <Grid container direction="column">
                    <Grid item>
                      <input
                        placeholder='Поиск'
                        style={{ width: "100%" }}
                        name="partnersSearhField"
                        value={partnersSearchField}
                        onChange={partnersSearchFieldChange}
                        autoFocus={focusField === "partnersSearhField" ? true : false}
                      />
                    </Grid>
                    <Grid item>{partnersList(partners)}</Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction="column">
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleAllRight}
                      disabled={partners.length === 0}
                      aria-label="move all selectedPartners"
                    >
                      ≫
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleCheckedRight}
                      disabled={leftChecked.length === 0}
                      aria-label="move selected selectedPartners"
                    >
                      &gt;
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleCheckedLeft}
                      disabled={rightChecked.length === 0}
                      aria-label="move selected partners"
                    >
                      &lt;
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      className={classes.button}
                      onClick={handleAllLeft}
                      disabled={selectedPartners.length === 0}
                      aria-label="move all partners"
                    >
                      ≪
                    </Button>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction="column">
                    <Grid item>
                      <input
                        placeholder='Поиск'
                        style={{ width: "100%" }}
                        name="selectedPartnersSearhField"
                        value={selectedPartnersSearchField}
                        onChange={selectedPartnersSearchFieldChange}
                        autoFocus={focusField === "selectedPartnersSearhField" ? true : false}
                      />
                    </Grid>
                    <Grid item>{selectedPartnersList(selectedPartners)}</Grid>
                  </Grid>
                </Grid>
                <Grid item xs={11}>Тип сообщения: {getEnumLabel("mailTypes", messageType)}</Grid>
                <Grid item xs={11}>
                  <Grid container direction="row">
                    <TextField
                      id="outlined-multiline-static"
                      label="Тема"
                      multiline
                      onBlur={handleChange}
                      name={"subject"}
                      defaultValue={fieldValue["subject"]}
                      variant="outlined"
                      style={{ width: "100%" }}
                    />
                    <TextField
                      id="outlined-multiline-static"
                      label="Текст уведомления"
                      multiline
                      rows={4}
                      onBlur={handleChange}
                      name={"body"}
                      defaultValue={fieldValue["body"]}
                      variant="outlined"
                      style={{ width: "100%" }}
                    />
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container direction="row">
                    <div className={classes.importFile}>
                      <input
                        accept="image/*, application/pdf"
                        className={classes.inputFile}
                        id={corpActionsAttachFileButtonId}
                        multiple
                        type="file"
                        onChange={handleAttachFile}
                      />
                      <label htmlFor={corpActionsAttachFileButtonId}>
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
                    <Button
                      variant="outlined"
                      onClick={() => buttonClick("send", null)}
                      style={{
                        margin: 3,
                        color: "white",
                        borderColor: "#161C87",
                        backgroundColor: "#287A2C",
                        height: 32,
                        fontSize: 12
                      }}
                      endIcon={<SendIcon />}
                      disabled={disableButtons}
                    >Отправить
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => props.esInn !== null ? buttonClick("sendWithES") : setShowModalEnterPin(true)}
                      style={{
                        margin: 3,
                        color: "white",
                        borderColor: "#161C87",
                        backgroundColor: "#287A2C",
                        height: 32,
                        fontSize: 12
                      }}
                      endIcon={<SendIcon />}
                      disabled={disableButtons}
                    >Подписать и отправить
                    </Button>

                    <Button
                      variant="outlined"
                      onClick={() => buttonClick("backToSearchForm")}
                      style={{
                        margin: 3,
                        color: "white",
                        borderColor: "#161C87",
                        backgroundColor: "#ff1f1f",
                        height: 32,
                        fontSize: 12
                      }}

                    >Назад
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid style={{ paddingLeft: "45px" }} container spacing={2} justify="flex-start" alignItems="flex-start" className={classes.root}>
                <Grid item xs={"auto"}>
                  <Grid container direction="column" spacing={1}>
                    {filesList()}
                  </Grid>
                </Grid>
              </Grid>
              <Modal
                open={showModalEnterPin}
                onClose={handleCloseModalEnterPin}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <div style={modalStyle} className={classes.modalRutoken}>
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
                    onClick={() => buttonClick("sendWithES")}
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
            </Paper>
          )
        }
      }
      else if (taskType === "shomMessageForm") {
        return (
          <Paper>
            <br />
            <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
              <Grid item xs={10} align="center">
                <Typography component="h1" variant="h6" color="inherit">{selectedDoc.subject}</Typography>
              </Grid>
              <Grid item xs={10} align="right">
                <p style={{ fontSize: 12 }}>{"Дата: "}{selectedDoc.created_at.substring(0, 19)}</p>
                <p style={{ fontSize: 12 }}>{"Отправитель: "}{getSenderName(selectedDoc.sender)}</p>
                {selectedDoc.es_inn !== null &&
                  <div>
                    <p style={{ fontSize: 12 }}>{"Время подписания: "}{selectedDoc.es_date !== undefined ? selectedDoc.es_date.substring(0, 19) : ""}</p>
                    <p style={{ fontSize: 12 }}>{"ИНН: "}{selectedDoc.es_inn}</p>
                    <p style={{ fontSize: 12 }}>{"ФИО: "}{selectedDoc.es_full_name}</p>
                  </div>
                }
              </Grid>
              <Grid item xs={10} align="left">
                <p>{selectedDoc.body}</p>
              </Grid>
              <br />
              <Grid item xs={10} align="left">
                <p style={{ fontSize: 12, fontWeight: "bold" }}>{"Прикрепленные файлы"}</p>
                {savedDocsList()}
                {savedImgsList()}
              </Grid>
              <Grid item xs={10} align="center">
                <Button
                  variant="outlined"
                  onClick={() => buttonClick("showReport")}
                  style={{
                    margin: 3,
                    color: "white",
                    borderColor: "#161C87",
                    backgroundColor: "#287A2C",
                    height: 32,
                    fontSize: 12
                  }}
                >Печать
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => buttonClick("back")}
                  style={{
                    margin: 3,
                    color: "white",
                    borderColor: "#161C87",
                    backgroundColor: "#ff1f1f",
                    height: 32,
                    fontSize: 12
                  }}
                >Назад
                </Button>
              </Grid>
            </Grid>
            <Modal
              className={classes.modal}
              open={openModal}
              onClose={handleCloseModal}
            >
              <div className={classes.imagePaper}>
                <img name={selectedImg.name} height={600} width="auto" src={selectedImg.src} />
              </div>
            </Modal>
          </Paper>
        )
      }
      else {
        return <LinearProgress />
      }
    }
    catch (er) {
      // console.log("ERROR", er)
      return <LinearProgress />
    }
  }
};
