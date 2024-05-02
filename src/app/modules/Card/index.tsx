import React from "react";
import CustomImage from "../../components/CustomImage";
import NextLink from "../../components/NextLink";

interface CardProps {
  item: {
    id: string;
    url: string;
    name: string;
  };
}

const Card: React.FC<CardProps> = ({ item }) => {
  return (
    <NextLink
      className="bg-white rounded-lg shadow-primary p-4"
      href={`/drawings/${item.id}`}
      prefetch
    >
      <div>
        <div className="h-[220px] rounded-xl relative overflow-hidden">
          <CustomImage
            src={
              item.url
                ? "/api/assets/" + item.url.replace("canvas/", "")
                : "/tree.jpg"
            }
            alt={item.name}
            priority={true}
            className="object-cover"
            fill={true}
          />
        </div>
        <h2 className="text-xl font-semibold mt-8">{item.name}</h2>
      </div>
    </NextLink>
  );
};

export default Card;
