import React, { useState, useCallback, useEffect } from 'react';
import { INITIAL_PARAMS, CharacterParams } from './types';
import { generateCharacterImage, checkApiKey, promptSelectKey } from './services/geminiService';
import { InputGroup } from './components/InputGroup';
import { SelectGroup } from './components/SelectGroup';
import { Section } from './components/Section';

const App: React.FC = () => {
  const [params, setParams] = useState<CharacterParams>(INITIAL_PARAMS);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyReady, setApiKeyReady] = useState<boolean>(false);

  // Initial check for API Key availability
  useEffect(() => {
    const initKey = async () => {
      try {
        const hasKey = await checkApiKey();
        setApiKeyReady(hasKey);
      } catch (e) {
        console.warn("Could not check API key status", e);
      }
    };
    initKey();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleApiKeySelection = async () => {
    try {
      await promptSelectKey();
      setApiKeyReady(true);
      setError(null);
    } catch (e) {
      console.error("API Key Selection failed", e);
      setError("Gagal memilih API Key. Silakan coba lagi.");
    }
  };

  const handleGenerate = async () => {
    if (!apiKeyReady) {
       await handleApiKeySelection();
       return;
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);
    setLastPrompt(null);

    try {
      const result = await generateCharacterImage(params);
      setGeneratedImage(result.image);
      setLastPrompt(result.prompt);
    } catch (err: any) {
      console.error("Generation failed", err);
      if (err.message && err.message.includes("API Key")) {
        setApiKeyReady(false);
        setError("API Key diperlukan atau tidak valid. Silakan pilih Key.");
      } else {
        setError(err.message || "Terjadi kesalahan saat membuat gambar.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Option Lists
  const artStyles = ['Realistic', 'Anime', 'Cartoon', '3D Render', 'Oil Painting', 'Sketch', 'Cyberpunk', 'Fantasy Art'];
  const backgrounds = ['White Background', 'City View', 'Forest', 'Beach', 'Mountain', 'Space', 'Cyberpunk City', 'Studio Lighting', 'Fantasy Garden', 'Library', 'Cafe'];
  const poses = ['Standing Straight', 'Sitting Relaxed', 'Waving', 'Walking', 'Action Pose', 'Crossed Arms', 'Hands on Hips', 'Looking over shoulder', 'Running'];
  
  const races = ['Asian', 'Caucasian', 'Black/African', 'Hispanic/Latino', 'Middle Eastern', 'South Asian', 'Elf', 'Orc', 'Cyborg', 'Demon', 'Angel'];
  const skinColors = ['Pale', 'Fair', 'Light', 'Medium', 'Olive', 'Tan', 'Brown', 'Dark Brown', 'Black', 'Blue (Fantasy)', 'Green (Fantasy)', 'Red (Fantasy)', 'Metallic'];
  
  const faceShapes = ['Oval', 'Round', 'Square', 'Diamond', 'Heart', 'Long', 'Triangle'];
  const eyebrows = ['Natural', 'Thick', 'Thin', 'Arched', 'Straight', 'Bushy', 'Slit'];
  const eyes = ['Round', 'Almond', 'Monolid', 'Hooded', 'Wide', 'Cat-eye', 'Closed'];
  const noses = ['Small', 'Big', 'Pointed', 'Button', 'Wide', 'Hawk', 'Flat'];
  const mouths = ['Small', 'Full Lips', 'Thin Lips', 'Wide', 'Smirking', 'Open'];
  
  const hairShapes = ['Straight', 'Wavy', 'Curly', 'Coily', 'Messy Bun', 'Ponytail', 'Braids', 'Bob', 'Spiky', 'Bald', 'Mohawk'];
  const hairLengths = ['Bald', 'Short', 'Ear Length', 'Chin Length', 'Shoulder Length', 'Mid-Back', 'Waist Length', 'Floor Length'];
  const hairColors = ['Black', 'Brown', 'Blonde', 'Red', 'Auburn', 'White', 'Grey', 'Silver', 'Blue', 'Pink', 'Purple', 'Green', 'Multicolor', 'Pastel'];

  const bodyShapes = ['Hourglass', 'Pear', 'Apple', 'Rectangle', 'Inverted Triangle', 'Athletic', 'Muscular', 'Slim', 'Plus Size', 'Chubby'];
  const heights = ['Short', 'Below Average', 'Average', 'Above Average', 'Tall', 'Very Tall', 'Giant'];
  const sizes = ['Small', 'Medium', 'Large', 'Extra Large', 'Flat', 'Voluptuous'];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      
      {/* Left Sidebar: Inputs */}
      <div className="w-full md:w-1/2 lg:w-5/12 xl:w-1/3 border-r border-slate-800 flex flex-col h-screen overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/95 backdrop-blur z-10">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            CharGen Pro
          </h1>
          <p className="text-xs text-slate-500 mt-1">AI Character Generator (Ratio 3:4)</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          
          <Section title="0. Gaya & Latar (Utama)" defaultOpen={true}>
            <SelectGroup label="Gaya Seni (Art Style)" name="artStyle" value={params.artStyle} onChange={handleInputChange} options={artStyles} />
            <div className="grid grid-cols-2 gap-4">
               <SelectGroup label="Latar Belakang" name="background" value={params.background} onChange={handleInputChange} options={backgrounds} />
               <SelectGroup label="Pose" name="pose" value={params.pose} onChange={handleInputChange} options={poses} />
            </div>
          </Section>

          <Section title="1. Identitas & Fisik Dasar">
            <div className="grid grid-cols-2 gap-4">
                <SelectGroup label="Ras" name="race" value={params.race} onChange={handleInputChange} options={races} />
                <SelectGroup label="Warna Kulit" name="skinColor" value={params.skinColor} onChange={handleInputChange} options={skinColors} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <InputGroup label="Umur" name="age" value={params.age} onChange={handleInputChange} type="number" placeholder="20" />
                <SelectGroup label="Tinggi Badan" name="height" value={params.height} onChange={handleInputChange} options={heights} />
            </div>
            <SelectGroup label="Bentuk Badan" name="bodyShape" value={params.bodyShape} onChange={handleInputChange} options={bodyShapes} />
            <InputGroup label="Detail Badan (Tato/Luka/dll)" name="bodyDetails" value={params.bodyDetails} onChange={handleInputChange} type="textarea" placeholder="Ex: Bertato naga di lengan, otot terdefinisi..." />
          </Section>

          <Section title="2. Wajah & Kepala">
            <div className="grid grid-cols-2 gap-4">
              <SelectGroup label="Bentuk Wajah" name="faceShape" value={params.faceShape} onChange={handleInputChange} options={faceShapes} />
              <SelectGroup label="Bentuk Alis" name="eyebrows" value={params.eyebrows} onChange={handleInputChange} options={eyebrows} />
            </div>
            <InputGroup label="Detil Wajah Khusus" name="faceDetails" value={params.faceDetails} onChange={handleInputChange} type="textarea" placeholder="Ex: Tahi lalat di pipi, lesung pipi..." />
            
            <div className="grid grid-cols-2 gap-4">
               <SelectGroup label="Bentuk Mata" name="eyes" value={params.eyes} onChange={handleInputChange} options={eyes} />
               <SelectGroup label="Bentuk Hidung" name="nose" value={params.nose} onChange={handleInputChange} options={noses} />
            </div>
            <SelectGroup label="Bentuk Mulut" name="mouth" value={params.mouth} onChange={handleInputChange} options={mouths} />
          </Section>

          <Section title="3. Rambut">
            <div className="grid grid-cols-2 gap-4">
              <SelectGroup label="Gaya Rambut" name="hairShape" value={params.hairShape} onChange={handleInputChange} options={hairShapes} />
              <SelectGroup label="Panjang" name="hairLength" value={params.hairLength} onChange={handleInputChange} options={hairLengths} />
            </div>
            <SelectGroup label="Warna Rambut" name="hairColor" value={params.hairColor} onChange={handleInputChange} options={hairColors} />
          </Section>

          <Section title="4. Ukuran Tubuh (Estimasi)">
            <div className="grid grid-cols-3 gap-3">
              <SelectGroup label="Dada" name="chest" value={params.chest} onChange={handleInputChange} options={sizes} />
              <SelectGroup label="Pinggang" name="waist" value={params.waist} onChange={handleInputChange} options={sizes} />
              <SelectGroup label="Pinggul" name="hips" value={params.hips} onChange={handleInputChange} options={sizes} />
            </div>
          </Section>

          <Section title="5. Outfit (Pakaian)">
            <InputGroup 
              label="Prompt Outfit" 
              name="outfit" 
              value={params.outfit} 
              onChange={handleInputChange} 
              type="textarea" 
              placeholder="Kosongkan untuk default: Tanktop putih ketat & denim short" 
            />
            <p className="text-xs text-slate-500 italic mt-1">
              {params.outfit ? 'Custom outfit aktif' : 'Default: Tanktop putih ketat + Denim Short'}
            </p>
          </Section>

          <div className="h-20"></div> {/* Spacer for fixed bottom bar */}
        </div>

        {/* Sticky Action Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 absolute bottom-0 w-full backdrop-blur">
          {!apiKeyReady ? (
            <button
              onClick={handleApiKeySelection}
              className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 8a6 6 0 11-12 0 6 6 0 0112 0zm-6-3a1 1 0 100 2 1 1 0 000-2zm-2 4a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
              </svg>
              Pilih API Key (Wajib)
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-3 font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2
                ${loading 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-blue-500/25'
                }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'GENERATE CHARACTER'
              )}
            </button>
          )}
          
          <div className="mt-2 text-center text-[10px] text-slate-600">
             Powered by Gemini 2.5 Flash • <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-slate-400">Billing Info</a>
          </div>
        </div>
      </div>

      {/* Right Content: Preview */}
      <div className="w-full md:w-1/2 lg:w-7/12 xl:w-2/3 bg-slate-950 flex flex-col items-center justify-center p-8 relative min-h-[500px] overflow-y-auto">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        {error && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg max-w-md text-center z-20 backdrop-blur-md">
            <strong className="block font-semibold mb-1">Error</strong>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {generatedImage ? (
           <div className="relative z-10 animate-in zoom-in duration-500 w-full max-w-[500px] flex flex-col items-center gap-6 my-auto">
             <div className="rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-900 w-full relative group">
                <img 
                  src={generatedImage} 
                  alt="Generated Character" 
                  className="w-full h-auto object-contain"
                  style={{ aspectRatio: '3/4' }}
                />
                <a 
                  href={generatedImage} 
                  download={`char-gen-${Date.now()}.png`}
                  className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                  title="Download Image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
             </div>

             {/* Prompt Display Box */}
             {lastPrompt && (
               <div className="w-full bg-slate-900/90 border border-slate-800 rounded-lg p-4 backdrop-blur-sm shadow-xl">
                 <div className="flex items-center justify-between mb-2">
                   <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                     Prompt Used
                   </h3>
                   <span className="text-[10px] text-slate-500">Gemini 2.5 Flash</span>
                 </div>
                 <div className="text-xs text-slate-400 font-mono bg-black/40 p-3 rounded-md border border-slate-800/50 max-h-32 overflow-y-auto whitespace-pre-wrap leading-relaxed custom-scrollbar">
                   {lastPrompt}
                 </div>
               </div>
             )}
           </div>
        ) : (
          <div className="text-center z-10 opacity-40 select-none">
            {loading ? (
               <div className="flex flex-col items-center gap-4">
                 <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-lg font-light tracking-wide animate-pulse">Meracik elemen...</p>
               </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-32 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center">
                   <span className="text-slate-600 text-4xl">+</span>
                </div>
                <p className="text-xl font-light tracking-wider text-slate-500">
                  Hasil gambar akan muncul di sini
                </p>
                <p className="text-sm text-slate-600">Ratio 3:4 High Quality</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;