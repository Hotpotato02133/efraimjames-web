import React from 'react';
import InfiniteMarquee from './InfiniteMarquee';

const LetsTalkMarquee = () => {
  return (
    <div className="py-8 bg-stone-50">
      <InfiniteMarquee speed={40} direction="left">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center mx-8">
            <span className="text-6xl sm:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-300 uppercase opacity-60 hover:opacity-80 transition-opacity duration-300">
              Let's Talk +++
            </span>
          </div>
        ))}
      </InfiniteMarquee>
    </div>
  );
};

export default LetsTalkMarquee;
