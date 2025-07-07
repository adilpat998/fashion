import { useEffect, useState } from 'react';
import './AdminClothingManager.css';

const AdminClothingManager = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', sizes: '', price: '', image: null });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', sizes: '', price: '', image: null });

  const fetchClothes = async () => {
    setLoading(true);
    const res = await fetch('/api/clothes');
    const data = await res.json();
    setClothes(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchClothes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value, files } = e.target;
    setEditForm(f => ({ ...f, [name]: files ? files[0] : value }));
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
    const res = await fetch('/api/clothes', {
      method: 'POST',
      headers: { 'x-admin-token': localStorage.getItem('adminToken') },
      body: formData
    });
    if (res.ok) {
      setSuccess('Clothing item added!');
      setForm({ name: '', description: '', sizes: '', price: '', image: null });
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
      image: null
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

  return (
    <div className="admin-manager-root">
      <h1 className="splash-header">Shadmani Fashion</h1>
      <h2>Manage Clothing</h2>
      <button onClick={() => setShowForm(f => !f)} className="add-btn">{showForm ? 'Cancel' : 'Add New Clothing'}</button>
      {showForm && (
        <form className="add-form" onSubmit={handleAddClothing}>
          <input name="name" value={form.name} onChange={handleInputChange} placeholder="Name" required />
          <input name="description" value={form.description} onChange={handleInputChange} placeholder="Description" required />
          <input name="sizes" value={form.sizes} onChange={handleInputChange} placeholder="Sizes (e.g. S,M,L)" required />
          <input name="price" value={form.price} onChange={handleInputChange} placeholder="Price" type="number" step="0.01" required />
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
