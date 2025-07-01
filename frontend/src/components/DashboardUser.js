import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmailList from './EmailList';

function DashboardUser() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    // Fetch list of Outlook accounts available to user
    // Placeholder: Replace with actual API call
    setAccounts([
      { id: '1', email: 'admin@example.com', display_name: 'Admin Account' }
    ]);
  }, []);

  useEffect(() => {
    if (selectedAccountId) {
      axios.get(`http://localhost:4000/emails/${selectedAccountId}`, { withCredentials: true })
        .then(res => {
          setEmails(res.data.emails);
        })
        .catch(err => {
          console.error(err);
          setEmails([]);
        });
    }
  }, [selectedAccountId]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>User Dashboard</h2>
      <label htmlFor="account-select">Select Outlook Account:</label>
      <select
        id="account-select"
        value={selectedAccountId || ''}
        onChange={e => setSelectedAccountId(e.target.value)}
        style={{ marginLeft: '1rem' }}
      >
        <option value="" disabled>Select an account</option>
        {accounts.map(acc => (
          <option key={acc.id} value={acc.id}>{acc.display_name} ({acc.email})</option>
        ))}
      </select>
      <EmailList emails={emails} />
    </div>
  );
}

export default DashboardUser;
