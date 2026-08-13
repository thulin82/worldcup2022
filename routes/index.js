import express from "express";
import dotenv from "dotenv";
import axios from "axios";

const router = express.Router();
const URL = "https://api.football-data.org/v4/competitions/2000/matches";

dotenv.config({ quiet: true });

/**
 * Default Route, get group matches
 *
 *
 */
router.get("/", function (req, response) {
  const opt = {
    headers: {
      "X-Auth-Token": process.env.API_KEY,
      Accept: "application/json",
    },
  };

  axios
    .all([
      axios.get(URL + "?season=2026&group=GROUP_A", opt),
      axios.get(URL + "?season=2026&group=GROUP_B", opt),
      axios.get(URL + "?season=2026&group=GROUP_C", opt),
      axios.get(URL + "?season=2026&group=GROUP_D", opt),
      axios.get(URL + "?season=2026&group=GROUP_E", opt),
      axios.get(URL + "?season=2026&group=GROUP_F", opt),
      axios.get(URL + "?season=2026&group=GROUP_G", opt),
      axios.get(URL + "?season=2026&group=GROUP_H", opt),
      axios.get(URL + "?season=2026&group=GROUP_I", opt),
      axios.get(URL + "?season=2026&group=GROUP_J", opt),
      axios.get(URL + "?season=2026&group=GROUP_K", opt),
      axios.get(URL + "?season=2026&group=GROUP_L", opt),
    ])
    .then(
      axios.spread(
        (
          resp1,
          resp2,
          resp3,
          resp4,
          resp5,
          resp6,
          resp7,
          resp8,
          resp9,
          resp10,
          resp11,
          resp12,
        ) => {
          response.set("Content-Type", "text/html");
          response.render("index", {
            A: resp1.data,
            B: resp2.data,
            C: resp3.data,
            D: resp4.data,
            E: resp5.data,
            F: resp6.data,
            G: resp7.data,
            H: resp8.data,
            I: resp9.data,
            J: resp10.data,
            K: resp11.data,
            L: resp12.data,
          });
        },
      ),
    )
    .catch((error) => {
      console.log(error);
    });
});

/**
 * /standings Route, get group standings
 *
 *
 */
router.get("/standings", function (req, response) {
  var opt = {
    method: "GET",
    url: "https://divanscore.p.rapidapi.com/tournaments/get-standings",
    params: { tournamentId: "16", seasonId: "58210" },
    headers: {
      "x-rapidapi-key": process.env.API_KEY2,
      "x-rapidapi-host": "divanscore.p.rapidapi.com",
    },
  };

  axios
    .request(opt)
    .then(function (resp) {
      response.set("Content-Type", "text/html");
      response.render("standings", { result: resp.data.standings });
    })
    .catch(function (error) {
      console.error(error);
    });
});

/**
 * /scorers Route, get top scorers
 *
 *
 */
router.get("/scorers", function (req, response) {
  const opt = {
    method: "GET",
    url: "https://divanscore.p.rapidapi.com/tournaments/get-top-players",
    params: { tournamentId: "16", seasonId: "58210" },
    headers: {
      "x-rapidapi-key": process.env.API_KEY2,
      "x-rapidapi-host": "divanscore.p.rapidapi.com",
    },
  };

  axios
    .request(opt)
    .then(function (resp) {
      response.set("Content-Type", "text/html");
      response.render("scorers", { result: resp.data.topPlayers.goals });
    })
    .catch(function (error) {
      console.error(error);
    });
});

/**
 * /playoff Route, get tournament bracket
 *
 *
 */
router.get("/playoff", function (req, response) {
  response.set("Content-Type", "text/html");
  response.render("playoff");
});

export default router;
