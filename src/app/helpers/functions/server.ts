"use server";
import fs from "fs";
import { headers } from "next/headers";
import path from "path";
import { getPlaiceholder } from "plaiceholder";
import { UAParser } from "ua-parser-js";

export const isMobileDevice = async () => {
  if (typeof process === "undefined") {
    throw new Error(
      "[Server method] you are importing a server-only module outside of server"
    );
  }
  const { get } = headers();
  const ua = get("user-agent");

  const device = new UAParser(ua || "").getDevice();

  return device.type === "mobile";
};

export const saveBase64ImageToFile = (
  base64Image: File,
  id: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const base64ImageString = base64Image.toString() as string;

    const matches = base64ImageString.match(
      /^data:([A-Za-z-+/]+);base64,(.+)$/
    );

    if (matches && matches.length === 3) {
      const imageData = matches[2];
      const imagePath = path.join("assets", "canvas", `${id}.png`);
      const directoryPath = path.dirname(imagePath);

      // Create the directory if it doesn't exist
      fs.mkdirSync(directoryPath, { recursive: true });

      fs.writeFile(imagePath, imageData, "base64", (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(imagePath.replace("assets/", ""));
        }
      });
    } else {
      reject(new Error("Invalid base64 image format"));
    }
  });
};

export const iteratorToStream = (iterator: any) => {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();
      if (done) {
        controller.close();
      } else {
        controller.enqueue(value);
      }
    },
  });
};

export async function* nodeStreamToIterator(stream: fs.ReadStream) {
  for await (const chunk of stream) {
    yield new Uint8Array(chunk);
  }
}

export const getBase64 = async (imageUrl: string) => {
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
};

export const addBlurredDataUrls = async (
  data: any,
  nestedProps: string
): Promise<any[]> => {
  const nestedPropsArray = nestedProps.split(".");
  const base64Promises = data.map((item) => {
    const url = item[nestedPropsArray[0]][nestedPropsArray[1]]
      ? item[nestedPropsArray[0]][nestedPropsArray[1]].replace(
          "canvas",
          "/api/assets"
        )
      : null;
    return url ? getBase64(process.env.APP_URL + url) : null;
  });
  const base64Results = await Promise.all(base64Promises);
  const photosWithBlur: any[] = data.map((item, i) => {
    item[nestedPropsArray[0]]["blurDataURL"] = base64Results[i];
    return item;
  });

  return photosWithBlur;
};
