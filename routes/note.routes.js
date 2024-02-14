const express = require("express");
const  NoteModel  = require("../models/note.model.js");
const {auth} = require("../middlewares/auth.middleware.js")

const noteRouter = express.Router();

noteRouter.get("/",auth, async (req, res) => {
    try {
        const notes = await NoteModel.find({userID:req.body.userID});
        res.status(200).send({notes});
        
    } catch (error) {
        res.send(error)
    }
   
})

noteRouter.post("/",auth, async (req, res) => {
    try {
        const note = new NoteModel(req.body);
        await note.save()
        res.send({"msg":"note has been created"})
    } catch (error) {
        res.send(error)
    }
    
})
noteRouter.patch("/:id",auth, async (req, res) => {
    const  {id}  = req.params;
    try {
        const note = await NoteModel.findOne({ _id: id });
        if(note.userID===req.body.userID){
            await NoteModel.findByIdAndUpdate({ _id: id },req.body);
        res.send({"msg":`note with note id ${id} has been updated`})
        }else{
            res.send({"msg":"you are not authorized"})
        }
        
    } catch (error) {
        res.status(400).errored({error})
    }
})

noteRouter.delete("/:id",auth, async (req, res) => {
    const { id } = req.params;
    try {
        const note = await NoteModel.findOne({ _id: id });
        if(note.userID===req.body.userID){
            await NoteModel.findByIdAndDelete({ _id: id }, req.body);
        res.send({"msg":`note with note id ${id} has been updated`})
        }else{
            res.send({"msg":"you are not authorized"})
        }
        
    } catch (error) {
        res.send({err})
    }
})

module.exports = {noteRouter}