
import { type InferPageType } from 'fumadocs-core/source';
import { docs, meta , authdocs, authmeta ,backgrounds , backgroundsmeta} from "@/.source";
import { createMDXSource } from "fumadocs-mdx";
import { loader } from "fumadocs-core/source";


import { icons } from "lucide-react";
import { createElement } from "react";

export const source = loader({
    baseUrl: "/docs",
    source: createMDXSource(docs, meta),
    
    icon(icon) {
        if (!icon) {
            return createElement(icons.Library);
        }

        if (icon in icons)
            return createElement(icons[icon as keyof typeof icons]);
    },
});

export const authsource = loader({
  baseUrl: "/authdocs",
  source: createMDXSource(authdocs, authmeta),
  icon(icon) {
        if (!icon) {
            return createElement(icons.Library);
        }

        if (icon in icons)
            return createElement(icons[icon as keyof typeof icons]);
    },
});



export const backgroundsource = loader({
  baseUrl: "/backgrounds",
  source: createMDXSource(backgrounds, backgroundsmeta),
  icon(icon) {
        if (!icon) {
            return createElement(icons.Library);
        }

        if (icon in icons)
            return createElement(icons[icon as keyof typeof icons]);
    },
});


export function getPageImage(page: InferPageType<typeof authsource>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/authdocs/${segments.join('/')}`,
  };
}


export function getPageImage2(page: InferPageType<typeof backgroundsource>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `/og/backgrounds/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof authsource>) {
  const processed = await page.data.getText('processed');

  return `# ${page.data.title} (${page.url})

${processed}`;
}

    