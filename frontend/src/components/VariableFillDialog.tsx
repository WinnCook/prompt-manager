import { useState, useEffect } from 'react';
import { parseVariables, replaceVariables, validateVariableValues, loadVariableSets, saveVariableSets, createVariableSet, type Variable, type VariableSet } from '@/utils/variables';
import './VariableFillDialog.css';

interface VariableFillDialogProps {
  isOpen: boolean;
  content: string;
  promptTitle: string;
  onFill: (filledContent: string) => void;
  onCancel: () => void;
}

export function VariableFillDialog({
  isOpen,
  content,
  promptTitle,
  onFill,
  onCancel,
}: VariableFillDialogProps) {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [variableSets, setVariableSets] = useState<VariableSet[]>([]);
  const [selectedSetId, setSelectedSetId] = useState<string>('');
  const [saveAsSetName, setSaveAsSetName] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Parse variables from content
      const parsed = parseVariables(content);
      setVariables(parsed);

      // Initialize values with defaults
      const initialValues: Record<string, string> = {};
      parsed.forEach(variable => {
        initialValues[variable.name] = variable.defaultValue || '';
      });
      setValues(initialValues);
      setErrors([]);
      setShowPreview(false);

      // Load saved variable sets
      setVariableSets(loadVariableSets());
    }
  }, [isOpen, content]);

  const handleValueChange = (name: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
    setErrors([]);
  };

  const handleLoadSet = (setId: string) => {
    const set = variableSets.find(s => s.id === setId);
    if (!set) return;

    setSelectedSetId(setId);

    // Apply set values to matching variables
    const newValues = { ...values };
    Object.entries(set.variables).forEach(([name, value]) => {
      if (variables.some(v => v.name === name)) {
        newValues[name] = value;
      }
    });
    setValues(newValues);
  };

  const handleSaveAsSet = () => {
    if (!saveAsSetName.trim()) {
      alert('Please enter a name for the variable set');
      return;
    }

    const newSet = createVariableSet(
      saveAsSetName.trim(),
      `Variables for: ${promptTitle}`,
      values
    );

    const updatedSets = [...variableSets, newSet];
    setVariableSets(updatedSets);
    saveVariableSets(updatedSets);

    setSaveAsSetName('');
    alert(`Variable set "${newSet.name}" saved!`);
  };

  const handleFill = () => {
    // Validate
    const validationErrors = validateVariableValues(variables, values);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Replace variables
    const filledContent = replaceVariables(content, values);
    onFill(filledContent);
  };

  if (!isOpen) return null;

  const previewContent = replaceVariables(content, values);

  return (
    <div className="variable-fill-overlay" onClick={onCancel}>
      <div className="variable-fill-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="variable-fill-header">
          <h2>Fill in Variables</h2>
          <p className="variable-fill-subtitle">{promptTitle}</p>
          <button className="close-button" onClick={onCancel}>✕</button>
        </div>

        <div className="variable-fill-content">
          {/* Variable Sets */}
          {variableSets.length > 0 && (
            <div className="variable-sets-section">
              <label>Load from saved set:</label>
              <select
                value={selectedSetId}
                onChange={(e) => handleLoadSet(e.target.value)}
              >
                <option value="">-- Select a set --</option>
                {variableSets.map(set => (
                  <option key={set.id} value={set.id}>
                    {set.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Variable Inputs */}
          <div className="variable-inputs">
            {variables.map((variable) => (
              <div key={variable.name} className="variable-input-group">
                <label>
                  {variable.name}
                  {variable.defaultValue && (
                    <span className="default-indicator">
                      (default: {variable.defaultValue})
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={values[variable.name] || ''}
                  onChange={(e) => handleValueChange(variable.name, e.target.value)}
                  placeholder={variable.defaultValue || `Enter ${variable.name}`}
                />
              </div>
            ))}
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="variable-errors">
              {errors.map((error, index) => (
                <div key={index} className="error-message">⚠️ {error}</div>
              ))}
            </div>
          )}

          {/* Preview Toggle */}
          <div className="preview-toggle">
            <label>
              <input
                type="checkbox"
                checked={showPreview}
                onChange={(e) => setShowPreview(e.target.checked)}
              />
              Show preview
            </label>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="variable-preview">
              <h3>Preview:</h3>
              <pre>{previewContent}</pre>
            </div>
          )}

          {/* Save as Set */}
          <div className="save-set-section">
            <label>Save these values as a reusable set:</label>
            <div className="save-set-input">
              <input
                type="text"
                placeholder="Set name (e.g., 'Product Launch - Tech')"
                value={saveAsSetName}
                onChange={(e) => setSaveAsSetName(e.target.value)}
              />
              <button className="btn-secondary" onClick={handleSaveAsSet}>
                Save Set
              </button>
            </div>
          </div>
        </div>

        <div className="variable-fill-footer">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleFill}>
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
}
