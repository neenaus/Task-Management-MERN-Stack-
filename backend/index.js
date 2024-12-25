    const express=require('express');
    const mongoose=require('mongoose');
    const cors=require('cors')


    //creating instance of express
    const app=express();

    //.use tells that we are going to use middleware
    //this middle ware is used bcz we are posting data as json but this req.body dont know that, to tell that it is json the next line is used
    app.use(express.json())
    app.use(cors())

    //connecting mongodb
    mongoose.connect('mongodb://localhost:27017/mern-app')//this is path(mongodb://localhost:27017/) is inside the mongodb app(compass)
                                                            // and mern-app is user defined name->db to be created
    .then(()=>{//promise
    console.log("db connected")
    })
    .catch((err)=>{
        console.log(err)
    })

    //creating schema
    const todoschema=new mongoose.Schema({
        title:{
            required:true,
            type: String
        },
        description:String
    })

    //creating model
    const todomodel=mongoose.model('Todo',todoschema); //with this model only database operation is performed and "Todo" this name should be in singular

    app.post("/todos",async(req,res)=>{
        const {title,description}=req.body;
        
        try{
            const newtodo=new todomodel({title,description});
            await newtodo.save(); //this is a promise so we have to wait so 'await' and so use async; as this has to wait, we r using try, catch
            res.status(201).json(newtodo);//to tell that this "newtodo" only i received as response
        }
        catch(error){
            console.log(error);
            res.status(500).json({message:error.message});
        }

    })

    //api to get all the items
    app.get("/todos",async(req,res)=>{
        try{
            const todos=await todomodel.find();//find is also a promise so await, async
            res.json(todos);
        }
        catch(error){
            console.log(error);
            res.status(500).json({message:error.message});
        }
    })

    app.put("/todos/:id",async(req,res)=>{
        try {
            const {title,description}=req.body;
            const id=req.params.id;
            const updatetodo=await todomodel.findByIdAndUpdate(
                id,
                {title,description},
                {new:true}//if this is not given old value only shown if this is given, updated value is shown
            )
            if(!updatetodo){
                return res.status(404).json({message:"todo not found"})
            }
            res.json(updatetodo)
            
        } catch (error) {
            console.log(error)
            res.status(500).json({message:error.message});
        }
    })

    app.delete("/todos/:id",async(req,res)=>{
        try {
        const id=req.params.id;
        await todomodel.findByIdAndDelete(id);
        res.status(204).end()
        } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message});
        }
    })

    //start a server
    const port=8000;
    app.listen(port,()=>{
        console.log("Server is listening to port"+port);
    })