import { Package, ComparisonData, ComparisonCategory, ComparisonFeature } from "@/types/packages";

export function buildComparisonData(packages: Package[]=[]): ComparisonData {
console.log("packages",  packages);
  const categoryMap = new Map<number, ComparisonCategory>();

  for (const pkg of packages) {
    for (const category of pkg.packageCategories) {
      if (!categoryMap?.has(category?.id)) {
        categoryMap?.set(category?.id, {
          id: category.id,
          name: category.name,
          features: [],
        });
      }

      const existingCategory = categoryMap?.get(category?.id)!;

     
      for (const unitLabel of category?.units) {
        const feature: ComparisonFeature = {
          id: unitLabel?.label?.id,
          name: unitLabel?.label?.name,
        };

   
        if (!existingCategory?.features?.some(f => f.id === feature?.id)) {
          existingCategory?.features?.push(feature);
        }
      }
    }
  }

  return {
    packages,
    categories: Array.from(categoryMap?.values() || []),
  };
}
