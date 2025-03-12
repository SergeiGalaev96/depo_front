import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ComponentManager from "../components/ComponentManager/ComponentManager.jsx";
import Box from "@material-ui/core/Box";
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
// PIN components
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
// Icons
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ExitToAppIcon from "@material-ui/icons/ExitToAppOutlined";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import AddCircleIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import CloseIcon from "@material-ui/icons/Close";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Notification from "@material-ui/icons/Notifications";
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import EmailIcon from '@material-ui/icons/Email';
import Badge from '@material-ui/core/Badge';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Libs
import { useKeycloak } from "../lib";
import swal from "sweetalert" // https://sweetalert.js.org/guides/
import { ToastContainer, toast } from 'react-toastify'; // https://fkhadra.github.io/react-toastify/introduction/
import 'react-toastify/dist/ReactToastify.css';
import * as rutoken from "rutoken";
import moment from "moment";
var plugin = null;
var rutokenHandle, certHandle, certData, cmsData;

function TabPanel(props) {
  const { children, currentTab, selectedTab, ...other } = props;
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={currentTab !== selectedTab}
      id={`scrollable-auto-tabpanel-${selectedTab}`}
      aria-labelledby={`scrollable-auto-tab-${selectedTab}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}
function a11yProps(id) {
  return {
    id: `scrollable-auto-tab-${id}`,
    "aria-controls": `scrollable-auto-tabpanel-${id}`
  }
}
var HashMap = require("hashmap")
const drawerWidth = 250;
const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    backgroundColor: "#0F6038",
    // height: "200px"
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    // backgroundColor: "#E6F3ED",
    position: "fixed",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "86vh",
    marginTop: "110px",
    // height: "100vh",
    overflow: "auto",
    // paddingTop: "190px",
    // border: "1px solid red"
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  modal: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #AFAFAF',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  hrefStyleTop: {
    position: 'absolute',
    backgroundColor: "white",
    border: '1px solid grey',
    height: "35px",
    width: "35px"
  },
  hrefStyleBottom: {
    position: 'absolute',
    backgroundColor: "white",
    border: '1px solid grey',
    height: "35px",
    width: "35px"
  },
  imgstyle: {
    "fill": "red"
  }
}))
const useStylesnav = makeStyles(theme => ({
  root: {
    overflow: "hidden",
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  listItemText: {
    fontSize: 13,
    paddingLeft: "2px",
    // "display": "flex", 
    // "flex-wrap": "wrap",
  },
  level1: {
    paddingLeft: theme.spacing(0),
    maxHeight: 20
  },
  level2: {
    paddingLeft: theme.spacing(0),
    maxHeight: 20
  },
  level3: {
    paddingLeft: theme.spacing(1),
    maxHeight: 20
  },
  tabs: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
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
function getHrefStyleTop() {
  const bottom = 7;
  const right = 2;
  return {
    bottom: `${bottom}%`,
    right: `${right}%`,
    transform: `translate(-${bottom}%, -${right}%)`,
  };
}
function getHrefStyleBottom() {
  const bottom = 2;
  const right = 2;
  return {
    bottom: `${bottom}%`,
    right: `${right}%`,
    transform: `translate(-${bottom}%, -${right}%)`,
  };
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
export default () => {
  const { keycloak } = useKeycloak()
  const [selectedTab, setSelectedTab] = useState(null)
  const [tabs, setTabs] = useState([])

  // const [endpoint] = useState("ws://192.168.2.208:3220") // Local
  // const [api] = useState("/api") // Local api

  // const [endpoint] = useState("wss://depo.cds.kg:3120") //Rented Server UBUNTU
  // const [api] = useState("/back/api") //Server api

  // separate endpoints  by build/production
  const [endpoint] = process.env.NODE_ENV === "development" ? useState("ws://localhost:3220") : useState("wss://depo.cds.kg:3120")
  const [api] = process.env.NODE_ENV === "development" ? useState("/api") : useState("/back/api")

  // const [endpoint] = useState("wss://depo-test.cds.kg:3120") //OLD Server

  const [routes, setRoutes] = useState([])
  const [session_id, setSession_id] = useState(null)
  const [webSocketMessage, setWebSocketMessage] = useState(null)
  const [currTaskId, setCurrTaskId] = useState(null)
  const [opennav, setOpennav] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(true)
  const [tabCounter, setTabCounter] = useState(1)
  const [menuItemStates, setMenuItemStates] = useState([])
  const [socket, setSocket] = useState(null)
  const [tabData, setTabData] = useState(null)
  // User
  const [userProfile, setUserProfile] = useState({})
  const [userRoleLabel, setUserRoleLabel] = useState("")
  const [userPartnerLabel, setUserPartnerLabel] = useState("")

  const [unreadInstructions, setUnreadInstructions] = useState(0)
  const [urgentUnreadInstructions, setUrgentUnreadInstructions] = useState(false)
  const [unreadDistributions, setUnreadDistributions] = useState(0)
  const [operDayIsOpened, setOperDayIsOpened] = useState(null)
  const [lastClosedDate, setLastClosedDate] = useState(moment(new Date()).format("DD.MM.YYYY"))
  const [restore, setRestore] = useState(false)
  // Rutoken
  const [rutokenRequired, setRutokenRequired] = useState(true)
  const [modalStyle] = useState(getModalStyle)
  const [showModalEnterPin, setShowModalEnterPin] = useState(false)
  const [rutokenPin, setRutokenPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [wrongPin, setWrongPin] = useState(false)
  const [esUserFullName, setEsUserFullName] = useState(null)
  const [esInn, setEsInn] = useState(null)
  const [esExpiredDate, setEsExpiredDate] = useState(null)

  const [showModalFakeRutoken, setShowModalFakeRutoken] = useState(false)
  const [rutokenFakePin, setRutokenFakePin] = useState("")

  const classes = useStyles()
  const classesnav = useStylesnav()
  const [hrefStyleTop] = useState(getHrefStyleTop)
  const [hrefStyleBottom] = useState(getHrefStyleBottom)
  const handleDrawerOpen = () => {
    setOpenDrawer(true)
  }
  const handleDrawerClose = () => {
    setOpenDrawer(false)
  }
  // console.log("INN", esInn)
  useEffect(() => {
    console.log("ENV", endpoint)
    if (tabData === null) {
      setTabData(new HashMap())
    }
    keycloak.loadUserProfile().success(function (profile) {
      let curUserProfile = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        username: profile.username
      }
      try {
        if (profile.attributes["rutokenRequired"][0] === "true") {
          setRutokenRequired(true)
        }
        else {
          setRutokenRequired(false)
          setRestore(true)
        }
      }
      catch (er) {
        setRutokenRequired(false)
        setRestore(true)
      }

      for (let i in profile.attributes) {
        let value = profile.attributes[i][0] === "true" ? true : profile.attributes[i][0] === "false" ? false : profile.attributes[i][0]
        curUserProfile[i] = value
      }
      if (curUserProfile.rutokenRequired === true) {
        setShowModalEnterPin(true)
      }
      setUserProfile(curUserProfile)
      console.log("PROFILE", curUserProfile)
    }).error(function () {
      console.log("Failed to load user profile")
    })
  }, [])

  // RuToken functions
  // Sign with rutoken
  function sign() {
    var textToSign = "data";
    if (plugin !== null) {
      // Перебор подключенных Рутокенов
      plugin.enumerateDevices()
        .then(function (devices) {
          if (devices.length > 0) {
            return Promise.resolve(devices[0]);
          } else {
            swAllert("Рутокен не обнаружен", "warning");
          }
        })
        // Проверка залогиненности
        .then(function (firstDevice) {
          rutokenHandle = firstDevice;
          return plugin.getDeviceInfo(rutokenHandle, plugin.TOKEN_INFO_IS_LOGGED_IN);
        })
        // Логин на первый токен в списке устройств PIN-кодом по умолчанию
        .then(function (isLoggedIn) {
          // console.log("PIN", rutokenPin)
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
              // console.log("ESDATA", inn, fullName)
              setEsInn(inn)
              setEsUserFullName(fullName)
              setEsExpiredDate(certData.validNotAfter.substring(0, certData.validNotAfter.length - 1))
              restoreUserTabs()
              handleCloseModalEnterPin()
              return plugin.sign(rutokenHandle, certHandle, textToSign, plugin.DATA_FORMAT_PLAIN, options);
            } else {
              alert("Сертификат на Рутокен не обнаружен")
            }
          }
          else {
            plugin.logout(rutokenHandle)
            callErrorToast("Рутокен просрочен", "warning")
          }
        })
        // Закрытие сессии
        .then(function () {
          plugin.logout(rutokenHandle)
        }, handleError)
    }
    else { callErrorToast("Вставьте рутокен, либо установите расширение для вашего браузера", "warning") }
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
  const handleCloseModalEnterPin = () => {
    setShowModalEnterPin(false)
  }
  function handlePinChange(event) {
    // console.log("PIN EV", event.target.value)
    setRutokenPin(event.target.value)
    setWrongPin(false)
    // console.log("PIN", event.target.value)
  }
  function handleClickShowPin() {
    setShowPin(!showPin)
  }
  function onKeyPressModalEnterPin(event) {
    // console.log("KP EV", event.target.value)
    let code = event.charCode
    if (code === 13) {
      buttonClick("SignButton")
    }
  }
  function handleFakePinChange(event) {
    // console.log("PIN EV", event.target.value)
    setRutokenFakePin(event.target.value)
    setWrongPin(false)
    // console.log("PIN", event.target.value)
  }
  function setFakeRutokenData() {
    // console.log("RUT", rutokenFakePin)
    if (rutokenFakePin === "inter!@#") {
      setEsUserFullName("Intersoft")
      setEsInn("10101200000222")
      setEsExpiredDate("01.01.2050")
      setShowModalFakeRutoken(false)
      callSuccessToast("Данные записаны!")
    }
    else{
      setWrongPin(true)
    }
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
  // function downloadReport(reportName, reportVars) {
  //   socket.send(JSON.stringify({
  //     commandType: "downloadReport",
  //     userId: userProfile.userId,
  //     session_id: session_id,
  //     userRole: userProfile.userRole,
  //     partner: userProfile.partner,
  //     token: "Bearer " + keycloak.token,
  //     reportName: reportName,
  //     reportVars: reportVars
  //   }))
  // }
  // Main socket connection and data receiving
  if (socket === null && userProfile.userRole !== undefined) {
    setSocket(new WebSocket(endpoint))
    console.log("CONNECTING...", endpoint)
  }
  if (socket !== null) {
    socket.onmessage = async function (message) {
      var incomingJson = JSON.parse(message.data)
      // console.log("Socket message", incomingJson)
      // console.log("TAB DATA", tabData)
      if (incomingJson.messageType === "session_id") {
        console.log("CONNECTED TO: ", endpoint)
        console.log("NEW SESSION: ", incomingJson.session_id)
        setSession_id(incomingJson.session_id)
        socket.send(JSON.stringify({
          commandType: "setUserData",
          userId: userProfile.userId,
          session_id: incomingJson.session_id,
          userRole: userProfile.userRole,
          partner: userProfile.partner,
          token: "Bearer " + keycloak.token
        }))
      }
      else if (incomingJson.messageType === "userDataInserted") {
        console.log("userDataInserted", incomingJson.session_id)
        socket.send(JSON.stringify({
          commandType: "getMenu",
          userProfile: userProfile,
          session_id: incomingJson.session_id,
          token: "Bearer " + keycloak.token
        }))
        socket.send(JSON.stringify({
          commandType: "getUserRoleLabel",
          userProfile: userProfile,
          session_id: incomingJson.session_id,
          token: "Bearer " + keycloak.token
        }))
        if (restore === true) {
          restoreUserTabs()
        }
      }
      else if (incomingJson.messageType === "Menu") {
        let updatedMenuItemStates = menuItemStates.slice()
        for (let i = 0; i < incomingJson.routes.length; i++) {
          if (incomingJson.routes[i].level2 !== undefined) {
            let newMenuItem = {
              name: incomingJson.routes[i].name,
              state: incomingJson.routes[i].state
            }
            updatedMenuItemStates.push(newMenuItem)
            for (let l = 0; l < incomingJson.routes[i].level2.length; l++) {
              if (incomingJson.routes[i].level2[l].level3 !== undefined) {
                let newMenuItem2 = {
                  name: incomingJson.routes[i].level2[l].name,
                  state: incomingJson.routes[i].level2[l].state
                }
                updatedMenuItemStates.push(newMenuItem2)
              }
            }
          }
        }
        setRoutes(incomingJson.routes)
        setMenuItemStates(updatedMenuItemStates)
        // console.log("MENU States", updatedMenuItemStates)
      }
      else if (incomingJson.messageType === "userTask") {
        // console.log("NEW TASK", incomingJson)
        let tabExist = false // If tab not exist open it to copy workspace on different machines
        for (let i = 0; i < tabs.length; i++) {
          if (tabs[i].id === incomingJson.process_id) {
            tabExist = true
            break
          }
        }
        if (tabExist === false) {
          let updatedTabs = tabs.slice()
          updatedTabs.push({ id: incomingJson.process_id, name: incomingJson.process_id, label: incomingJson.tabLabel + " " + tabCounter })
          setTabs(updatedTabs)
          // setSelectedTab(incomingJson.process_id)
          setTabCounter(tabCounter + 1)
        }
        tabData.remove(incomingJson.process_id)
        setCurrTaskId(incomingJson.taskID)
        await tabData.set(incomingJson.process_id, incomingJson)
        setWebSocketMessage(incomingJson)
      }
      else if (incomingJson.messageType === "restoreTab") {
        if (tabData.get(incomingJson.process_id) === undefined) {
          await tabData.set(incomingJson.process_id, incomingJson)
          // console.log("NEW TASK", incomingJson)
          let updatedTabs = tabs.slice()
          updatedTabs.push({ id: incomingJson.process_id, name: incomingJson.process_id, label: incomingJson.tabLabel + " " + tabCounter })
          if (tabCounter === 1) {
            setSelectedTab(incomingJson.process_id)
            setCurrTaskId(incomingJson.taskID)
          }
          setTabs(updatedTabs)
          setTabCounter(tabCounter + 1)
          setWebSocketMessage(incomingJson)
        }
      }
      else if (incomingJson.messageType === "error") {
        setWebSocketMessage(incomingJson)
        // console.log("webSocket ERROR", incomingJson)
        tabData.set(incomingJson.process_id, incomingJson)
        setCurrTaskId(incomingJson.taskID)
        handleCloseCurrentTab(incomingJson.process_id)
      }
      else if (incomingJson.messageType === "notifications") {
        let unreadInstructions = JSON.parse(incomingJson.unreadInstructions)
        // console.log("NOTIFICATIONS", unreadInstructions)
        setUrgentUnreadInstructions(unreadInstructions.urgent)
        setUnreadInstructions(parseInt(unreadInstructions.count))
      }
      else if (incomingJson.messageType === "notification") {
        swal({
          text: incomingJson.text,
          icon: incomingJson.icon
        })
      }
      else if (incomingJson.messageType === "distributions") {
        let unreadDistributions = JSON.parse(incomingJson.unreadDistributions)
        console.log("unreadDistributions", unreadDistributions)
        if (unreadDistributions.length > 3) {
          setUnreadDistributions(unreadDistributions.substring(0, 3) + "+")
        }
        else {
          setUnreadDistributions(unreadDistributions)
        }
      }
      else if (incomingJson.messageType === "toast") {
        if (incomingJson.toastType === "success") {
          callSuccessToast(incomingJson.toastText)
        }
        else if (incomingJson.toastType === "error") {
          console.log("ERR TOAST", incomingJson.toastText)
          callErrorToast(incomingJson.toastText)
        }
      }
      else if (incomingJson.messageType === "operDayStatus") {
        let opDayStatus = JSON.parse(incomingJson.status)
        console.log("OP DAY", opDayStatus)
        // if (opDayStatus.isOpened === true) {
        setOperDayIsOpened(opDayStatus.isOpened)
        setLastClosedDate(moment(new Date(opDayStatus.lastClosedDate)).format("DD.MM.YYYY"))

        // }
        // else {
        //   setOperDayIsOpened(false)
        // }
      }
      else if (incomingJson.messageType === "userPartnerLabel") {
        // console.log("Partner", incomingJson)
        setUserPartnerLabel(incomingJson.userPartnerLabel)
        if (incomingJson.userPartnerLabel === null) {
          callErrorToast("У данного пользователя отсутствует контрагент!")
        }
      }
      else if (incomingJson.messageType === "userRoleLabel") {
        // console.log("ROLE", incomingJson)
        setUserRoleLabel(incomingJson.userRoleLabel)
      }

      else if (incomingJson.messageType === "closeTab") {
        // console.log("ROLE", incomingJson)
        closeTab(incomingJson.process_id)
      }

      // else if (incomingJson.messageType === "downloadReport") {
      //   console.log("B64", incomingJson.base64)
      //   var arr = incomingJson.base64.split(','),
      //     mime = arr[0].match(/:(.*?);/)[1],
      //     bstr = atob(arr[1]),
      //     n = bstr.length,
      //     u8arr = new Uint8Array(n)

      //   while (n--) {
      //     u8arr[n] = bstr.charCodeAt(n)
      //   }
      //   let convFile = new File([u8arr], "fileName", { type: mime })

      //   var url = window.URL.createObjectURL(convFile)
      //   var a = document.createElement('a')
      //   a.href = url
      //   a.download = `${"incomingJson.blob.name"}.pdf`
      //   document.body.appendChild(a) // we need to append the element to the dom -> otherwise it will not work in firefox
      //   a.click()
      //   a.remove()
      // }
      else {
        console.log("Socket Message", incomingJson)
      }
    }
    socket.onclose = function (er) {
      console.log("CONNECTION CLOSED ", endpoint)
      setSocket(null)
    }
  }
  function callSuccessToast(text) {
    toast(text, {
      position: "top-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
  function callErrorToast(text) {
    toast.error(text, {
      position: "top-right",
      autoClose: 7000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    })
  }
  function restoreUserTabs() {
    console.log("RESTORE STARTED")
    setRestore(false)
    socket.send(JSON.stringify({
      commandType: "restoreSession",
      userId: userProfile.userId,
      session_id: session_id,
      userRole: userProfile.userRole,
      token: "Bearer " + keycloak.token
    }))
    socket.send(JSON.stringify({
      commandType: "getOperDayStatus",
      userId: userProfile.userId,
      session_id: session_id,
      token: "Bearer " + keycloak.token
    }))
    socket.send(JSON.stringify({
      commandType: "launchProcess",
      processKey: "process_169eccff-4a0c-4b5f-8eda-150965351a91",
      session_id: session_id,
      process_id: "null",
      userId: userProfile.userId,
      token: "Bearer " + keycloak.token,
      variables: {
        user_session_id: { value: session_id },
        userAction: { value: "getNotificationsCount" }
      }
    }))
    updateMailDistributions()
  }
  function updateMailDistributions() {
    console.log("GET DISTRS", userProfile.partner)
    if (userProfile.partner) {

      socket.send(JSON.stringify({
        commandType: "getUnreadDistributions",
        // processKey: "process_673b1ef0-a228-476c-832a-682b14e5cc93",
        session_id: session_id,
        process_id: "null",
        userId: userProfile.userId,
        partner: userProfile.partner,
        token: "Bearer " + keycloak.token,
        // variables: {
        //   user_session_id: { value: session_id },
        //   userAction: { value: "getUnreadDistributions" },
        //   user_id_recipient: { value: userProfile.partner},
        //   userId: { value: userProfile.userId },
        // }
      }))
    }
    else {
      console.log("User Partner not mentioned")
    }
  }
  function reduceMailDistributions() {
    if (unreadDistributions > 0) {
      setUnreadDistributions(unreadDistributions - 1)
    }
  }

  // Main button click handler
  function buttonClick(buttonName) {
    // console.log("Button", buttonName)
    if (buttonName === "SignButton") {
      console.log("button Sign: ")
      if (rutokenPin === "") {
        setWrongPin(true)
      }
      else {
        sign()
      }
    }
    else {
      console.log("button: ", buttonName)
    }
  }
  function sendFieldValues(commandJson) {
    if (socket.readyState === socket.OPEN) {
      commandJson["token"] = "Bearer " + keycloak.token
      commandJson["session_id"] = session_id
      console.log("CUR SESSION: ", session_id)
      if (commandJson.commandType !== "deleteSavedDoc") {
        clearTabData(commandJson.process_id)
      }
      if (commandJson.variables !== undefined) {
        if (commandJson.variables["userAction"]["value"] === "cancel") {
          closeTab(selectedTab)
          socket.send(JSON.stringify(commandJson))
        }
        else {
          commandJson.variables["authorization"] = { value: "Bearer " + keycloak.token }
          socket.send(JSON.stringify(commandJson))
          console.log("HOME SEND", commandJson.session_id)
        }
      }
      else {
        socket.send(JSON.stringify(commandJson))
        // console.log("HOME SEND", commandJson)
      }
    }
    else {
      setSession_id(null)
      setSocket(null)
      clearTabData(commandJson.process_id)
    }
    setCurrTaskId(getUUID())
  }
  function handleCloseCurrentTab(tabId) {
    var selectedTabData = tabData.get(tabId)
    if (selectedTabData !== undefined) {
      var commandJson = {
        commandType: "completeTask",
        session_id: selectedTabData.session_id,
        process_id: selectedTabData.process_id,
        taskID: selectedTabData.taskID,
        token: "Bearer " + keycloak.token,
        variables: {
          userAction: { value: "cancel" },
          userId: { value: userProfile.userId },
          userRole: { value: userProfile.userRole }
        }
      }
      sendFieldValues(commandJson)
      closeTab(tabId)
      var commandJson = {
        commandType: "closeTab",
        process_id: selectedTabData.process_id,
        token: "Bearer " + keycloak.token,
        userId: userProfile.userId
      }
      sendFieldValues(commandJson)
      // if (userProfile.userRole === "1") {
      //   sendFieldValues(commandJson)
      //   closeTab(tabId)
      // }
      // else {
      //   if (selectedTabData.taskType === "showSearchUser" ||
      //     selectedTabData.taskType === "showAccountsSearchForm" ||
      //     selectedTabData.taskType === "showSecuritiesSearchForm" ||
      //     selectedTabData.taskType === "showIssuersSearchForm" ||
      //     selectedTabData.taskType === "showDepositorsSearchForm" ||
      //     selectedTabData.taskType === "showDepositoriesSearchForm" ||
      //     selectedTabData.taskType === "showIssuersSearchForm" ||
      //     selectedTabData.taskType === "showPartnersSearchForm" ||
      //     selectedTabData.taskType === "showTransactionsSearchForm" ||
      //     selectedTabData.taskType === "showReferenceListSearchForm" ||
      //     selectedTabData.taskType === "showInstructionsSearchForm" ||
      //     selectedTabData.taskType === "showInstructionsRegistrarsSearchForm" ||
      //     selectedTabData.taskType === "showChargeForCDServicesSearchForm" ||
      //     selectedTabData.taskType === "showTransitChargeForCDServicesSearchForm" ||
      //     selectedTabData.taskType === "showPaymentsForCDServicesSearchForm" ||
      //     selectedTabData.taskType === "showTransitPaymentsForCDServicesSearchForm" ||
      //     selectedTabData.taskType === "showAccountingReportsSelectingForm" ||
      //     selectedTabData.taskType === "showCurrencyRatesSearchForm" ||
      //     selectedTabData.taskType === "showServiceTypesSearchForm" ||
      //     selectedTabData.taskType === "showServiceGroupsSearchForm" ||
      //     selectedTabData.taskType === "showImportFileGIKForm" ||
      //     selectedTabData.taskType === "showQuestinariesGIKSearchForm" ||
      //     selectedTabData.taskType === "showAccountsGIKSearchForm" ||
      //     selectedTabData.taskType === "showReportsSelectingForm" ||
      //     selectedTabData.taskType === "showTariffsRegistrarsSearchForm" ||
      //     selectedTabData.taskType === "showTradesSearchForm" ||
      //     selectedTabData.taskType === "showContractsSearchForm" ||
      //     selectedTabData.taskType === "CorporativeActionsForm" ||
      //     selectedTabData.taskType === "showStockSecuritySearchForm" ||
      //     selectedTabData.taskType === "showStockCurrencySearchForm" ||
      //     selectedTabData.taskType === "showUploadDataToTSForm" ||
      //     selectedTabData.taskType === "showLoadDataFromTSForm" ||
      //     selectedTabData.taskType === "showFormsEditForm" ||
      //     selectedTabData.taskType === "showTariffsCDSearchForm" ||
      //     selectedTabData.taskType === "showFormsSearchForm" ||
      //     selectedTabData.taskType === "showAccountingEntrySearchForm" ||
      //     selectedTabData.taskType === "showSecuritiesOrdersHistorySearchForm" ||
      //     selectedTabData.taskType === "showCurrenciesOrdersHistorySearchForm" ||
      //     selectedTabData.taskType === "showSecuritiesTradesHistorySearchForm" ||
      //     selectedTabData.taskType === "showCurrenciesTradesHistorySearchForm" ||
      //     selectedTabData.taskType === "showLoadDataFromTSSecuritiesForm" ||
      //     selectedTabData.taskType === "showUploadDataToTSSecuritiesForm" ||
      //     selectedTabData.taskType === "showLoadDataFromTSCurrenciesForm" ||
      //     selectedTabData.taskType === "showUploadDataToTSCurrenciesForm" ||
      //     selectedTabData.taskType === "showOperationDayForm" ||
      //     selectedTabData.taskType === "showRegistrarsSearchForm" ||
      //     selectedTabData.taskType === "showTariffsCorrDepositorySearchForm" ||
      //     selectedTabData.taskType === "showCoefficientDepositorsSearchForm" ||
      //     selectedTabData.taskType === "showInstructionsTypeSelectingForm" ||
      //     selectedTabData.taskType === "showReportsCreatingForm" ||
      //     selectedTabData.taskType === "showTransferOrdersSearchForm" ||
      //     selectedTabData.taskType === "corporativeActionsMainForm" ||
      //     selectedTabData.taskType === "showCorrDepositoriesSearchForm" ||
      //     selectedTabData.taskType === "showNewSecurityApplicationsSearchForm" ||
      //     selectedTabData.taskType === "showMortgageSecuritiesSearchForm" ||
      //     selectedTabData.taskType === "showExchangeTSFilesSearchForm" ||
      //     selectedTabData.taskType === "showExchangeTSFilesListForm" ||
      //     selectedTabData.taskType === "error") {
      //     sendFieldValues(commandJson)
      //     closeTab(tabId)
      //   }
      //   else handleOpenSwal("Вы действительно хотите закрыть вкладку?", { yes: "Да", no: "Нет" }, tabId)
      // }
    }
  }
  // Custom allert component
  function handleOpenSwal(text, swalButtons, tabId) {
    return (
      swal({
        text: text,
        icon: "warning",
        buttons: swalButtons
      })
        .then((click) => {
          if (click === "yes") {
            handleCloseCurrentTabModal(tabId)
          }
        })
    )
  }
  // Close current tab from opened alert component
  function handleCloseCurrentTabModal(tabId) {
    var selectedTabData = tabData.get(tabId)
    var commandJson =
    {
      commandType: "completeTask",
      session_id: selectedTabData.session_id,
      process_id: selectedTabData.process_id,
      taskID: selectedTabData.taskID,
      userId: userProfile.userId,
      token: "Bearer " + keycloak.token,
      variables: {
        userAction: { value: "cancel" },
        userId: { value: userProfile.userId },
        userRole: { value: userProfile.userRole }
      }
    }
    sendFieldValues(commandJson)
    closeTab(tabId)
  }

  // wrap up menu items
  function handleOpenMenuClick(name) {
    // console.log("Event", name)
    for (var i = 0; i < menuItemStates.length; i++) {
      if (menuItemStates[i].name === name) {
        if (menuItemStates[i].state === true) {
          menuItemStates[i].state = false
        }
        else {
          menuItemStates[i].state = true
        }
      }
    }
    setOpennav(!opennav)
  }
  // launch process related to menu button
  function handleMenuButtonClick(button) {
    // console.log("Menu button clicked", button)
    if (button.name !== "insertForm" && button.name !== "redeploy") {
      var process_id = getUUID()
      let updatedTabs = tabs.slice()
      updatedTabs.push({ id: process_id, name: process_id, label: button.parentLabel + " " + tabCounter })
      setTabs(updatedTabs)
      setSelectedTab(process_id)
      setTabCounter(tabCounter + 1)
    }
    const commandJson =
    {
      commandType: button.commandType,
      processKey: button.processKey,
      process_id: process_id,
      session_id: session_id,
      userId: userProfile.userId,
      token: "Bearer " + keycloak.token,
      variables: {
        user_session_id: { value: session_id },
        process_id: { value: process_id },
        userAction: { value: "filter" },
        userId: { value: userProfile.userId },
        userRole: { value: userProfile.userRole },
        tabLabel: { value: button.parentLabel },
        authorization: { value: "Bearer " + keycloak.token }
      }
    }
    sendFieldValues(commandJson)
    console.log("Menu Button ", commandJson.variables)
  }
  function getUUID() {
    const uuidv1 = require("uuid/v1")
    return uuidv1()
  }
  async function handleTabChange(tabId) {
    setSelectedTab(tabId)
    console.log("TAB CHANGE", tabId)
  }
  function clearTabData(process_id) {
    tabData.remove(process_id)
    setCurrTaskId(getUUID())
    // console.log("Clearing TabData", tabData, "ID", process_id)
  }
  // close selected tab clear it"s data from cache & change tab counter
  function closeTab(process_id) {
    if (process_id !== undefined) {
      // console.log("Closing TAB", process_id)
      let copyTabs = [...tabs]
      let newTabs = []
      for (var i = 0; i < copyTabs.length; i++) {
        if (copyTabs[i].id !== process_id) {
          newTabs.push(copyTabs[i])
        }
        else {
          // console.log("TAB TO CLOSE", copyTabs[i].id, i)
          if (i > 0 && newTabs.length > 0) {
            setSelectedTab(newTabs[i - 1].id)
          }
          else {
            if (copyTabs.length > 1) {
              setSelectedTab(copyTabs[1].id)
            }
            else { setSelectedTab(null) }
          }
        }
      }
      // console.log("TABS", newTabs, newTabs.length)
      if (newTabs.length === 0) {
        setTabCounter(1)
      }
      setTabs(newTabs)
    }
    // // console.log("Closing TAB", process_id)
    // let updatedTabs = tabs.slice()
    // for (i = 0; i < updatedTabs.length; i++) {
    //   if (updatedTabs[i].id === process_id) {
    //     // console.log("INDEX", i)
    //     updatedTabs.splice(i, 1)
    //   }
    // }
    // if (Object.keys(updatedTabs).length === 0) {
    //   setSelectedTab(null)
    //   setTabCounter(1)
    // }
    // else {
    //   setSelectedTab(updatedTabs[0].id)
    //   setTabs(updatedTabs)
    // }
  }
  // Creating Menu Levels 1-3
  function getLevel1Items(level1, index) {
    // console.log("Creating Menu menuItemStates", menuItemStates)
    if (level1.level2 === undefined) {
      return (
        <ListItem button
          className={classesnav.level1}
          onClick={() => handleMenuButtonClick(level1)}
        >
          <ExitToAppIcon />
          <div className={classesnav.listItemText}>{openDrawer === true ? level1.label : ""}</div>
        </ListItem>
      )
    }
    else {
      for (var i = 0; i < menuItemStates.length; i++) {
        if (menuItemStates[i].name === level1.name) {
          return (
            <List key={index}>
              <ListItem
                button
                className={classesnav.level1}
                onClick={() => handleOpenMenuClick(level1.name)}
              >
                <AddCircleIcon style={{ height: 20 }} />
                <div className={classesnav.listItemText} style={{ "fontWeight": "bold" }}>{openDrawer === true ? level1.label : ""}</div>
                {(menuItemStates[i].state === true) ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={menuItemStates[i].state} timeout="auto" unmountOnExit>
                {level1.level2.map((level2Item, index) =>
                  getLevel2Items(level2Item, index)
                )}
              </Collapse>
            </List>
          )
        }
      }
    }
  }
  function getLevel2Items(level2, index) {
    // console.log("Level2", level2)
    if (level2.level3 === undefined) {
      return (
        <ListItem button
          className={classesnav.level2}
          key={index}
          onClick={() => handleMenuButtonClick(level2)}
        >
          <ExitToAppIcon style={{ height: 20 }} />
          <div className={classesnav.listItemText}>{openDrawer === true ? level2.label : ""}</div>
        </ListItem>
      )
    }
    else {
      for (var i = 0; i < menuItemStates.length; i++) {
        if (menuItemStates[i].name === level2.name) {
          return (
            <List component="div" disablePadding key={index}>
              <ListItem button
                className={classesnav.level2}
                key={index}
                onClick={() => handleOpenMenuClick(level2.name)}
              >
                <AddCircleIcon style={{ height: 20 }} />
                <div className={classesnav.listItemText} style={{ "fontWeight": "bold" }}>{openDrawer === true ? level2.label : ""}</div>
                {(menuItemStates[i].state === true) ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={menuItemStates[i].state} timeout="auto" unmountOnExit>
                {level2.level3.map((level3Item, index) =>
                  getLevel3Items(level3Item, index)
                )}
              </Collapse>
            </List>
          )
        }
      }
    }
  }
  function getLevel3Items(level3, index) {
    return (
      <ListItem button
        className={classesnav.level3}
        key={index}
        onClick={() => handleMenuButtonClick(level3)}
      >
        <ExitToAppIcon style={{ height: 20, color: "grey", marginLeft: "4px" }} />
        <div className={classesnav.listItemText}>{openDrawer === true ? level3.label : ""}</div>
      </ListItem>
    )
  }
  if (menuItemStates.length === 0) {
    return (
      <div align="center" style={{ paddingTop: 20 }}>
        <CircularProgress />
        <div>Loading...</div>
      </div>
    )
  }
  function handleOperDayClick() {
    if (userProfile.userRole === "1" || userProfile.userRole === "7") {
      handleMenuButtonClick({ commandType: "launchProcess", processKey: "process_e79e1386-4473-4d35-8106-acd3fafaa129", parentLabel: "Операц-й день" })
    }
  }
  function currencyBeautifier(currency) {
    // return currency
    // console.log("CUR", currency)
    try {
      let cur = parseFloat(currency).toString()
      let parts
      try {
        parts = cur.split(".")
      }
      catch (er) {
        // console.log("ERR Parsing Float", er)
        parts = [cur, "0"]
      }
      // console.log("PARTS", parts)
      let numberPart = parts[0]
      let thousands = /\B(?=(\d{3})+(?!\d))/g
      let decimalPart = parts[1]
      let newCur = numberPart.replace(thousands, " ")
      let spDecPart
      let newDecPart = ""
      try {
        spDecPart = decimalPart.split('')
        let numberStarted = false
        for (let i = spDecPart.length - 1; i > -1; i--) {
          if (spDecPart[i] === "0") {
            if (numberStarted === true) {
              newDecPart = spDecPart[i] + newDecPart
            }
          }
          else {
            numberStarted = true
            newDecPart = spDecPart[i] + newDecPart
          }
        }
      }
      catch (er) {
        // console.log("ERR parsing Dec part", er)
      }

      newCur = newCur + (newDecPart ? "." + newDecPart : "")
      return newCur
    }
    catch (er) {
      console.log("ERR Parsing Float", er)
      return currency
    }
  }
  function intBeautifier(int) {
    try {
      let strInt = int.toString()
      const thousands = /\B(?=(\d{3})+(?!\d))/g
      let newInt = strInt.replace(thousands, " ")
      return newInt
    }
    catch (er) {
      return int
    }
  }

  return (
    <Grid>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar style={{ position: "fixed" }} className={clsx(classes.appBar, openDrawer && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, openDrawer && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>

            <Typography component="h1" variant="h6" color="inherit" className={classes.title} onDoubleClick={() => setShowModalFakeRutoken(true)}>
              ЦД
            </Typography>
            {userProfile.userId !== undefined &&
              <table>
                <tbody>
                  <tr>
                    <td style={{ paddingRight: 15 }}>
                      {moment(new Date()).format("DD.MM.YYYY")}
                    </td>
                    {operDayIsOpened !== null &&
                      <td
                        style={{ paddingRight: 15, cursor: "pointer" }}
                        onClick={() => handleOperDayClick()}
                      >
                        Операционный день: {operDayIsOpened === true ? "Открыт" : "Закрыт"}
                      </td>
                    }
                    {operDayIsOpened !== null && operDayIsOpened === false &&
                      <td style={{ paddingRight: 15 }}>
                        {lastClosedDate}
                      </td>
                    }

                    <td>
                      <Badge badgeContent={unreadDistributions} color="primary">
                        <EmailIcon
                          style={{ cursor: "pointer" }}
                          fontSize="large"
                          color="white"
                          onClick={() => handleMenuButtonClick({ commandType: "launchProcess", processKey: "process_998ca68e-ee45-4b5b-ba23-5b9af4a34d38", parentLabel: "КД" })}
                        />
                      </Badge>
                    </td>
                    {(userProfile.userRole === "1" || userProfile.userRole === "7") &&
                      <td style={{ paddingRight: 15 }}>
                        <Badge badgeContent={unreadInstructions} color={unreadInstructions > 0 ? "secondary" : "primary"}>
                          <Notification
                            style={{ cursor: "pointer" }}
                            fontSize="large"
                            color={urgentUnreadInstructions === true ? "secondary" : "white"}
                            onClick={() => handleMenuButtonClick({ commandType: "launchProcess", processKey: "process_892bad05-cc0e-46b2-8e76-6aa1fed7cde0", parentLabel: "Поручения" })}
                          />
                        </Badge>
                      </td>
                    }
                  </tr>
                </tbody>
              </table>
            }
            <AccountCircleIcon fontSize="large" />
            {!!keycloak.authenticated && (
              <table>
                <tbody>
                  <tr>
                    <td>
                      <table>
                        <tbody>
                          <tr>
                            <td style={{ fontSize: 11 }}>ФИО:</td>
                            <td style={{ fontSize: 11 }}>{userProfile.firstName + " " + userProfile.lastName.substring(0, 1) + "."}</td>
                          </tr>
                          <tr>
                            <td style={{ fontSize: 11 }}>Роль:</td>
                            <td style={{ fontSize: 11 }}>{userRoleLabel}</td>
                          </tr>
                          <tr>
                            <td style={{ fontSize: 11 }}>Фирма:</td>
                            <td style={{ fontSize: 11 }}>{userPartnerLabel}</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td>
                      <Typography>
                        <IconButton color="inherit" style={{ fontSize: 14 }} onClick={() => keycloak.logout()}>
                          Выйти
                        </IconButton>
                      </Typography>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !openDrawer && classes.drawerPaperClose),
          }}
          open={openDrawer}
        >
          <div className={classes.toolbarIcon}>
            <img src="favicon.ico" height="65px" width="65px" style={{ marginRight: "100px" }}></img>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          {routes.map((level1, index) => (
            getLevel1Items(level1, index)
          ))}
        </Drawer>

        <main className={classes.content}>
          <a name="top" />
          {/* <div className={classes.appBarSpacer}/> */}
          <Grid style={{ paddingLeft: (openDrawer === true) ? drawerWidth : 65 }}>
            <AppBar color="default" style={{ paddingLeft: (openDrawer === true) ? drawerWidth : 65 }}>
              <Tabs
                key={currTaskId}
                style={{ height: "110px", paddingTop: "60px" }}
                position="fixed"
                value={selectedTab}
                // onChange={(event, newValue)=> handleTabChange(event, newValue)}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
              >
                {tabs.map((tab, index) => (
                  <Tab
                    key={tab.id}
                    index={index}
                    onMouseDown={() => handleTabChange(tab.id)}
                    label={
                      <Grid style={{ fontSize: 10 }}>
                        {tab.label}
                        <IconButton onClick={() => handleCloseCurrentTab(tab.id)}>
                          <CloseIcon style={{ fontSize: "medium", color: "black" }} />
                        </IconButton>
                      </Grid>
                    }
                    value={tab.id}
                    {...a11yProps(tab.id)}
                  >
                  </Tab>
                ))}
              </Tabs>
            </AppBar>
            {webSocketMessage !== null &&
              tabs.map(tab => (
                <TabPanel
                  // position="fixed"
                  currentTab={tab.id}
                  selectedTab={selectedTab}
                  key={tab.id}
                  style={{ paddingLeft: 10, fontSize: "0.9rem" }}
                  value={tab.id}
                >
                  <ComponentManager
                    // VARS
                    api={api}
                    userProfile={userProfile}
                    selectedTab={selectedTab}
                    id={tab.id}
                    key={tab.id}
                    esInn={esInn}
                    esUserFullName={esUserFullName}
                    esExpiredDate={esExpiredDate}
                    // closeTab={closeTab}
                    // mailRest={mailRest}
                    operDayIsOpened={operDayIsOpened}
                    userTask={tabData.get(tab.id)}
                    // FUNCS
                    callSuccessToast={callSuccessToast}
                    callErrorToast={callErrorToast}
                    sendFieldValues={sendFieldValues}
                    handleCloseCurrentTab={handleCloseCurrentTab}
                    clearTabData={clearTabData}
                    updateMailDistributions={updateMailDistributions}
                    reduceMailDistributions={reduceMailDistributions}
                    setEsUserFullName={setEsUserFullName}
                    setEsInn={setEsInn}
                    setEsExpiredDate={setEsExpiredDate}
                    currencyBeautifier={currencyBeautifier}
                    intBeautifier={intBeautifier}
                  // downloadReport={downloadReport}
                  />
                </TabPanel>
              ))
            }
          </Grid>
          <Modal
            open={showModalEnterPin}
            // onClose={handleCloseModalEnterPin}
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
                onClick={() => buttonClick("SignButton")}
                style={{
                  margin: 3,
                  height: 32,
                  fontSize: 12,
                  color: "white",
                  backgroundColor: "#2862F4"
                }}
              >Ок
              </Button>
            </div>
          </Modal>
          <Modal
            open={showModalFakeRutoken}
            onClose={() => setShowModalFakeRutoken(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <div style={modalStyle} className={classes.modal}>
              <h3 id="simple-modal-title">Введите код</h3>
              <FormControl variant="outlined" style={{ width: "100%" }} error={wrongPin}>
                <InputLabel htmlFor="outlined-adornment-password">PIN</InputLabel>
                <OutlinedInput
                  type={showPin ? 'text' : 'password'}
                  defaultValue={rutokenFakePin}
                  onChange={handleFakePinChange}
                  // onKeyPress={onKeyPressModalEnterPin}
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
                onClick={() => setFakeRutokenData()}
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
                onClick={() => setShowModalFakeRutoken(false)}
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
          <ToastContainer />
          <Typography variant="body2" color="textSecondary" align="center" style={{ paddingLeft: openDrawer === true ? drawerWidth : 65, paddingTop: 10 }}>
            {"Copyright © " + new Date().getFullYear() + " Intersoft Ltd. All rights reserved. "}
          </Typography>
          <table
            style={{ paddingLeft: openDrawer === true ? drawerWidth : 65 }}
          >
            <tr>
              <td width="20%">
                <img name="USAID_logo" height={"80px"} width="auto" src={"./USAID_logo.png"} />
              </td>
              <td width="80%">
                <p style={{ align: "center", fontSize: 10 }}>
                  {"Данная автоматизированная информационная система стала возможной благодаря помощи американского народа, оказанной через Агентство США по международному развитию (USAID). Закрытое Акционерное Общество (ЗАО) «Центральный депозитарий» Кыргызской Республики несет ответственность за содержание системы, которое не обязательно отражает позицию USAID или Правительства США."}
                </p>
              </td>
            </tr>
          </table>
          <IconButton href="#top" style={hrefStyleTop} className={classes.hrefStyleTop}>
            <ArrowUpwardRoundedIcon />
          </IconButton>
          <IconButton href="#bottom" style={hrefStyleBottom} className={classes.hrefStyleBottom}>
            <ArrowDownwardIcon />
          </IconButton>
          <a name="bottom" />
        </main>
      </div>
    </Grid>
  )
}
