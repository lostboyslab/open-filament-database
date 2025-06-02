import { loadFilamentDatabase } from '$lib/jsonParser';
import type { LayoutServerLoad } from './$types';
import { loadFlash } from 'sveltekit-flash-message/server';
import { loadFilamentDatabaseLazy } from '$lib/lazyParser';

let filamentDataCache: any = null;

const dataPath = '/Users/madsjacobsen/Desktop/open-filament-database/data';
export const load: LayoutServerLoad = loadFlash(async (event) => {
  const filamentData = loadFilamentDatabase(dataPath);
  // if (!filamentDataCache) {
  //   filamentDataCache = loadFilamentDatabase('/Users/madsjacobsen/Desktop/open-filament-database/data');
  // }
  // return { filamentData: filamentDataCache };
  return { filamentData };
});
