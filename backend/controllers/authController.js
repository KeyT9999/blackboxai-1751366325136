const User = require('../models/User');
const OutlookAccount = require('../models/OutlookAccount');
const axios = require('axios');
const qs = require('qs');
const crypto = require('crypto');

const CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
const CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET;
const REDIRECT_URI = process.env.MICROSOFT_REDIRECT_URI;
const TOKEN_ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY;

function encrypt(text) {
  const cipher = crypto.createCipher('aes-256-cbc', TOKEN_ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(text) {
  const decipher = crypto.createDecipher('aes-256-cbc', TOKEN_ENCRYPTION_KEY);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const valid = await user.validatePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    req.session.userId = user._id;
    req.session.userRole = user.role;
    res.json({ message: 'Login successful', role: user.role });
  } catch (err) {
    next(err);
  }
};

exports.microsoftLogin = (req, res) => {
  const params = {
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    response_mode: 'query',
    scope: 'openid profile offline_access User.Read Mail.Read',
    state: '12345'
  };
  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${qs.stringify(params)}`;
  res.redirect(authUrl);
};

exports.microsoftCallback = async (req, res, next) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).json({ error: 'Authorization code missing' });
    }
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', qs.stringify({
      client_id: CLIENT_ID,
      scope: 'openid profile offline_access User.Read Mail.Read',
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
      client_secret: CLIENT_SECRET
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token, refresh_token, expires_in, id_token } = tokenResponse.data;

    // Get user info
    const userInfoResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const { mail, displayName } = userInfoResponse.data;

    // Save or update Outlook account
    let account = await OutlookAccount.findOne({ email: mail });
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    if (!account) {
      account = new OutlookAccount({
        email: mail,
        display_name: displayName,
        access_token: encrypt(access_token),
        refresh_token: encrypt(refresh_token),
        expires_at: expiresAt
      });
    } else {
      account.access_token = encrypt(access_token);
      account.refresh_token = encrypt(refresh_token);
      account.expires_at = expiresAt;
    }
    await account.save();

    res.json({ message: 'Outlook account added/updated successfully' });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out' });
};
