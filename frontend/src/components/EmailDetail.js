import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EmailDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch email detail by id
    // Placeholder: Replace with actual API call
    // For now, simulate fetch
    async function fetchEmail() {
      try {
        // Example API call: axios.get(`http://localhost:4000/emails/detail/${id}`)
        // For demo, set dummy data
        setEmail({
          subject: 'Sample Email Subject',
          from: { emailAddress: { name: 'Sender Name' } },
          receivedDateTime: new Date().toISOString(),
          body: 'This is the full content of the email.'
        });
      } catch (err) {
        setError('Failed to load email details.');
      }
    }
    fetchEmail();
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!email) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>Back to List</button>
      <h2>{email.subject}</h2>
      <p><strong>From:</strong> {email.from.emailAddress.name}</p>
      <p><strong>Date:</strong> {new Date(email.receivedDateTime).toLocaleString()}</p>
      <div style={{ marginTop: '1rem' }}>
        <p>{email.body}</p>
      </div>
    </div>
  );
}

export default EmailDetail;
