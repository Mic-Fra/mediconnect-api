const bcrypt = require("bcrypt");

async function generatePasswordHash(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("Hashed Password:", hashedPassword);
}

generatePasswordHash("1q2w3e4r!@#$Q"); // Replace with your actual password
