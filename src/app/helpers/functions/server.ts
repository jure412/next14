import fs from "fs";
import path from "path";

export const saveBase64ImageToFile = (
  base64Image: string,
  id: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const matches = base64Image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

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

export function iteratorToStream(iterator: any) {
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
}

export async function* nodeStreamToIterator(stream: fs.ReadStream) {
  for await (const chunk of stream) {
    yield new Uint8Array(chunk);
  }
}
