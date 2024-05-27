import { Config, driver } from "driver.js";
import "driver.js/dist/driver.css";

export const pageTour = ({ isAuth, pathname }) => {
  const homePageSteps = [
    {
      popover: {
        title: "Welcome to the Shit Show",
        description: "Let me walk you through my awesome homepage!",
      },
    },
    {
      element: "#clientUser",
      popover: {
        title: "Welcome Component",
        description: `This section changes a bit depending on if you're logged in. Right now, you are ${
          isAuth ? "" : "not"
        } logged in. Make up your mind!`,
      },
    },
    {
      element: "#typographySection",
      popover: {
        title: "Typography Section",
        description: "Check out these fancy fonts! Aren't they cool?",
      },
    },
    {
      element: "#customImage",
      popover: {
        title: "Image Component",
        description: "Behold, an image! Try not to be too impressed.",
      },
    },
    {
      element: "#buttonSection",
      popover: {
        title: "Button Section",
        description: "Press all the buttons! Just kidding, please be gentle.",
      },
    },
    {
      element: "#linkSection",
      popover: {
        title: "Link Section",
        description: "Links to everywhere and nowhere. Click wisely!",
      },
    },
  ];

  const drawingsPageSteps = [
    {
      popover: {
        title: "Welcome to the Shit Show",
        description: "Let me walk you through the drawings page. It's artsy!",
      },
    },
    {
      element: "#createNewDrawing",
      popover: {
        title: "New Drawings",
        description: "Create new drawings here and make unforgettable art!",
      },
    },
  ];

  const drive: Config = {
    showProgress: true,
    steps: [
      {
        popover: {
          title: `
            <br>
            🎨 Welcome to DoodlePal! 🎨
            `,
          description: `
            <br>
            Hey there, creative genius! I'm on a mission to get hired, and what better way to showcase my skills than with this fun app?
            DoodlePal is your ultimate drawing playground. Here's how it works:
            <br>
            <b>Invite Friends:</b> Creativity is better together! Invite your friends to join your drawing session.
            <br>
            <b>Create Together:</b> Doodle in real-time and unleash your collective creativity.
            <br>
            <b>Share the Fun:</b> Finished your masterpiece? Share it with the world or keep it as a fun memory.
            Happy doodling, and wish me luck on getting hired! 🚀
          `,
          side: "left",
          align: "start",
        },
      },
      ...(pathname === "/" ? homePageSteps : drawingsPageSteps),
    ],
  };
  const driverObj = driver(drive);
  driverObj.drive();
};
