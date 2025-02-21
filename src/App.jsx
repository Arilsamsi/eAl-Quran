import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import ReactAudioPlayer from "react-audio-player";
import {
  Book,
  Moon,
  Sun,
  Search,
  Volume2,
  BookOpen,
  AlertCircle,
  ArrowUp,
  Play,
} from "lucide-react";
import MobileSurahDetailPopup from "./components/MobileSurahDetailPopup";

function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 5000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    showButton && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    )
  );
}

function App() {
  const audioRef = useRef(null);
  const ayatRefs = useRef({});
  const [darkMode, setDarkMode] = useState(false);
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileDetailPopup, setShowMobileDetailPopup] = useState(false);
  const [playingAyat, setPlayingAyat] = useState(null);

  const toggleAudio = (url, ayatNomor) => {
    if (!audioRef.current) return; // Pastikan audioRef sudah tersedia

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

  const handleClosePopup = () => {
    setShowMobileDetailPopup(false);
  };

  useEffect(() => {
    fetchSurahs();
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchSurahs = async () => {
    try {
      const response = await axios.get("https://equran.id/api/v2/surat");
      setSurahs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching surahs:", error);
      setError("Failed to fetch surah list. Please try again.");
      setLoading(false);
    }
  };

  const fetchSurahDetails = async (surahNumber) => {
    try {
      setLoadingSurah(true);
      setSelectedSurah(null);
      const response = await axios.get(
        `https://equran.id/api/v2/surat/${surahNumber}`
      );
      const surahData = response.data.data;
      setSelectedSurah(surahData);
      setAudioUrl(surahData.audioFull["05"]);
      setLoadingSurah(false);
      if (isMobile) {
        setShowMobileDetailPopup(true);
      }
    } catch (error) {
      console.error("Error fetching surah details:", error);
      setError("Failed to fetch surah details. Please try again.");
      setLoadingSurah(false);
    }
  };

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`fixed w-full top-0 z-50 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-md`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Book className="w-8 h-8" />
            <h1 className="text-2xl font-bold">eAl-Qur'an</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <ScrollToTopButton />
      <div className="container mx-auto px-4 pt-24 pb-8">
        {/* Search Input */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Surah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-300"
              } border focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Surah List */}
          <div
            className={`md:col-span-4 lg:col-span-3 ${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-lg p-4 h-[calc(100vh-180px)] overflow-y-auto`}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Surah List
            </h2>

            {/* Error Handling */}
            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-md flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            {/* Skeleton Loader */}
            {loading ? (
              <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} height={60} />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredSurahs.map((surah) => (
                  <button
                    key={surah.nomor}
                    onClick={() => fetchSurahDetails(surah.nomor)}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      selectedSurah?.nomor === surah.nomor
                        ? "bg-blue-500 text-white"
                        : darkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{surah.namaLatin}</span>
                      <span className="text-sm opacity-75">{surah.nama}</span>
                    </div>
                    <div className="text-sm opacity-75 mt-1">
                      {surah.arti} • {surah.jumlahAyat} verses
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Surah Details */}
          {!isMobile && (
            <div
              className={`md:col-span-8 lg:col-span-9 ${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-lg p-6`}
            >
              {loadingSurah ? (
                <div className="text-center">
                  <Skeleton height={40} width={200} />
                  <Skeleton height={30} width={300} className="mt-2" />
                  <Skeleton height={60} className="mt-4" />
                </div>
              ) : selectedSurah ? (
                <div>
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold mb-2">
                      {selectedSurah.nama} • {selectedSurah.namaLatin}
                    </h2>
                    <p className="text-lg opacity-75 mb-4">
                      {selectedSurah.arti}
                    </p>
                    {audioUrl && (
                      <div className="p-4 rounded-lg bg-gray-100 flex items-center justify-center space-x-2">
                        <Volume2 className="w-5 h-5" />
                        <ReactAudioPlayer
                          src={audioUrl}
                          controls
                          className="w-full max-w-md"
                        />
                      </div>
                    )}
                    <audio ref={audioRef} controls className="hidden" />
                  </div>

                  <p className="mb-4 text-justify">
                    {selectedSurah.deskripsi.replace(/<[^>]+>/g, "")}
                  </p>

                  <div className="space-y-6">
                    {selectedSurah.ayat.map((ayat) => (
                      <div
                        key={ayat.nomorAyat}
                        className="p-4 border rounded-lg shadow-sm transition hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-lg">
                            {ayat.nomorAyat}.
                          </span>
                          <button
                            onClick={() =>
                              toggleAudio(ayat.audio["05"], ayat.nomorAyat)
                            }
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
              ) : (
                <div className="text-center">
                  <Book className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Select a Surah</h3>
                  <p className="opacity-75">
                    Choose a Surah from the list to start reading
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Surah Detail Popup */}
      {isMobile && showMobileDetailPopup && (
        <MobileSurahDetailPopup
          key={showMobileDetailPopup}
          selectedSurah={selectedSurah}
          audioUrl={audioUrl}
          onClose={handleClosePopup}
          onPlayAudio={(url) => setAudioUrl(url)}
        />
      )}
    </div>
  );
}

export default App;
