import { listToColumn } from "../../universe/v1/libraries/helper";

const roleColumnList = ["_id", "name", "created_at", "updated_at"] as const;

export const roleColumn =
  listToColumn<(typeof roleColumnList)[number]>(roleColumnList);

export default roleColumnList;
