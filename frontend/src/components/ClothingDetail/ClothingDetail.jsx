
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ClothingDetail.css';
import ClothingDetailNav from './ClothingDetailNav';
import ReactDOM from 'react-dom';

const ClothingDetail = () => {
  // Make ReactDOM available for portal rendering
  if (typeof window !== 'undefined') window.ReactDOM = ReactDOM;
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/clothes/${id}`)
      .then(res => res.json())
      .then(data => {
        setItem(data);
        if (data && data.categoryId) {
          fetch(`/api/clothes?categoryId=${data.categoryId}`)
            .then(res => res.json())
            .then(items => {
              setCategoryItems(items.filter(i => i.id !== data.id));
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      });
  }, [id]);

  if (loading) return <div style={{padding:'3em',textAlign:'center'}}>Loading...</div>;
  if (!item) return <div style={{padding:'3em',textAlign:'center'}}>Item not found.</div>;

  return (
    <div className="clothing-detail-root">
      <ClothingDetailNav />
      <div style={{ height: '350px', width: '100%' }} className="nav-spacer"></div>
      <div className="clothing-detail-mainbox">
        <h2 className="section-label">Item Details</h2>
        <div className="clothing-detail-images">
          {(item.images && item.images.length > 0 ? item.images : [{ imageUrl: item.imageUrl }]).map((img, idx) => (
            <img key={idx} src={img.imageUrl} alt={item.name} className="clothing-detail-img" />
          ))}
        </div>
        <div className="clothing-detail-info">
          <div className="item-label"><b>Name:</b></div>
          <div className="item-value item-name">{item.name}</div>
          <div className="item-label"><b>Description:</b></div>
          <div className="item-value item-desc">{item.description}</div>
          <div className="item-label"><b>Price:</b></div>
          <div className="item-value item-price">${Number(item.price).toFixed(2)}</div>
          <div className="item-label"><b>Sizes:</b></div>
          <div className="item-value item-sizes">{Array.isArray(item.sizes) ? item.sizes.join(', ') : (typeof item.sizes === 'string' ? item.sizes.split(',').map(s => s.trim()).join(', ') : '')}</div>
          {item.colors && <>
            <div className="item-label"><b>Colors:</b></div>
            <div className="item-value item-colors">{Array.isArray(item.colors) ? item.colors.join(', ') : (typeof item.colors === 'string' ? item.colors.split(',').map(c => c.trim()).join(', ') : '')}</div>
          </>}
        </div>
        <div className="clothing-detail-actions">
          <button className="buy-btn" onClick={async () => {
            try {
              const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  imageUrl: (item.images && item.images[0]?.imageUrl) || item.imageUrl
                })
              });
              const data = await res.json();
              if (data.url) {
                window.location.href = data.url;
              } else {
                alert(data.error || 'Could not start checkout.');
              }
            } catch (err) {
              alert('Could not start checkout.');
            }
          }}>Buy</button>
          <button className="share-btn" onClick={() => {
            const shareUrl = window.location.href;
            const shareData = {
              title: item.name,
              text: `Check out this item on Shadmani Fashion: ${item.name}`,
              url: shareUrl
            };
            if (navigator.share) {
              navigator.share(shareData).catch(() => {});
            } else if (navigator.clipboard) {
              navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Link copied to clipboard!');
              }, () => {
                alert('Could not copy link.');
              });
            } else {
              window.prompt('Copy this link:', shareUrl);
            }
          }}>Share</button>
        </div>
        <div className="clothing-detail-related-list-label">
          <h2 className="section-label">
            {(() => {
              const cat = item.category?.name || item.categoryName || item.category || '';
              if (!cat) return 'Other in this Category';
              if (cat.toLowerCase() === 'new') return 'Other New Products';
              return `Other ${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
            })()}
          </h2>
        </div>
        <div className="clothing-detail-related-list">
          {categoryItems.length === 0 ? (
            <div style={{color:'#888'}}>No other items in this category.</div>
          ) : (
            categoryItems.map(ci => (
              <div key={ci.id} className="clothing-card" onClick={() => navigate(`/clothes/${ci.id}`)} style={{cursor:'pointer'}}>
                <img src={ci.imageUrl || (ci.images && ci.images[0]?.imageUrl) || 'https://via.placeholder.com/220x260?text=No+Image'} alt={ci.name} className="clothing-image" />
                <div className="clothing-info">
                  <div className="clothing-name">{ci.name}</div>
                  <div className="clothing-price">${Number(ci.price).toFixed(2)}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClothingDetail;
