import React, { useState } from 'react';

const Filtros = () => {
    const [priceRange, setPriceRange] = useState(25);
    const [selectedFilters, setSelectedFilters] = useState(['Crocante', 'Fruta']);

    const handleFilterChange = (filter) => {
        setSelectedFilters(prev => 
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        );
    };

    return (
        <div className="filtros">
            <h3>Filtros</h3>
            <div className="price-range">
                <input
                    type="range"
                    min="0"
                    max="50"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                />
                <div className="price-labels">
                    <span>R$0,00</span>
                    <span>R${priceRange.toFixed(2)}</span>
                    <span>R$50,00</span>
                </div>
            </div>
            <div className="filter-options">
                {['Crocante', 'Cremoso', 'Fruta', 'Potes'].map((filter) => (
                    <label key={filter} className="filter-option">
                        <input
                            type="checkbox"
                            checked={selectedFilters.includes(filter)}
                            onChange={() => handleFilterChange(filter)}
                        />
                        {filter}
                    </label>
                ))}
            </div>
            <button className="apply-filters">Aplicar</button>
        </div>
    );
};

export default Filtros;