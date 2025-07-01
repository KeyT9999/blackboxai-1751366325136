const mongoose = require('mongoose');

const OutlookAccountSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  display_name: { type: String, required: true },
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  expires_at: { type: Date, required: true }
});

module.exports = mongoose.model('OutlookAccount', OutlookAccountSchema);
