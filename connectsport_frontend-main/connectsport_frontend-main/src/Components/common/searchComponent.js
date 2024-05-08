import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Styles/HomePage/searchComponent.css';
import { Button, InputGroup, FormControl, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const SearchComponent = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const selectFilter = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearch = () => {
    console.log(`Navigating to search results with query: ${searchQuery} and filter: ${activeFilter}`);
    navigate(`/search-results?query=${encodeURIComponent(searchQuery)}&filter=${activeFilter}`);
  };

  return (
    <div className="search-container my-3">
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search..."
          aria-label="Search"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <Button variant="outline-secondary" onClick={handleSearch}>
          Search
        </Button>
      </InputGroup>

      <ButtonGroup>
        {['All', 'Posts', 'People', 'Pages'].map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? 'primary' : 'secondary'}
            onClick={() => selectFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default SearchComponent;
