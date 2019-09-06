const express = require('express');
const Projects = require('../data/helpers/projectModel.js');
const actionRouter = require('../actions/actionRouter.js');
const router = express.Router();

router.use('/:projectID/actions', actionRouter);


router.get('/:projectID', validateProjectId, (req, res) => {
    res.status(200).json(req.project)
});


router.post('/', validateProject, (req,res) => {
    const project = req.body;
    Projects.insert(project)
        .then( project => {
            res.status(201).json(project)
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({error: "error inserting project"});
        })
});

router.put('/:projectID',validateProjectId, validateProject, (req, res) => {
    const projectID = req.params.projectID;
    const changes = req.body;
    Projects.update(projectID, changes)
        .then(project => {
            res.status(200).json(project)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({error: "error updating project"})
        })
});

router.delete('/:projectID', validateProjectId, (req, res) => {
    const projectID = req.params.projectID;
    Projects.remove(projectID)
        .then(project => {
            res.status(200).json({message: "Project successfully deleted"})
        })
        .catch(error => {
            console.log(error)
            res.status(404).json({error: "Server couldn't delete the user"})
        })
});

//custom middleware

function validateProjectId(req, res, next) {
    const projectID = req.params.projectID;
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


function validateProject(req, res, next) {
    const {name, description} = req.body;

    if(!name && !description){
        return res.status(400).json({message: "missing required project name and project description"});
    }  
    if(!name){
        return res.status(400).json({message: "missing required project name"});
    }
    if(!description){
        return res.status(400).json({message: "missing required project description"});
    }
    if(typeof name !== 'string'){
        return res.status(400).json({error: "name must be string"});
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



