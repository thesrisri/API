const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({                                                                                                    // to read from the html page
  extended: true
}));


mongoose.connect("mongodb://localhost:27017/ownapi", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


//____________________________________________________________________________________________


const dbSchema = new mongoose.Schema({                                          //schema for items in the list

  name: String,
  location: String,
  about: String,
  image:String
});


const Item = mongoose.model("Item", dbSchema);

//________________________________________________________________________________
app.route("/articals")

.get(function(req,res){
  Item.find(function(err,foundarticals){
      if(!err){
        res.send(foundarticals);
      }else{
        res.send("didn't found any articals");
      }
  });
})

.post(function(req,res){
  const newArtical = new Item({
    name: req.body.name,
    location: req.body.location,
    about: req.body.about,
    image: req.body.image
  });
  newArtical.save(function(err){
    if(!err){
      res.send("artical saved");
    }else{
      res.send("error occured ! try again");
    }
  });
})

.delete(function(req,res){
  Item.deleteMany(function(err){
    if(!err){
      res.send("successfully deleted all articals");
    }else{
      res.send("error deleting all articals ");
    }
  });

});
//////////////////////////////////////////////////////////


app.route("/articals/:articalTitle")
.get(function(req,res){
  Item.findOne({name:  req.params.articalTitle},function(err,foundArtical){
      if(foundArtical){
        res.send(foundArtical);
      }else{
        res.send("No articals found as the name "+req.params.articalTitle);
      }

  });
})
.put(function(req,res){
    Item.update({
      name:req.params.articalTitle
    },{name: req.body.name,
    location: req.body.location,
    about: req.body.about,
    image: req.body.image},{overwrite:true},
  function(err){
    if(!err){
      res.send("successfully updated");
    }
    else{
      res.send("error updating");
  }});

})
.patch(function(req, res){
  Item.update(
    {name: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated article.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req,res){
      Item.deleteOne({name:req.params.articalTitle},function(err){
        if(!err)
        {res.send("deleted successfully")}
        else{res.send("cannot delete")}
      });

});







//////////////////////////////////////////////////////////

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
