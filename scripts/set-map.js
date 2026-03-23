const { PrismaNeon } = require("@prisma/adapter-neon");
const { PrismaClient } = require("../src/generated/prisma/client");

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const MAP_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.0318346663325!2d55.2604608!3d25.202148899999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43fbe12b69c9%3A0xc08db524c295ac73!2sDr.%20Firas%20%7C%20Composite%20Bonding%20-%20Dubai!5e0!3m2!1ssv!2sae!4v1774281488941!5m2!1ssv!2sae";

db.siteSetting
  .upsert({
    where: { key: "mapUrl" },
    update: { value: MAP_URL },
    create: { key: "mapUrl", value: MAP_URL },
  })
  .then(() => {
    console.log("Map URL saved.");
    return db.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return db.$disconnect();
  });
