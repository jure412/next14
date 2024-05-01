"use client";

import { drawLine } from "@/app/helpers/functions/client";
import { useDraw } from "@/app/helpers/hooks/useDraw";
import { getDrawingById } from "@/app/helpers/queries/index.client";
import { socket } from "@/socket";
import { useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { saveDrawings } from "../../actions/drawing";
import Button from "../Button";
import { ButtonVariant } from "../Button/index.types";
import Typography from "../Typography";
import { Draw, DrawLineProps } from "./index.types";

const CanvasBoard = ({ id }: { id: string }) => {
  const { push } = useRouter();
  const { data, isLoading, isFetched } = useQuery({
    queryKey: ["getDrawingById", id],
    queryFn: () => getDrawingById(id),
  });
  const { canvasRef, onMouseDown, clear } = useDraw(createLine);
  const color = "#000";

  async function save() {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL();
      const formData = new FormData();
      formData.append("drawingId", data?.data?.id);
      formData.append("canvas", dataUrl);
      await saveDrawings(formData);
    }
  }

  const debounceOnChange = debounce(() => {
    save();
  }, 500);

  function createLine(_drawing: Draw) {
    socket.emit("drawing-line", data?.data?.id, _drawing);
    drawLine({ ..._drawing, color });
    debounceOnChange();
  }

  async function clearBoard() {
    socket.emit("clear", data?.data?.id);
    debounceOnChange();
    clear();
  }

  useEffect(() => {
    if (isFetched && !data?.success) {
      toast.error(data?.msg[0]);
      push("/drawings");
    }
  }, [isFetched, data, push]);

  useEffect(() => {
    function canvasState() {
      const state =
        process.env.NEXTAUTH_URL +
        "/api/assets/" +
        data?.data?.url.replace("canvas/", "") +
        "?=" +
        new Date().getTime();
      const ctx = canvasRef.current?.getContext("2d");
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    }
    if (data?.success) {
      const ctx = canvasRef.current?.getContext("2d");
      data?.data?.url && canvasState();

      socket.emit("join-room", data?.data?.id);

      socket.on("user-joined", () => {
        save();
      });

      socket.on(
        "drawing-line",
        ({ prevPoint, currentPoint, color }: DrawLineProps) => {
          if (!ctx) return console.log("no ctx here");
          drawLine({ prevPoint, currentPoint, ctx, color });
        }
      );

      socket.on("clear", clear);

      return () => {
        socket.off("drawing-line");
        socket.off("clear");
      };
    }
  }, [canvasRef, data, clear]);

  return (
    <div>
      <div className="flex justify-between align-center my-8 gap-4">
        <Button
          variant={ButtonVariant.DANGER}
          loading={isLoading}
          onClick={clearBoard}
        >
          Clear
        </Button>
        {isLoading ? (
          <div className="">
            <FaSpinner size={20} className="spinner-icon animate-spin mt-3" />
          </div>
        ) : (
          <Typography h3>{data?.data?.name}</Typography>
        )}
      </div>
      <div
        style={{
          height: "80dvh",
        }}
        className="w-full overflow-auto bg-white relative rounded-lg"
      >
        {isLoading ? (
          <div className="absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2">
            <FaSpinner size={100} className="spinner-icon animate-spin" />
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            onMouseDown={onMouseDown}
            width={1492}
            height={1512}
          />
        )}
      </div>
    </div>
  );
};

export default CanvasBoard;
