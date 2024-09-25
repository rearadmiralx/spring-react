import React from 'react';

const SearchComponent = ({ searchTerm, onSearchChange }) => {
    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="form-control"
            />
        </div>
    );
};

export default SearchComponent;
