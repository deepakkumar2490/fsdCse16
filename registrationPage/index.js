const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const btn = document.getElementById("btn");
const handleClick = () => {
    console.log(name.value);
    console.log(email.value);
    console.log(password.value);

}
btn.addEventListener("click", handleClick)





