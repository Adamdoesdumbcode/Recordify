let mediaRecorder;
let recordedChunks = [];

// Get buttons and video element
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const recordedVideo = document.getElementById('recordedVideo');
const downloadBtn = document.getElementById('downloadBtn');
const testMicBtn = document.getElementById('testMicBtn');
const testSpeakersBtn = document.getElementById('testSpeakersBtn');
const audioTest = document.getElementById('audioTest');

// Start recording
startBtn.addEventListener('click', async () => {
    // Get audio from microphone
    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Get video from screen
    const videoStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true // Include audio from the display media
    });

    // Combine audio tracks
    const combinedStream = new MediaStream([
        ...audioStream.getTracks(), // Microphone audio
        ...videoStream.getTracks()   // Screen audio
    ]);

    mediaRecorder = new MediaRecorder(combinedStream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm'
        });
        const url = URL.createObjectURL(blob);
        recordedVideo.src = url;
        recordedVideo.controls = true;

        // Update the download link
        downloadBtn.href = url;
        downloadBtn.style.display = 'inline-block'; // Show the download button
        downloadBtn.innerText = 'Download Recording';
    };

    mediaRecorder.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    recordedChunks = []; // Clear previous recordings
});

// Stop recording
stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
});

// Test Microphone
testMicBtn.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            chunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
        alert("Mic test recorded. You should hear it playing now.");
    };

    mediaRecorder.start();
    setTimeout(() => {
        mediaRecorder.stop();
    }, 2000); // Record for 2 seconds
});

// Test Speakers
testSpeakersBtn.addEventListener('click', () => {
    audioTest.play();
    alert("You should hear a test tone playing now.");
});
