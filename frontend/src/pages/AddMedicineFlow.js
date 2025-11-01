// src/pages/AddMedicineFlow.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useReactMediaRecorder } from 'react-media-recorder';
import { FaMicrophone, FaStop, FaUpload, FaCamera } from 'react-icons/fa';

export default function AddMedicineFlow() {
  const [step, setStep] = useState(1); // 1: Photo, 2: Audio, 3: Submitting
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const navigate = useNavigate();

  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleStartRecording = () => {
    setAudioBlob(null); // Clear previous
    startRecording();
  };

  const handleStopRecording = async () => {
    stopRecording();
    // We must fetch the blob to be able to use it
    if (mediaBlobUrl) {
      const blob = await fetch(mediaBlobUrl).then(r => r.blob());
      setAudioBlob(blob);
    }
  };

  const handleSubmit = async () => {
    if (!photo || !audioBlob) {
      alert("Please provide both a photo and a recording.");
      return;
    }
    setStep(3); // Show loading spinner
    
    const formData = new FormData();
    formData.append('photo', photo);
    formData.append('audio', audioBlob, 'instruction.wav');

    try {
      await axios.post('http://localhost:5000/api/medicine/add', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard'); // Success!
    } catch (err) {
      console.error(err);
      alert("Error uploading. Please try again.");
      setStep(2); // Go back to audio step
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      
      {/* Step 1: Photo */}
      {step === 1 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Step 1: Take a photo</h2>
          <label className="flex flex-col items-center px-12 py-16 bg-white text-brand-blue rounded-lg shadow-lg cursor-pointer">
            <FaCamera size={50} />
            <span className="mt-2 text-base leading-normal">Select a photo</span>
            <input type='file' accept="image/*" capture="environment" className="hidden" onChange={handlePhotoChange} />
          </label>
          {photoPreview && (
            <div className="mt-4">
              <img src={photoPreview} alt="Preview" className="w-48 h-48 rounded-lg object-cover mx-auto" />
              <button onClick={() => setStep(2)} className="mt-4 px-6 py-2 bg-brand-green text-black font-bold rounded-full">
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Audio */}
      {step === 2 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Step 2: Record instructions</h2>
          <p className="mb-6 text-gray-600">e.g., "One pill in the morning, two at night"</p>
          
          {status === 'recording' ? (
            <button onClick={handleStopRecording} className="flex flex-col items-center justify-center w-32 h-32 bg-red-500 text-white rounded-full shadow-xl">
              <FaStop size={40} />
              <span>Stop</span>
            </button>
          ) : (
            <button onClick={handleStartRecording} className="flex flex-col items-center justify-center w-32 h-32 bg-brand-blue text-white rounded-full shadow-xl">
              <FaMicrophone size={40} />
              <span>Record</span>
            </button>
          )}

          {mediaBlobUrl && status === 'stopped' && (
            <div className="mt-6">
              <audio src={mediaBlobUrl} controls className="mx-auto" />
              <button onClick={handleSubmit} className="mt-6 px-8 py-3 bg-brand-green text-black font-bold rounded-full text-lg">
                <FaUpload className="inline-block mr-2" />
                Save Medicine
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Loading */}
      {step === 3 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Saving...</h2>
          <p className="mt-2">The AI is learning your schedule.</p>
          {/* Add a nice loading spinner here */}
        </div>
      )}

    </div>
  );
}