"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { FaSpinner } from "react-icons/fa";
import Typography from "../../components/Typography";
import { getDrawings } from "../../helpers/queries/index.client";
import Card from "../Card";
import ScrollToEndComponent from "../ScrollToEndComponent";
const initialPageParam = { skip: 0, take: 24 };
export default function DrawingsList() {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["getDrawings"],
      queryFn: ({ pageParam }) => getDrawings(pageParam),
      initialPageParam: initialPageParam,
      getNextPageParam: (lastParams, allParmas) => {
        const skip = allParmas.length * initialPageParam.take;
        const take = initialPageParam.take;
        let drawingsDisplayed = 0;
        allParmas.forEach(
          (param: any) => (drawingsDisplayed += param.data.length)
        );
        const drawingsLeft = lastParams.count - drawingsDisplayed;
        if (drawingsLeft > 0) {
          return { skip, take };
        }
        return undefined;
      },
    });

  const handleScrollToEndDebouncer = debounce(() => {
    hasNextPage && fetchNextPage();
  }, 500);

  return (
    <>
      {isLoading ? (
        <div className="fixed  inset-0 flex items-center justify-center">
          <FaSpinner size={40} className="spinner-icon animate-spin" />
        </div>
      ) : data?.pages[0].count > 0 ? (
        <ScrollToEndComponent onScrollToEnd={handleScrollToEndDebouncer}>
          {data?.pages?.map((pages: any) =>
            pages?.data.map((drawing: any, i: number) => (
              <Card item={drawing?.drawing} key={i} />
            ))
          )}
          {isFetchingNextPage && (
            <div className="fixed h-14 bottom-0 w-full flex justify-center mt-4">
              <FaSpinner size={40} className="spinner-icon animate-spin" />
            </div>
          )}
        </ScrollToEndComponent>
      ) : (
        <Typography h3> No drawings found</Typography>
      )}
    </>
  );
}
