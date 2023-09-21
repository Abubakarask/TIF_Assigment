import { listToColumn } from "../../universe/v1/libraries/helper";

const collectionList = ["communites", "members", "roles", "users"] as const;

export const collections =
  listToColumn<(typeof collectionList)[number]>(collectionList);

export default collectionList;
