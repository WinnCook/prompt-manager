import { useEffect, useState } from 'react';
import { usePromptStore, useUIStore } from '@/store';
import type { PromptCreate, PromptUpdate } from '@/types/api';
import './EditModal.css';

export function EditModal() {
  const { isEditModalOpen, editModalPromptId, selectedFolderId, closeEditModal, showToast } = useUIStore();
  const { prompts, createPrompt, updatePrompt } = usePromptStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing prompt data when editing
  useEffect(() => {
    if (isEditModalOpen && editModalPromptId) {
      const prompt = prompts.find(p => p.id === editModalPromptId);
      if (prompt) {
        setFormData({
          title: prompt.title,
          description: prompt.description || '',
          content: prompt.content,
          tags: prompt.tags || [],
        });
      }
    } else if (isEditModalOpen) {
      // Reset form for new prompt
      setFormData({
        title: '',
        description: '',
        content: '',
        tags: [],
      });
    }
  }, [isEditModalOpen, editModalPromptId, prompts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      showToast('Title and content are required', 'error');
      return;
    }

    if (!selectedFolderId && !editModalPromptId) {
      showToast('Please select a folder first', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editModalPromptId) {
        // Update existing prompt
        const updateData: PromptUpdate = {
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          content: formData.content.trim(),
          tags: formData.tags.length > 0 ? formData.tags : undefined,
        };
        const result = await updatePrompt(editModalPromptId, updateData);
        if (result) {
          showToast('Prompt updated successfully', 'success');
          closeEditModal();
        } else {
          showToast('Failed to update prompt', 'error');
        }
      } else {
        // Create new prompt
        const createData: PromptCreate = {
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          content: formData.content.trim(),
          folder_id: selectedFolderId!,
          tags: formData.tags.length > 0 ? formData.tags : undefined,
        };
        const result = await createPrompt(createData);
        if (result) {
          showToast('Prompt created successfully', 'success');
          closeEditModal();
        } else {
          showToast('Failed to create prompt', 'error');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!isEditModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeEditModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editModalPromptId ? 'Edit Prompt' : 'New Prompt'}</h2>
          <button className="modal-close" onClick={closeEditModal}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter prompt title"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              type="text"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description (optional)"
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              value={formData.content}
              onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter your prompt content here..."
              rows={10}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <div className="tag-input-container">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tag and press Enter"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!tagInput.trim() || isSubmitting}
                className="btn-add-tag"
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="tags-list">
                {formData.tags.map(tag => (
                  <span key={tag} className="tag-item">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      disabled={isSubmitting}
                      className="tag-remove"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={closeEditModal}
              disabled={isSubmitting}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-submit"
            >
              {isSubmitting ? 'Saving...' : editModalPromptId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
