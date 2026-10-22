const form = document.getElementById("registrationForm");
const message = document.getElementById("message");

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const age = Number(document.getElementById("age").value);
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (username === "") {
        message.textContent = "Please enter your username.";
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        message.textContent = "Enter a valid 10-digit phone number.";
        return;
    }

    if (age < 18 || age > 60) {
        message.textContent = "Age must be between 18 and 60.";
        return;
    }

    if (email === "") {
        message.textContent = "Please enter your email.";
        return;
    }

    if (password.length < 6) {
        message.textContent =
            "Password must contain at least 6 characters.";
        return;
    }

    message.style.color = "green";
    message.textContent = "Registration successful!";

    form.reset();
});