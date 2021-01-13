function isArray(v) {
  return Array.isArray(v);
}

function isPrimitive(v) {
  return ["number", "boolean", "string"].includes(typeof v);
}

function isObject(v) {
  return !isArray(v) && typeof v === "object";
}

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
const PAD = "->";
const FROM_MARKER = "<FROM|";
const TO_MARKER = "|TO>";

function padding(depth, pad = PAD) {
  return new Array(depth).fill(pad).join("");
}

const OBJECT_DELIMS = ["{", "}"];
const ARRAY_DELIMS = ["[", "]"];

export default function jsonStringify(json, locs) {
  let str = _jsonStringify(json, locs);
  let fromIndex = str.indexOf(FROM_MARKER) + FROM_MARKER.length;
  let toIndex = str.indexOf(TO_MARKER);
  console.log(str, fromIndex, toIndex);
  return str.slice(fromIndex, toIndex);
}

function _jsonStringify(
  json,
  locs = {
    from: { path: null, index: 0 },
    to: { path: null, index: 0 },
  },
  path = ROOT,
  depth = 0
) {
  if (isPrimitive(json)) {
    return formatPrimitive(json, locs, path + "@");
  }

  let delims = isObject(json)
    ? [...OBJECT_DELIMS]
    : isArray(json)
    ? [...ARRAY_DELIMS]
    : null;

  if (locs.from.path === path + "<") {
    delims[0] =
      delims[0].slice(0, locs.from.index) +
      FROM_MARKER +
      delims[0].slice(locs.from.index);
  } else if (locs.from.path === path + ">") {
    delims[1] =
      delims[1].slice(0, locs.from.index) +
      FROM_MARKER +
      delims[1].slice(locs.from.index);
  }

  if (locs.to.path === path + "<") {
    delims[0] =
      delims[0].slice(0, locs.to.index) +
      TO_MARKER +
      delims[0].slice(locs.to.index);
  } else if (locs.to.path === path + ">") {
    delims[1] =
      delims[1].slice(0, locs.to.index) +
      TO_MARKER +
      delims[1].slice(locs.to.index);
  }

  return (
    delims[0] +
    "\n" +
    stringifyEntries(json, locs, path, depth + 1) +
    "\n" +
    padding(depth) +
    delims[1]
  );
}

function formatPrimitive(v, locs, path) {
  console.log(`path ${path}, format primitive`, v);
  let formatted = "";
  if (typeof v === "string") {
    formatted = `"${v}"`;
  } else {
    formatted = `${v}`;
  }
  if (locs.from.path === path) {
    formatted =
      formatted.slice(0, locs.from.index) +
      FROM_MARKER +
      formatted.slice(locs.from.index);
  }
  if (locs.to.path === path) {
    formatted =
      formatted.slice(0, locs.to.index) +
      TO_MARKER +
      formatted.slice(locs.to.index);
  }
  return formatted;
}

function stringifyEntries(objOrArr, locs, path, depth) {
  console.log(`path ${path}, stringify entries for `, objOrArr);
  return isObject(objOrArr)
    ? stringifyObjectEntries(objOrArr, locs, path, depth)
    : stringifyArrayEntries(objOrArr, locs, path, depth);
}

function stringifyObjectEntries(object, locs, path, depth) {
  let str = "";
  let keys = Object.keys(object);
  let lastKey = keys[keys.length - 1];

  for (let key of keys) {
    let isLast = key === lastKey;
    let v = object[key];
    let keyPath = path + "." + key;
    key = `"${key}": `;
    if (locs.from.path === keyPath) {
      key =
        key.slice(0, locs.from.index) +
        FROM_MARKER +
        key.slice(locs.from.index);
    }
    if (locs.to.path === keyPath) {
      key = key.slice(0, locs.to.index) + TO_MARKER + key.slice(locs.to.index);
    }
    str += `${padding(depth)}${key}${_jsonStringify(v, locs, keyPath, depth)}`;

    if (!isLast) {
      let entryDelimiter = ",";
      let entryDelimiterPath = keyPath + "@" + ",";
      console.log("EDP", entryDelimiterPath);
      if (locs.from.path === entryDelimiterPath) {
        entryDelimiter =
          entryDelimiter.slice(0, locs.from.index) +
          FROM_MARKER +
          entryDelimiter.slice(locs.from.index);
      }
      if (locs.to.path === entryDelimiterPath) {
        entryDelimiter =
          entryDelimiter.slice(0, locs.to.index) +
          TO_MARKER +
          entryDelimiter.slice(locs.to.index);
      }

      str += entryDelimiter + "\n";
    }
  }
  return str;
}

function stringifyArrayEntries(arr, locs, path, depth) {
  let str = "";
  let lastIndex = `${arr.length - 1}`;
  for (let [index, v] of Object.entries(arr)) {
    let isLast = index === lastIndex;
    let keyPath = path + "[" + index + "]";
    if (locs.from.path === keyPath) {
      v = v + "<FROM|";
    }
    if (locs.to.path === keyPath) {
      v = v + "|TO>";
    }
    str += `${padding(depth)}${_jsonStringify(v, locs, keyPath, depth)}`;
    if (!isLast) {
      let entryDelimiter = ",";
      let entryDelimiterPath = keyPath + "@" + ",";
      console.log("EDP", entryDelimiterPath);
      if (locs.from.path === entryDelimiterPath) {
        entryDelimiter =
          entryDelimiter.slice(0, locs.from.index) +
          FROM_MARKER +
          entryDelimiter.slice(locs.from.index);
      }
      if (locs.to.path === entryDelimiterPath) {
        entryDelimiter =
          entryDelimiter.slice(0, locs.to.index) +
          TO_MARKER +
          entryDelimiter.slice(locs.to.index);
      }

      str += entryDelimiter + "\n";
    }
  }
  return str;
}
