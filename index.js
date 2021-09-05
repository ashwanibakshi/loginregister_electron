const {app,BrowserWindow,Menu, ipcMain}     = require("electron");
const userModel  = require("./models/user");
const mongoose   = require("mongoose");

mongoose.connect("mongodb://localhost:27017/login")
.then(()=>{
  console.log("connected to db");
})
.catch((err)=>{
  console.log("connection error",err);
})

let main ;

app.on('ready',()=>{
      main = new BrowserWindow({
         width:700,
         height:420,
         webPreferences:{
           nodeIntegration:true,
           contextIsolation: false,
           enableRemoteModule: true,
           devTools:true
         }
      }); 
       tempmain1(null,(err,data)=>{
        const menu = Menu.buildFromTemplate(data);
        Menu.setApplicationMenu(menu);  
       main.loadFile('./view/index.html')         
       });
});

app.on('window-all-closed',()=>{
    app.quit();
})


ipcMain.on('register',(event,arg)=>{
   let users = new userModel({
      username:arg.name,
      email: arg.email,
      password: arg.password,
      role:"user"    
   });
   users.save((err,data)=>{
        if(err){
          console.log(err);
        }
        else{
          event.sender.send('datasaved');
        }
    });
});

ipcMain.on('loginn',(event,arg)=>{
  console.log(arg);
  userModel.findOne({"email":arg.email,"password":arg.password},(err,data)=>{
      if(err){
        console.log(err);
      }
      else{
        console.log("ds",data);
        tempmain1(data.role,(err,data)=>{
           if(err){
             console.log(err);
           }    
           else{
             const menu = Menu.buildFromTemplate(data);
             Menu.setApplicationMenu(menu);
             main.loadFile('./view/dashboard.html');  
           }
         });    
      }   
    });
  });



//menus

function tempmain1(role,cb){
  let template;
  if(role==null||role==undefined){
     template =  [
      {
        label:"register",
        click:()=>{
          main.loadFile('./view/register.html')    
        }
      },
      {
      label:"login",
      click:()=>{
          main.loadFile('./view/login.html')
        }
      }
     ]
  }
  else if(role=="user"){
    template =  [
      {
        label:"Dashboard",
        click:()=>{
            main.loadFile('./view/dashboard.html')
          }
        },
      {
        label:"logout",
        click:()=>{
          tempmain1(null,(err,data)=>{
             if(err){
               console.log(err);
             } 
             else{
               const menu = Menu.buildFromTemplate(data);
               Menu.setApplicationMenu(menu);
               main.loadFile('./view/index.html')
             }
          });    
        }
      }
     ]
  }
  cb(null,template);
}