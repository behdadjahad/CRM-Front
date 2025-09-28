import { Package, PackageComparisonData, UnitComparison, UnitIdentity, UnitVariant, Label, PackageCategory } from "@/types/packages";

export function buildComparisonData(packages: Package[] = [], labels: Label[] = []): PackageComparisonData {
  console.log("packages", packages);
  console.log("labels", labels);

  // Create a map to group units by their identity (label + name combination)
  const unitMap = new Map<string, UnitComparison>();
  // Create a map to track categories and their units
  const categoryMap = new Map<number, { category: PackageCategory; unitKeys: string[] }>();

  // Process each package
  for (const pkg of packages) {
    for (const category of pkg.packageCategories || []) {
      // Track category if not already tracked
      if (!categoryMap.has(category.id)) {
        categoryMap.set(category.id, {
          category: category,
          unitKeys: []
        });
      }

      for (const unit of category.units || []) {
        // Create unit identity based on label or unit name
        const labelId = unit.packageUnitLabelId;
        const label = labels.find(l => l.id === labelId);

        // Create identity key: use label name if exists, otherwise use unit name
        // For units with the same label, they should be grouped together
        const identityKey = label ? label.name : `unit_${unit.id}`;

        // Add unit key to category
        const categoryData = categoryMap.get(category.id)!;
        if (!categoryData.unitKeys.includes(identityKey)) {
          categoryData.unitKeys.push(identityKey);
        }

        // Create unit identity
        const unitIdentity: UnitIdentity = {
          label: label || null,
          name: label ? label.name : unit.name,
          description: unit.description
        };

        // Create unit variant for this package
        const unitVariant: UnitVariant = {
          unitId: unit.id,
          packageId: pkg.id,
          packageTitle: pkg.title,
          unitType: unit.unitType,
          unitModel: unit.unitModel,
          enabledDurationInDays: unit.enabledDurationInDays,
          showDurationInDays: unit.showDurationInDays,
          countUnit: unit.countUnit,
          price: unit.price,
          currency: unit.currency
        };

        // Get or create unit comparison
        if (!unitMap.has(identityKey)) {
          unitMap.set(identityKey, {
            identity: unitIdentity,
            variants: []
          });
        }

        // Add variant to the unit comparison
        const unitComparison = unitMap.get(identityKey)!;
        unitComparison.variants.push(unitVariant);
      }
    }
  }

  // Convert map to array
  const unitComparisons = Array.from(unitMap.values());
  const categories = Array.from(categoryMap.values()).map(data => data.category);

  return {
    packages,
    labels,
    unitComparisons,
    categories
  };
}