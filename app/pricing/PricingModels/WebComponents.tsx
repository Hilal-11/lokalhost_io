// app/.../page.tsx

import WebComponentPricing from './webComponentPricing';
import fs from 'fs';
import path from 'path';

interface PricingConfig {
  id: string;
  plan: string;
  planDescription?: string;
  subscription_amount: string;
  save_price?: string;
  save_price_value?: string;
  features: string[];
  butttonContent?: string;
  popular?: boolean;
}

function getPricingConfig(): PricingConfig[] {  // ✅ array
  const filePath = path.join(process.cwd(), 'public', 'config', 'pricingConfig.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

function WebComponents() {  
  const pricingConfig = getPricingConfig(); 
  return (
    <div id="web-components" className='dark:border-neutral-700'>
      <WebComponentPricing webComponentsPricingConfig={pricingConfig} />
    </div>
  )
}

export default WebComponents;