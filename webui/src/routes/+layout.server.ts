import { loadFilamentDatabase } from "$lib/jsonParser";
import type { LayoutServerLoad } from "./$types";
import { loadFlash } from 'sveltekit-flash-message/server';

let filamentDataCache: any = null;


export const load: LayoutServerLoad = loadFlash(async (event) => {
  const filamentData = loadFilamentDatabase('/Users/madsjacobsen/Desktop/open-filament-database/data');
  // if (!filamentDataCache) {
  //   filamentDataCache = loadFilamentDatabase('/Users/madsjacobsen/Desktop/open-filament-database/data');
  // }
  // return { filamentData: filamentDataCache };
  return { filamentData };
});