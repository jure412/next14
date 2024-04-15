import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  Response.json({
    success: true,
    msg: ["good"],
  });
  //   try {
  //     const { user } = await validateRequest();
  //     if (user) {
  //       NextResponse.json({
  //         success: true,
  //         msg: ["good"],
  //         data: user,
  //       });
  //     }
  //     NextResponse.json({
  //       success: false,
  //       msg: ["Unauthorized."],
  //     });
  //   } catch (error: any) {
  //     return NextResponse.json({ msg: [error?.message], success: false });
  //   }
};
// export const VerifyUser = async () => {
//   try {
//     const { user } = await validateRequest();
//     if (user) {
//       return {
//         success: true,
//         msg: ["good"],
//         data: user,
//       };
//     }
//     return {
//       success: false,
//       msg: ["Unauthorized."],
//     };
//   } catch (error: any) {
//     return { msg: [error?.message], success: false };
//   }
// };
