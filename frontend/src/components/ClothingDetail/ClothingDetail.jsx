
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ClothingDetail.css';
import ClothingDetailRoot from './jsx/ClothingDetailRoot';
import ClothingDetailMainbox from './jsx/ClothingDetailMainbox';
import ClothingDetailNav from './jsx/ClothingDetailNav';
import ClothingDetailInfo from './jsx/ClothingDetailInfo';
import ClothingDetailImages from './jsx/ClothingDetailImages';
import ClothingDetailActions from './jsx/ClothingDetailActions';
import ClothingDetailRelatedList from './jsx/ClothingDetailRelatedList';


const ClothingDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    // Fetch clothing item
    fetch(`/api/clothes/${id}`)
      .then(res => res.json())
      .then(data => {
        // Fetch all images for this clothing item
        fetch(`/api/clothes/${id}/images`)
          .then(res => res.json())
          .then(imagesData => {
            const allImages = Array.isArray(imagesData)
              ? imagesData.map(img => img.imageUrl)
              : [];
            setItem({ ...data, images: allImages });
            setLoading(false);
            // Fetch related items by category
            if (data.categoryId) {
              fetch(`/api/clothes?categoryId=${data.categoryId}&excludeId=${id}`)
                .then(res => res.json())
                .then(related => setRelatedItems(related));
            }
          });
      });
  }, [id]);

  const handleBuy = async () => {
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
  };

  const handleShare = () => {
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
  };

  if (loading || !item) return <div style={{padding:'2rem', textAlign:'center'}}>Loading...</div>;

  return (
    <ClothingDetailRoot>
      <ClothingDetailNav onHome={() => navigate('/')} />
      <ClothingDetailMainbox>
        <div className="section-label">{item.name}</div>
        <ClothingDetailImages images={item.images || []} />
        <ClothingDetailInfo
          name={item.name}
          description={item.description}
          price={item.price}
          sizes={item.sizes}
          colors={item.colors}
        />
        <ClothingDetailActions onBuy={handleBuy} onShare={handleShare} />
        <span style={{marginLeft:'2rem', fontSize:'1.08rem', color:'#388e3c', fontFamily:'Montserrat, Playfair Display, serif', fontWeight:500}}>
          Any questions or concerns? Reach out to <a href="tel:2012137065" style={{color:'#388e3c', textDecoration:'underline'}}>201-213-7065</a>
        </span>
        <div className="section-label">Related Items</div>
        <ClothingDetailRelatedList related={relatedItems} />
      </ClothingDetailMainbox>
    </ClothingDetailRoot>
  );
};

export default ClothingDetail;
