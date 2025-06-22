import React, { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

const Cam = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameId = useRef(null);
  const [gazeStatus, setGazeStatus] = useState("Loading...");

  const getAverageY = (landmarks, indices) =>
    indices.reduce((sum, i) => sum + landmarks[i].y, 0) / indices.length;

  const isLookingDown = (landmarks) => {
    const eyeY = getAverageY(landmarks, [33, 133]); // Approximate left + right eye centers
    const noseY = landmarks[1].y;
    const chinY = landmarks[152].y;

    const eyeToChin = chinY - eyeY;
    const eyeToNose = noseY - eyeY;
    const ratio = eyeToNose / eyeToChin;

    console.log(ratio);

    return ratio > 0.5; // Tune threshold based on tests
  };

  useEffect(() => {
    const initCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    };

    const loadFaceLandmarker = async () => {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );
      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          runningMode: "VIDEO",
          numFaces: 1,
        }
      );
    };

    const startDetection = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const canvasCtx = canvasRef.current.getContext("2d");
      const drawUtils = new DrawingUtils(canvasCtx);

      const detect = async () => {
        if (!faceLandmarkerRef.current) return;

        const detections = await faceLandmarkerRef.current.detectForVideo(
          videoRef.current,
          performance.now()
        );

        canvasCtx.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        // Mirror both video and landmarks
        canvasCtx.save();
        canvasCtx.scale(-1, 1);
        canvasCtx.translate(-canvasRef.current.width, 0);

        // Draw video
        canvasCtx.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        if (detections.faceLandmarks.length > 0) {
          const landmarks = detections.faceLandmarks[0];
          drawUtils.drawConnectors(
            landmarks,
            FaceLandmarker.FACE_LANDMARKS_TESSELATION,
            {
              color: "#00FF00",
              lineWidth: 1,
            }
          );

          // Gaze logic still based on original landmark coordinates
          const lookingDown = isLookingDown(landmarks);
          setGazeStatus(lookingDown ? "Looking Down" : "Looking Forward");
        }

        canvasCtx.restore(); // Restore non-mirrored state

        animationFrameId.current = requestAnimationFrame(detect);
      };

      detect();
    };

    (async () => {
      await initCamera();
      await loadFaceLandmarker();
      startDetection();
    })();

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <p style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{gazeStatus}</p>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{
          border: "1px solid black",
          transform: "scaleX(1)", // mirror
        }}
      />
    </div>
  );
};

export default Cam;
