function FilterBar({ setSearch, setCategory, setSort }) {
  return (
    <div className="filter">
      <input
        placeholder="🔍  Search products..."
        onChange={(e) => setSearch(e.target.value)}
      />

      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="men's clothing">Men's Clothing</option>
        <option value="women's clothing">Women's Clothing</option>
        <option value="electronics">Electronics</option>
        <option value="jewelery">Jewelery</option>
        <option value="home & living">Home & Living</option>
        <option value="sports & outdoors">Sports & Outdoors</option>
        <option value="beauty">Beauty</option>
        <option value="books">Books</option>
      </select>

      <select onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort By</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="rating-desc">Top Rated</option>
      </select>
    </div>
  );
}

export default FilterBar;
