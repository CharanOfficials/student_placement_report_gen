import bcrypt from 'bcrypt';
//  encrypt generated password
async function crypt(password) {
  try {
    const saltRounds = 5;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.error("Encryption error", err);
    return null;
  }
}
// generate password
const passGen = function generateRandomPassword(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

export default {
  passGen,
  crypt,
};
