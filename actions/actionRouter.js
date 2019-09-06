const express = require('express');
const Actions = require('../data/helpers/actionModel.js');
const Projects = require('../data/helpers/projectModel.js');
const router = express.Router({mergeParams: true});

router.get('/', validateProjectId, (req, res) => {
    const projectID = req.params.id;
    Projects.getProjectActions(projectID)
        .then(actions => {
            res.status(200).json(actions)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error: "error catching actions"})
        })
});

router.post('/',validateProjectId, validateActions, (req, res) => {
    const projectID = req.params.projectID;
    req.body.project_id = projectID;
    Actions.insert(req.body)
        .then(action => {
            res.status(201).json(action)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error: "action couldn't inserted"})
        })
});

router.put('/:actionID',validateProjectId, validateActions, (req, res) => {
    const actionID = req.params.actionID
    const changes = req.body;
    Actions.update(actionID, changes)
        .then(action => {
            if(!action){
                return res.status(400).json({message: "invalid action id"})
            }
            res.status(200).json(action)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error: "error updating action"})
        })
});

router.delete('/:actionID', validateProjectId, validateActionId, (req, res) => {
    const actionID = req.params.actionID;
    Actions.remove(actionID)
        .then(action => {
            res.status(200).json({message: "Action successfully deleted"})
        })
        .catch(error => {
            res.status(404).json({error: "cerror deleting the action"})
        })
});



//custom middleware

function validateProjectId(req, res, next) {
    const projectID = req.params.projectID
    Projects.get(projectID).then( project => {
        if(project){
            req.project = project;
            next();
        } else {
            res.status(400).json({message: "invalid project id"});
        };
    }).catch(error => {
        console.log(error)
        res.status(500).json({error: "Server couldn't process your request"})
    });
};


function validateActionId(req, res, next) {
    const actionID = req.params.actionID;
    Actions.get(actionID)
        .then(action => {
            if(!action){
                return res.status(400).json({message: "invalid action id"});
            }
            req.action = action;
            next();
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error: "error updating action"})
        })
};


function validateActions(req, res, next) {
    const {notes, description} = req.body;

    if(!description && !notes){
        return res.status(400).json({message: "missing required action notes and action description"});
    }  
    if(!description){
        return res.status(400).json({message: "missing required action description"});
    }
    if(!notes){
        return res.status(400).json({message: "missing required action notes"});
    }
    if(typeof description !== 'string'){
        return res.status(400).json({error: "description must be string"});
    }
    if(description.length > 128){
        return res.status(400).json({error: "description must be less than 128 characters"});
    }
    next();
};



module.exports = router;