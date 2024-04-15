"use server";

export const protectedQuery = async () => {
  try {
    return {
      msg: ["Authorized"],
      success: true,
      data: [{ name: "s", last: "s" }],
    };
  } catch (error: any) {
    return { msg: [error?.message], success: false };
  }
};
