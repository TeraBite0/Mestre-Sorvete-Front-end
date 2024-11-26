import React, { useState } from 'react';

const categories = ['Chocolate', 'Frutas', 'Creme', 'Especial'];

const Filtros = () => {
    const [priceRange, setPriceRange] = useState(15);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
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
                    max="30"
                    step="0.50"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseFloat(e.target.value))}
                    className="custom-range"
                    style={{
                        WebkitAppearance: 'none',
                        width: '100%',
                        height: '8px',
                        borderRadius: '4px',
                        background: `linear-gradient(to right, #772321 0%, #772321 ${(priceRange/30)*100}%, #f2f2f2 ${(priceRange/30)*100}%, #f2f2f2 100%)`,
                        outline: 'none',
                    }}
                />
            </div>
            
            <div className="categories">
                <h4>Categorias</h4>
                {categories.map(category => (
                    <div key={category} className="category-option">
                        <input
                            type="radio"
                            id={category}
                            name="category"
                            checked={selectedCategory === category}
                            onChange={() => handleCategoryChange(category)}
                        />
                        <label htmlFor={category}>{category}</label>
                    </div>
                ))}
            </div>
            
            <style>{`
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