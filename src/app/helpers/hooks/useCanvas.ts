import { UseMutateFunction } from "@tanstack/react-query";
import { debounce, forEach } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { UseFormWatch } from "react-hook-form";
import { toast } from "react-toastify";
import short from "short-uuid";
import { socket } from "../../../socket";

interface CanvasToolProps {
  watch: UseFormWatch<WatchProps>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  url: string;
  id: string;
  meId: string;
  mutate: UseMutateFunction<any, unknown, FormData, unknown>;
}

interface WatchProps {
  tool: string;
  width: number;
  color: string;
  fill: boolean;
}

interface CustomCanvasContext extends CanvasRenderingContext2D {
  isFilled?: boolean;
  tool?: string;
  prevMouseX?: number | null;
  prevMouseY?: number | null;
  isDrawing?: boolean;
  snapshot?: any | null;
  drawingId?: string;
}

const useCanvasTool = ({
  watch,
  canvasRef,
  url,
  id,
  meId,
  mutate,
}: CanvasToolProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [startSyncing, setStartSyncing] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const selectedTool = watch("tool");
  const brushWidth = watch("width");
  const selectedColor = watch("color");
  const fillColor = watch("fill");

  function save() {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      const formData = new FormData();
      formData.append("drawingId", id);
      formData.append("canvas", dataUrl);
      mutate(formData);
    }
  }

  const debounceSaveOnChange = debounce(() => {
    save();
  }, 500);

  const drawingStart = (
    e: MouseEvent,
    brushWidth: number,
    selectedTool: string,
    selectedColor: string,
    fillColor: boolean
  ) => {
    const ctx = canvasRef.current?.getContext("2d", {
      willReadFrequently: true,
    }) as CustomCanvasContext;
    ctx!.isDrawing = true;
    ctx!.lineWidth = brushWidth;
    ctx!.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx!.fillStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
    ctx!.isFilled = fillColor;
    ctx!.tool = selectedTool;
    ctx!.prevMouseX = e.offsetX;
    ctx!.prevMouseY = e.offsetY;
    ctx!.snapshot = ctx?.getImageData(
      0,
      0,
      ctx?.canvas.width!,
      ctx?.canvas.height!
    );
  };

  const drawing = useCallback(
    (e: MouseEvent) => {
      const ctx = canvasRef.current?.getContext("2d") as CustomCanvasContext;
      if (!ctx) return;
      if (ctx?.tool === "brush" || ctx?.tool === "eraser") {
        drawLine(e);
      } else if (ctx?.tool === "rectangle") {
        drawRect(e);
      } else if (ctx?.tool === "circle") {
        drawCircle(e);
      } else if (ctx?.tool === "triangle") {
        drawTriangle(e);
      }
    },
    [selectedTool, selectedColor, brushWidth, fillColor]
  );

  const drawingEnd = () => {
    const ctx = canvasRef.current?.getContext("2d") as CustomCanvasContext;
    if (!ctx) return;
    ctx.isDrawing = false;
    ctx.prevMouseX = null;
    ctx.prevMouseY = null;
    ctx.snapshot = null;
  };

  const drawLine = (e: MouseEvent) => {
    const ctx = canvasRef.current?.getContext("2d") as CustomCanvasContext;
    if (!ctx.prevMouseX || !ctx.prevMouseY || !ctx.lineWidth) return;
    ctx.beginPath();
    ctx.moveTo(ctx.prevMouseX!, ctx.prevMouseY!);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(
      e.offsetX!,
      e.offsetY!,
      ctx.lineWidth / 2,
      0,
      ctx.lineWidth * Math.PI
    );
    ctx.fill();
    ctx.closePath();
    ctx.prevMouseX = e.offsetX;
    ctx.prevMouseY = e.offsetY;
  };

  const drawRect = (e: MouseEvent) => {
    const ctx = canvasRef.current?.getContext("2d") as CustomCanvasContext;
    if (!ctx.prevMouseX || !ctx.prevMouseY || !ctx.snapshot) return;
    ctx.beginPath();
    ctx.putImageData(ctx.snapshot, 0, 0);
    if (!ctx.isFilled) {
      ctx.strokeRect(
        e.offsetX,
        e.offsetY,
        ctx?.prevMouseX! - e.offsetX,
        ctx?.prevMouseY! - e.offsetY
      );
    } else {
      ctx.fillRect(
        e.offsetX,
        e.offsetY,
        ctx?.prevMouseX! - e.offsetX,
        ctx?.prevMouseY! - e.offsetY
      );
    }
  };

  const drawCircle = (e: MouseEvent) => {
    const ctx = canvasRef.current?.getContext("2d") as CustomCanvasContext;
    if (!ctx.prevMouseX || !ctx.prevMouseY || !ctx.snapshot) return;
    ctx.putImageData(ctx.snapshot, 0, 0);
    ctx.beginPath();
    const radius = Math.sqrt(
      Math.pow(ctx.prevMouseX - e.offsetX, 2) +
        Math.pow(ctx.prevMouseY - e.offsetY, 2)
    );
    ctx.arc(ctx.prevMouseX, ctx.prevMouseY, radius, 0, 2 * Math.PI);
    if (ctx.isFilled) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  };

  const drawTriangle = (e: MouseEvent) => {
    const ctx = canvasRef.current?.getContext("2d") as CustomCanvasContext;
    if (!ctx.prevMouseX || !ctx.prevMouseY || !ctx.snapshot) return;
    ctx.putImageData(ctx.snapshot, 0, 0);
    ctx.beginPath();
    ctx.moveTo(ctx.prevMouseX, ctx.prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(ctx.prevMouseX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    if (ctx.isFilled) {
      ctx.fill();
    } else {
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d") as CustomCanvasContext;
    if (!canvas || isLoading || !startSyncing) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (ctx?.isDrawing) return;
      const drawignId = short.generate();
      ctx.drawingId = drawignId;
      drawingStart(
        e as MouseEvent,
        brushWidth,
        selectedTool,
        selectedColor,
        fillColor
      );
      socket.emit("draw-start", {
        roomId: id,
        drawignId: drawignId,
        offsetX: e.offsetX,
        offsetY: e.offsetY,
        brushWidth,
        selectedTool,
        selectedColor,
        fillColor,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!ctx.isDrawing) return;
      drawing(e);
      socket.emit("drawing", {
        drawignId: ctx.drawingId,
        roomId: id,
        offsetX: e.offsetX,
        offsetY: e.offsetY,
      });
    };

    const mouseUp = () => {
      if (!ctx.isDrawing) return;
      drawingEnd();
      socket.emit("draw-end", { drawignId: ctx.drawingId, roomId: id });
      debounceSaveOnChange();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", mouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", mouseUp);
    };
  }, [drawing, drawingStart, drawingEnd]);

  useEffect(() => {
    if (startSyncing) {
      socket.emit("join-room", { id, meId });
      socket.on("syncing-canvas", (userId, draw) => {
        if (meId != userId) {
          toast.info(`User joined the room.`);
        }
        if (meId === userId) {
          forEach(draw, (d) => {
            drawingStart(
              {
                offsetX: d.drawingStart.offsetX,
                offsetY: d.drawingStart.offsetY,
              } as MouseEvent,
              d.drawingStart.brushWidth,
              d.drawingStart.selectedTool,
              d.drawingStart.selectedColor,
              d.drawingStart.fillColor
            );
            if (d.drawing.length > 0) {
              forEach(d.drawing, (draw) => {
                drawing({
                  offsetX: draw.offsetX,
                  offsetY: draw.offsetY,
                } as MouseEvent);
              });
            }
            d.drawingEnd && drawingEnd();
          });
        }
        setIsConnected(true);
        setIsLoading(false);
      });
      socket.on(
        "draw-start",
        ({
          offsetX,
          offsetY,
          brushWidth,
          selectedTool,
          selectedColor,
          fillColor,
        }) => {
          drawingStart(
            { offsetX, offsetY } as MouseEvent,
            brushWidth,
            selectedTool,
            selectedColor,
            fillColor
          );
        }
      );

      socket.on("drawing", ({ offsetX, offsetY }) => {
        drawing({ offsetX, offsetY } as MouseEvent);
      });

      socket.on("draw-end", () => {
        drawingEnd();
      });

      return () => {
        socket.emit("handle-disconnect", { roomId: id });
        socket.off("syncing-canvas");
        socket.off("join-room");
        socket.off("draw-start");
        socket.off("drawing");
        socket.off("draw-end");
        socket.off("handle-disconnect");
      };
    }
  }, [startSyncing]);

  useEffect(() => {
    const setImage = async (snap?: string) => {
      const ctx = canvasRef.current?.getContext("2d");
      const image = new Image();
      image.src =
        snap ??
        `${process.env.APP_URL}/api/assets/${url.replace(
          "canvas/",
          ""
        )}?=${new Date().getTime()}`;
      image.onload = function () {
        ctx?.drawImage(image, 0, 0);
        setStartSyncing(true);
      };
    };

    const createImage = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      save();
      setStartSyncing(true);
    };

    if (!startSyncing) {
      if (url === "") {
        createImage();
      } else {
        setImage();
      }
      const canvas = canvasRef.current;
      canvas?.scrollIntoView({
        block: "center",
        inline: "center",
      });
    }
  }, [url]);

  return { isLoading, isConnected };
};

export default useCanvasTool;
