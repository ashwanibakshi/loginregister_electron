const elect   = require('electron');
const  $      = require('jquery');


//register
function register(e){
   let name  = $("#uname").val();
   let email = $("#email").val();
   let pass  = $("#password").val(); 
   
   if((name!="")&&(email!="")&&(pass!="")){
    $("#error p").remove();
    let user ={
        name : name,
       email : email,
    password : pass 
    }
    elect.ipcRenderer.send('register',user);
   }
   else {
       $("#error p").remove();
       $("#error").append('<p class="alert-danger" style="color:"red";">Fill Data In All Fields</p>')
   }
}


//login
function login(e){
    let email = $("#email").val();
    let pass  = $("#password").val(); 
    
    if((email!="")&&(pass!="")){
     $("#error p").remove();
     let user = {
         email : email,
         password:pass
     }
     elect.ipcRenderer.send("loginn",user);
    }
    else {
        $("#error p").remove();
        $("#error").append('<p class="alert-danger" style="color:"red";">Fill Data In All Fields</p>')
    }

}

// function datasaved(e){
//      $("#error p").remove();
//      $("#error").append('<p class="alert-success">data saved</p>')
// }

elect.ipcRenderer.on('datasaved',(event,arg)=>{
     $("#error p").remove();
     $("#error").append('<p class="alert-success">data saved</p>')
     $("#uname").val('');
     $("#email").val('');
     $("#password").val(''); 
});