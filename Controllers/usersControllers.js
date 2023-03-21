const { response } = require("express");
const users = require("../models/usersSchema");
const csv = require("fast-csv");
const fs = require("fs");
const moment = require("moment/moment");
const { Collection } = require("mongoose");

//registers user
exports.userpost = async (req, res) => {
  const {
    category,
    product,
    dateofsale,
    rgioncode,
    storecode,
    noofpieces,
    amount,
    tax,
    totalamount,
    status,
  } = req.body;

  if (
    !category ||
    !product ||
    !dateofsale ||
    !rgioncode ||
    !storecode ||
    !noofpieces ||
    !amount ||
    !tax ||
    !totalamount ||
    !status
  ) {
    res.status(401).json("All input is required");
  } else {
    const datecreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");

    const userData = new users({
      category,
      product,
      dateofsale,
      rgioncode,
      storecode,
      noofpieces,
      amount,
      tax,
      totalamount,
      status,
      datecreated,
    });
    await userData.save();
    res.status(200).json(userData);
  }
};

// userget

exports.userget = async (req, res) => {
  const search = req.query.search || "";
  const category = req.query.category || "";
  const status = req.query.status || "";
  const sort = req.query.sort || "";
  const page = req.query.page || 1;
  const ITEM_PER_PAGE = 10;
  const dateofsale = req.query.dateofsale || "";
  // let { startDate, endDate } = req.query.dateofsale;
  const startDate = req.query.startDate || "";
  const endDate = req.query.endDate || "";
  

  const query =
    startDate && endDate
      ? {
          dateofsale: {
            $gte: startDate,
            $lte: endDate,
          },
        }
      : {};
  if (search.length > 0) {
    query["rgioncode"] = { $regex: search, $options: "i" };
  }

  if (category !== "All") {
    query.category = category;
  }

  if (status !== "All") {
    query.status = status;
  }

  

  try {
    const skip = (page - 1) * ITEM_PER_PAGE;
    // console.log("this i wanted to see data ", query);
    const count = await users.countDocuments(query);

    const usersdata = await users
      .find(query)
      .sort({ datecreated: sort == "new" ? -1 : 1 })
      .limit(ITEM_PER_PAGE)
      .skip(skip);
    

    const pageCount = Math.ceil(count / ITEM_PER_PAGE);

    res.status(200).json({
      Pagination: {
        count,
        pageCount,
      },
      usersdata,
    });
  } catch (error) {
    res.status(401).json(error);
  }
};
//single user

exports.singleuserget = async (req, res) => {
  const { id } = req.params;
  try {
    const userdata = await users.findOne({ _id: id });
    res.status(200).json(userdata);
  } catch (error) {
    res.status(401).json(error);
  }
};

//user edit

exports.useredit = async (req, res) => {
  const { id } = req.params;
  const {
    category,
    product,
    dateofsale,
    rgioncode,
    storecode,
    noofpieces,
    amount,
    tax,
    totalamount,
    status,
  } = req.body;

  try {
    const updateuser = await users.findByIdAndUpdate(
      { _id: id },
      {
        category,
        product,
        dateofsale,
        rgioncode,
        storecode,
        noofpieces,
        amount,
        tax,
        totalamount,
        status,
      },
      {
        new: true,
      }
    );

    await updateuser.save();
    res.status(200).json(updateuser);
  } catch (error) {
    res.status(401).json(error);
  }
};

// delete user

exports.userdelete = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteuser = await users.findByIdAndDelete({ _id: id });
    res.status(200).json(deleteuser);
  } catch (error) {
    res.status(401).json(error);
  }
};

//change status

exports.userstatus = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  try {
    const userstatusupdate = await users.findByIdAndUpdate(
      { _id: id },
      { status: data },
      { new: true }
    );
    res.status(200).json(userstatusupdate);
  } catch (error) {
    res.status(401).json(error);
  }
};

//export user

exports.userExport = async (req, res) => {
  try {
    const usersdata = await users.find();

    const csvStream = csv.format({ headers: true });

    if (!fs.existsSync("public/files/export/")) {
      if (!fs.existsSync("public/files")) {
        fs.mkdirSync("public/files/");
      }
      if (!fs.existsSync("public/files/export")) {
        fs.mkdirSync("./public/files/export/");
      }
    }

    const writablestream = fs.createWriteStream(
      "public/files/export/users.csv"
    );

    csvStream.pipe(writablestream);

    writablestream.on("finish", function () {
      res.json({
        downloadUrl: `http://localhost:6010/files/export/users.csv`,
      });
    });

    if (usersdata.length > 0) {
      usersdata.map((user) => {
        csvStream.write({
          Category: user.category ? user.category : "-",
          ProductName: user.product ? user.product : "-",
          Dateofsale: user.dateofsale ? user.dateofsale : "-",
          RegionCode: user.rgioncode ? user.rgioncode : "-",
          StoreCode: user.storecode ? user.storecode : "-",
          Noofpieces: user.noofpieces ? user.noofpieces : "-",
          Amount: user.amount ? user.amount : "-",
          Tax: user.tax ? user.tax : "-",
          TotalAmount: user.totalamount ? user.totalamount : "-",
          Status: user.status ? user.status : "-",
          DateCreated: user.datecreated ? user.datecreated : "-",
        });
      });
    }

    csvStream.end();
    writablestream.end();
  } catch (error) {
    res.status(401).json(error);
  }
};

//aggget

exports.usersget = async (req, res) => {
  
   try {
    
    
    const userdata = await users.aggregate([ 
      {
        $project: {
          category: 1,
          product: 1,
           dateofsale: 1,
          rgioncode: 1,
           noofpieces:1,
          amount: 1,
        },
      },
    
      {
        $group: {
          _id: {
            category: "$category",
            product: "$product",
            dateofsale: "$dateofsale",
            rgioncode: "$rgioncode",
            noofpieces: "$noofpieces",
            
          },
          total: {
            $sum: "$amount",
          }
        },}
        
      // },{$limit:30},
      // {$skip:1}
    ]);
      
    res.status(200).json(userdata);
  } catch (error) {
    res.status(401).json(error);
  }
};

