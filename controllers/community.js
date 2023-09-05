const { Community } = require("../models/Community");
const { Member } = require("../models/Member");
const { Role } = require("../models/Role");
const { generateSnowflakeId, generateSlug } = require("../utils/generateID");

exports.createCommunity = async (req, res) => {
  try {
    // user _id from the authenticated user
    // console.log(req.user);
    const ownerId = req.user._id;

    // get community name from payload
    const { name } = req.body;

    const slug = await generateSlug(name);

    const communityWithSlugExists = await Community.findOne({ slug });
    if (communityWithSlugExists) {
      return res.status(400).json({
        success: false,
        message: "Community with this name/slug already exists",
        code: "ALREADY_EXIST",
      });
    }

    //community ID
    const _id = await generateSnowflakeId();
    const community = new Community({
      _id,
      name,
      slug,
      owner: ownerId,
    });

    //Add owner/logged_in user(first member as Community Admin)
    let roleDetails = await Role.findOne({ name: "Community Admin" });
    let memberId = await generateSnowflakeId();

    await Member.create({
      _id: memberId,
      community: community._id,
      user: ownerId,
      role: roleDetails._id,
    });

    await community.save();
    res.status(200).json({
      status: true,
      content: {
        data: {
          _id: community._id,
          name: community.name,
          slug: community.slug,
          owner: community.owner,
          created_at: community.created_at,
          updated_at: community.updated_at,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Failed to create a community",
    });
  }
};

exports.getAllCommunities = async (req, res) => {
  try {
    // Get the page number from query (default to 1 if not present)
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;

    // Calculate skip and limit for pagination
    const skip = (page - 1) * perPage;
    const limit = perPage;

    //Communities wrt Pagination, also populated owner details
    const allCommunities = await Community.find({}, { __v: 0 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "owner",
        select: "_id name",
      });

    const totalCommunities = await Community.countDocuments();

    const totalPages = Math.ceil(totalCommunities / limit);

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalCommunities,
          pages: totalPages,
          page,
        },
        data: allCommunities,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Failed to retrieve joined communities",
    });
  }
};

exports.getCommunityMembers = async (req, res) => {
  try {
    let communityId = req.params.id;

    const page = parseInt(req.query.page) || 1;
    const perPage = 10;

    // Calculate skip and limit for pagination
    const skip = (page - 1) * perPage;
    const limit = perPage;

    // Query the community to ensure it exists
    const community = await Community.findOne({ _id: communityId });
    if (!community) {
      return res.status(404).json({
        status: false,
        message: "Community not found",
      });
    }

    // Query members with pagination, populate other fields
    const members = await Member.find({ community: communityId })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "role",
        select: "id name",
      })
      .populate({
        path: "user",
        select: "id name",
      });

    const totalMembers = await Member.countDocuments({
      community: communityId,
    });
    const totalPages = Math.ceil(totalMembers / limit);

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalMembers,
          pages: totalPages,
          page,
        },
        data: members,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Failed to retrieve all members of community ${req.params.id}`,
    });
  }
};

exports.getOwnedCommunity = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;

    // Calculate skip and limit for pagination
    const skip = (page - 1) * perPage;
    const limit = perPage;

    // get all the communites with owner_id as loggedIn user's Id
    const communities = await Community.find({ owner: req.user._id })
      .skip(skip)
      .limit(limit);

    const totalCommunities = await Community.countDocuments({
      owner: req.user._id,
    });
    const totalPages = Math.ceil(totalCommunities / limit);

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: totalCommunities,
          pages: totalPages,
          page,
        },
        data: communities,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Failed to retrieve all members of community ${req.params.id}`,
    });
  }
};

exports.getMyJoinedCommunity = async (req, res) => {
  try {
    const userId = req.user.id;

    //get page from query params if not present use default as 1
    const page = parseInt(req.query.page) || 1;
    const perPage = 10;

    // Calculate skip and limit for pagination
    const skip = (page - 1) * perPage;
    const limit = perPage;

    const joinedCommunities = await Member.find({ user: userId })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "community",
        select: "id name slug owner created_at updated_at",
        populate: {
          path: "owner",
          select: "id name",
        },
      })
      .populate("role", "id name");

    const total = await Member.countDocuments({ user: userId });
    const totalPages = Math.ceil(total / perPage);

    const transformedData = joinedCommunities.map((item) => ({
      id: item.community.id,
      name: item.community.name,
      slug: item.community.slug,
      owner: {
        id: item.community.owner.id,
        name: item.community.owner.name,
      },
      created_at: item.community.created_at,
      updated_at: item.community.updated_at,
      role: {
        id: item.role.id,
        name: item.role.name,
      },
    }));

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total,
          pages: totalPages,
          page,
        },
        data: transformedData,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Failed to retrieve joined communities",
    });
  }
};
