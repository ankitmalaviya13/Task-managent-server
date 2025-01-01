const asyncHandler = require("express-async-handler");
const Project = require("../Models/project.js");
const { ObjectId } = require("mongoose").Types;

const addProject = asyncHandler(async (req, res) => {
  console.log(req.userId);

  const { name,visibility,members} = req.body;

  if (!name || !visibility) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }
newmembers = members.split(",");
if(newmembers.length===0||!newmembers.includes(req.userId)){
  
  newmembers.push(req.userId);

}

const objectIdMembers =newmembers.map((id) => new ObjectId(id));

  const project = await Project.create({
  name:name,
  AddedBy:req.userId,
  visibility:visibility,
  members:objectIdMembers
  });
  const populatedProject = await Project.findById(project._id).populate('members', 'firstName lastName email').populate('AddedBy','firstName lastName email'); // Add more fields as needed

  if (populatedProject) {
    res.status(200).json({
      Status: 1,
      Message: "Language added Successfully",
      project: populatedProject,
    });
  } else {
    return res.status(200).json({ Status: 0, error: "Something Went Wrong" });
  }
});

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ AddedBy: req.userId ,members: { $in: [req.userId] },},).populate('members', 'firstName lastName email').populate('AddedBy','firstName lastName email');

  if (projects) {
    res.status(200).json({
      Status: 1,
      Message: "Language get Successfully",
      projects: projects,
    });
  } else {
    return res.status(200).json({ Status: 0, error: "No languages found" });
  }
});

const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params.id;
  const { name,visibility,members} = req.body;


  if (!name || !visibility) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }
  const project = await Project.findOne({_id:req.params.id});
  newmembers = members.split(",");
  if(newmembers.length===0||!newmembers.includes(req.userId)){
    
    newmembers.push(req.userId);
  
  }
  
  const objectIdMembers =newmembers.map((id) => new ObjectId(id));
  
  if (project) {
    project.name = name;
    project.visibility = visibility;
    project.members = objectIdMembers;
    
    await project.save();
    const populatedProject = await Project.findById(project._id).populate('members', 'firstName lastName email').populate('AddedBy','firstName lastName email'); // Add more fields as needed

    res.status(200).json({
      Status: 1,
      Message: "Language Updated Successfully",
      project: populatedProject,
    });
  } else {
    return res.status(200).json({ Status: 0, error: "Language Not Found" });
  }
});
const deleteProject = asyncHandler(async (req, res) => {

    const { id } = req.params.id;
   

    const project = await Project.findOne({_id:req.params.id});
  
    if (project) {
     await Project.deleteOne(id);
      res.status(200).json({
        Status: 1,
        Message: "Project Deleted Successfully",
      
      });
    } else {
      return res.status(200).json({ Status: 0, error: "Project Not Found" });
    }
});
module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
};
