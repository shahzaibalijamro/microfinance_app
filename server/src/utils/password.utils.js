function generateRandomPassword() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&";
    const minLength = 8;

    let password = "";
    while (password.length < minLength) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Ensure the password meets the criteria by adding at least one letter, number, and special character if not present
    if (!/[A-Za-z]/.test(password)) {
        password += "a"; // Add a letter
    }
    if (!/\d/.test(password)) {
        password += "1"; // Add a number
    }
    if (!/[@$!%*?&]/.test(password)) {
        password += "!"; // Add a special character
    }

    // Shuffle to mix the added characters into the password
    password = password.split("").sort(() => Math.random() - 0.5).join("");

    return password;
}

export {generateRandomPassword}