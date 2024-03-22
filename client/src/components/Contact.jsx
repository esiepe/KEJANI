import React, { useEffect, useState } from 'react';
import emailjs from 'emailjs-com';

export default function Contact({ listing, currentUser }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        'service_sxey8l8',
        'template_6ydvuyy',
        e.target,
        'e2cAQQ-3HH0XP4E2y'
      )
      .then(
        (result) => {
          console.log('Email sent successfully!', result.text);
          setMessage('');
          setLoading(false);
          alert('Email sent successfully');
        },
        (error) => {
          console.error('Failed to send email:', error.text);
          setLoading(false);
          alert('Failed to send email. Please try again later');
        }
      );
  };

  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-2">
          <p className=" mt-6 leading-8">
            Contact <span className="font-semibold">{landlord.username}</span> for{' '}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <form onSubmit={sendEmail}>
            <input type="hidden" name="from_name" value={currentUser.username} />
            <input type="hidden" name="to_name" value={landlord.username} />
            <input type="hidden" name="subject" value={`Regarding ${listing.name}`} />
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={onChange}
              placeholder="Enter your message here..."
              className="w-full border p-3 rounded-lg"
            ></textarea>
            <button
              type="submit"
              className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95 w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}