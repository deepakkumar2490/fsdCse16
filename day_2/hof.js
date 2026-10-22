let arr = [1,2,3,4,5,6,7,8,9,10];

const multipleOfTwo = arr.map((data)=>data*2);
console.log(multipleOfTwo);

const divisibleByThree = arr.filter((num)=>num%3==0);
console.log(divisibleByThree);

const firstdivisibleByThree = arr.find((num)=>num%3==0);
console.log(firstdivisibleByThree);

const sumOfArr = arr.reduce((data,acc)=> acc += data,0);
console.log(sumOfArr);
