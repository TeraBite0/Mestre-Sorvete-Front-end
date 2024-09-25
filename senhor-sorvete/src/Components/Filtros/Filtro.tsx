import React from 'react';

const categories = ['Chocolate', 'Frutas', 'Creme', 'Especial'];

const Filtros = ({ priceRange, setPriceRange, selectedCategories, setSelectedCategories }) => {
    const handleCategoryChange = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter(c => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
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
                />
            </div>
            <div className="categories">
                <h4>Categorias</h4>
                {categories.map(category => (
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
        </div>
    );
};

export default Filtros;