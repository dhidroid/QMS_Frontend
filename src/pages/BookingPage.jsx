import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/endpoints';
import { Card, CardHeader, CardTitle, CardContent } from '../design-system/atoms/Card';
import Button from '../design-system/atoms/Button';
import { Smartphone, User, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import Footer from '../components/Footer';

const BookingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);
  const [checkingDefault, setCheckingDefault] = useState(true);
  const [error, setError] = useState('');

  // Check for default form
  React.useEffect(() => {
    const checkDefault = async () => {
      try {
        const res = await api.forms.getDefault();
        if (res.success && res.form && res.form.FormId) {
          navigate(`/book/form/${res.form.FormId}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingDefault(false);
      }
    };
    checkDefault();
  }, []);

  if (checkingDefault) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.token.create(formData);
      if (res.success && res.token) {
        navigate(`/ticket/${res.token.tokenGuid}`, { state: { token: res.token } });
      } else {
        setError('Failed to create ticket. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
      <Card className="w-full max-w-md shadow-xl border-border/60 z-10">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 mb-2">
            <Smartphone size={24} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Book Appointment</CardTitle>
          <p className="text-sm text-muted-foreground">Join the queue from your device</p>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-rose-50 text-rose-600 text-sm border border-rose-100 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                name="fullName"
                required
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Mobile Number</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                name="mobile"
                type="tel"
                placeholder="+1 234 567 890"
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Purpose</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                name="purpose"
                required
                value={formData.purpose}
                onChange={handleChange}
              >
                <option value="">Select Purpose</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Consultation">Consultation</option>
                <option value="Payment">Payment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <Button type="submit" className="w-full mt-6 h-12 text-base" disabled={loading}>
              {loading ? 'Booking...' : 'Get Ticket'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="fixed bottom-0 w-full z-0 p-4">
        <Footer className="bg-transparent border-t-0 opacity-60" />
      </div>
    </div>
  );
};

export default BookingPage;
