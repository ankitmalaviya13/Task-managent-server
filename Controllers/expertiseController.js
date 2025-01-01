const asyncHandler = require("express-async-handler");
const Expertise = require("../Models/expertise.js");


const addExpertise = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }

  const expertise = await Expertise.create({
    name,
  });

  if (expertise) {
    res.status(200).json({
      Status: 1,
      Message: "Expertise added Successfully",
      expertise: expertise,
    });
  } else {
    return res.status(200).json({ Status: 0, error: "Something Went Wrong" });
  }
});

const getExpertises = asyncHandler(async (req, res) => {
  const expertise = await Expertise.find();
  if (expertise) {
    res.status(200).json({
      Status: 1,
      Message: "Expertise get Successfully",
      expertise: expertise,
    });
  } else {
    return res.status(200).json({ Status: 0, error: "No Expertises found" });
  }
});

const getALLExpertises = asyncHandler(async (req, res) => {
  const expertise = await Expertise.find();
  const newExpertise =     {
    "name": "All",
  
  };

  if (expertise) {
    console.log(expertise);
    expertise.unshift(newExpertise);
    res.status(200).json({
      Status: 1,
      Message: "Expertise get Successfully",
      expertise: expertise,
    });
  } else {
    return res.status(200).json({ Status: 0, error: "No Expertises found" });
  }
});

const   updateExpertise = asyncHandler(async (req, res) => {
    

  const { id } = req.params.id;
  const { name } = req.body;


  if (!name) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }
  console.log(req.params.id);
  const expertise = await Expertise.findOne({_id:req.params.id});
  console.log(expertise._id);
  console.log(expertise.name);

  if (expertise) {
    expertise.name = name;
    await expertise.save();
    res.status(200).json({
      Status: 1,
      Message: "Expertise Updated Successfully",
      expertise: expertise,
    });
  } else {
    return res.status(200).json({ Status: 0, error: "Expertise Not Found" });
  }
});
const deleteExpertise = asyncHandler(async (req, res) => {

    const { id } = req.params.id;
   

    const expertise = await Expertise.findOne({_id:req.params.id});
  
    if (expertise) {
     await expertise.deleteOne(id);
      res.status(200).json({
        Status: 1,
        Message: "Expertise Deleted Successfully",
      
      });
    } else {
      return res.status(200).json({ Status: 0, error: "Expertise Not Found" });
    }
});
module.exports = {
  getExpertises,
  getALLExpertises,
  addExpertise,
  updateExpertise,
  deleteExpertise,
};
