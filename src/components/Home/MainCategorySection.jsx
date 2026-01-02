import CategorySection from './CategorySection';

const MainCategorySection = ({ title, pages, category, subcategories = [] }) => {
  return (
    <div className="mb-16">
      <div className="relative mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white inline-block">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent-teal)] to-white">{title}</span>
        </h2>
        <div className="absolute -bottom-4 left-0 w-20 h-1 bg-[var(--accent-teal)]"></div>
        <div className="absolute -bottom-4 left-20 w-full h-px bg-gray-700"></div>
      </div>
      
      {subcategories.length > 0 ? (
        // Render subcategories if provided
        subcategories.map((subcategory, index) => (
          <CategorySection 
            key={`${category}-${subcategory.value}-${index}`}
            title={subcategory.title} 
            pages={pages} 
            category={category} 
            subcategory={subcategory.value} 
          />
        ))
      ) : (
        // Render all pages in this category if no subcategories
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pages
            .filter(page => page.category === category)
            .map((page, index) => (
              <CategorySection 
                key={`${category}-all-${index}`}
                pages={[page]} 
                category={category} 
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default MainCategorySection;
