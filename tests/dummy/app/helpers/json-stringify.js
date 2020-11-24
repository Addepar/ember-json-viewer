import { helper } from "@ember/component/helper";

export default helper(function jsonStringify([json] /*, hash*/) {
  return JSON.stringify(json, null, " ");
});
