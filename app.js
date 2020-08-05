var express = require('express');
    bodyParser = require('body-parser');
    methodOverride = require('method-override');
    mongoose = require('mongoose');
    expressSanitizer = require('express-sanitizer');
    app   = express();
    

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);

//App config
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine","ejs"); 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer()); //after body parser
app.use(methodOverride("_method"));

//mongoose/model config
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : {type : Date , default:Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);



//RESTful routes

//HOME
app.get("/",function(req,res){
   res.redirect("/blogs");    
});

//NEW
app.get("/blogs/new",function(req,res){
    res.render("new");
});

//CREATE
app.post("/blogs",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //create blogs
    Blog.create(req.body.blog , function(err,blogs){   //req.body.blog get all the data 
                                                       //of name var at once as an object
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    })
    //redirect
})

//SHOW
app.get("/blogs/:id",function(req,res){
    //res.send("Show Page");
    Blog.findById(req.params.id , function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{Blog : foundBlog})
        }
    });
});

//EDIT
app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id , function(err,foundBlog){
       
        if(err){
            console.log(err);
        }
        else{
            res.render("edit",{blog : foundBlog});
        }
    })
})

//UPDATE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.findByIdAndUpdate(req.params.id , req.body.blog ,function(err , updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})

//DELETE
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id , function(err,deleteBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
    //destroy
    //then redirect
});



//INDEX
app.get("/blogs",function(req,res){
    
   Blog.find({},function(err,blogs){
       if(err){
           console.log(err);
       }
       else{
           res.render("index",{Blogs:blogs});
       }
   })
});







app.listen(3000,function(req,res){
    console.log("Server is running");
});