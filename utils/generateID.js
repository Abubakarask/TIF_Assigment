const SNOWFLAKE = require("@theinternetfolks/snowflake");

const generateSnowflakeId = async () => {
  try {
    const id = await SNOWFLAKE.Snowflake.generate();
    return id
  } catch (error) {
    // Handle any errors that occur during Snowflake ID generation
    throw new Error("Failed to generate Snowflake ID");
  }
};

module.exports = {
  generateSnowflakeId,
};
