"use client";

import { useQuery } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import Typography from "../../components/Typography";
import { getDrawings } from "../../helpers/queries/index.client";
import Card from "../Card";

export default function DrawingsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["getDrawings"],
    queryFn: () => getDrawings(),
  });

  return (
    <>
      {isLoading ? (
        <FaSpinner size={40} className="spinner-icon animate-spin" />
      ) : data?.data?.length ? (
        data?.data?.map((drawing: any, i: number) => (
          <Card item={drawing?.drawing} key={i} />
        ))
      ) : (
        <Typography h3> No drawings found</Typography>
      )}
    </>
  );
}
