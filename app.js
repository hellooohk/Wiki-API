const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();
mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true, useUnifiedTopology: true });
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Article = mongoose.model("Article", articleSchema);
app.route("/articles").get( (req, res) => {
    Article.find({}, (err, foundArticles) => {
        if (!err)
            res.send(foundArticles);
        else
            res.send(err);

    })
}).post((req, res) => {
    const article = new Article({
        title: req.body.title,
        content: req.body.content
    });
    article.save((err) => {
        if (!err) {
            res.send("Successfully saved the article.")
        }
        else {
            res.send(err);
        }
    });
}).delete((req,res)=>{
    Article.deleteMany((err)=>{
        if(!err){
            res.send("Successfully deleted all the articles");
        }
        else{
            res.send(err);
        }
    });
});
app.route("/articles/:articleTitle").get((req,res)=>{
    const articleTitle = req.params.articleTitle;
    Article.findOne({title:articleTitle},(err,article)=>{
        if(article){
            res.send(article);
        }
        else
            res.send("No articles matching that title was found.");
    });
}).put((req,res)=>{
    Article.update(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},
        (err) => {
            if(!err){
                res.send("Successfully updated article.");
            }
        }
    )
}).patch((req,res)=>{
    Article.update(
        {title:req.params.articleTitle},
        {$set:req.body},
        (err)=>{
            if(!err)
                res.send("Successfully updated article.");
            
        }
    )
}).delete((req,res)=>{
    Article.deleteOne({title:req.params.articleTitle},(err)=>{
        if(!err){
            res.send("Successfully deleted the article")
        }
    });
});
app.listen(3000, () => {
    console.log("Server started sucessfully");
});