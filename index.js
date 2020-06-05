const express = require("express");
const app = express();
const path=require('path');
const TodoTask=require('./model/Todotask');

app.set("view engine", "ejs");
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));



 const dotenv = require("dotenv");
    dotenv.config();

    const mongoose = require("mongoose");
    //connection to db
    mongoose.set("useFindAndModify", false);
    mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
    });

app.post('/',async (req,res)=>{
    const todoTask=new TodoTask({
        content:req.body.content
    });
    try{
        await todoTask.save();
        res.redirect('/');
    }catch(err){
       res.redirect('/');
    }
   

})
app.get('/',(req,res)=>{
  TodoTask.find({},(err,tasks)=>{
      res.render('todo.ejs',{todoTask:tasks})
  })
})

app.route('/edit/:id').get((req,res)=>{
    const id=req.params.id;
    TodoTask.find({},(err,tasks)=>{
        res.render('todoEdit',{todoTasks:tasks,idTask:id});
    });

}).post((req,res)=>{
    const id=req.params.id;
    TodoTask.findByIdAndUpdate(id,{content:req.body.content},(err)={
        if(err){
            return res.send(500,err)
        } 
      
    })
    res.redirect('/');
})

//delete routes

app.route('/remove/:id').get((req,res)=>{
    const id=req.params.id;
    TodoTask.findByIdAndRemove(id,(err)=>{
        if(err){
            return res.send(500,err);
        }
        res.redirect('/');
    })
})