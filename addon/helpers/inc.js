import { helper } from '@ember/component/helper';
import { assert } from '@ember/debug';

export default helper(function inc([num] /*, hash*/) {
  assert(
    `Expected Number.isFinite to be true for ${num}`,
    Number.isFinite(num),
  );
  return num + 1;
});
