const asyncHandler = require("express-async-handler");
const Rate = require("../Models/rate.js");

const addRate = asyncHandler(async (req, res) => {
  const { rateText, rate } = req.body;

  if (!rate || !rateText) {
    return res.status(200).json({
      Status: 0,
      Message: "Please fill all the fields",
    });
  }

  const addrate = await Rate.create({
    rateText,
    rate,
    rateBy: req.userId,
  });
  if (addrate) {
    return res.status(200).json({
      Status: 1,
      Message: "rate added successfully",
    });
  } else {
    return res.status(200).json({
      Status: 0,
      Message: "Something went wrong",
    });
  }
});

const getRates = asyncHandler(async (req, res) => {

    const rates =   await  Rate.find();
    console.log("fdsfjhsdkfjsdljfk");
    console.log(rates);
    return res.status(200).json({
        Status: 1,
        Message: "get rate successfully",
        rates:rates,
      });
});

module.exports = {
  addRate,
  getRates,
};
