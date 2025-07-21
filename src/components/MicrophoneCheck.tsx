import React, { useEffect, useRef, useState } from 'react';

const THRESHOLD = 0.02; // עוצמה מינימלית לזיהוי קול

const MicrophoneCheck: React.FC = () => {
  const [active, setActive] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const startMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        audioContextRef.current = new window.AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

        const checkVolume = () => {
          if (cancelled) return;
          analyserRef.current!.getByteTimeDomainData(dataArray);
          // נורמליזציה
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            const v = (dataArray[i] - 128) / 128;
            sum += v * v;
          }
          const volume = Math.sqrt(sum / dataArray.length);
          setActive(volume > THRESHOLD);
          animationFrameRef.current = requestAnimationFrame(checkVolume);
        };

        checkVolume();
      } catch (err) {
        setActive(false);
      }
    };

    startMic();

    return () => {
      cancelled = true;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          display: 'inline-block',
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: active ? '#4caf50' : '#bbb',
          border: '2px solid #333',
          transition: 'background 0.2s'
        }}
        title={active ? 'המיקרופון קולט קול' : 'המיקרופון שקט'}
      />
      <span style={{ fontSize: 14 }}>
        {active ? 'המיקרופון קולט קול' : 'המיקרופון שקט'}
      </span>
    </div>
  );
};

export default MicrophoneCheck;