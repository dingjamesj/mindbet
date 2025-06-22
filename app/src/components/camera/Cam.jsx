import React, { useRef, useEffect } from "react";
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
        // Loads from CDN
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
      );
      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          },
          outputFaceBlendshapes: false,
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
        canvasCtx.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        if (detections.faceLandmarks) {
          for (const landmarks of detections.faceLandmarks) {
            drawUtils.drawConnectors(
              landmarks,
              FaceLandmarker.FACE_LANDMARKS_TESSELATION,
              {
                color: "#00FF00",
                lineWidth: 1,
              }
            );
          }
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
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ border: "1px solid black" }}
      />
    </div>
  );
};

export default Cam;
