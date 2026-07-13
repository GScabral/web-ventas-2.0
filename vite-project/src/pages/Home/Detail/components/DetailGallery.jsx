import React, { useState, useEffect, useCallback } from "react";
import "../styles/gallery.css";

const ProductGallery = ({ images, imgIndex, setImgIndex }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goPrev = useCallback(() => {
    setImgIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  }, [images, setImgIndex]);

  const goNext = useCallback(() => {
    setImgIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  }, [images, setImgIndex]);

  // Cerrar con Escape y navegar con las flechas mientras el
  // lightbox está abierto.
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, closeLightbox, goPrev, goNext]);

  if (!images?.length) return null;

  return (
    <div className="gallery">

      <div
        className="main-image"
        onClick={() => setLightboxOpen(true)}
        role="button"
        tabIndex={0}
        aria-label="Ver imagen en pantalla completa"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setLightboxOpen(true);
          }
        }}
      >
        <img src={images[imgIndex]} alt="producto" />
      </div>

      <div className="thumbs">
        {images.map((img, i) => (
          <button
            key={i}
            className={`thumb ${i === imgIndex ? "active" : ""}`}
            onClick={() => setImgIndex(i)}
          >
            <img src={img} alt="thumb" loading="lazy" />
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div
          className="gallery-lightbox-overlay"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="gallery-lightbox-close"
            onClick={closeLightbox}
            aria-label="Cerrar"
          >
            ×
          </button>

          <img
            src={images[imgIndex]}
            alt="producto en pantalla completa"
            className="gallery-lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                className="gallery-lightbox-arrow gallery-lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Imagen anterior"
              >
                ‹
              </button>

              <button
                type="button"
                className="gallery-lightbox-arrow gallery-lightbox-next"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Imagen siguiente"
              >
                ›
              </button>
            </>
          )}
        </div>
      )}

    </div>
  );
};

export default ProductGallery;