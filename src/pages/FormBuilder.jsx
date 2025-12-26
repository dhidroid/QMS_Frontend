import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/endpoints';
import styles from '../styles/FormBuilder.module.css';

const FIELD_TYPES = [
  { type: 'text', label: 'Text Input', icon: 'Aa' },
  { type: 'number', label: 'Number', icon: '#' },
  { type: 'email', label: 'Email', icon: '@' },
  { type: 'password', label: 'Password', icon: '🔒' },
  { type: 'textarea', label: 'Text Area', icon: '¶' },
  { type: 'dropdown', label: 'Dropdown', icon: '▼' },
  { type: 'date', label: 'Date', icon: '📅' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑' },
  { type: 'section', label: 'Section Header', icon: 'H' }, // For grouping
];

const FormBuilder = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState('New Form');
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  // Load existing form
  useEffect(() => {
      if(formId) {
          const loadForm = async () => {
              try {
                  const res = await api.forms.get(formId);
                  if(res.success && res.form) {
                      setFormTitle(res.form.Title);
                      setIsDefault(res.form.IsDefault || false);
                      // Ensure schema is parsed
                      const schema = typeof res.form.Schema === 'string' ? JSON.parse(res.form.Schema) : res.form.Schema;
                      setFields(schema.fields || []);
                  }
              } catch(err) {
                  console.error("Failed to load form", err);
                  alert("Could not load form");
              }
          };
          loadForm();
      }
  }, [formId]);

  // Add a new field
  const addField = (type) => {
    const newField = {
      id: Date.now().toString(),
      type,
      label: type === 'section' ? 'Section Title' : `New ${type}`,
      placeholder: '',
      required: false,
      options: type === 'dropdown' ? 'Option 1, Option 2' : '',
    };
    setFields([...fields, newField]);
    setSelectedField(newField);
  };

  // Update field properties
  const updateField = (key, value) => {
    if (!selectedField) return;
    const updated = { ...selectedField, [key]: value };
    setSelectedField(updated);
    setFields(fields.map(f => f.id === updated.id ? updated : f));
  };

  // Delete field
  const deleteField = (id, e) => {
    e.stopPropagation();
    const newFields = fields.filter(f => f.id !== id);
    setFields(newFields);
    if (selectedField?.id === id) setSelectedField(null);
  };

  // Move field (simple up/down for now, or just array reorder)
  const moveField = (index, direction, e) => {
      e.stopPropagation();
      if(direction === 'up' && index > 0) {
          const newFields = [...fields];
          [newFields[index], newFields[index-1]] = [newFields[index-1], newFields[index]];
          setFields(newFields);
      } else if(direction === 'down' && index < fields.length - 1) {
          const newFields = [...fields];
          [newFields[index], newFields[index+1]] = [newFields[index+1], newFields[index]];
          setFields(newFields);
      }
  };

  // Save Form
  const handleSave = async () => {
    if(fields.length === 0) {
        alert("Please add at least one field.");
        return;
    }
    setSaving(true);
    try {
      const schema = {
        title: formTitle,
        fields: fields.map(f => ({
          ...f,
          options: f.type === 'dropdown' && typeof f.options === 'string' ? f.options.split(',').map(o => o.trim()) : f.options
        }))
      };
      
      const payload = {
        title: formTitle,
        schema: JSON.stringify(schema),
        isActive: true,
        formId: formId || undefined, // Pass ID if editing
        isDefault
      };

      await api.forms.save(payload);
      alert('Form Saved Successfully!');
      if(!formId) navigate('/admin/dashboard'); // Redirect after create
    } catch (err) {
      console.error(err);
      alert('Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
            <input 
            value={formTitle} 
            onChange={(e) => setFormTitle(e.target.value)}
            className={styles.titleInput}
            placeholder="Form Title"
            />
            <div style={{display:'flex', alignItems:'center', gap:8, marginLeft: 16}}>
                <input 
                    type="checkbox" 
                    checked={isDefault} 
                    onChange={e => setIsDefault(e.target.checked)} 
                    id="isDef"
                />
                <label htmlFor="isDef" style={{cursor:'pointer', color:'#64748b'}}>Set as Primary</label>
            </div>
        </div>
        <div className={styles.headerRight}>
             <button 
                className={`${styles.modeBtn} ${previewMode ? styles.active : ''}`}
                onClick={() => setPreviewMode(!previewMode)}
             >
                 {previewMode ? 'Edit Mode' : 'Preview Mode'}
             </button>
             <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
                {saving ? 'Saving...' : 'Save Form'}
             </button>
             <button className={styles.closeBtn} onClick={() => window.location.href='/admin'}>Exit</button>
        </div>
      </header>
      
      <div className={styles.builder}>
        {/* Sidebar - Hidden in Preview Mode */}
        {!previewMode && (
             <div className={styles.sidebar}>
             <h3>Toolbox</h3>
             <div className={styles.toolsGrid}>
               {FIELD_TYPES.map(ft => (
                 <button key={ft.type} onClick={() => addField(ft.type)} className={styles.toolBtn}>
                   <span className={styles.icon}>{ft.icon}</span>
                   <span className={styles.toolLabel}>{ft.label}</span>
                 </button>
               ))}
             </div>
           </div>
        )}

        {/* Canvas */}
        <div className={`${styles.canvas} ${previewMode ? styles.previewCanvas : ''}`}>
          {fields.length === 0 ? (
            <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📝</div>
                <h3>Start Building</h3>
                <p>Select fields from the toolbox to create your form</p>
            </div>
          ) : (
            fields.map((field, index) => (
              <div 
                key={field.id} 
                onClick={() => !previewMode && setSelectedField(field)}
                className={`
                    ${styles.fieldItem} 
                    ${selectedField?.id === field.id && !previewMode ? styles.selected : ''}
                    ${field.type === 'section' ? styles.sectionItem : ''}
                `}
              >
                  {/* Field Controls (Edit Mode Only) */}
                {!previewMode && (
                    <div className={styles.fieldControls}>
                        <button onClick={(e) => moveField(index, 'up', e)} disabled={index===0}>↑</button>
                        <button onClick={(e) => moveField(index, 'down', e)} disabled={index===fields.length-1}>↓</button>
                        <button onClick={(e) => deleteField(field.id, e)} className={styles.deleteBtn}>×</button>
                    </div>
                )}

                {/* Field Rendering */}
                {field.type === 'section' ? (
                     <h3 className={styles.sectionTitle}>{field.label}</h3>
                ) : (
                    <>
                        <label className={styles.fieldLabel}>
                             {field.label} {field.required && <span className={styles.req}>*</span>}
                        </label>
                        
                        {field.type === 'textarea' ? (
                            <textarea disabled className={styles.previewInput} placeholder={field.placeholder} rows={3} />
                        ) : field.type === 'dropdown' ? (
                             <select disabled className={styles.previewInput}>
                                <option>Select...</option>
                                {field.options && typeof field.options === 'string' && field.options.split(',').map(o => (
                                    <option key={o}>{o.trim()}</option>
                                ))}
                              </select>
                        ) : field.type === 'checkbox' ? (
                             <div className={styles.previewCheck}>
                                  <input type="checkbox" disabled /> <span>{field.label} placeholder text if any</span>
                              </div>
                        ) : (
                             <input 
                                type={field.type} 
                                disabled 
                                placeholder={field.placeholder} 
                                className={styles.previewInput} 
                             />
                        )}
                    </>
                )}
              </div>
            ))
          )}
           {previewMode && <button className={styles.submitPreviewBtn}>Submit Form</button>}
        </div>

        {/* Properties Panel - Hidden in Preview Mode */}
        {!previewMode && (
            <div className={styles.properties}>
            <h3>Properties</h3>
            {selectedField ? (
                <div className={styles.propForm}>
                <div className={styles.formGroup}>
                    <label>Label</label>
                    <input 
                    value={selectedField.label} 
                    onChange={(e) => updateField('label', e.target.value)} 
                    />
                </div>
                
                {selectedField.type !== 'section' && selectedField.type !== 'checkbox' && (
                    <div className={styles.formGroup}>
                        <label>Placeholder</label>
                        <input 
                        value={selectedField.placeholder} 
                        onChange={(e) => updateField('placeholder', e.target.value)} 
                        />
                    </div>
                )}


                {selectedField.type !== 'section' && (
                    <div className={styles.formCheck}>
                        <input 
                            type="checkbox" 
                            checked={selectedField.required} 
                            onChange={(e) => updateField('required', e.target.checked)} 
                        />
                        <label>Required Field</label>
                    </div>
                )}

                {selectedField.type === 'dropdown' && (
                    <div className={styles.formGroup}>
                    <label>Options (comma separated)</label>
                    <textarea 
                        value={selectedField.options} 
                        onChange={(e) => updateField('options', e.target.value)} 
                        rows={5}
                    />
                    </div>
                )}
                </div>
            ) : (
                <div className={styles.noProp}>
                    <p>Select a field to edit its properties</p>
                </div>
            )}
            </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
