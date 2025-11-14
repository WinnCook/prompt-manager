import { useState } from 'react';
import './EnhanceCompareModal.css';

interface EnhanceCompareModalProps {
  isOpen: boolean;
  original: string;
  enhanced: string;
  isLoading: boolean;
  customInstruction?: string;
  onSelectOriginal: () => void;
  onSelectEnhanced: () => void;
  onCancel: () => void;
  onCustomInstructionChange?: (instruction: string) => void;
  onRegenerate?: () => void;
}

export function EnhanceCompareModal({
  isOpen,
  original,
  enhanced,
  isLoading,
  customInstruction,
  onSelectOriginal,
  onSelectEnhanced,
  onCancel,
  onCustomInstructionChange,
  onRegenerate,
}: EnhanceCompareModalProps) {
  const [hoveredSide, setHoveredSide] = useState<'original' | 'enhanced' | null>(null);
  const [showConfirm, setShowConfirm] = useState<'original' | 'enhanced' | null>(null);

  if (!isOpen) return null;

  const handleSelect = (side: 'original' | 'enhanced') => {
    setShowConfirm(side);
  };

  const confirmSelection = () => {
    if (showConfirm === 'original') {
      onSelectOriginal();
    } else if (showConfirm === 'enhanced') {
      onSelectEnhanced();
    }
    setShowConfirm(null);
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="enhance-modal" onClick={(e) => e.stopPropagation()}>
        <div className="enhance-modal-header">
          <h2>AI Prompt Enhancement</h2>
          <button className="modal-close" onClick={onCancel}>✕</button>
        </div>

        {isLoading ? (
          <div className="enhance-loading">
            <div className="spinner"></div>
            <p>Enhancing your prompt with Claude...</p>
          </div>
        ) : (
          <>
            <div className="custom-instruction-section">
              <label htmlFor="custom-instruction">Custom Enhancement Instruction (optional):</label>
              <textarea
                id="custom-instruction"
                value={customInstruction || ''}
                onChange={(e) => onCustomInstructionChange?.(e.target.value)}
                placeholder="e.g., 'Make this more professional and suitable for a software developer'"
                rows={2}
              />
              {onRegenerate && (
                <button className="btn-regenerate" onClick={onRegenerate}>
                  🔄 Regenerate with Custom Instruction
                </button>
              )}
            </div>

            <div className="compare-container">
              <div
                className={`prompt-version ${hoveredSide === 'original' ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredSide('original')}
                onMouseLeave={() => setHoveredSide(null)}
                onClick={() => handleSelect('original')}
              >
                <h3>Original Prompt</h3>
                <div className="prompt-content-box">
                  <pre>{original}</pre>
                </div>
                <button className="btn-select-version">Select Original</button>
              </div>

              <div
                className={`prompt-version ${hoveredSide === 'enhanced' ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredSide('enhanced')}
                onMouseLeave={() => setHoveredSide(null)}
                onClick={() => handleSelect('enhanced')}
              >
                <h3>✨ AI Enhanced Prompt</h3>
                <div className="prompt-content-box">
                  <pre>{enhanced}</pre>
                </div>
                <button className="btn-select-version">Select Enhanced</button>
              </div>
            </div>
          </>
        )}

        {showConfirm && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <h3>Confirm Selection</h3>
              <p>
                Are you sure you want to select the{' '}
                <strong>{showConfirm === 'original' ? 'Original' : 'AI Enhanced'}</strong> prompt?
              </p>
              <div className="confirm-actions">
                <button className="btn-confirm-yes" onClick={confirmSelection}>
                  Yes, Select This
                </button>
                <button className="btn-confirm-no" onClick={() => setShowConfirm(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
