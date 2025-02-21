import React, { useRef, useState } from "react";
import { X, Volume2, Play, ArrowUp } from "lucide-react";

function MobileSurahDetailPopup({ selectedSurah, audioUrl, onClose }) {
  const audioRef = useRef(null);
  const ayatRefs = useRef({});
  const containerRef = useRef(null);
  const [playingAyat, setPlayingAyat] = useState(null);

  if (!selectedSurah) return null;

  const toggleAudio = (url, ayatNomor) => {
    if (audioRef.current.src !== url) {
      audioRef.current.src = url;
      audioRef.current.play();
      setPlayingAyat(ayatNomor);
    } else if (!audioRef.current.paused) {
      audioRef.current.pause();
      setPlayingAyat(null);
    } else {
      audioRef.current.play();
      setPlayingAyat(ayatNomor);
    }

    if (ayatRefs.current[ayatNomor]) {
      ayatRefs.current[ayatNomor].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 dark:text-white pt-[100px]">
      <div
        ref={containerRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 p-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors shadow-lg"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </button>

        {/* Surah Details */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold mb-2">
            {selectedSurah.nama} • {selectedSurah.namaLatin}
          </h2>
          <p className="text-lg opacity-75 mb-4">{selectedSurah.arti}</p>
          {audioUrl && (
            <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center space-x-2">
              <audio ref={audioRef} controls className="w-full max-w-md" />
            </div>
          )}
        </div>

        {/* Surah Description */}
        <p className="mb-4 text-justify">
          {selectedSurah.deskripsi.replace(/<[^>]+>/g, "")}
        </p>

        {/* Ayat List */}
        <div className="space-y-6">
          {selectedSurah.ayat.map((ayat) => (
            <div
              key={ayat.nomorAyat}
              ref={(el) => (ayatRefs.current[ayat.nomorAyat] = el)}
              className="p-4 border rounded-lg shadow-sm transition hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-lg">{ayat.nomorAyat}.</span>
                <button
                  onClick={() => toggleAudio(ayat.audio["05"], ayat.nomorAyat)}
                >
                  {playingAyat === ayat.nomorAyat ? (
                    <Volume2 className="w-5 h-5 text-blue-500" />
                  ) : (
                    <Play className="w-5 h-5 text-blue-500" />
                  )}
                </button>
              </div>
              <p className="text-right text-2xl font-arabic mb-2">
                {ayat.teksArab}
              </p>
              <p className="italic">{ayat.teksLatin}</p>
              <p className="mt-2">{ayat.teksIndonesia}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MobileSurahDetailPopup;
