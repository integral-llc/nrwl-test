function countSetsOfThree(numbers, threshold) {
  numbers.sort((n1, n2) => +n1 - +n2);
  let res = 0;
  for (let i = 0; i < numbers.length - 3; i++) {
    let low = i + 1;
    let high = numbers.length - 1;

    while (low <= high) {
      if (numbers[i] + numbers[low] + numbers[high] > threshold) {
        high--;
      } else {
        for (let x = low + 1; x <= high; x++) {
          console.log(numbers[i], numbers[low], numbers[x])
          res++;
        }

        low++;
      }
    }
  }

  return res;
}

console.log(countSetsOfThree([7, 3, 9, 1, 34, 12, 19], 19))
