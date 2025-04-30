// import * as fs from 'fs';
// import * as path from 'path';
// import { fileURLToPath } from 'url';

// interface Data {
//   [key: string]: any;
//   data?: {
//     type: string;
//     jsonFile?: string;
//     imageFile?: string;
//   };
// }

// // Define the root directory as a constant
// const __filename = fileURLToPath(import.meta.url); // Get the current file path
// const __dirname = path.dirname(__filename); // Get the directory of the current file
// const ROOT_DIR = path.join(__dirname, '../data'); // Define the root directory
// const OUTPUT_FILE = path.join(__dirname, '../output/aggregatedData.json'); // Define the output file path

// const readJsonFile = (filePath: string): any => {
//   const rawData = fs.readFileSync(filePath, 'utf-8');
//   return JSON.parse(rawData);
// };

// export const processDirectory = (dirPath: string = ROOT_DIR, type: string = 'brand'): Data => {
//   const data: Data = {};
//   const items = fs.readdirSync(dirPath);

//   items.forEach(item => {
//     const itemPath = path.join(dirPath, item);
//     const stats = fs.statSync(itemPath);

//     if (stats.isDirectory()) {
//       // Determine the type for the next level
//       const nextType = type === 'brand' ? 'material' : 
//                       type === 'material' ? 'filament' : 
//                       type === 'filament' ? 'color' : 'size_or_variant';
      
//       // Recursively process subdirectories
//       data[item] = processDirectory(itemPath, nextType);

//       // Find any JSON and image files in this directory
//       const files = fs.readdirSync(itemPath);
//       const jsonFile = files.find(f => f.endsWith('.json'));
//       const imageFile = files.find(f => /\.(jpg|jpeg|png)$/i.test(f));

//       // Initialize or update the data object
//       if (!data[item].data) {
//         data[item].data = { type };
//       }
      
//       if (jsonFile) {
//         const jsonData = readJsonFile(path.join(itemPath, jsonFile));
//         data[item].data = {
//           ...data[item].data,
//           ...jsonData,
//           jsonFile,
//           ...(imageFile && { imageFile })
//         };
//       }
//     } else if (stats.isFile() && item.endsWith('.json')) {
//       // Handle root level JSON files
//       const jsonData = readJsonFile(itemPath);
//       if (!data.data) {
//         data.data = { type };
//       }
//       data.data = {
//         ...data.data,
//         ...jsonData,
//         jsonFile: item
//       };
//     }
//   });

//   return data;
// };

// export const exportToJsonFile = (): void => {
//   const aggregatedData = processDirectory();

//   // Ensure the output directory exists
//   const outputDir = path.dirname(OUTPUT_FILE);
//   if (!fs.existsSync(outputDir)) {
//     fs.mkdirSync(outputDir, { recursive: true });
//   }

//   // Write the aggregated data to the output file
//   fs.writeFileSync(OUTPUT_FILE, JSON.stringify(aggregatedData, null, 2), 'utf-8');
//   console.log(`Aggregated data has been written to ${OUTPUT_FILE}`);
// };
// // Example usage
// exportToJsonFile();



// -------------
// BRAND PARSER
// -------------

// import * as fs from 'fs';
// import * as path from 'path';
// import { fileURLToPath } from 'url';

// interface BrandData {
//   brandName: string;
//   data: {
//     logo: string;
//     [key: string]: any;
//   };
// }

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const BRANDS_DIR = path.join(__dirname, '../data');

// export function parseBrands(): BrandData[] {
//   const brands: BrandData[] = [];
  
//   // Read all brand directories
//   const brandDirs = fs.readdirSync(BRANDS_DIR);

//   brandDirs.forEach(brandDir => {
//     const brandPath = path.join(BRANDS_DIR, brandDir);
    
//     // Skip if not a directory
//     if (!fs.statSync(brandPath).isDirectory()) return;

//     const brandJsonPath = path.join(brandPath, 'brand.json');
    
//     // Skip if brand.json doesn't exist
//     if (!fs.existsSync(brandJsonPath)) return;

//     try {
//       const brandData = JSON.parse(fs.readFileSync(brandJsonPath, 'utf-8'));
      
//       // Find the logo file
//       const files = fs.readdirSync(brandPath);
//       const logoFile = files.find(file => 
//         file.toLowerCase().endsWith('.jpg') || 
//         file.toLowerCase().endsWith('.png')
//       );

//       brands.push({
//         brandName: brandDir,
//         data: {
//           ...brandData,
//           logo: logoFile || ''
//         }
//       });
//     } catch (error) {
//       console.error(`Error parsing ${brandDir}/brand.json:`, error);
//     }
//   });

//   return brands;
// }


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

export function loadFilamentDatabase(dataPath: string): FilamentDatabase {
  // const startMem = process.memoryUsage().heapUsed;
  console.log('Running!')

  const brands: Record<string, Brand> = {};

  const brandFolders = fs.readdirSync(dataPath, { withFileTypes: true }).filter(dirent => dirent.isDirectory());

  for (const brandFolder of brandFolders) {
    const brandPath = path.join(dataPath, brandFolder.name);
    const brandJsonPath = path.join(brandPath, 'brand.json');
    // Find logo file (png/jpg/jpeg) in brand folder
    const files = fs.readdirSync(brandPath);
    const logoFile = files.find(file =>
      /\.(png|jpg|jpeg)$/i.test(file)
    );
    // Set logo path for browser (assuming you move/copy all logos to static/logos/)
    const logo = logoFile ? `/data/${brandFolder.name}/${logoFile}` : '';
  
    if (!fs.existsSync(brandJsonPath)) continue;
  
    const brandData = JSON.parse(fs.readFileSync(brandJsonPath, 'utf-8'));
    const materials: Record<string, Material> = {};
  

    const materialFolders = fs.readdirSync(brandPath, { withFileTypes: true }).filter(dirent => dirent.isDirectory());

    for (const materialFolder of materialFolders) {
      const materialPath = path.join(brandPath, materialFolder.name);
      const materialJsonPath = path.join(materialPath, 'material.json');

      if (!fs.existsSync(materialJsonPath)) continue;

      const materialData = JSON.parse(fs.readFileSync(materialJsonPath, 'utf-8'));
      const filaments: Record<string, Filament> = {};

      const filamentFolders = fs.readdirSync(materialPath, { withFileTypes: true }).filter(dirent => dirent.isDirectory());

      for (const filamentFolder of filamentFolders) {
        const filamentPath = path.join(materialPath, filamentFolder.name);
        const filamentJsonPath = path.join(filamentPath, 'filament.json');

        if (!fs.existsSync(filamentJsonPath)) continue;

        const filamentData = JSON.parse(fs.readFileSync(filamentJsonPath, 'utf-8'));
        const colors: Record<string, Color> = {};

        const colorFolders = fs.readdirSync(filamentPath, { withFileTypes: true }).filter(dirent => dirent.isDirectory());

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

    brands[brandFolder.name] = {
      name: brandData.brand ?? brandFolder.name,
      logo,
      website: brandData.website ?? '',
      origin: brandData.origin ?? '',
      materials,
    };
  }
  // const endMem = process.memoryUsage().heapUsed;
  // console.log(
  //   `Filament DB: ${(endMem / 1024 / 1024).toFixed(2)} MB used (${((endMem - startMem) / 1024 / 1024).toFixed(2)} MB delta)`
  // );
  return { brands };
}