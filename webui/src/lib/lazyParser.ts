import * as fs from 'fs';
import * as path from 'path';

interface FilamentDatabase {
  brands: Record<string, Brand>;
}

interface Brand {
  name: string;
  logo: string;
  website?: string;
  origin?: string;
  materials: Record<string, Material>;
}

interface Material {
  name: string;
  filaments: Record<string, Filament>;
}

interface Filament {
  name: string;
  colors: Record<string, Color>;
}

interface Color {
  name: string;
  sizes: Size[];
  variant: Variant;
}

interface Size {
  filament_weight: number;
  diameter: number;
  ean: string;
  purchase_links: PurchaseLink[];
}

interface PurchaseLink {
  store_id: string;
  url: string;
  affiliate: boolean;
}

interface Variant {
  [key: string]: any;
}

interface FilamentDatabaseLazy {
  brands: Record<string, BrandLazy>;
}

interface BrandLazy {
  name: string;
  logo: string;
  website?: string;
  origin?: string;
  _path: string; // Store path for lazy loading
  materials?: Record<string, Material>; // Only load when needed
}

export function loadFilamentDatabaseLazy(dataPath: string): FilamentDatabaseLazy {
  console.log('Loading database lazy');

  const brands: Record<string, BrandLazy> = {};
  const brandFolders = fs
    .readdirSync(dataPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory());

  for (const brandFolder of brandFolders) {
    const brandPath = path.join(dataPath, brandFolder.name);
    const brandJsonPath = path.join(brandPath, 'brand.json');

    if (!fs.existsSync(brandJsonPath)) continue;

    const brandData = JSON.parse(fs.readFileSync(brandJsonPath, 'utf-8'));

    // Find logo file
    const files = fs.readdirSync(brandPath);
    const logoFile = files.find((file) => /\.(png|jpg|jpeg)$/i.test(file));
    const logo = logoFile ? `/data/${brandFolder.name}/${logoFile}` : '';

    brands[brandFolder.name] = {
      name: brandData.brand ?? brandFolder.name,
      logo,
      website: brandData.website ?? '',
      origin: brandData.origin ?? '',
      _path: brandPath, // Store path for lazy loading
    };
  }

  return { brands };
}

// Load materials for a specific brand only when needed
export function loadBrandMaterials(brandPath: string): Record<string, Material> {
  const materials: Record<string, Material> = {};
  const materialFolders = fs
    .readdirSync(brandPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory());

  for (const materialFolder of materialFolders) {
    const materialPath = path.join(brandPath, materialFolder.name);
    const materialJsonPath = path.join(materialPath, 'material.json');

    if (!fs.existsSync(materialJsonPath)) continue;

    // Continue with existing material loading logic...
    const filaments: Record<string, Filament> = {};
    const filamentFolders = fs
      .readdirSync(materialPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory());

    for (const filamentFolder of filamentFolders) {
      const filamentPath = path.join(materialPath, filamentFolder.name);
      const filamentJsonPath = path.join(filamentPath, 'filament.json');

      if (!fs.existsSync(filamentJsonPath)) continue;

      const filamentData = JSON.parse(fs.readFileSync(filamentJsonPath, 'utf-8'));
      const colors: Record<string, Color> = {};

      const colorFolders = fs
        .readdirSync(filamentPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory());

      for (const colorFolder of colorFolders) {
        const colorPath = path.join(filamentPath, colorFolder.name);
        const sizesJsonPath = path.join(colorPath, 'sizes.json');
        const variantJsonPath = path.join(colorPath, 'variant.json');

        if (!fs.existsSync(sizesJsonPath) || !fs.existsSync(variantJsonPath)) continue;

        const sizesData: Size[] = JSON.parse(fs.readFileSync(sizesJsonPath, 'utf-8'));
        const variantData: Variant = JSON.parse(fs.readFileSync(variantJsonPath, 'utf-8'));

        colors[colorFolder.name] = {
          name: colorFolder.name,
          sizes: sizesData,
          variant: variantData,
        };
      }

      filaments[filamentFolder.name] = {
        ...filamentData,
        name: filamentFolder.name,
        colors,
      };
    }

    materials[materialFolder.name] = {
      name: materialFolder.name,
      filaments,
    };
  }

  return materials;
}
