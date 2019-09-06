const express = require('express');
const Projects = require('../data/helpers/projectModel.js');

const router = express.Router();


router.get('/:id', validateProjectId, (req, res) => {
    res.status(200).json(req.project)
});

router.get('/:id/actions', validateProjectId, (req, res) => {
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

router.put('/:id',validateProjectId, validateProject, (req, res) => {
    const projectID = req.project.id;
    const changes = req.body;
    Projects.update(projectID, changes)
        .then(project => {
            res.status(200).json(project)
        })
        .catch(error => {
            console.log(error)
            res.status(500).json.apply({error: "error updating project"})
        })
});

router.delete('/:id', validateProjectId, (req, res) => {
    const projectID = req.project.id;
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
    const { id } = req.params;
    Projects.get(id).then( project => {
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
    next();
};


module.exports = router; 



