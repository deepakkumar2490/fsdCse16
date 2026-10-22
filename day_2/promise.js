const myPromise = new Promise((resolve, reject) => {
    let age = 15;
    if (age >= 18) {
        resolve("Eligible for vote");
    } else {
        reject("Not eligible for vote.");
    }
})
const checkEligiblity = async() => {
    try {
        const msg = await myPromise;
        console.log(msg);
    } catch (error) {
        console.log(error);
    }
}
checkEligiblity();




// myPromise
//     .then((msg) =>console.log(msg))
//     .catch((error) =>console.log(error));









// console.log(myPromise);
