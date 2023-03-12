import { faker } from "@faker-js/faker";
import mongoose, { Schema, model } from "mongoose";

const minDate = new Date(2023, 0, 1);
const maxDate = new Date(2023, 11, 30);

const databaseUrl =
  "mongodb://root:password@127.0.0.1:27017/analytics?authSource=admin";

const selectors = [
  "html",
  "html body div.a div.b",
  "html body div.a div.b div.c div.d div.e p#main-p.f",
  "html body div.a div.b input#mon_input",
  "html body div.a div.b div.c button#mon_bouton",
];

const EventSchema = new Schema({
  event: {
    type: String,
    required: true,
  },
  data: { type: {}, required: true },
  clientTime: { type: Date, required: true },
  serverTime: { type: Date, required: true },
  userAgent: { type: String, required: true },
  ip: { type: String, required: true },
  isCustom: { type: Boolean, required: true },
  applicationId: { type: String, required: true },
});

const EventModel = model("Event", EventSchema);

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateResize() {
  return {
    event: "resize",
    data: {
      width: faker.datatype.number({ min: 100, max: 7680 }),
      height: faker.datatype.number({ min: 100, max: 4320 }),
    },
  };
}

function generateFakeCSSSelector() {
  const index = getRandomArbitrary(0, selectors.length - 1);
  return selectors[index];
}

function generateClick() {
  return {
    event: "click",
    data: {
      selector: generateFakeCSSSelector(),
      innerText: faker.lorem.words(),
    },
  };
}

function generateEntry() {
  const clientTime = faker.date.between(minDate, maxDate);
  const serverTime = new Date(clientTime);
  serverTime.setSeconds(
    serverTime.getSeconds() + faker.datatype.number({ max: 20 })
  );

  const isClick = getRandomArbitrary(0, 10) >= 6;
  const applicationId =
    getRandomArbitrary(0, 2) === 1
      ? "94086418-da30-4a1a-950f-27e19cb6f17d"
      : "11d41ce2-58bf-4f1c-91bc-9d8b4f7177d7";
  return {
    ...(isClick ? generateClick() : generateResize()),
    clientTime,
    serverTime,
    userAgent: faker.internet.userAgent(),
    ip: faker.internet.ipv4(),
    isCustom: false,
    applicationId,
  };
}

async function run(count) {
  await mongoose.connect(databaseUrl);
  let entries = [];
  let num = 0;
  for (let i = 1; i <= count; i++) {
    entries.push(generateEntry());
    if (i % 50000 === 0) {
      console.log("pushing", i);
      await EventModel.insertMany(entries);
      console.log("pushed", i);
      entries = [];
    }
  }
}

run(7_000_000);
