const express = require('express')
const router = express.Router()
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


//Route 1: Get all notes using: GET "/api/notes/getuser". login required 
router.get('/fetchnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal Server Error")
    }
})

//Route 2: Add anew note using: GET "/api/notes/addnote". login required 
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 5 }),
    body('description', 'discription must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
    const {title, description, tag} = req.body
    //If there are any errors, return bad requests and errors
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const note= new Note({
    title, description, tag, user: req.user.id
    })
    const saveNote = await note.save()
    res.json(saveNote);
} catch (error) {
    console.error(error.message);
    res.status(500).send("internal Server Error")
}
})


//Route 3: Update an existing Note using: Put "/api/notes/updatenote". login required
router.put('/updatenote/:id', fetchuser, async (req, res)=>{
    console.log("Put method is working");
    const {title, description, tag} = req.body
    try {
        
    
    //create newNote object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description= description};
    if(tag){newNote.tag = tag};
    
    //Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    console.log("working :" + JSON.stringify(note));
    if(!note){
        return res.status(404).send("Not Found")
    }
    if(note.user.toString() !== req.user.id){

        return res.status(401).send("Not Allowed")
    }
    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
    res.json({note});
} catch (error) {
    console.error(error.message);
    res.status(500).send("internal Server Error")
}
})

//Route 3: Delete an existing Note using: DELETE "/api/notes/deletenote". login required
router.delete('/deletenote/:id', fetchuser, async (req, res)=>{
    console.log("Put method is working");
    const {title, description, tag} = req.body
    try {
        
    
    //Find the note to be delete and delete it
    let note = await Note.findById(req.params.id);
    console.log("working :" + JSON.stringify(note));
    if(!note){
        return res.status(404).send("Not Found")
    }

    //Allow Deletion only if user onwns the Note
    if(note.user.toString() !== req.user.id){
    return res.status(401).send("Not Allowed")
    }
    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success" : "Note has been deleted", note: note});
}  catch (error) {
    console.error(error.message);
    res.status(500).send("internal Server Error")
}
})
module.exports = router