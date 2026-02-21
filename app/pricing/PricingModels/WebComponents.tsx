import WebComponentPricing from './webComponentPricing';
interface PricingConfig {
    id: string,
    plan: string,
    planDescription?: string,
    subscription_amount: string,
    save_price?: string,
    save_price_value?: string,
    features: string[],
    butttonContent?: string,
    popular?: boolean
}

async function getPricingConfig(): Promise<PricingConfig[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/config/pricingConfig.json`,
    {
      cache: 'force-cache', // ✅ cached forever (until rebuild)
    }
  );
  if (!res.ok) {
    throw new Error('Failed to fetch pricing config');
  }
  return res.json();
}

async function WebComponents() {

  const pricingConfig = await getPricingConfig();
  return (
          <div id="web-components" className='dark:border-neutral-700'>
            <WebComponentPricing webComponentsPricingConfig={pricingConfig}/>
          </div>
  )
}

export default WebComponents
