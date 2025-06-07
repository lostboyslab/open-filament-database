import type { brandSchema } from '$lib/validation/filament-brand-schema';
import type { z } from 'zod';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { filamentMaterialSchema } from '$lib/validation/filament-material-schema';
import type { baseFilamentSchema } from '$lib/validation/filament-schema';

export const removeUndefined = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, removeUndefined(v)]),
    );
  }
  return obj;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../../../data');

export const createBrand = async (brandData: z.infer<typeof brandSchema>) => {
  const brandDir = path.join(DATA_DIR, brandData.name);
  if (!fs.existsSync(brandDir)) {
    fs.mkdirSync(brandDir, { recursive: true });
  }

  let logoPath = '';
  let logoUrl = '';
  if (
    brandData.logo &&
    typeof brandData.logo === 'object' &&
    typeof brandData.logo.arrayBuffer === 'function'
  ) {
    const arrayBuffer = await brandData.logo.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    logoPath = path.join(brandDir, brandData.logo.name);
    fs.writeFileSync(logoPath, buffer);
    logoUrl = `/data/${brandData.name}/${brandData.logo.name}`;
  }

  const brandJson = {
    brand: brandData.name,
    website: brandData.website,
    logo: logoUrl,
    origin: brandData.origin,
  };

  const brandJsonPath = path.join(brandDir, 'brand.json');
  fs.writeFileSync(brandJsonPath, JSON.stringify(brandJson, null, 2), 'utf-8');

  return brandDir;
};

export async function updateBrand(brandData: z.infer<typeof brandSchema>) {
  const oldDir = path.join(DATA_DIR, brandData.oldBrandName);
  const newDir = path.join(DATA_DIR, brandData.name);

  if (brandData.oldBrandName !== brandData.name && fs.existsSync(oldDir)) {
    if (fs.existsSync(newDir)) {
      throw new Error(`Brand folder "${brandData.name}" already exists.`);
    }
    fs.renameSync(oldDir, newDir);
  } else if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir, { recursive: true });
  }

  const brandJson = {
    brand: brandData.name,
    website: brandData.website,
    logo: brandData.logo,
    origin: brandData.origin,
  };

  const brandJsonPath = path.join(newDir, 'brand.json');
  fs.writeFileSync(brandJsonPath, JSON.stringify(brandJson, null, 2), 'utf-8');

  return newDir;
}

export const createMaterial = async (
  brandName: string,
  materialData: z.infer<typeof filamentMaterialSchema>,
) => {
  console.log('Material data:', materialData);
  const brandDir = path.join(DATA_DIR, brandName);
  if (!fs.existsSync(brandDir)) {
    throw new Error(`Brand directory "${brandName}" does not exist.`);
  }

  const materialDir = path.join(brandDir, materialData.name);
  if (!fs.existsSync(materialDir)) {
    fs.mkdirSync(materialDir, { recursive: true });
  }

  const materialJsonPath = path.join(materialDir, 'material.json');
  fs.writeFileSync(materialJsonPath, JSON.stringify(materialData, null, 2), 'utf-8');

  return materialDir;
};

export const createFilament = async (
  brandName: string,
  materialName: string,
  filamentData: z.infer<typeof baseFilamentSchema>,
) => {
  console.log('Filament data:', filamentData);

  const brandDir = path.join(DATA_DIR, brandName);
  if (!fs.existsSync(brandDir)) {
    throw new Error(`Brand directory "${brandName}" does not exist.`);
  }

  const materialDir = path.join(brandDir, materialName);
  if (!fs.existsSync(materialDir)) {
    throw new Error(`Material directory "${materialName}" does not exist in brand "${brandName}".`);
  }

  const filamentDir = path.join(materialDir, filamentData.name);
  if (!fs.existsSync(filamentDir)) {
    fs.mkdirSync(filamentDir, { recursive: true });
  }

  const filamentJsonPath = path.join(filamentDir, 'filament.json');
  fs.writeFileSync(filamentJsonPath, JSON.stringify(filamentData, null, 2), 'utf-8');

  return filamentDir;
};

