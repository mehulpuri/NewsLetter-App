// jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request= require("request");
const app = express();
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req,res){
  res.sendFile(__dirname+("/signup.html"));
});


app.post("/", function(req,res){
  const firstName = req.body.fName;
  const lastName=  req.body.lName;
  const email= req.body.email;
  const data= {
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonDATA = JSON.stringify(data);
  const url = "https://us14.api.mailchimp.com/3.0/lists/<YOUR LIST ID>";
  const options= {
    method: "POST",
    auth: "rnd:<YOUR API>",
  };

  const request = https.request(url, options, function(response){
   if(response.statusCode === 200){

     res.sendFile(__dirname+"/success.html");
   }else{

     res.sendFile(__dirname+"/failure.html");
   }
  });

  request.write(jsonDATA);
  request.end();

});

app.post("/failure", function(req,res){
  res.redirect("/");
});


const PORT = process.env.PORT || '3000';
app.listen(PORT, function(){
  console.log("the server is up and running");
});
