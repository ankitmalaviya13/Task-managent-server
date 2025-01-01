const express = require('express');
const router = express.Router();
const {getProjects,addProject,updateProject,deleteProject} = require('../Controllers/projectController');
const { protect } = require('../Middlewares/auth');


// //get Project profile
router.get('/',protect,getProjects);

//add Project profile
router.post('/',protect,addProject);
// router.route('/').post(addProject);

// //update Project profile
router.put('/:id',protect, updateProject);

// //Delete Project profile
router.delete('/:id',protect,deleteProject);  


module.exports = router;