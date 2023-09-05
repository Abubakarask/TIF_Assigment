const SNOWFLAKE = require("@theinternetfolks/snowflake");

const generateSnowflakeId = async () => {
  try {
    const _id = await SNOWFLAKE.Snowflake.generate();
    return _id;
  } catch (error) {
    // Handle any errors that occur during Snowflake ID generation
    throw new Error("Failed to generate Snowflake ID");
  }
};

const generateSlug = async (name) => {
  const trimmedName = name.trim();

  // Replace spaces with hyphens and convert to lowercase
  const slug = trimmedName.replace(/\s+/g, "-").toLowerCase();

  return slug;
};

module.exports = {
  generateSnowflakeId,
  generateSlug,
};
