import { FAQ_A, FAQ_B, FAQ_C, FAQ_D , FAQ_E, FAQ_F , FAQ_G , FAQ_H   } from "./FAQS";
import fs from 'fs';
import path from 'path';

interface Question {
  question: string;
  answer: string;
}

interface IFaq {
  id: string;
  title: string;
  questions: Question[];
}

// ✅ Replace fetch with fs
function fetchFAQSConfig(): IFaq[] {
  const filePath = path.join(process.cwd(), 'public', 'config', 'faqConfig.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  return data.faqs;
}

export const FinalMainFAQ = () => {  
  const FAQItems = fetchFAQSConfig();

  return (
    <div className='w-full h-full pt-8 lg:pt-10'>
      <div className='w-full mx-auto py-20 pb-5 flex flex-col items-center justify-center px-20 '>
        <h1 className='text-center font-sans font-bold text-2xl lg:text-4xl text-neutral-800 dark:text-neutral-200 pb-2'>
          Frequently Asked Questions about Lokalhost.io
        </h1>
        <p className='text-center font-sans font-medium text-sm text-neutral-700 dark:text-neutral-300'>
          Find answers to common questions about our services, features, and how Lokalhost.io can benefit you.
        </p>
      </div>
      <div className='grid md:grid-cols-2 lg:grid-cols-2 grid-cols-1 pt-16 px-6 gap-6 lg:gap-16'>
        <div>{FAQItems[0] && <FAQ_A faq={FAQItems[0]} />}</div>
        <div>{FAQItems[1] && <FAQ_B faq={FAQItems[1]} />}</div>
        <div>{FAQItems[2] && <FAQ_C faq={FAQItems[2]} />}</div>
        <div>{FAQItems[3] && <FAQ_D faq={FAQItems[3]} />}</div>
        <div>{FAQItems[4] && <FAQ_E faq={FAQItems[4]} />}</div>
        <div>{FAQItems[5] && <FAQ_F faq={FAQItems[5]} />}</div>
        <div>{FAQItems[6] && <FAQ_G faq={FAQItems[6]} />}</div>
        <div>{FAQItems[7] && <FAQ_H faq={FAQItems[7]} />}</div>
      </div>
    </div>
  );
}