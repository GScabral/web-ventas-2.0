import React, { useState, useEffect } from "react";
import './carrusel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const Carousel = () => {
  const imagenes = [
    "/eliminardepues1.jpg",
    "/eliminardepues2.jpeg",
    "/eliminardepues3.jpeg",
    "/eliminardepues4.jpeg",
    "/oferta.png"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % imagenes.length
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [imagenes.length]);

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const goToNextImage = () => {
    goToImage((currentImageIndex + 1) % imagenes.length);
  };

  const goToPreviousImage = () => {
    goToImage((currentImageIndex - 1 + imagenes.length) % imagenes.length);
  };

  return (
    <div className="carousel" role="region" aria-label="Carrusel de imágenes">
      <button
        className="buton-carousel-left"
        onClick={goToPreviousImage}
        aria-label="Imagen anterior"
      >
        <FontAwesomeIcon icon={faChevronLeft} />
      </button>

      <div className="image-container-carrusel">
        <img
          src={imagenes[currentImageIndex]}
          alt={`Imagen ${currentImageIndex + 1}`}
          loading="lazy"
        />
      </div>

      <button
        className="buton-carousel-right"
        onClick={goToNextImage}
        aria-label="Imagen siguiente"
      >
        <FontAwesomeIcon icon={faChevronRight} />
      </button>

      <div className="dots-container">
        {imagenes.map((_, index) => (
          <span
            key={index}
            className={index === currentImageIndex ? "dot active" : "dot"}
            onClick={() => goToImage(index)}
            role="button"
            aria-label={`Ver imagen ${index + 1}`}
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goToImage(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
