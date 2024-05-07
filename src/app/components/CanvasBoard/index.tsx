"use client";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { BsBrush } from "react-icons/bs";
import { FaSpinner } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa6";
import { RiEraserLine, RiRectangleLine, RiTriangleLine } from "react-icons/ri";
import useCanvasTool from "../../helpers/hooks/useCanvas";
import { getDrawingById } from "../../helpers/queries/index.client";
import Input from "../Input";
import InputColors from "../InputColor";
import InputRowSelect from "../InputRowSelect";
import InputToggle from "../InputToggle";
import NextLink from "../NextLink";
import Typography from "../Typography";

export default function CanvasBoard({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["getDrawingById", id],
    queryFn: () => getDrawingById(id),
  });

  const methods = useForm({
    defaultValues: {
      width: 2,
      tool: "brush",
      color: "#0f1615",
      fill: false,
    },
  });

  const { watch } = methods;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { isLoading: isCanvasLoading } = useCanvasTool({
    watch,
    canvasRef,
    url: data?.data?.url,
    id,
  });

  useEffect(() => {
    if (!isCanvasLoading) {
      handleCenter();
    }
  }, [isCanvasLoading]);

  const handleCenter = () => {
    if (containerRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.scrollIntoView({
        block: "center",
        inline: "center",
      });
    }
  };

  return (
    <div ref={containerRef} className={`bg-white cursor-crosshair relative`}>
      {(isLoading || isCanvasLoading) && (
        <FaSpinner
          size={100}
          className="spinner-icon animate-spin fixed m-auto left-0 right-0 top-0 bottom-0"
        />
      )}
      <>
        <div className="fixed left-4 top-4 ">
          <Typography p>{data?.data?.name}</Typography>
          <NextLink href={`/drawings`}>Go Back</NextLink>
        </div>
        <div className="flex justify-between align-center gap-4 z-10 fixed right-4 top-4 bg-background rounded-lg">
          <FormProvider {...methods}>
            <form className="flex flex-col p-4 gap-4 cursor-default">
              <InputRowSelect
                label="Tool"
                name="tool"
                select={[
                  {
                    label: "Brush",
                    value: "brush",
                    content: <BsBrush />,
                  },
                  {
                    label: "Eraser",
                    value: "eraser",
                    content: <RiEraserLine />,
                  },
                  {
                    label: "Rectangle",
                    value: "rectangle",
                    content: <RiRectangleLine />,
                  },
                  {
                    label: "Triangle",
                    value: "triangle",
                    content: <RiTriangleLine />,
                  },
                  {
                    label: "Circle",
                    value: "circle",
                    content: <FaRegCircle />,
                  },
                ]}
              />
              <Input label="Size" name="width" type="range" />
              <InputColors
                label="Color"
                name="color"
                colorOptions={[
                  "#0f1615",
                  "#457b9d",
                  "#9999cc",
                  "#cc3f00",
                  "#006885",
                  "#a3c293",
                ]}
              />
              <InputToggle label="Fill" name="fill" />
            </form>
          </FormProvider>
        </div>
        <canvas
          width="4000"
          height="4000"
          className="bg-white"
          style={{
            display: "block",
            margin: "auto",
            touchAction: "none",
          }}
          ref={canvasRef}
        ></canvas>
      </>
    </div>
  );
}
