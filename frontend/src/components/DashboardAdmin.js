import React, { useEffect, useState } from 'react';

function DashboardAdmin() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    // Fetch list of Outlook accounts added by admin
    // Placeholder: Replace with actual API call
    setAccounts([
      { id: '1', email: 'admin@example.com', display_name: 'Admin Account' }
    ]);
  }, []);

  const handleAddAccount = () => {
    // Redirect to backend Microsoft OAuth login
    window.location.href = 'http://localhost:4000/auth/microsoft';
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>
      <button onClick={handleAddAccount} style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
        Add Outlook Account
      </button>
      <h3>Added Outlook Accounts</h3>
      <ul>
        {accounts.map(acc => (
          <li key={acc.id}>{acc.display_name} ({acc.email})</li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardAdmin;
