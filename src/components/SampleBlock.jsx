import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function SampleBlock(props) {
  const waveformRef = useRef(null)
  const waveSurfer = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false);
  const {sampleData} = props

  useEffect(() => {
    // Initialize WaveSurfer when component mounts
    waveSurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ddd',
        progressColor: '#baf71e',
        cursorColor: '#242424',
        cursorWidth: 1,
        height: 50,
        responsive: true,
        barWidth: 1
    });

    // Load the sample file into WaveSurfer
    waveSurfer.current.load(sampleData.previews['preview-lq-mp3']); // Use the low-quality preview mp3

    //turns off pause button when finished.
    waveSurfer.current.on('finish', () => {
      setIsPlaying(false);
    })

    //if the user seeks (clicks) on the wave surfer than it will start playing
    waveSurfer.current.on('seeking', () => {
      if (!isPlaying) {
        waveSurfer.current.play(); // Play if it's not already playing
        setIsPlaying(true); // Update the play state
      }
    });

    return () => {
        // Clean up WaveSurfer instance when component unmounts
        if (waveSurfer.current) {
            waveSurfer.current.destroy();
        }
    };
  }, [sampleData]); 

  //toggles playback
  const togglePlay = () => {
    if (waveSurfer.current) {
        waveSurfer.current.playPause();
        setIsPlaying(!isPlaying);
    }
  }

  function handleDownload(url, fileName){
    fetch(url)
      .then (response => response.blob())
      .then (blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(error => console.log('download failed', error))
  }

  return (
    <div className="sample-block">
        <h3>{sampleData.name}</h3>
        <div ref={waveformRef} className="waveform" />
        <button onClick={togglePlay}>
            {isPlaying ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}
        </button>
        <button onClick={() => handleDownload(sampleData.previews['preview-hq-mp3'], sampleData.name)}><i className="fa-solid fa-download"></i></button>
    </div>
  )
}
