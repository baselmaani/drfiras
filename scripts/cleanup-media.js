"use strict";
const { Client } = require("pg");
require("dotenv").config();

const client = new Client({ connectionString: process.env.DATABASE_URL });

client.connect().then(async () => {
  // Remove anything that isn't a real media file:
  // - not a Vercel Blob URL
  // - and doesn't end with a known image/video extension
  const res = await client.query(`
    DELETE FROM "MediaFile"
    WHERE
      url NOT LIKE '%blob.vercel-storage.com%'
      AND url NOT SIMILAR TO '%.*(jpeg|jpg|png|webp|gif|avif|mp4|mov|webm|avi|mkv)%'
    RETURNING url
  `);
  console.log("Removed non-media entries:");
  res.rows.forEach((r) => console.log(" -", r.url));
  console.log("Total removed:", res.rows.length);
  await client.end();
});
