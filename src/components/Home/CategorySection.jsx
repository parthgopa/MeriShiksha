import React from "react";
import FunctionalityCard from "./FunctionalityCard";

const CategorySection = ({ title, pages, category, subcategory = null }) => {
  // Filter pages based on category and subcategory if provided
  const filteredPages = subcategory
    ? pages.filter(
        (page) =>
          page.category === category &&
          (subcategory === true ||
            page.subcategory === subcategory ||
            (Array.isArray(subcategory) &&
              subcategory.some((sub) => page.subcategory.includes(sub))))
      )
    : pages.filter((page) => page.category === category);

  return (
    <div className="mb-10">
      <h4 className="text-2xl font-semibold mb-6 text-white">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPages.map((page, index) => (
          <FunctionalityCard
            key={`${category}-${subcategory}-${index}`}
            page={page}
            index={index}
            pageIndex={pages.indexOf(page)}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
