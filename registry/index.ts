import { component } from "./registry-components";
import { lib } from "./registry-lib";
import type { Registry } from "./schema";


export const registry: Registry = [...component, ...lib];
