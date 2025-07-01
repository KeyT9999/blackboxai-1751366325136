import React from 'react';

function EmailList({ emails }) {
  if (!emails || emails.length === 0) {
    return <p>No emails to display.</p>;
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      {emails.map(email => (
        <div key={email.id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '0.5rem', borderRadius: '4px' }}>
          <h4>{email.subject || '(No Subject)'}</h4>
          <p><strong>From:</strong> {email.from?.emailAddress?.name || 'Unknown'}</p>
          <p><strong>Date:</strong> {new Date(email.receivedDateTime).toLocaleString()}</p>
          <p>{email.bodyPreview}</p>
        </div>
      ))}
    </div>
  );
}

export default EmailList;
