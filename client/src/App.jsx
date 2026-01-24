import React from 'react'
import { useState } from 'react';
import { ArrowRight } from 'lucide-react'
import SpeedGauge from './SpeedGauge';




const App = () => {
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);
  const [ping, setPing] = useState(0);
  const [loading, setLoading] = useState({
    download: false,
    upload: false,
    ping: false
  });


  // ping
  const measureping = async () => {
    try {
      setLoading(l => ({ ...l, ping: true }));

      const ROUNDS = 8;
      let latencies = [];

      for (let i = 0; i < ROUNDS; i++) {
        const start = performance.now();
        await fetch('/api/ping', { cache: 'no-store' });
        const latency = performance.now() - start;

        latencies.push(latency);

        // Progressive average
        const avg =
          latencies.reduce((a, b) => a + b, 0) / latencies.length;

        setPing(Math.round(avg));

        // Small delay for UI smoothness
        await new Promise(r => setTimeout(r, 200));
      }

    } catch (err) {
      console.error('Ping test failed', err);
    } finally {
      setLoading(l => ({ ...l, ping: false }));
    }
  };

  //  download
  const measuredownload = async () => {
    try {
      setLoading(l => ({ ...l, download: true }));

      const ITERATIONS = 6;
      let speeds = [];

      for (let i = 0; i < ITERATIONS; i++) {
        const start = performance.now();

        const response = await fetch('/api/download', {
          cache: 'no-store'
        });

        const blob = await response.blob();
        const end = performance.now();

        const bits = blob.size * 8;
        const seconds = (end - start) / 1000;
        const mbps = bits / seconds / 1_000_000;

        speeds.push(mbps);

        // Progressive average (smooth animation)
        const avg =
          speeds.reduce((a, b) => a + b, 0) / speeds.length;

        const scaledSpeed = avg * 100;
        setDownload(Number(scaledSpeed.toFixed(2)));


        // Small delay to let UI breathe
        await new Promise(r => setTimeout(r, 300));
      }

    } catch (error) {
      console.error('Download failed', error);
    } finally {
      setLoading(l => ({ ...l, download: false }));
    }
  };

  //upload
  const measureupload = async () => {
    try {
      setLoading(l => ({ ...l, upload: true }));

      const ITERATIONS = 6;
      const data = new Blob([new Uint8Array(25 * 1024 * 1024)]); // 25 MB

      let speeds = [];

      for (let i = 0; i < ITERATIONS; i++) {
        const start = performance.now();

        await fetch('/api/upload', {
          method: 'POST',
          body: data,
          cache: 'no-store'
        });

        const end = performance.now();

        const bits = data.size * 8;
        const seconds = (end - start) / 1000;
        const mbps = bits / seconds / 1_000_000;

        speeds.push(mbps);

        // Progressive average (smooth gauge)
        const avg =
          speeds.reduce((a, b) => a + b, 0) / speeds.length;
        const capped = Math.min(avg, 100); // cap at 100 Mbps
        setUpload(Number(capped.toFixed(2)));

        setUpload(Number(avg.toFixed(2)));

        // UI breathing space
        await new Promise(r => setTimeout(r, 300));
      }

    } catch (error) {
      console.error('Upload failed', error);
    } finally {
      setLoading(l => ({ ...l, upload: false }));
    }
  };

  return (
    <div className='bg-linear-to-b from-white to-gray-100 h-screen w-full'>
      <div className="px-4 sm:px-20 xl:px-32  flex flex-col justify-center items-center ">

        <img
          src="/speed.png"
          alt="speed icon"
          className="w-16 mt-5 sm:w-24  cursor-pointer"
        />

        <h1 className="text-red-600 text-5xl font-extrabold">
          Internet Speed Test
        </h1>

        <p className="text-gray-600 mt-5 text-3xl font-bold">
          Your Internet Speed is:
        </p>


      </div>

        {/* download */}
      <div className=' mt-10 px-4  flex flex-wrap justify-center gap-25 text-gray-600 max-w-7xl mx-auto'>

        <div className='flex justify-center flex-col gap-4'>
          <SpeedGauge
            label="Download"
            value={download}
            unit="Mbps"
            color="#6366f1"
            max={30}
          />
          <button
            onClick={measuredownload}
            disabled={loading.download}
            className="
          px-6 py-3 rounded-lg bg-indigo-600 text-white max-w-sm mx-auto
          hover:bg-indigo-700 transition
          disabled:opacity-50 cursor-pointer
        "
          >
            {loading.download ? 'Measuring...' : 'Start Download Test'}
          </button>
        </div>

        {/* //upload */}
        <div className='flex justify-center flex-col gap-4'>
          <SpeedGauge
            label="Upload"
            value={upload}
            unit="Mbps"
            color="#16a34a"
            max={2000}
          />
          <button
            onClick={measureupload}
            disabled={loading.upload}
            className="
          px-6 py-3 rounded-lg bg-indigo-600 text-white max-w-sm mx-auto
          hover:bg-indigo-700 transition
          disabled:opacity-50  cursor-pointer
        "
          >
            {loading.upload ? 'Measuring...' : 'Start UploadTest'}
          </button>
        </div>

        {/* Ping */}
        <div className='flex justify-center flex-col gap-4'>
          <SpeedGauge label="Latency (Ping)" value={ping} unit="ms" color="#b45309" max={5000}
          />
          <button
            onClick={measureping}
            disabled={loading.ping}
            className="
          px-6 py-3 rounded-lg bg-indigo-600 text-white max-w-sm mx-auto
          hover:bg-indigo-700 transition
          disabled:opacity-50  cursor-pointer
        "
          >
            {loading.ping ? 'Measuring...' : 'Start Ping Test'}
          </button>
        </div>

      </div>


      {/* Blue Info Section */}
      <div className="mt-16">
        <div className=" bg-blue-200 max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-4 rounded-lg flex flex-col  items-center  gap-2 text-yellow-700 text-sm sm:text-base lg:text-lg text-center " >
          <p>For Attendees: Download: 5Mbps or greater</p>
          <p> For Presenters/Organizers: Download AND Upload: 5Mbps or greater </p>
          <p> Latency: 0–150ms = Good, 150–400ms = OK, &gt;400ms = Poor </p>
        </div>
      </div>

    </div>

  );
};

export default App;



