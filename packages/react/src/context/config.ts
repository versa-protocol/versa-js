import { createContext } from "react";

export interface VersaConfig {
  mapbox_token?: string;
}

export const VersaContext = createContext<VersaConfig>({});
