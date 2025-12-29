import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/endpoints';
import { Card, CardHeader, CardTitle, CardContent } from '../design-system/atoms/Card';
import Button from '../design-system/atoms/Button';
import { FileText, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const DynamicBookingPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formSchema, setFormSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch Form Schema
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await api.forms.get(formId);
        if (res.success && res.form) {
          setFormSchema(res.form);
          const initialData = {};
          if (res.form.Schema && res.form.Schema.fields) {
            res.form.Schema.fields.forEach(f => {
               initialData[f.label] = '';
             });
          }
           setFormData(initialData);

        } else {
          setError('Form not found');
        }
      } catch (err) {
        setError('Failed to load form');
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  const handleChange = (label, value) => {
    setFormData({ ...formData, [label]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const nameKey = Object.keys(formData).find(k => k.toLowerCase().includes('name')) || 'FullName';
      const mobileKey = Object.keys(formData).find(k => k.toLowerCase().includes('mobile') || k.toLowerCase().includes('phone')) || 'Mobile';
      const purposeKey = Object.keys(formData).find(k => k.toLowerCase().includes('purpose')) || 'Purpose';

      const payload = {
        fullName: formData[nameKey] || 'Guest', 
        mobile: formData[mobileKey] || '', 
        purpose: formData[purposeKey] || formSchema.Title,
        extra: formData
      };

      const res = await api.token.create(payload);
      if (res.success) {
        navigate(`/ticket/${res.token.tokenGuid}`, { state: { token: res.token } });
      } else {
        alert('Booking Failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting form');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="max-w-md w-full p-8 text-center text-rose-600">
          <h2 className="text-xl font-bold">{error}</h2>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/book')}>Go Back</Button>
        </Card>
      </div>
    );
  }

  if (!formSchema) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-border/60">
        <CardHeader className="text-center space-y-2 pb-8">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 mb-2">
            <FileText size={24} />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">{formSchema.Title || 'Booking Form'}</CardTitle>
          <p className="text-sm text-muted-foreground">{formSchema.Description || 'Please fill in your details'}</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {formSchema.Schema && formSchema.Schema.fields.map((field) => (
              <div key={field.id} className="space-y-1.5">

                {field.type === 'section' ? (
                  <h3 className="text-lg font-semibold text-foreground pt-4 border-t border-border mt-4">{field.label}</h3>
                ) : (
                  <>
                      <label className="text-sm font-medium text-foreground">
                        {field.label} {field.required && <span className="text-rose-500">*</span>}
                      </label>

                      {(field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'number' || field.type === 'date') && (
                        <input
                          type={field.type}
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          required={field.required}
                          placeholder={field.placeholder}
                          value={formData[field.label] || ''}
                          onChange={(e) => handleChange(field.label, e.target.value)}
                        />
                      )}

                      {field.type === 'textarea' && (
                            <textarea
                          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                          required={field.required}
                          placeholder={field.placeholder}
                          value={formData[field.label] || ''}
                          onChange={(e) => handleChange(field.label, e.target.value)}
                          rows={4}
                            />
                      )}

                      {field.type === 'dropdown' && (
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          required={field.required}
                          value={formData[field.label] || ''}
                          onChange={(e) => handleChange(field.label, e.target.value)}
                        >
                          <option value="">Select an option</option>
                          {field.options && field.options.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                        </select>
                      )}

                      {field.type === 'checkbox' && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`check-${field.id}`}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={!!formData[field.label]}
                            onChange={(e) => handleChange(field.label, e.target.checked)}
                          />
                          <label htmlFor={`check-${field.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {field.placeholder || 'Yes'}
                          </label>
                        </div>
                        )}
                  </>
                )}
              </div>
            ))}

            <Button type="submit" className="w-full mt-6 h-12 text-base" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Booking'}
              {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
    </div>
  );
};

export default DynamicBookingPage;
