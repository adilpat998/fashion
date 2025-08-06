import React from 'react';

const ClothingFormModal = ({
  showForm,
  setShowForm,
  form,
  handleInputChange,
  handleAddClothing,
  categories,
  BASIC_COLORS,
  customColor,
  setCustomColor,
  handleAddCustomColor,
  error,
  success
}) => (
  showForm && (
    <div className="modal-overlay" onClick={() => setShowForm(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Clothing</h3>
          <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
        </div>
        <div className="modal-content">
          <form className="modal-form" onSubmit={handleAddClothing}>
            <input name="name" value={form.name} onChange={handleInputChange} placeholder="Name" required />
            <input name="description" value={form.description} onChange={handleInputChange} placeholder="Description" required />
            <input name="sizes" value={form.sizes} onChange={handleInputChange} placeholder="Sizes (e.g. S,M,L)" required />
            <input name="price" value={form.price} onChange={handleInputChange} placeholder="Price" type="number" step="0.01" required />
            <select name="categoryId" value={form.categoryId} onChange={handleInputChange} required>
              <option value="" disabled>Select category</option>
              {[...categories].sort((a, b) => {
                if (a.name.toLowerCase() === 'new') return -1;
                if (b.name.toLowerCase() === 'new') return 1;
                return a.name.localeCompare(b.name);
              }).map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <div className="color-select-row">
              <label>Colors:</label>
              <div className="color-checkboxes">
                {BASIC_COLORS.map(color => (
                  <label key={color}>
                    <input
                      type="checkbox"
                      name="colors"
                      value={color}
                      checked={form.colors.includes(color)}
                      onChange={handleInputChange}
                    /> {color.charAt(0).toUpperCase() + color.slice(1)}
                  </label>
                ))}
              </div>
              <div className="custom-color-form">
                <input
                  type="text"
                  value={customColor}
                  onChange={e => setCustomColor(e.target.value)}
                  placeholder="Add color"
                />
                <button type="button" onClick={handleAddCustomColor}>Add</button>
              </div>
            </div>
            <input name="image" type="file" accept="image/*" onChange={handleInputChange} />
            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Add</button>
            </div>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
          </form>
        </div>
      </div>
    </div>
  )
);

export default ClothingFormModal;
