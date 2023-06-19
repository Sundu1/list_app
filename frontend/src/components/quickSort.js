const quickSort = (arr) => {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[Math.floor(arr.length / 2)].order;
  const less = [];
  const equal = [];
  const greater = [];

  for (let element of arr) {
    if (element.order < pivot) {
      less.push(element);
    } else if (element.order > pivot) {
      greater.push(element);
    } else {
      equal.push(element);
    }
  }

  return [...quickSort(less), ...equal, ...quickSort(greater)];
};

export default quickSort