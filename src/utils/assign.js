/* eslint-disable */
// From http://stackoverflow.com/questions/13719593/how-to-set-object-property-of-object-property-of-given-its-string-name-in-ja
export function assign(obj, prop, value) {
  if (typeof prop === "string")
    prop = prop.split(".");

  if (prop.length > 1) {
    var e = prop.shift();
    assign(obj[e] =
        Object.prototype.toString.call(obj[e]) === "[object Object]"
          ? obj[e]
          : {},
      prop,
      value);
  } else
    obj[prop[0]] = value;
}
