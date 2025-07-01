const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], required: true }
});

// Method to set password
UserSchema.methods.setPassword = async function(password) {
  this.password_hash = await bcrypt.hash(password, 10);
};

// Method to validate password
UserSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password_hash);
};

module.exports = mongoose.model('User', UserSchema);
