import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './styles/AdminClothingManagerRoot.css';
import './styles/AdminNav.css';
import './styles/CategoryManager.css';
import './styles/ClothingAdminCard.css';
import './styles/Modal.css';
import './styles/ColorSelect.css';
import './styles/Loading.css';
import './styles/Form.css';
import AdminClothingManagerNav from './AdminClothingManagerNav';
import CategoryManager from './CategoryManager';
import ClothingList from './ClothingList';
import ClothingFormModal from './ClothingFormModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const BASIC_COLORS = [
  'red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple', 'orange', 'brown', 'gray', 'beige', 'navy', 'maroon', 'teal'
];

const AdminClothingManager = () => {
  const navigate = useNavigate();
  const [clothes, setClothes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', sizes: '', price: '', image: null, categoryId: '', colors: [] });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', sizes: '', price: '', image: null, categoryId: '', colors: [] });
  const [categoryError, setCategoryError] = useState('');
  const [categorySuccess, setCategorySuccess] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [customColor, setCustomColor] = useState("");
  
  // New modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const fetchClothes = async () => {
    setLoading(true);
    const res = await fetch('/api/clothes');
    const data = await res.json();
    setClothes(data);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchClothes();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files, checked } = e.target;
    if (name === 'colors') {
      setForm(f => {
        if (checked) return { ...f, colors: [...(f.colors || []), value] };
        return { ...f, colors: (f.colors || []).filter(c => c !== value) };
      });
    } else {
      setForm(f => ({ ...f, [name]: files ? files[0] : value }));
    }
  };
  
  const handleEditInputChange = (e) => {
    const { name, value, files, checked } = e.target;
    if (name === 'colors') {
      setEditForm(f => {
        if (checked) return { ...f, colors: [...(f.colors || []), value] };
        return { ...f, colors: (f.colors || []).filter(c => c !== value) };
      });
    } else {
      setEditForm(f => ({ ...f, [name]: files ? files[0] : value }));
    }
  };

  const handleAddClothing = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('sizes', form.sizes);
    formData.append('price', form.price);
    if (form.image) formData.append('image', form.image);
    if (form.categoryId) formData.append('categoryId', form.categoryId);
    if (form.colors) formData.append('colors', form.colors.join(','));
    const res = await fetch('/api/clothes', {
      method: 'POST',
      headers: { 'x-admin-token': localStorage.getItem('adminToken') },
      body: formData
    });
    if (res.ok) {
      setSuccess('Clothing item added!');
      setForm({ name: '', description: '', sizes: '', price: '', image: null, categoryId: '', colors: [] });
      setShowForm(false);
      fetchClothes();
    } else {
      const err = await res.json();
      setError(err.error || 'Failed to add clothing');
    }
  };

  // Updated handleDelete function
  const handleDelete = (item) => {
    setDeleteItem(item);
    setShowDeleteModal(true);
  };

  // New function for confirming delete
  const confirmDelete = async () => {
    if (!deleteItem) return;
    const res = await fetch(`/api/clothes/${deleteItem.id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': localStorage.getItem('adminToken') }
    });
    if (res.ok) {
      fetchClothes();
      setShowDeleteModal(false);
      setDeleteItem(null);
    }
  };

  // Updated handleEdit function
  const handleEdit = (item) => {
    setEditId(item.id);
    setEditForm({
      name: item.name,
      description: item.description,
      sizes: item.sizes,
      price: item.price,
      image: null,
      categoryId: item.categoryId || '',
      colors: item.colors ? (Array.isArray(item.colors) ? item.colors : item.colors.split(',')) : []
    });
    setShowEditModal(true);
  };

  // Updated handleEditSubmit function
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const formData = new FormData();
    formData.append('name', editForm.name);
    formData.append('description', editForm.description);
    formData.append('sizes', editForm.sizes);
    formData.append('price', editForm.price);
    if (editForm.image) formData.append('image', editForm.image);
    if (editForm.categoryId) formData.append('categoryId', editForm.categoryId);
    if (editForm.colors) formData.append('colors', editForm.colors.join(','));
    const res = await fetch(`/api/clothes/${editId}`, {
      method: 'PUT',
      headers: { 'x-admin-token': localStorage.getItem('adminToken') },
      body: formData
    });
    if (res.ok) {
      setSuccess('Clothing item updated!');
      setEditId(null);
      setShowEditModal(false);
      fetchClothes();
    } else {
      const err = await res.json();
      setError(err.error || 'Failed to update clothing');
    }
  };

  // Category management handlers
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCategoryError(''); setCategorySuccess('');
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': localStorage.getItem('adminToken')
      },
      body: JSON.stringify({ name: newCategory })
    });
    if (res.ok) {
      setCategorySuccess('Category added!');
      setNewCategory('');
      fetchCategories();
    } else {
      const err = await res.json();
      setCategoryError(err.error || 'Failed to add category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category? All clothing in this category will be unassigned.')) return;
    const res = await fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': localStorage.getItem('adminToken') }
    });
    if (res.ok) {
      fetchCategories();
      fetchClothes();
    }
  };

  const handleAddCustomColor = (e) => {
    e.preventDefault();
    const color = customColor.trim().toLowerCase();
    if (color && !form.colors.includes(color)) {
      setForm(f => ({ ...f, colors: [...(f.colors || []), color] }));
      setCustomColor("");
    }
  };
  
  const handleEditAddCustomColor = (e) => {
    e.preventDefault();
    const color = customColor.trim().toLowerCase();
    if (color && !editForm.colors.includes(color)) {
      setEditForm(f => ({ ...f, colors: [...(f.colors || []), color] }));
      setCustomColor("");
    }
  };

  return (
    <div className="admin-manager-root">
      {/* Navigation Bar */}
      <AdminClothingManagerNav navigate={navigate} />

      <h1 className="splash-header">Shadmani Fashion</h1>
      <h2>Manage Clothing</h2>
      
      {/* Category Management Section */}
      <CategoryManager
        categories={categories}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        handleAddCategory={handleAddCategory}
        handleDeleteCategory={handleDeleteCategory}
        categoryError={categoryError}
        categorySuccess={categorySuccess}
      />

      {/* Clothing Management Section */}
      <button onClick={() => setShowForm(f => !f)} className="add-btn">{showForm ? 'Cancel' : 'Add New Clothing'}</button>
      <ClothingFormModal
        showForm={showForm}
        setShowForm={setShowForm}
        form={form}
        handleInputChange={handleInputChange}
        handleAddClothing={handleAddClothing}
        categories={categories}
        BASIC_COLORS={BASIC_COLORS}
        customColor={customColor}
        setCustomColor={setCustomColor}
        handleAddCustomColor={handleAddCustomColor}
        error={error}
        success={success}
      />
      {loading ? <p>Loading...</p> : (
        <ClothingList
          clothes={clothes}
          categories={categories}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      )}
      <DeleteConfirmationModal
        showDeleteModal={showDeleteModal}
        deleteItem={deleteItem}
        setShowDeleteModal={setShowDeleteModal}
        confirmDelete={confirmDelete}
      />

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Clothing Item</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <form className="modal-form" onSubmit={handleEditSubmit}>
                <input 
                  name="name" 
                  value={editForm.name} 
                  onChange={handleEditInputChange} 
                  placeholder="Name" 
                  required 
                />
                <input 
                  name="description" 
                  value={editForm.description} 
                  onChange={handleEditInputChange} 
                  placeholder="Description" 
                  required 
                />
                <input 
                  name="sizes" 
                  value={editForm.sizes} 
                  onChange={handleEditInputChange} 
                  placeholder="Sizes (e.g. S,M,L)" 
                  required 
                />
                <input 
                  name="price" 
                  value={editForm.price} 
                  onChange={handleEditInputChange} 
                  placeholder="Price" 
                  type="number" 
                  step="0.01" 
                  required 
                />
                <select name="categoryId" value={editForm.categoryId} onChange={handleEditInputChange} required>
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
                          checked={editForm.colors.includes(color)}
                          onChange={handleEditInputChange}
                        />
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </label>
                    ))}
                  </div>
                  <div className="custom-color-form">
                    <input
                      type="text"
                      value={customColor}
                      onChange={e => setCustomColor(e.target.value)}
                      placeholder="Add custom color"
                    />
                    <button type="button" onClick={handleEditAddCustomColor}>Add</button>
                  </div>
                </div>
                <input name="image" type="file" accept="image/*" onChange={handleEditInputChange} />
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteItem && (
        <div className="modal-overlay delete-modal" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="warning-icon">⚠️</div>
              <p>
                Are you sure you want to delete <span className="item-name">&quot;{deleteItem.name}&quot;</span>?
              </p>
              <p>This action cannot be undone.</p>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-danger" 
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
  

export default AdminClothingManager;