import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
  return (
    <input
      type="text"
      placeholder="Buscar..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{
        padding: "10px",
        width: "100%",
        maxWidth: "400px",
        margin: "10px 0",
        borderRadius: "5px",
        border: "1px solid #ccc",
      }}
    />
  );
};

export default SearchBar;
