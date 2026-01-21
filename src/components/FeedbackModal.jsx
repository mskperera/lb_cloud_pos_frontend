// src/components/FeedbackModal.jsx
import { useState, useRef } from 'react';

const FeedbackModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedback: '',
  });
  const [files, setFiles] = useState([]); // array of File objects
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const fileInputRef = useRef(null);

  const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf',
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (status.success || status.error) {
      setStatus({ loading: false, success: false, error: null });
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    let totalSize = files.reduce((sum, f) => sum + f.size, 0);

    const validFiles = [];
    const errors = [];

    selectedFiles.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Unsupported file type`);
        return;
      }
      if (totalSize + file.size > MAX_TOTAL_SIZE) {
        errors.push(`${file.name}: File too large (total limit 10MB)`);
        return;
      }
      validFiles.push(file);
      totalSize += file.size;
    });

    if (errors.length > 0) {
      setStatus({
        loading: false,
        success: false,
        error: errors.join('; '),
      });
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.feedback.trim()) {
      setStatus({ ...status, error: 'Please write your feedback.' });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    const formPayload = new FormData();
    formPayload.append('recipientEmail', 'legendbyteworld@gmail.com');
    formPayload.append('subject', `Feedback from ${formData.name || 'Anonymous'}`);

    // Build HTML message body
    const messageHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <img 
            src="https://clpos.legendbyte.com/api/v1/asset/13f8885574c870b0c6982c2331b27aa1" 
            alt="Legend POS" 
            style="max-height: 60px;"
          />
          <h2 style="color: #0ea5e9; margin: 16px 0 8px;">New Customer Feedback</h2>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
          <p><strong>From:</strong> ${formData.name || 'Anonymous'} ${
            formData.email ? `(<a href="mailto:${formData.email}">${formData.email}</a>)` : ''
          }</p>
          <p style="margin-top: 16px;"><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; line-height: 1.6;">${formData.feedback.replace(/\n/g, '<br>')}</p>
        </div>

        ${
          files.length > 0
            ? `
          <div style="margin-top: 24px;">
            <p style="font-weight: bold; margin-bottom: 8px;">Attachments (${files.length}):</p>
            <ul style="list-style: disc; padding-left: 20px; color: #334155;">
              ${files.map(f => `<li>${f.name} (${(f.size / 1024).toFixed(1)} KB)</li>`).join('')}
            </ul>
          </div>`
            : ''
        }

        <p style="text-align: center; color: #64748b; font-size: 13px; margin-top: 24px;">
          Sent on ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' })}
        </p>
      </div>
    `;

    formPayload.append('isHtmlBody', 'true');
    formPayload.append('messageBody', messageHtml);

    // Attach files
    files.forEach((file, index) => {
      formPayload.append(`attachment${index + 1}`, file);
    });

    try {
      const response = await fetch('https://clpos.legendbyte.com/api/notification/email/send', {
        method: 'POST',
        body: formPayload,
        // Note: Do NOT set 'Content-Type': 'multipart/form-data' manually — browser does it with boundary
      });

      if (!response.ok) {
        throw new Error(`Server error ${response.status}`);
      }

      setStatus({ loading: false, success: true, error: null });
      // Reset form
      setFormData({ name: '', email: '', feedback: '' });
      setFiles([]);
      setTimeout(() => setIsOpen(false), 2500); // auto-close after success

    } catch (err) {
      console.error(err);
      setStatus({
        loading: false,
        success: false,
        error: 'Failed to send feedback. Please try again later.',
      });
    }
  };

  return (
    <>
      {/* Trigger Button - place this where you want (navbar, footer, contact section, etc.) */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-6 py-3 bg-sky-600 text-white font-medium rounded-xl hover:bg-sky-700 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
      >
        Give Feedback / Suggestions
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Share Your Ideas & Feedback</h2>
              <p className="mt-1 text-sm text-gray-600">
                Help us improve Legend POS — screenshots and files are welcome!
              </p>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Name (optional)
                </label>
                <input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email (optional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Your feedback / suggestions / bug report *
                </label>
                <textarea
                  id="feedback"
                  rows={5}
                  value={formData.feedback}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none resize-y"
                  placeholder="Ideas for new features, improvements, issues you've noticed..."
                  required
                />
              </div>

              {/* File Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Attachments (screenshots, photos, PDFs – max 10MB total)
                </label>

                <div className="mt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    Choose Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="text-sm text-gray-500">
                    {files.length} file{files.length !== 1 ? 's' : ''} selected
                  </span>
                </div>

                {/* Selected files list */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 text-sm"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <span className="text-gray-600 truncate max-w-[220px]">{file.name}</span>
                          <span className="text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status */}
              {status.error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {status.error}
                </div>
              )}
              {status.success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  Thank you! Your feedback has been sent successfully.
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status.loading}
                  className={`px-8 py-3 font-medium rounded-lg text-white transition-colors flex items-center gap-2
                    ${status.loading ? 'bg-sky-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700'}`}
                >
                  {status.loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                        <path fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" className="opacity-75" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Feedback'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackModal;