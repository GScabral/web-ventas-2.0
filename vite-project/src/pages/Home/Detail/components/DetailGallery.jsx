import React from "react";
import "../styles/gallery.css";

const ProductGallery = ({ images, imgIndex, setImgIndex }) => {
  if (!images?.length) return null;

  return (
    <div className="gallery">

      <div className="main-image">
        <img src={images[imgIndex]} alt="producto" />
      </div>

      <div className="thumbs">
        {images.map((img, i) => (
          <button
            key={i}
            className={`thumb ${i === imgIndex ? "active" : ""}`}
            onClick={() => setImgIndex(i)}
          >
            <img src={img} alt="thumb" />
          </button>
        ))}
      </div>

    </div>
  );
};

export default ProductGallery;