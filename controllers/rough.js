const { Community } = require("../models/Community");

async function getCommunities() {
  try {
    const allCommunities = await Community.find().populate({
      path: "owner",
      select: "_id name",
      model: "User",
    });

    console.log(allCommunities);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getCommunities,
};
