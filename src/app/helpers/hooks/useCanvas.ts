"use client";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { saveDrawings } from "../../actions/drawing";

interface CanvasToolProps {
  watch: any;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  url: string;
  id: string;
}

const useCanvasTool = ({ watch, canvasRef, url, id }: CanvasToolProps) => {
  const [prevMouseX, setPrevMouseX] = useState<number | null>(null);
  const [prevMouseY, setPrevMouseY] = useState<number | null>(null);
  const [snapshot, setSnapshot] = useState<ImageData | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const selectedTool = watch("tool");
  const brushWidth = watch("width");
  const selectedColor = watch("color");
  const fillColor = watch("fill");

  async function save() {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      const formData = new FormData();
      formData.append("drawingId", id);
      formData.append("canvas", dataUrl);
      await saveDrawings(formData);
    }
  }

  const debounceSaveOnChange = debounce(() => {
    save();
  }, 500);

  function setImage() {
    // setIsLoading(true);

    const ctx = canvasRef.current?.getContext("2d");
    const image = new Image();
    image.src = `${process.env.NEXTAUTH_URL}/api/assets/${url.replace(
      "canvas/",
      ""
    )}`;
    image.onload = function () {
      ctx?.drawImage(image, 0, 0);
      setIsLoading(false);
    };
  }

  const createImage = async () => {
    // setIsLoading(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    await save();
    setIsLoading(false);
  };

  //save image every 500ms after drawing

  const startDraw = useCallback(
    (e: MouseEvent) => {
      setIsDrawing(true);
      const offsetX = e.offsetX;
      const offsetY = e.offsetY;
      setPrevMouseX(offsetX);
      setPrevMouseY(offsetY);
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.lineWidth = brushWidth;
        ctx.strokeStyle = selectedColor;
        ctx.fillStyle = selectedColor;
        setSnapshot(
          ctx.getImageData(
            0,
            0,
            canvasRef.current!.width,
            canvasRef.current!.height
          )
        );
      }
    },
    [brushWidth, selectedColor]
  );

  const drawing = useCallback(
    (e: MouseEvent) => {
      if (!isDrawing) return;
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || !prevMouseX || !prevMouseY || !snapshot) return;

      ctx.putImageData(snapshot, 0, 0);

      if (selectedTool === "brush" || selectedTool === "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
      } else if (selectedTool === "rectangle") {
        drawRect(e, ctx);
      } else if (selectedTool === "circle") {
        drawCircle(e, ctx);
      } else if (selectedTool === "triangle") {
        drawTriangle(e, ctx);
      }
    },
    [isDrawing, prevMouseX, prevMouseY, snapshot, selectedTool, selectedColor]
  );

  const drawRect = (e: MouseEvent, ctx: CanvasRenderingContext2D) => {
    if (!prevMouseX || !prevMouseY) return;
    if (!snapshot) return;

    if (!fillColor) {
      ctx.strokeRect(
        e.offsetX,
        e.offsetY,
        prevMouseX - e.offsetX,
        prevMouseY - e.offsetY
      );
    } else {
      ctx.fillRect(
        e.offsetX,
        e.offsetY,
        prevMouseX - e.offsetX,
        prevMouseY - e.offsetY
      );
    }
  };

  const drawCircle = (e: MouseEvent, ctx: CanvasRenderingContext2D) => {
    if (!prevMouseX || !prevMouseY) return;
    if (!snapshot) return;

    ctx.beginPath();
    const radius = Math.sqrt(
      Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
    );
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
    if (fillColor) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  };

  const drawTriangle = (e: MouseEvent, ctx: CanvasRenderingContext2D) => {
    if (!prevMouseX || !prevMouseY) return;
    if (!snapshot) return;

    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    if (fillColor) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineWidth = brushWidth;
      ctx.strokeStyle = selectedColor;
      ctx.fillStyle = selectedColor;
    }
  }, [brushWidth, selectedColor, canvasRef]);

  useEffect(() => {
    if (url === "") {
      console.log("create image");
      createImage();
    }
    if (url) {
      console.log("swet image");
      setImage();
    }
  }, [url]);

  const mouseUp = () => {
    debounceSaveOnChange();
    setIsDrawing(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const handleMouseDown = (e: MouseEvent) => startDraw(e);
    const handleMouseMove = (e: MouseEvent) => drawing(e);

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", mouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", mouseUp);
      // setIsLoading(true);
    };
  }, [canvasRef, startDraw, drawing]);

  return { isLoading };
};

export default useCanvasTool;
