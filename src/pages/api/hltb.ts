import type { NextApiRequest, NextApiResponse } from "next";
import { load } from "cheerio";
import axios from "axios";
import UserAgent from "user-agents";

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { id } = req.query;

  try {
    const result = await await axios
      .get(`https://howlongtobeat.com/game?id=${id}`, {
        headers: {
          "User-Agent": new UserAgent().toString(),
          origin: "https://howlongtobeat.com",
          referer: "https://howlongtobeat.com",
        },
        timeout: 20000,
      })
      .catch((e) => {
        throw e;
      });
    const $ = load(result.data);
    const data = JSON.parse($("#__NEXT_DATA__").text()).props.pageProps.game
      .data.game[0];
    res.json({
      image: `https://howlongtobeat.com/games/${data.game_image}`,
      name: data.game_name,
      dev: data.profile_dev,
      genres: data.profile_genre.split(", "),
      platforms: data.profile_platform.split(", "),
      summary: data.profile_summary,
      steam: data.profile_steam,
      score: data.review_score,
      release:
        data.release_world ||
        data.release_eu ||
        data.release_na ||
        data.release_jp,
      time: (data.comp_main / 3600).toFixed(1),
    });
  } catch (e) {
    console.error(e);
  }
};
