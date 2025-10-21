import { ApertureIcon } from "lucide-react";
import React from "react";

const VideoProof = () => {
  return (
    <section className="py-20 -mt-10 z-5 rounded-t-[50px] bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="flex flex-col items-center justify-center mb-15">
          <div className="relative flex items-center justify-center mb-3">
            <div className="w-14 h-14 rounded-full border-2 border-pink-300 flex items-center justify-center bg-white shadow-sm">
              <ApertureIcon className="w-6 h-6 text-pink-400" />
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            See it in action
          </h2>
          <div className="w-22 h-1 bg-pink-300 mt-2 rounded-full"></div>
        </div>
        <div className="grid gap-15 sm:gap-5 sm:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-video">
            <iframe
              src="https://www.youtube.com/embed/ksS_fuc7r0k"
              title="Miala Cosmetics Application Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-lg aspect-video">
            <iframe
              src="https://www.youtube.com/embed/p6YyVgzicrk"
              title="This review for the Miala CC Cream Foundation will blow your mind!  #makeup #cccreamfoundation"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoProof;
