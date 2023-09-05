const { Role } = require("../models/Role");
const { generateSnowflakeId } = require("../utils/generateID");

exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;
    let roleExists = await Role.findOne({ name });

    if (roleExists) {
      return res.status(400).json({
        status: false,
        error: {
          param: "name",
          message: `Role ${name} already exists.`,
          code: "RESOURCE_EXISTS",
        },
      });
    }
    const role = new Role({ name });
    role._id = await generateSnowflakeId();
    await role.save();

    // Use .lean() to return a plain JavaScript object without __v and _id
    const result = await Role.findById(role._id).lean();

    res.status(200).json({
      status: true,
      content: {
        data: result,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to create Role" });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    //no of entries per page
    const perPage = 10;

    //fetching entries and handling the pagination part(using skip for skipping the entries which we in previous pages)
    const roles = await Role.find({}, { _id: 0, __v: 0 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalRoles = await Role.countDocuments();
    const totalPages = Math.ceil(totalRoles / perPage);

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalRoles,
          pages: totalPages,
          page,
        },
        data: roles,
      },
    });
  } catch (error) {
    res.status(500).json({ status: false, error: "Failed to fetch roles" });
  }
};
