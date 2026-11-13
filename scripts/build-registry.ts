import { registry } from "../registry"; // <-- adjust to your real path/export name
import { promises as fs } from "fs";
import type { z } from "zod";
import type { registryItemFileSchema } from "@/registry/schema";
import path from "path";

const REGISTRY_BASE_PATH = process.cwd();
const PUBLIC_FOLDER_BASE_PATH = "public/r";

type File = z.infer<typeof registryItemFileSchema>;

async function writeFileRecursive(filePath: string, data: string) {
    const dir = path.dirname(filePath);
    // No try/catch here — let failures throw and propagate up to main(),
    // so a broken build actually fails instead of silently reporting "done".
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, data, "utf-8");
    console.log(`File written to ${filePath}`);
}

/**
 * Strips a leading "/" — the shadcn CLI treats a leading slash as an
 * absolute filesystem path and aborts with "unsafe file path". Every
 * path/target we emit must be relative, no exceptions.
 */
function toRelative(p: string): string {
    return p.startsWith("/") ? p.slice(1) : p;
}

async function readSourceFile(relativePath: string): Promise<string> {
    const absolutePath = path.join(REGISTRY_BASE_PATH, relativePath);
    try {
        return await fs.readFile(absolutePath, "utf-8");
    } catch {
        throw new Error(
            `[build-registry] Source file not found:\n  ${relativePath}\n(resolved to ${absolutePath})`
        );
    }
}

const getComponentFiles = async (files: File[], registryType: string) => {
    const filesArrayPromises = (files ?? []).map(async (file) => {
        if (typeof file === "string") {
            const relativePath = toRelative(file);
            const fileContent = await readSourceFile(relativePath);
            return {
                type: registryType,
                content: fileContent,
                path: relativePath,
                target: relativePath, // mirrors source location, no flattening
            };
        }

        const relativePath = toRelative(file.path);
        const fileContent = await readSourceFile(relativePath);
        const fileType = file.type || registryType;

        return {
            type: fileType,
            content: fileContent,
            path: relativePath,
            target: file.target ? toRelative(file.target) : relativePath,
        };
    });

    return Promise.all(filesArrayPromises);
};

const main = async () => {
    const names = new Set<string>();

    for (let i = 0; i < registry.length; i++) {
        const component = registry[i];

        if (names.has(component.name)) {
            throw new Error(`[build-registry] Duplicate item name: "${component.name}"`);
        }
        names.add(component.name);

        const files = component.files;
        if (!files || files.length === 0) {
            throw new Error(`[build-registry] No files found for component "${component.name}"`);
        }

        const filesArray = await getComponentFiles(files, component.type);

        const json = JSON.stringify(
            {
                $schema: "https://ui.shadcn.com/schema/registry-item.json",
                ...component,
                files: filesArray,
            },
            null,
            2
        );

        const jsonPath = `${PUBLIC_FOLDER_BASE_PATH}/${component.name}.json`;
        await writeFileRecursive(jsonPath, json);
    }
};

main()
    .then(() => {
        console.log("done");
    })
    .catch((err) => {
        console.error(err);
        process.exit(1); // <-- ensures CI/Vercel build actually fails on error
    });