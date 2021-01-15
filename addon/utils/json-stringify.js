import {
  isArray,
  isPrimitive,
  isObject,
} from "ember-json-viewer/utils/value-types";

/**
 * Paths:
 * $: the root
 * $.propName: The property key
 * $.propName[idx]: The property at index idx in the array $.propName
 * $.propName@: The value at property key propName
 * $.propName<: The opening brace/bracket for the object/array propName
 * $.propName>: Closing brace/bracket
 * $.propName@,: The entry delimiter (comma) following propName's value
 *
 * Examples:
 * Assume the following JSON, where the numbers indicate positions
 * immediately following them
 * rather than actual values/properties (i.e., ignore the numbers to interpret at JSON):
 *
 * {1
 *   "2foo": "3bar"4,
 *   "arr": 5["abc", 6true, false7, 8]9,
 * }
 *
 * 1: $
 * 2: $.foo
 * 3: $.foo@
 * 4: $.foo@,
 * 5: $.arr<
 * 6: $.arr[1]@
 * 7: $.arr[2]@,
 * 8: $.arr>
 * 9: $.arr@,
 */

const ROOT = "$";
const PAD = "  ";

// Used to mark the place in the stringified JSON that matches
// the target position
export const MARKER = "<MARKER>";

/**
 * Creates a string by concat-ing the `pad` `depth` times
 * @param {number} depth
 * @param {string} [pad=PAD]
 * @returns {string}
 */
function padding(depth, pad = PAD) {
  return new Array(depth).fill(pad).join("");
}

// Start-end delimiters for objects and arrays
const OBJECT_DELIMS = ["{", "}"];
const ARRAY_DELIMS = ["[", "]"];

// Default range is from the very start to very end
const FULL_RANGE = {
  start: { path: ROOT + "<", index: 0 },
  end: { path: ROOT + ">", index: 1 },
};

/**
 * Creates a unique marker string that can be used to
 * mark start/end spot in the output JSON.
 * Makes sure that return value never occurs in the stringified
 * json object.
 *
 * @param {object} json
 * @param {string} [marker=MARKER]
 * @returns {string}
 */
function createUniqueMarker(json, marker = MARKER) {
  let jsonString = JSON.stringify(json);
  let possibleMarker = marker;
  while (jsonString.includes(possibleMarker)) {
    possibleMarker = marker + Math.random();
  }
  return possibleMarker;
}

/**
 * Returns part of the stringified json that is between the start and end positions in the range
 * @param {object} json
 * @param {{start:{path:string,index:number}},{end:{path:string,index:number}}} range An object with `start` and `end` keys that are
 * each a "position"
 * @returns {string}
 */
export default function jsonStringify(json, range = FULL_RANGE) {
  let options = {
    marker: createUniqueMarker(json),
  };

  // Create strings with the given marker for the start and end
  // positions in the range
  let startStr = _jsonStringify(json, range.start, options);
  let endStr = _jsonStringify(json, range.end, options);

  // Determine the indices of the (start/end) markers in the
  // start string
  let startIndex = startStr.indexOf(options.marker) + options.marker.length;
  let endIndex = endStr.indexOf(options.marker) + options.marker.length;

  // Slice to return only the part of the json string between the
  // markers
  return startStr.slice(startIndex, endIndex);
}

function _jsonStringify(json, pos, options, path = ROOT, depth = 0) {
  if (isPrimitive(json)) {
    return formatPrimitive(json, pos, options, path + "@");
  }

  let delims = isObject(json)
    ? [...OBJECT_DELIMS]
    : isArray(json)
    ? [...ARRAY_DELIMS]
    : null;

  if (pos.path === path + "<") {
    delims[0] =
      delims[0].slice(0, pos.index) +
      options.marker +
      delims[0].slice(pos.index);
  } else if (pos.path === path + ">") {
    delims[1] =
      delims[1].slice(0, pos.index) +
      options.marker +
      delims[1].slice(pos.index);
  }

  return (
    delims[0] +
    "\n" +
    stringifyEntries(json, pos, options, path, depth + 1) +
    "\n" +
    padding(depth) +
    delims[1]
  );
}

function formatPrimitive(v, pos, options, path) {
  let formatted = "";
  if (typeof v === "string") {
    formatted = `"${v}"`;
  } else {
    formatted = `${v}`;
  }
  if (pos.path === path) {
    formatted =
      formatted.slice(0, pos.index) +
      options.marker +
      formatted.slice(pos.index);
  }
  return formatted;
}

function stringifyEntries(objOrArr, pos, options, path, depth) {
  return isObject(objOrArr)
    ? stringifyObjectEntries(objOrArr, pos, options, path, depth)
    : stringifyArrayEntries(objOrArr, pos, options, path, depth);
}

function stringifyObjectEntries(object, pos, options, path, depth) {
  let str = "";
  let keys = Object.keys(object);
  let lastKey = keys[keys.length - 1];

  for (let key of keys) {
    let isLast = key === lastKey;
    let v = object[key];
    let keyPath = path + "." + key;
    key = `"${key}": `;
    if (pos.path === keyPath) {
      key = key.slice(0, pos.index) + options.marker + key.slice(pos.index);
    }
    str += `${padding(depth)}${key}${_jsonStringify(
      v,
      pos,
      options,
      keyPath,
      depth
    )}`;

    if (!isLast) {
      let entryDelimiter = ",";
      let entryDelimiterPath = keyPath + "@" + ",";
      if (pos.path === entryDelimiterPath) {
        entryDelimiter =
          entryDelimiter.slice(0, pos.index) +
          MARKER +
          entryDelimiter.slice(pos.index);
      }

      str += entryDelimiter + "\n";
    }
  }
  return str;
}

function stringifyArrayEntries(arr, pos, options, path, depth) {
  let str = "";
  let lastIndex = `${arr.length - 1}`;
  for (let [index, v] of Object.entries(arr)) {
    let isLast = index === lastIndex;
    let keyPath = path + "[" + index + "]";
    if (pos.path === keyPath) {
      v = v + options.marker;
    }
    str += `${padding(depth)}${_jsonStringify(
      v,
      pos,
      options,
      keyPath,
      depth
    )}`;
    if (!isLast) {
      let entryDelimiter = ",";
      let entryDelimiterPath = keyPath + "@" + ",";
      if (pos.path === entryDelimiterPath) {
        entryDelimiter =
          entryDelimiter.slice(0, pos.index) +
          options.marker +
          entryDelimiter.slice(pos.index);
      }
      str += entryDelimiter + "\n";
    }
  }
  return str;
}
