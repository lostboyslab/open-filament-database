import { loadFilamentDatabase } from "$lib/jsonParser";
import type { LayoutServerLoad } from "./$types";

let filamentDataCache: any = null;


export const load: LayoutServerLoad = async () => {


  if (!filamentDataCache) {
    filamentDataCache = loadFilamentDatabase('/Users/madsjacobsen/Desktop/web-ui/src/data');
  }
  return { filamentData: filamentDataCache };
};