/**
 * Curated commercial-grade photography used as premium placeholder imagery
 * across the site. Every entry maps to a real, licensed Unsplash asset.
 */
function unsplash(id: string, w = 1600) {
  return `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;
}

export const img = {
  heroStudio: unsplash("1441986300917-64674bd600d8", 2400),
  fashionEditorial1: unsplash("1523381210434-271e8be1f52b", 2000),
  fashionEditorial2: unsplash("1441984904996-e0b6ba687e04", 2000),
  fashionEditorial3: unsplash("1445205170230-053b83016050", 2000),
  fashionEditorial4: unsplash("1441123285228-1448e608f3d5", 2000),
  cosmeticsLipstick: unsplash("1596462502278-27bfdc403348", 2000),
  productWatch: unsplash("1523275335684-37898b6baf30", 2000),
  skincareProduct: unsplash("1571781926291-c477ebfd024b", 2000),
  productFlatlay: unsplash("1522337360788-8b13dee7a37e", 2000),
  perfumeBottle: unsplash("1587017539504-67cfbddac569", 2000),
  cosmeticsFlatlay: unsplash("1571875257727-256c39da42af", 2000),
  jewelryNecklace: unsplash("1515562141207-7a88fb7ce338", 2000),
  shoesProduct: unsplash("1560769629-975ec94e6a86", 2000),
  fashionModel: unsplash("1490481651871-ab68de25d43d", 2000),
  packagingBoxes: unsplash("1556228720-195a672e8a03", 2000),
  restaurantPlating: unsplash("1467003909585-2f8a72700288", 2000),
  foodPhotography1: unsplash("1414235077428-338989a2e8c0", 2000),
  restaurantFood2: unsplash("1504674900247-0877df9cc836", 2000),
  coffeeProduct: unsplash("1447933601403-0c6688de566e", 2000),
  cosmetics2: unsplash("1620916566398-39f1143ab7be", 2000),
  makeupProduct: unsplash("1522335789203-aabd1fc54bc9", 2000),
  jewelryRings: unsplash("1611085583191-a3b181a88401", 2000),
  perfumeFlowers: unsplash("1483985988355-763728e1935b", 2000),
  officeTeam: unsplash("1519389950473-47ba0277781c", 2000),
  teamMeeting: unsplash("1497215728101-856f4ea42174", 2000),
  officeInterior: unsplash("1600880292203-757bb62b4baf", 2000),
  architectureAbstract1: unsplash("1522071820081-009f0129c71c", 2000),
  architectureAbstract2: unsplash("1487958449943-2429e8be8625", 2000),
  productDesign2: unsplash("1592878904946-b3cd8ae243d0", 2000),
  printTexture: unsplash("1567446537708-ac4aa75c9c28", 2000),
  designStudio: unsplash("1608248543803-ba4f8c70ae0b", 2000),
  foodPhotography3: unsplash("1495474472287-4d71bcdd2085", 2000),
  restaurantInterior: unsplash("1550966871-3ed3cdb5ed0c", 2000),
  industrialFactory: unsplash("1587293852726-70cdb56c2866", 2000),
  industrialLine: unsplash("1581092160562-40aa08e78837", 2000),
  packagingProduct2: unsplash("1594736797933-d0501ba2fe65", 2000),
  productStillLife: unsplash("1595950653106-6c9ebd614d3a", 2000),
} as const;

export type ImageKey = keyof typeof img;
