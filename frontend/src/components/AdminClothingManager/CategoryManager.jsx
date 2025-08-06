import React from 'react';

const CategoryManager = ({
  categories,
  newCategory,
  setNewCategory,
  handleAddCategory,
  handleDeleteCategory,
  categoryError,
  categorySuccess
}) => (
  <div className="category-manager">
    <h3>Manage Categories</h3>
    <form className="add-category-form" onSubmit={handleAddCategory}>
      <input
        type="text"
        placeholder="Add new category"
        value={newCategory}
        onChange={e => setNewCategory(e.target.value)}
        required
      />
      <button type="submit">Add Category</button>
    </form>
    {categoryError && <div className="error">{categoryError}</div>}
    {categorySuccess && <div className="success">{categorySuccess}</div>}
    <div className="category-list">
      {[...categories].sort((a, b) => {
        if (a.name.toLowerCase() === 'new') return -1;
        if (b.name.toLowerCase() === 'new') return 1;
        return a.name.localeCompare(b.name);
      }).map(category => (
        <div className="category-item" key={category.id}>
          <span className="category-name">{category.name}</span>
          <button className="delete-btn" onClick={() => handleDeleteCategory(category.id)}>Delete</button>
        </div>
      ))}
    </div>
  </div>
);

export default CategoryManager;
