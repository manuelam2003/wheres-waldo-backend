const express = require("express");
const request = require("supertest");

const {
  initializeMongoServer,
  closeMongoServer,
} = require("./mongoConfigTesting");

const indexRouter = require("../routes/index");
const scoresRouter = require("../routes/score");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/scores", scoresRouter);

beforeAll(async () => {
  await initializeMongoServer();
});

afterAll(async () => {
  await closeMongoServer();
});

describe("Index router", () => {
  it("returns the welcome message", (done) => {
    request(app)
      .get("/")
      .expect("Content-Type", /json/)
      .expect({ welcomeMessage: "Where is Waldo API" })
      .expect(200, done);
  });

  it("adds an image to the database", async () => {
    const response = await request(app)
      .post("/images")
      .type("form")
      .send({
        image: "beach",
        characters: [
          {
            character: "Waldo",
            minX: 617,
            maxX: 655,
            minY: 413,
            maxY: 481,
          },
          {
            character: "Wizard",
            minX: 730,
            maxX: 785,
            minY: 416,
            maxY: 483,
          },
          {
            character: "Odlaw",
            minX: 278,
            maxX: 303,
            minY: 420,
            maxY: 494,
          },
        ],
        dimensions: {
          width: 1200,
          height: 900,
        },
      });
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.createdImage).toBeDefined();
  });

  it("returns an image from the database", async () => {
    const response = await request(app).get("/images/beach");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.image).toBeDefined();
  });

  it("updates an image in the database", async () => {
    const response = await request(app)
      .put("/images/beach")
      .send("image=beachUpdated");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.updatedImage).toBeDefined();
    expect(response.body.updatedImage.image).toMatch("beachUpdated");
  });

  it("returns game time", async () => {
    const response = await request(app).post("/game/finished");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.gameTimeInSeconds).toBeDefined();
  });
});

describe("Scores router", () => {
  it("submits a score to the database", async () => {
    const response = await request(app)
      .post("/scores/submit")
      .type("form")
      .send({
        image: "beach",
        user: "username",
        score: 60,
      });
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.message).toMatch("Score submitted");
  });

  it("returns scores", async () => {
    const response = await request(app).get("/scores");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.scores).toBeDefined();
  });

  it("returns scores for a specific game", async () => {
    const response = await request(app).get("/scores/beach");
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(response.body.scores).toBeDefined();
  });
});
