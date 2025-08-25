import React, { useState } from "react";
import "./filtro.css";

const categories = [
  "Extrusado",
  "Ao leite",
  "Cremosinho",
  "Especiais",
  "Palhetas",
  "Extrusado sem cobertura",
  "Torpedinhos",
  "Infantil",
  "Pote",
  "Pote Pequenos",
  "Cone",
  "Palheta",
  "Açai",
  "Açai Pequeno",
];

const types = [
  "Picolé",
  "Pote",
  "Pote Pequenos",
  "Cone",
  "Palheta",
  "Açai",
  "Açai Pequeno",
];

const Filtros = ({
  priceRange,
  setPriceRange,
  selectedCategories,
  setSelectedCategories,
  selectedTypes,
  setSelectedTypes,
}) => {
  const [visibleCategories, setVisibleCategories] = useState(4);
  const [visibleTypes, setVisibleTypes] = useState(4);

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleTypeChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleShowMoreCategories = () => {
    setVisibleCategories((prev) => Math.min(prev + 10, categories.length));
  };

  const handleShowLessCategories = () => {
    setVisibleCategories((prev) => Math.max(prev - 10, 4));
  };

  const handleShowMoreTypes = () => {
    setVisibleTypes((prev) => Math.min(prev + 10, types.length));
  };

  const handleShowLessTypes = () => {
    setVisibleTypes((prev) => Math.max(prev - 10, 4));
  };

  return (
    <div className="filtros">
      <h3>Filtros</h3>
      <div className="price-range">
        <label htmlFor="price-range">
          Preço máximo: R$ {priceRange.toFixed(2)}
        </label>
        <input
          type="range"
          id="price-range"
          min="0"
          max="50"
          step="1"
          value={priceRange}
          onChange={(e) => setPriceRange(parseFloat(e.target.value))}
          className="custom-range"
          style={{
            WebkitAppearance: "none",
            width: "100%",
            height: "8px",
            borderRadius: "4px",
            background: `linear-gradient(to right, #772321 0%, #772321 ${
              (priceRange / 51) * 100
            }%, #f2f2f2 ${(priceRange / 51) * 100}%, #f2f2f2 100%)`,
            outline: "none",
          }}
        />
      </div>

      <div className="types" style={{ marginBottom: "15px" }}>
        <h4>Tipos</h4>
        <div className="type-grid">
          {types.slice(0, visibleTypes).map((type) => (
            <div key={type} className="type-option">
              <input
                type="checkbox"
                id={`type-${type}`}
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
              />
              <label htmlFor={`type-${type}`}>{type}</label>
            </div>
          ))}
        </div>

        <div className="type-buttons">
          {visibleTypes < types.length && (
            <button onClick={handleShowMoreTypes} className="ver-mais-btn">
              Ver mais tipos
            </button>
          )}
          {visibleTypes > 4 && (
            <button onClick={handleShowLessTypes} className="ver-menos-btn">
              Ver menos tipos
            </button>
          )}
        </div>
      </div>

      <div className="categories">
        <h4>Categorias</h4>
        <div className="category-grid">
          {categories.slice(0, visibleCategories).map((category) => (
            <div key={category} className="category-option">
              <input
                type="checkbox"
                id={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
              <label htmlFor={category}>{category}</label>
            </div>
          ))}
        </div>

        <div className="category-buttons">
          {visibleCategories < categories.length && (
            <button onClick={handleShowMoreCategories} className="ver-mais-btn">
              Ver mais categorias
            </button>
          )}
          {visibleCategories > 4 && (
            <button
              onClick={handleShowLessCategories}
              className="ver-menos-btn"
            >
              Ver menos categorias
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filtros;