export async function createColorFiles(formData: any) {
  const DATA_DIR_FILAMENT = path.resolve('../data');
  const colorFolder = path.join(
    DATA_DIR_FILAMENT,
    formData.brandName,
    formData.materialName,
    formData.filamentName,
    formData.color_name,
  );

  if (!fs.existsSync(colorFolder)) fs.mkdirSync(colorFolder, { recursive: true });
  const sizeFields = [
    'filament_weight',
    'empty_spool_weight',
    'diameter',
    'spool_refill',
    'sku',
    'ean',
    'purchase_links',
  ];
  const sizeObj: any = {};
  for (const key of sizeFields) {
    if (formData[key] !== undefined) sizeObj[key] = formData[key];
  }
  if (formData.diameter_tolerance !== undefined)
    sizeObj.diameter_tolerance = formData.diameter_tolerance;
  if (formData.density !== undefined) sizeObj.density = formData.density;

  // Read existing sizes.json if it exists, otherwise start with empty array
  let sizesArr: any[] = [];
  const sizesPath = path.join(colorFolder, 'sizes.json');
  if (fs.existsSync(sizesPath)) {
    try {
      sizesArr = JSON.parse(fs.readFileSync(sizesPath, 'utf-8'));
      if (!Array.isArray(sizesArr)) sizesArr = [];
    } catch {
      sizesArr = [];
    }
  }
  // Add the new size object if it has at least filament_weight or diameter
  if (Object.keys(sizeObj).length > 0) {
    sizesArr.push(removeUndefined(sizeObj));
  }
  fs.writeFileSync(sizesPath, JSON.stringify(sizesArr, null, 2), 'utf-8');

  // --- 2. Prepare variant.json (single object) ---
  // Traits are grouped under a "traits" object
  const traitKeys = ['translucent', 'glow', 'matte', 'recycled', 'recyclable', 'biodegradable'];
  const traits: Record<string, boolean> = {};
  for (const key of traitKeys) {
    if (formData[key] !== undefined) traits[key] = formData[key];
  }

  // Only include traits if at least one is present
  const variantObj: any = {
    color_name: formData.color_name,
    color_hex: formData.color_hex,
  };
  if (Object.keys(traits).length > 0) {
    variantObj.traits = traits;
  }
  // Add any additional fields you want in variant.json
  if (formData.data_sheet_url) variantObj.data_sheet_url = formData.data_sheet_url;
  if (formData.safety_sheet_url) variantObj.safety_sheet_url = formData.safety_sheet_url;

  fs.writeFileSync(
    path.join(colorFolder, 'variant.json'),
    JSON.stringify(removeUndefined(variantObj), null, 2),
    'utf-8',
  );
}

function copyFileSync(src: string, dest: string) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

export function prepareFilamentDownload(colorFolder: string, tempDownloadDir: string) {
  // colorFolder: e.g. src/data/3DO/ASA/ASA/Blue
  // tempDownloadDir: e.g. /tmp/download-3DO-ASA-ASA-Blue

  // 1. Copy sizes.json and variant.json
  for (const file of ['sizes.json', 'variant.json']) {
    const srcFile = path.join(colorFolder, file);
    if (fs.existsSync(srcFile)) {
      copyFileSync(
        srcFile,
        path.join(tempDownloadDir, path.relative('src/data', path.join(colorFolder, file))),
      );
    }
  }

  // 2. Copy filament.json (one level up)
  const filamentFolder = path.dirname(colorFolder);
  const filamentJson = path.join(filamentFolder, 'filament.json');
  if (fs.existsSync(filamentJson)) {
    copyFileSync(filamentJson, path.join(tempDownloadDir, path.relative('src/data', filamentJson)));
  }

  // 3. Copy material.json (two levels up)
  const materialFolder = path.dirname(filamentFolder);
  const materialJson = path.join(materialFolder, 'material.json');
  if (fs.existsSync(materialJson)) {
    copyFileSync(materialJson, path.join(tempDownloadDir, path.relative('src/data', materialJson)));
  }

  // 4. Copy brand.json (three levels up)
  const brandFolder = path.dirname(materialFolder);
  const brandJson = path.join(brandFolder, 'brand.json');
  if (fs.existsSync(brandJson)) {
    copyFileSync(brandJson, path.join(tempDownloadDir, path.relative('src/data', brandJson)));
  }
}

export function downloadColor(brand: string, material: string, filament: string, color: string) {
  const url = `/api/download/${encodeURIComponent(brand)}/${encodeURIComponent(
    material,
  )}/${encodeURIComponent(filament)}/${encodeURIComponent(color)}`;
  // Create a hidden link and click it to trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = '';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
