const { Command } = require("discord.js-commando");
const axios = require("axios");
const moment = require("moment");
const config = require("./../../config.json");
module.exports = class Opportunity extends Command {
  constructor(client) {
    super(client, {
      name: "opportunity",
      group: "api calls",
      aliases: ["opportunity"],
      memberName: "opportunity",
      description:
        "Get info about opportunity and look up the images it has taken",
      examples: [
        `${config.prefix}opportunity`,
        `${config.prefix}opportunity <'info' | 'image'> <sol> <page number>`,
      ],
      clientPermissions: [
        "SEND_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
      ],
      guildOnly: false,
      ownerOnly: false,
      throttling: {
        usages: 2,
        duration: 10,
      },
      args: [
        {
          key: "type",
          prompt: "Please choose if you are looking for an image or info",
          type: "string",
          oneOf: ["info", `image`, `last`],
          default: "info",
        },
        {
          key: "sol",
          prompt: "Please choose a sol to look for",
          type: "integer",
          default: "",
        },
        {
          key: "page_number",
          prompt: "Please choose a page number to look for",
          type: "integer",
          default: "",
        },
      ],
    });
  }
  run(message, { type, sol, page_number }) {
    if (type === "info") {
      message.embed({
        title: "Mars Exploration Rover Opportunity",
        url:
          "https://mars.nasa.gov/mars-exploration/missions/mars-exploration-rovers/",
        description:
          "**API data available for this mission** Do `=opportunity image (sol) (page number)`\nLaunched on July 8, 2003\nLaunched from Cape Canaveral Air Force Station, Florida\nLanded on January 25, 2004\nLanded at Meridiani Planum\nMission Complete, ended on February 13, 2019\nMore Info at:\nhttps://mars.nasa.gov/mars-exploration/missions/mars-exploration-rovers/",
        color: "#5A2017",
        image: {
          url:
            "https://mars.nasa.gov/resources/3904/artists-concept-of-rover-on-mars/",
        },
        footer: {
          text: "Credit: NASA/JPL-Caltech",
          icon_url: "",
        },
      });
      return;
    }
    if (type === "last") {
      message.embed({
        title: "Opportunity's last message",
        url: "",
        description: "My battery's are low and its getting dark",
        color: "#5A2017",
        image: {
          url:
            "https://mars.nasa.gov/mer/gallery/all/1/p/5111/1P581919922EFFD2FCP2682L8M1-BR.JPG",
        },
        footer: {
          text: "Credit: NASA/JPL-Caltech",
          icon_url: "",
        },
      });
      return;
    }
    if (type === "image") {
      if (!sol || !page_number) {
        message.reply(
          "Please choose a sol and or page number to look for\n`=opportunity image <sol> <page number>`"
        );
      } else {
        axios
          .get(
            `https://api.nasa.gov/mars-photos/api/v1/rovers/opportunity/photos?sol=${sol}&api_key=${config.api_key}`
          )
          .then((res) => {
            if (!res.data.photos[page_number - 1]) {
              message.reply("No results found");
              return;
            }
            let img = res.data.photos[page_number - 1].img_src;
            let data = res.data.photos[page_number - 1];
            let cam = res.data.photos[page_number - 1].camera;
            let rover = res.data.photos[page_number - 1].rover;

            message.channel.send({
              embed: {
                title: "Photo from " + rover.name + "'s from " + cam.full_name,
                url: img,
                description: `**Rover Name:** ${rover.name}\n**Mission Status:** ${rover.status}\n**Sol:** ${data.sol}\n**Date:** ${data.earth_date}\n**Camera Name:** ${cam.full_name} (${cam.name})\n**Photo ID:** ${data.id}`,
                color: "#5A2017",
                image: {
                  url: img,
                },
                footer: {
                  text: "Photo Credit: NASA/JPL-Caltech",
                  icon_url: "",
                },
              },
            });
          })
          .catch(function (error) {
            console.log(error.stack);
            message.say(
              `An error occurred while running the command: ${error}\nFor help solving this problem please join are support server: ${invite}`
            );
          });
      }
    }
  }
};
