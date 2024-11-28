import React, { useState } from 'react';

const categories = [
    'Extrusado', 'Ao leite', 'Cremosinho', 'Especiais', 
    'Palhetas', 'Extrusado sem cobertura', 'Torpedinhos', 
    'Infantil', 'Pote', 'Pote Pequenos', 'Cone', 
    'Palheta', 'Açai', 'Açai Pequeno'
];

const Filtros = ({ priceRange, setPriceRange, selectedCategories, setSelectedCategories }) => {
    const [visibleCategories, setVisibleCategories] = useState(4);

    const handleCategoryChange = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const handleShowMore = () => {
        setVisibleCategories((prev) => Math.min(prev + 10, categories.length));
    };

    const handleShowLess = () => {
        setVisibleCategories((prev) => Math.max(prev - 10, 4));
    };

    return (
        <div className="filtros">
            <h3>Filtros</h3>
            <div className="price-range">
                <label htmlFor="price-range">Preço máximo: R$ {priceRange.toFixed(2)}</label>
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
                        background: `linear-gradient(to right, #772321 0%, #772321 ${(priceRange / 51) * 100}%, #f2f2f2 ${(priceRange / 51) * 100}%, #f2f2f2 100%)`,
                        outline: "none",
                    }}
                />
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
                        <button 
                            onClick={handleShowMore}
                            className="ver-mais-btn"
                        >
                            Ver mais categorias
                        </button>
                    )}
                    {visibleCategories > 4 && (
                        <button 
                            onClick={handleShowLess}
                            className="ver-menos-btn"
                        >
                            Ver menos categorias
                        </button>
                    )}
                </div>
            </div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap');
                .filtros {
                    padding: 10px;
                }
                .price-range {
                    margin-bottom: 15px;
                }
                .category-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }
                .category-option {
                    display: flex;
                    align-items: center;
                }
                .category-option input {
                    margin-right: 8px;
                }
                .category-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }
                .ver-mais-btn, .ver-menos-btn {
                    padding: 5px 10px;
                    background-color: #772321;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-family: 'Poppins', sans-serif;
                    font-weight: 500;
                }
                .ver-mais-btn:hover, .ver-menos-btn:hover {
                    opacity: 0.9;
                }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #772321;
                    cursor: pointer;
                }
                input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #772321;
                    cursor: pointer;
                    border: none;
                }
            `}</style>
        </div>
    );
};

export default Filtros;
