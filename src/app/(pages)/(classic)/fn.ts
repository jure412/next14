import { headers } from "next/headers";
import { getPlaiceholder } from "plaiceholder";

export async function getBase64(imageUrl: string) {
  try {
    const res = await fetch(imageUrl, { headers: headers() });

    if (!res.ok) {
      throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
    }

    const buffer = await res.arrayBuffer();

    const { base64 } = await getPlaiceholder(Buffer.from(buffer));

    return base64;
  } catch (e) {
    if (e instanceof Error) console.log(e.stack);
  }
}

export async function addBlurredDataUrls(
  data: any,
  nestedProps: string
): Promise<any[]> {
  // Make all requests at once instead of awaiting each one - avoiding a waterfall
  const nestedPropsArray = nestedProps.split(".");

  // console.log({
  //   data: data,
  //   nestedPropsArray: nestedPropsArray[0],
  //   dataNested: data[nestedPropsArray[0]],
  // });

  const base64Promises = data.map(
    (item) => {
      const url = item[nestedPropsArray[0]][nestedPropsArray[1]]
        ? item[nestedPropsArray[0]][nestedPropsArray[1]].replace(
            "canvas",
            "/api/assets"
          )
        : "/images/drawingPlaceholder.jpg";
      // console.log({ url: process.env.APP_URL + url });
      return getBase64(process.env.APP_URL + url);
    }
    // getBase64(
    //   process.env.APP_URL +
    //     item[nestedPropsArray[0]][nestedPropsArray[1]].replace("canvas/", "")
    // )
  );

  // // Resolve all requests in order
  const base64Results = await Promise.all(base64Promises);

  // console.log({ base64Results });

  const photosWithBlur: any[] = data.map((item, i) => {
    item[nestedPropsArray[0]]["blurDataURL"] = base64Results[i];
    return item;
  });
  // console.log({ ssasdsddasda: photosWithBlur[0] });

  return photosWithBlur;
}
