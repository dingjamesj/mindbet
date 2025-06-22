import React, { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

const Cam = ({ onGazeChange }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationFrameId = useRef(null);
  const lastRunTimeRef = useRef(0); // NEW: to throttle detection
  const [gazeStatus, setGazeStatus] = useState("Loading...");
  const prevGaze = useRef(null);
  const recentRatios = useRef([]);

  const SMOOTHING_WINDOW = 5;
  const GAZE_THRESHOLD = 0.4;
  const DETECTION_INTERVAL = 150; // milliseconds

  const getAverageY = (landmarks, indices) =>
    indices.reduce((sum, i) => sum + landmarks[i].y, 0) / indices.length;

  const getGazeRatio = (landmarks) => {
    const eyeY = getAverageY(landmarks, [33, 133]);
    const noseY = landmarks[1].y;
    const chinY = landmarks[152].y;
    const eyeToChin = chinY - eyeY;
    const eyeToNose = noseY - eyeY;
    return eyeToNose / eyeToChin;
  };

  const isLookingDownSmoothed = (newRatio) => {
    recentRatios.current.push(newRatio);
    if (recentRatios.current.length > SMOOTHING_WINDOW) {
      recentRatios.current.shift();
    }
    const avgRatio =
      recentRatios.current.reduce((sum, r) => sum + r, 0) /
      recentRatios.current.length;
    console.log("avgRatio:", avgRatio.toFixed(3));
    return avgRatio > GAZE_THRESHOLD;
  };

  useEffect(() => {
    const initCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        return new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch((err) => {
              console.warn("Video play failed:", err);
            });
            resolve();
          };
        });
      }
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
        const now = performance.now();

        if (
          faceLandmarkerRef.current &&
          videoRef.current &&
          now - lastRunTimeRef.current > DETECTION_INTERVAL
        ) {
          const detections = await faceLandmarkerRef.current.detectForVideo(
            videoRef.current,
            now
          );
          lastRunTimeRef.current = now;

          canvasCtx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );

          canvasCtx.save();
          canvasCtx.scale(-1, 1);
          canvasCtx.translate(-canvasRef.current.width, 0);

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

            const ratio = getGazeRatio(landmarks);
            const lookingDown = isLookingDownSmoothed(ratio);
            setGazeStatus(lookingDown ? "Looking Down" : "Looking Forward");

            if (lookingDown !== prevGaze.current) {
              prevGaze.current = lookingDown;
              if (typeof onGazeChange === "function") {
                onGazeChange(lookingDown);
              }
            }
          }

          canvasCtx.restore();
        }

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
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
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
          transform: "scaleX(1)",
        }}
      />
    </div>
  );
};

export default Cam;
