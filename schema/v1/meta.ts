import { listToColumn } from "../../universe/v1/libraries/helper";

const collectionList = ["communities", "members", "roles", "users"] as const;

export const collections =
  listToColumn<(typeof collectionList)[number]>(collectionList);

export default collectionList;
