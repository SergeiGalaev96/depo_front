// Import material and react components
import React, {useState, useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
// Table
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";

// Import libraries
import swal from 'sweetalert' // https://sweetalert.js.org/guides/
import ImportConfig from './ImportConfig.json';
var convert = require('xml-js');

export default(props) =>{
  // This.state
  const [userProfile] = useState(props.userProfile)
  const [process_id] = useState(props.userTask.process_id)
  const [session_id] = useState(props.userTask.session_id)
  const [taskID] = useState(props.userTask.taskID)
  const [taskType] = useState(props.userTask.taskType)
  const [gridForm] = useState(props.userTask.gridForm)
  const [buttons] = useState(props.userTask.buttons)
  const [docList, setDocList] = useState(null)
  const [sectionColor] = useState("#B2E0C9")
  const [showLoading, setShowLoading] = useState(false)
  

  useEffect(()=>{
    console.log("IMPORT PROPS", props)
  },[])

  // Main button click handler
  function buttonClick(buttonName, dataItem){
    console.log("Button", buttonName)
    if(buttonName === "insertDataToDB"){
      if(docList !== null){
        let testDosList = []
        testDosList.push(docList[9])
        const commandJson = 
        {
          commandType: "completeTask",
          session_id: session_id,
          process_id: process_id,
          taskID: taskID,
          variables: {
            userAction: {value: "insertDataToDB"},
            // document: {value: JSON.stringify(docList)}
            document: {value: JSON.stringify(testDosList)}
          }
        }
        console.log("button insertDataToDB: ", commandJson)
        props.sendFieldValues(commandJson)
        props.clearTabData(process_id)
        // swAlert("Данные загружены в базу!", "success")
      }
      else{
        swAlert("Данные для загрузки не обнаружены!", "warning")
      }
    }
    else if(buttonName === "cancel"){
      const commandJson = 
      {
        commandType: "completeTask",
        process_id: process_id,
        session_id: session_id,
        taskID: taskID,
        variables: {
          userAction: {value: "cancel"},
        }
      }
      console.log("button cancel: ", commandJson)
      props.sendFieldValues(commandJson)
      props.clearTabData(process_id)
    }
    else{
      console.log("button: ", buttonName)
    }
  }
  // Returns Button component
  function createButton(button, index){
    return(
      <Button variant="outlined"
        name = {button.name}
        onClick = {()=> buttonClick(button.name)}
        style={{
          margin: 3,
          backgroundColor: button.backgroundColor,
          height: 32,
          fontSize: 12
        }}
        value = {button.name}
        >
          {button.label}
      </Button> 
    )
  }
  // custom allerts
  function swAlert(text, icon){
    return(
      swal({
        text: text,
        icon: icon,
        buttons: {ok: "Ок"}
      })
    )
  }
  function handleChange(e) {
    const files = e.target.files
    if (files && files[0]){
      handleFile(files[0])
    }
  }
  function handleFile(inpFile){
    setShowLoading(true)
    setDocList(null)
    try{
      const reader = new FileReader()  
      reader.onload = (e) => {
        /* Parse data */
        const strxml = e.target.result
        let convertedJson = JSON.parse(convert.xml2json(strxml, {compact: true, spaces: 2}))
        let data = convertedJson.РеестрИпотечныхЦенныхБумаг.ИпотечныеЦенныеБумаги.ИпотечнаяЦеннаяБумага
        
        let newDocList = []
        for(let i=1; i<data.length; i++){
          let newItem = {}
          for(let key in data[i]){
            let name = ImportConfig.namesConfig[key]
            let value = null
            if(data[i][key]["_text"] !== undefined){
              value = data[i][key]["_text"]
            }
            newItem[name] = value
          }
          newDocList.push(newItem)
        }
        // console.log("DATA", newDocList)
        setDocList(newDocList)
        setShowLoading(false)
      }
      reader.readAsText(inpFile)
    }
    catch(re){
      swAlert("Нет данных для отображения!", "warning")
    }
  }
  // function handleFile(selectedFile){
  //   const fileReader = new FileReader()
  //   fileReader.onload = function(event) {
  //     var data = event.target.result;

  //     var workbook = XLSX.read(data, {
  //       type: "binary"
  //     });
  //     workbook.SheetNames.forEach(sheet => {
  //       let rowObject = XLSX.utils.sheet_to_row_object_array(
  //         workbook.Sheets[sheet]
  //       );
  //       let header = rowObject[0]
  //       let arr = []
  //       for(let i=1; i<rowObject.length; i++){
  //         let newObj = {}
  //         for(let key in rowObject[i]){
  //           newObj[header[key]] = rowObject[i][key]
  //         }
  //         arr.push(newObj)
  //       }
  //       console.log("DATA", rowObject);
  //     });
  //   };
  //   fileReader.readAsBinaryString(selectedFile);
  // }
  function getGridFormItems(name, value, index){
    if(name === "rowNumber"){
      let rowNum = index + 1
      return(<td align="left" style={{"color": "black", "fontSize": 12, "border": "1px solid grey", "fontWeight": "bold"}}>{rowNum}</td>)
    }
    else{
      if(value === null || value === "" || value === undefined){
        return(<td align="left" style={{"color": "black", "fontSize": 12, "border": "1px solid grey"}}>{"-"}</td>)
      }      
      else{
        return(<td align="left" style={{"color": "black", "fontSize": 12, "border": "1px solid grey"}}>{value}</td>)
      }
    }
    
  }
  try{
    if(buttons === undefined){return <div>No Buttons</div>}
    return (
      <Grid>
        <Grid container direction="row" justify="flex-start" spacing={1}>
          <Grid item xs={8}>
            <Paper>
              <Grid container direction="row" justify="center" alignItems="center">
                <Table size="small">
                  <TableHead>
                    <TableRow style={{height: 30}}>
                      <TableCell
                        style={{
                          color: "black", 
                          fontSize: 14,
                          backgroundColor:  sectionColor,
                          width: "100%"
                        }}>
                        Форма импорта данных из XML
                      </TableCell> 
                    </TableRow>
                  </TableHead>
                </Table>
                <br/>
                <input 
                  type="file" 
                  className="form-control" 
                  id="file" 
                  // accept={"application/xml"} 
                  onChange={handleChange} 
                />
                <br />
              </Grid>
              <Grid container  direction="row" justify="flex-start" alignItems="flex-start">
                {buttons.map((button, index) => {
                  return createButton(button, index)
                })}
              </Grid> 
            </Paper>
          </Grid>
        </Grid>
        {showLoading === true &&
          <div align="center" style={{paddingTop: 20}}>
            <div>Загрузка...</div>
          </div> 
        }
        <br></br>
        {/* Create grid table with data from doclist */}
        <Grid container direction="row" justify="flex-start" spacing={0}>
          <Grid item sm={"auto"}>
            <Paper>
              <table 
                size="small"
                style={{width:"100%", "border-collapse": "collapse"}}
              >
                <thead style={{backgroundColor: sectionColor}}>
                  <tr>
                    {gridForm.sections.map(section => {
                      return (
                        <td colSpan={section.contents.length} style={{"color": "black", "fontSize": 13, "border": "1px solid grey", "text-align": "center", "font-weight":"bold"}}>{section.label}</td>
                      )
                    })}
                  </tr>
                  <tr>
                    {gridForm.sections.map(section =>
                      section.contents.map(contentItem => {
                        return (
                          <td rowSpan="2" style={{"color": "black", "fontSize": 12, "border": "1px solid grey", "text-align": "center", "font-weight":"bold"}}>{contentItem.label}</td>
                        )
                      })
                    )}
                  </tr>
                </thead>
                <TableBody>
                  {docList !== null &&
                    docList.map((dataItem, index) => (
                      gridForm.sections.map(section => {
                        return(
                          <tr style={{height: 30}}>
                            {section.contents.map(contentItem => {
                              return(getGridFormItems(contentItem.name, dataItem[contentItem.name], index))
                            })}
                          </tr>
                        )
                      })
                    )
                  )} 
                                      
                </TableBody>
              </table>              
            </Paper>
          </Grid>
        </Grid>
      </Grid>  
    )
  }
  catch(error){
    console.log("ERROR", error)
    return <div>error</div>
  }
}