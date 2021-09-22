import React, { useEffect } from "react";
import AceEditor from "react-ace";
import "./App.css";
import {io} from 'socket.io-client'
import {BrowserRouter as Router ,Switch,Route,Redirect} from 'react-router-dom'
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-terminal";
import { v4 as uuidv4 } from 'uuid';
import {useParams} from 'react-router-dom' 
function App() {
  
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Redirect to={`/editor/${uuidv4()}`}/>
          
         
        </Route>
        <Route path="/editor/:id">
        <Editor/>
          
          
        </Route>
      </Switch>
    </Router>
    
  );
}
const Editor = () =>{

  const {id} = useParams() 

  const [code,setCode] = React.useState()
  const [socket,setSocket] = React.useState(null)
  const [copy,setCopy] = React.useState(false)
  
  React.useEffect(()=>{
    const s =  io("http://localhost:3001")
    setSocket(s)
    return () =>{
      s.disconnect()
    }
   

   
  },[])
  
  React.useEffect(()=>{
    if(socket == null || code == null) return
   socket.emit("sendChanges",code) 
  },[socket,code])


  React.useEffect(()=>{
    if(socket == null || code == null) return
   /* socket.emit("sendChanges",code)  */
   socket.on("recieveChanges",codes =>{
     setCode(codes)
   })
  },[socket,code])






  React.useEffect(()=>{
    if(socket == null || code == null) return

    socket.once("loadDocument", document =>{
      setCode(document)
    })

    socket.emit('getDocument',id)

  },[socket,code,id])







  return(
    <div className="app">
      <h1>Editor</h1>
      {copy?<h1>Copied</h1>:<h1>not copied</h1>}
      <button onClick={()=>{
         const el = document.createElement("input");
         el.value = window.location.href;
         document.body.appendChild(el);
         el.select();
         document.execCommand("copy");
         document.body.removeChild(el);
         setCopy(true)
      }}>Copy url</button>
      <div className="editor">
        <AceEditor
          width
          value={code}
          mode="javascript"
          theme="terminal"
          /* name="blah2" */
          fontSize={30}
          /* showPrintMargin={true} */
          onChange={(value,e)=>{setCode(value)}}
          showGutter={true}
          highlightActiveLine={true}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
          style={{
            width: '70%',
            height: "88vh",
            backgroundColor: "#000",
            color: "#fff",
          }}
        />
       
       
      </div>
    
    </div>
  )
}

export default App;


