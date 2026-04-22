import React, { useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { toast } from 'sonner';
import { RiExpandDiagonalLine } from "react-icons/ri";
import { Button } from '../ui/button';
import { IoCloseSharp } from "react-icons/io5";
import { FiCopy } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { GoStarFill } from "react-icons/go";
import { GoStar } from "react-icons/go";
import Hello from './helloTypeEffect/Hello';

type PlaygroundProps = {
  children: React.ReactElement;
  setPreview: (preview: React.ReactNode) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
};

const Playground: React.FC<PlaygroundProps> = ({
  children,
  setPreview,
  theme,
  setTheme,
}) => {

const [isCopied , setIsCopied] = useState(false)

const copyCode = () => {
  const code = ReactDOMServer.renderToString(children);

  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(code)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => fallbackCopy(code));
  } else {
    fallbackCopy(code);
  }
      setIsCopied(true)
    // after 3 secounds i should reset this, make it to false
    setTimeout(() => {
        setIsCopied(false)
    },3000)
};

const fallbackCopy = (text: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed"; 
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  toast.success('Copied to clipboard');
};

const [expand , setExpand] = useState(false)
const [isFavorite , setIsFavorite] = useState(false)

  const addFavorite = () => {
    toast.success('Pattern Add on Favorite');
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    if(!isFavorite) {
        addFavorite();
    }
  }

  return (
    <>
      <div className={`
            ${expand
            ? "fixed top-0 left-0 w-full h-full z-[9999] bg-neutral-100 dark:bg-neutral-900" // Expanded full screen with theme background
            : "min-h-[300px] relative w-full overflow-hidden rounded-lg ring-1 ring-slate-900/10"
            }
            transition-all duration-300 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]
        `}>

            <Button onClick={() => setExpand(!expand)} variant="outline" size="icon" aria-label="Go Back" className={`absolute right-1 top-1 cursor-pointer z-30 }`}>
            {
                !expand ? <RiExpandDiagonalLine /> : <IoCloseSharp />
            }
            </Button>

            {
                expand && <Hello />
            }
            
        <div className="absolute bottom-2 cursor-pointer w-full">
          { 
            !expand && <div className="flex gap-2 justify-between w-full px-4">
            <div
              className="z-40 flex items-center justify-center gap-2 border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-50 dark:border-neutral-400 relative overflow-hidden text-sm cursor-pointer font-sans font-medium w-full py-[6px] rounded-md bg-neutral-100 bg-gradient-to-t from-[#f5f5f5] to-[#d4d4d4] dark:text-neutral-900 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]"
              onClick={() => {
                setPreview(children);
                setTheme(theme);
              }}
            >
              <span className='text-lg'><MdOutlineRemoveRedEye/></span>Preview
            </div>
            <div
              className="flex items-center justify-center gap-2 z-30 border-t-[2px] border-l-[2px] border-r-[2px] border-neutral-950 dark:border-neutral-800 relative cursor-pointer text-sm font-sans font-medium w-full py-[6px] rounded-md bg-gradient-to-t from-[#262626] to-[#525252] text-neutral-200 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]"
              onClick={copyCode}
            >
              <span className='flex items-center justify-center gap-1'><FiCopy />{isCopied ? "Copied" : "Copy Code"}</span>
            </div>
          </div>
           }
        </div>
        {children}
      </div>
    </>
  );
};

export default Playground;
