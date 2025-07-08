import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminClothingManager.css';

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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this clothing item?')) return;
    const res = await fetch(`/api/clothes/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-token': localStorage.getItem('adminToken') }
    });
    if (res.ok) fetchClothes();
  };

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
  };

  const handleEditSubmit = async (e, id) => {
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
    const res = await fetch(`/api/clothes/${id}`, {
      method: 'PUT',
      headers: { 'x-admin-token': localStorage.getItem('adminToken') },
      body: formData
    });
    if (res.ok) {
      setSuccess('Clothing item updated!');
      setEditId(null);
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1.2em', marginBottom: '1.5em' }}>
        <button className="admin-nav-btn" onClick={() => navigate('/')}>Home</button>
        <button className="admin-nav-btn" onClick={() => {
          localStorage.removeItem('adminToken');
          navigate('/');
          window.location.reload();
        }}>Logout</button>
      </div>
      <h1 className="splash-header">Shadmani Fashion</h1>
      <h2>Manage Clothing</h2>
      {/* Category Management Section */}
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
      {/* Clothing Management Section */}
      <button onClick={() => setShowForm(f => !f)} className="add-btn">{showForm ? 'Cancel' : 'Add New Clothing'}</button>
      {showForm && (
        <form className="add-form" onSubmit={handleAddClothing}>
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
            <label style={{fontWeight:'bold'}}>Colors:</label>
            {BASIC_COLORS.map(color => (
              <label key={color} style={{ marginRight: '0.7em' }}>
                <input
                  type="checkbox"
                  name="colors"
                  value={color}
                  checked={form.colors.includes(color)}
                  onChange={handleInputChange}
                /> {color.charAt(0).toUpperCase() + color.slice(1)}
              </label>
            ))}
            <form onSubmit={handleAddCustomColor} style={{ display: 'inline-block', marginLeft: '1em' }}>
              <input
                type="text"
                value={customColor}
                onChange={e => setCustomColor(e.target.value)}
                placeholder="Add color"
                style={{ width: '90px', fontSize: '1em', borderRadius: '6px', border: '1px solid #ccc', marginRight: '0.3em' }}
              />
              <button type="submit" style={{ fontSize: '1em', borderRadius: '6px', border: '1px solid #bfa14a', background: '#fffbe6', color: '#bfa14a', padding: '0.2em 0.7em', cursor: 'pointer' }}>Add</button>
            </form>
          </div>
          <input name="image" type="file" accept="image/*" onChange={handleInputChange} />
          <button type="submit">Add</button>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </form>
      )}
      {loading ? <p>Loading...</p> : (
        <div className="clothes-list">
          {clothes.map(item => (
            <div className="clothing-admin-card" key={item.id}>
              <img src={item.imageUrl || (item.images && item.images[0]?.imageUrl) || 'https://via.placeholder.com/220x260?text=No+Image'} alt={item.name} />
              {editId === item.id ? (
                <form className="edit-form" onSubmit={e => handleEditSubmit(e, item.id)}>
                  <input name="name" value={editForm.name} onChange={handleEditInputChange} placeholder="Name" required />
                  <input name="description" value={editForm.description} onChange={handleEditInputChange} placeholder="Description" required />
                  <input name="sizes" value={editForm.sizes} onChange={handleEditInputChange} placeholder="Sizes (e.g. S,M,L)" required />
                  <input name="price" value={editForm.price} onChange={handleEditInputChange} placeholder="Price" type="number" step="0.01" required />
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
                    <label style={{fontWeight:'bold'}}>Colors:</label>
                    {BASIC_COLORS.map(color => (
                      <label key={color} style={{ marginRight: '0.7em' }}>
                        <input
                          type="checkbox"
                          name="colors"
                          value={color}
                          checked={editForm.colors.includes(color)}
                          onChange={handleEditInputChange}
                        /> {color.charAt(0).toUpperCase() + color.slice(1)}
                      </label>
                    ))}
                    <form onSubmit={handleEditAddCustomColor} style={{ display: 'inline-block', marginLeft: '1em' }}>
                      <input
                        type="text"
                        value={customColor}
                        onChange={e => setCustomColor(e.target.value)}
                        placeholder="Add color"
                        style={{ width: '90px', fontSize: '1em', borderRadius: '6px', border: '1px solid #ccc', marginRight: '0.3em' }}
                      />
                      <button type="submit" style={{ fontSize: '1em', borderRadius: '6px', border: '1px solid #bfa14a', background: '#fffbe6', color: '#bfa14a', padding: '0.2em 0.7em', cursor: 'pointer' }}>Add</button>
                    </form>
                  </div>
                  <input name="image" type="file" accept="image/*" onChange={handleEditInputChange} />
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditId(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <div><b>{item.name}</b></div>
                  <div>{item.description}</div>
                  <div>Sizes: {item.sizes}</div>
                  <div>Price: ${Number(item.price).toFixed(2)}</div>
                  <div>Category: {categories.find(c => c.id === item.categoryId)?.name || 'None'}</div>
                  <div>Colors: {(item.colors ? (Array.isArray(item.colors) ? item.colors : item.colors.split(',')) : []).join(', ')}</div>
                  <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(item.id)}>Delete</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminClothingManager;
