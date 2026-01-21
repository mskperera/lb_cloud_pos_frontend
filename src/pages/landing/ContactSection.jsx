import { Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import FeedbackModal from '../../components/FeedbackModal';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear status when user starts typing again
    if (status.success || status.error) {
      setStatus({ loading: false, success: false, error: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus({
        loading: false,
        success: false,
        error: 'Please fill in all fields.',
      });
      return;
    }

    // Simple email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus({
        loading: false,
        success: false,
        error: 'Please enter a valid email address.',
      });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    // Prepare nice HTML email body
    const emailBody = `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img 
            src="https://clpos.legendbyte.com/api/v1/asset/162a648b4d68fcf352759fc7a534addd" 
            alt="Legend POS Logo" 
            style="max-height: 60px; margin-bottom: 16px;"
          />
          <h2 style="color: #0ea5e9; margin: 0; font-size: 24px;">New Contact Message</h2>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 12px 0; font-weight: bold; color: #334155;">From:</p>
          <p style="margin: 0 0 20px 0;">${formData.name} <br/>
            <a href="mailto:${formData.email}" style="color: #0ea5e9;">${formData.email}</a>
          </p>

          <p style="margin: 0 0 12px 0; font-weight: bold; color: #334155;">Message:</p>
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${formData.message.replace(/\n/g, '<br/>')}</p>
        </div>

        <div style="text-align: center; color: #64748b; font-size: 14px; margin-top: 24px;">
          <p>This message was sent from the Legend POS website contact form.</p>
          <p style="margin-top: 8px;">
            Received on ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}
          </p>
        </div>
      </div>
    `;

    const payload = {
      recipientEmail: 'legendbyteworld@gmail.com', // ← your receiving email
      subject: `New Contact Message from ${formData.name}`,
      isHtmlBody: true,
      messageBody: emailBody,
    };

    try {
      const response = await fetch('https://clpos.legendbyte.com/api/notification/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If your API requires authentication:
          // 'Authorization': 'Bearer YOUR_TOKEN_HERE',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      // Success
      setStatus({
        loading: false,
        success: true,
        error: null,
      });

      // Optional: clear form after success
      setFormData({ name: '', email: '', message: '' });

    } catch (err) {
      console.error('Contact form error:', err);
      setStatus({
        loading: false,
        success: false,
        error: 'Failed to send message. Please try again later.',
      });
    }
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">Get in Touch</h2>
          <p className="mt-4 text-xl text-gray-600">
            Have questions? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-10">
            <div className="flex items-start gap-6">
              <div className="bg-sky-100 p-5 rounded-full">
                <Mail className="w-8 h-8 text-sky-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <p className="text-gray-700">legendbyteworld@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="bg-sky-100 p-5 rounded-full">
                <Phone className="w-8 h-8 text-sky-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
                <p className="text-gray-700">+94 77 114 7484</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-50 p-10 rounded-3xl border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-5 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  placeholder="How can we help you today?"
                  required
                />
              </div>

              {/* Status messages */}
              {status.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {status.error}
                </div>
              )}

              {status.success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              <button
                type="submit"
                disabled={status.loading}
                className={`w-full py-5 font-bold text-lg rounded-xl shadow-md transition-colors flex items-center justify-center gap-2
                  ${status.loading 
                    ? 'bg-sky-400 cursor-not-allowed' 
                    : 'bg-sky-600 hover:bg-sky-700 text-white'}`}
              >
                {status.loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="text-center mt-10">
  <p className="text-gray-600 mb-4">
    Want to suggest features or improvements?
  </p>
  {/* <FeedbackModal /> */}
</div>
    </section>
  );
};

export default ContactSection;