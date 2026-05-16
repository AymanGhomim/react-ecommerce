export default function FilterBar({ setSearch, setCategory, setSort }) {
  const CATEGORIES = [
    "Women's Fashion", "Men's Fashion", "Electronics", "Sports & Outdoors",
    "Home & Garden", "Beauty & Personal Care", "Watches",
  ];

  return (
    <div className="filter">
      <input placeholder="🔍  Search products..." onChange={(e) => setSearch(e.target.value)} />
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
