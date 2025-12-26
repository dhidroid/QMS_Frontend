import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/endpoints';
import styles from '../styles/DynamicBookingPage.module.css';

const DynamicBookingPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formSchema, setFormSchema] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch Form Schema
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await api.forms.get(formId);
        if (res.success && res.form) {
          setFormSchema(res.form);
          // Initialize data
          const initialData = {};
           res.form.Schema.fields.forEach(f => {
               // Default values
               initialData[f.label] = ''; 
           });
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
    try {
      // Map standard fields if they exist, else put everything in extra
      // We assume the standard Token schema expects: fullName, mobile, purpose
      // If we don't have them in the form, we might fail validation unless we handle it.
      // Strategy: Check if the form has keys like "Name", "Mobile". If not, send dummy or map.
      
      // Heuristic mapping
      const nameKey = Object.keys(formData).find(k => k.toLowerCase().includes('name')) || 'FullName';
      const mobileKey = Object.keys(formData).find(k => k.toLowerCase().includes('mobile') || k.toLowerCase().includes('phone')) || 'Mobile';
      const purposeKey = Object.keys(formData).find(k => k.toLowerCase().includes('purpose')) || 'Purpose';

      const payload = {
        fullName: formData[nameKey] || 'Guest', 
        mobile: formData[mobileKey] || '', 
        purpose: formData[purposeKey] || formSchema.Title,
        extra: formData // Store exact form data as JSON
      };

      const res = await api.token.create(payload);
      if (res.success) {
        navigate(`/ticket/${res.token.tokenGuid}`);
      } else {
        alert('Booking Failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting form');
    }
  };

  if (loading) return <div className={styles.loading}>Loading Form...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!formSchema) return null;

  return (
    <div className={styles.container}>
       <div className={styles.card}>
          <h1 className={styles.title}>{formSchema.Title || 'Booking Form'}</h1>
          <form onSubmit={handleSubmit}>
            {formSchema.Schema.fields.map((field) => (
              <div key={field.id} className={field.type === 'section' ? styles.sectionGroup : styles.formGroup}>
                
                {field.type === 'section' ? (
                    <h3 className={styles.sectionTitle}>{field.label}</h3>
                ) : (
                    <>
                        <label className={styles.label}>
                        {field.label} {field.required && <span className={styles.req}>*</span>}
                        </label>
                        
                        {(field.type === 'text' || field.type === 'email' || field.type === 'password') && (
                        <input 
                            type={field.type}
                            className={styles.input}
                            required={field.required}
                            placeholder={field.placeholder}
                            value={formData[field.label] || ''}
                            onChange={(e) => handleChange(field.label, e.target.value)}
                        />
                        )}

                        {field.type === 'number' && (
                        <input 
                            type="number"
                            className={styles.input}
                            required={field.required}
                            value={formData[field.label] || ''}
                            onChange={(e) => handleChange(field.label, e.target.value)}
                        />
                        )}

                        {field.type === 'textarea' && (
                            <textarea
                                className={styles.textarea}
                                required={field.required}
                                placeholder={field.placeholder}
                                value={formData[field.label] || ''}
                                onChange={(e) => handleChange(field.label, e.target.value)}
                                rows={4}
                            />
                        )}
                        
                        {field.type === 'dropdown' && (
                        <select 
                            className={styles.select}
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

                        {field.type === 'date' && (
                        <input 
                            type="date"
                            className={styles.input}
                            required={field.required}
                            value={formData[field.label] || ''}
                            onChange={(e) => handleChange(field.label, e.target.value)}
                        />
                        )}

                        {field.type === 'checkbox' && (
                            <div className={styles.checkMock}>
                                <input 
                                    type="checkbox"
                                    checked={!!formData[field.label]}
                                    onChange={(e) => handleChange(field.label, e.target.checked)}
                                />
                                <span style={{marginLeft: 8}}>{field.label}</span>
                            </div>
                        )}
                    </>
                )}
              </div>
            ))}
            
            <button type="submit" className={styles.submitBtn}>Submit Booking</button>
          </form>
       </div>
    </div>
  );
};

export default DynamicBookingPage;
