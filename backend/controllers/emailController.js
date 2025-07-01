const OutlookAccount = require('../models/OutlookAccount');
const graphClient = require('../services/graphClient');
const crypto = require('crypto');

const TOKEN_ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY;

function decrypt(text) {
  const decipher = crypto.createDecipher('aes-256-cbc', TOKEN_ENCRYPTION_KEY);
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

exports.fetchEmails = async (req, res, next) => {
  try {
    const accountId = req.params.accountId;
    const account = await OutlookAccount.findById(accountId);
    if (!account) {
      return res.status(404).json({ error: 'Outlook account not found' });
    }

    const accessToken = decrypt(account.access_token);

    // TODO: Check token expiry and refresh if needed

    const emails = await graphClient.getEmails(accessToken);
    res.json({ emails });
  } catch (err) {
    next(err);
  }
};
