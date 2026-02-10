function FilterBar({ setSearch, setCategory }) {
  return (
    <div className="filter">
      <input
        placeholder="Search products..."
        onChange={(e) => setSearch(e.target.value)}
      />
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">All</option>
        <option value="men's clothing">Men</option>
        <option value="women's clothing">Women</option>
        <option value="electronics">Electronics</option>
        <option value="jewelery">Jewelery</option>
      </select>
    </div>
  );
}
export default FilterBar;
