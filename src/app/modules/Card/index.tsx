import React from "react";
import CustomImage from "../../components/CustomImage";
import NextLink from "../../components/NextLink";

interface CardProps {
  item: {
    id: number;
    url: string;
    name: string;
    blurDataURL: string;
  };
}

const Card: React.FC<CardProps> = ({ item }) => {
  return (
    <NextLink
      className="bg-white rounded-lg shadow-primary p-4"
      href={`/editor/${item.id}`}
      scroll={false}
    >
      <div>
        <div className="h-[300px] w-auto rounded-xl relative overflow-hidden">
          <CustomImage
            src={
              item.url
                ? "/api/assets/" + item.url.replace("canvas/", "")
                : "/images/drawingPlaceholder.jpg"
            }
            alt={item.name}
            sizes="400px"
            blurDataURL={item?.blurDataURL}
            className="object-cover"
            fill={true}
            loading={"lazy"}
            placeholder="blur"
          />
        </div>
        <h2 className="text-xl font-semibold mt-8">{item.name}</h2>
      </div>
    </NextLink>
  );
};

export default Card;
