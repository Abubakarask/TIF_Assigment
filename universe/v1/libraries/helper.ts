import snowflake, { Snowflake } from "@theinternetfolks/snowflake";

export const listToColumn = <T extends string>(
  columns: readonly string[]
): Record<T, string> => {
  type IColumnList = Record<T, string>;

  return columns.reduce<IColumnList>(
    (prev, current) => ({
      ...prev,
      [current]: current,
    }),
    {} as IColumnList
  );
};

export const generateSnowflakeId = async (): Promise<string> => {
  try {
    const _id = await Snowflake.generate();
    return _id;
  } catch (error) {
    // Handle any errors that occur during Snowflake ID generation
    throw new Error("Failed to generate Snowflake ID");
  }
};

export const generateSlug = async (name: string): Promise<string> => {
  const trimmedName = name.trim();

  // Replace spaces with hyphens and convert to lowercase
  const slug = trimmedName.replace(/\s+/g, "-").toLowerCase();

  return slug;
};
