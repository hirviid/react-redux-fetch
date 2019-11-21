export default function equals(comparisonOld, comparisonNew) {
  if (comparisonOld === undefined || comparisonNew === undefined) {
    return false;
  }

  return comparisonNew === comparisonOld;
}
