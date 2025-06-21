import React, { useRef, useEffect, useState } from "react";

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [direction, setDirection] = useState("Loading...");

  useEffect(() => {
    if (!window.FaceMesh || !window.Camera) {
      console.error("MediaPipe not loaded.");
      return;
    }

    const faceMesh = new window.FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (
        !results.multiFaceLandmarks ||
        results.multiFaceLandmarks.length === 0
      ) {
        ctx.restore();
        return;
      }

      const landmarks = results.multiFaceLandmarks[0];

      // Draw green dots
      ctx.fillStyle = "lime";
      for (const point of landmarks) {
        const x = point.x * canvas.width;
        const y = point.y * canvas.height;

        if (x >= 0 && y >= 0 && x <= canvas.width && y <= canvas.height) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
          ctx.fill();
        }
      }

      // Head direction detection
      const noseY = landmarks[1].y;
      const chinY = landmarks[152].y;
      const foreheadY = landmarks[10].y;

      const noseToChin = chinY - noseY;
      const noseToForehead = noseY - foreheadY;
      const ratio = noseToForehead / noseToChin;

      if (ratio > 0.6) setDirection("Looking Up");
      else if (ratio < 0.4) setDirection("Looking Down");
      else setDirection("Looking Straight");

      ctx.restore();
    });

    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });

    camera.start();

    return () => {
      camera.stop();
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <div
        style={{
          position: "relative",
          width: "640px",
          height: "480px",
          margin: "0 auto",
        }}
      >
        <video
          ref={videoRef}
          width="640"
          height="480"
          autoPlay
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: "scaleX(-1)",
            zIndex: 1,
          }}
        />
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: "scaleX(-1)",
            zIndex: 2,
          }}
        />
      </div>
      <h2>{direction}</h2>
    </div>
  );
};

export default Camera;
