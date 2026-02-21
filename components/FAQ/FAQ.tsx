import { FAQ_A, FAQ_B, FAQ_C, FAQ_D } from "./FAQS";
interface Question {
  question: string;
  answer: string;
}

interface IFaq {
  id: string;
  title: string;
  questions: Question[];
}

async function fetchFAQSConfig(): Promise<IFaq[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/config/faqConfig.json`,{
      cache: 'force-cache', // ✅ cached forever (until rebuild)
    }
  );
  console.log(response)
  if (!response.ok) {
    throw new Error('Failed to fetch FAQ config');
  }
  const data = await response.json();
  return data.faqs;
}

export const FinalMainFAQ = async () => {
  const FAQItems = await fetchFAQSConfig()
    return (
        <div className='w-full h-full pt-8 lg:pt-20'>
            <div className='w-full mx-auto py-20 pb-5 flex flex-col items-center justify-center'>
                <h1 className='text-center font-sans font-bold text-2xl lg:text-4xl text-neutral-800 dark:text-neutral-200 pb-2'>Frequently Asked Questions about Lokalhost.io</h1>
                <p className='text-center font-sans font-medium text-sm text-neutral-700 dark:text-neutral-300'>Find answers to common questions about our services, features, and how Lokalhost.io can benefit you.</p>
            </div>
            <div className='grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 pt-16 px-6 gap-6 lg:gap-16'>
                <div>
                  {FAQItems[0] && <FAQ_A faq={FAQItems[0]} />}
                </div>
                <div>
                  {FAQItems[1] && <FAQ_B faq={FAQItems[1]} />}
                </div>
                <div>
                  {FAQItems[2] && <FAQ_C faq={FAQItems[2]} />}
                </div>
                <div>
                  {FAQItems[3] && <FAQ_D faq={FAQItems[3]} />}
                </div>
            </div>
        </div>
    )
} 

