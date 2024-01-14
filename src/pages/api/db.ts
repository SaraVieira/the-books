import clientPromise from "../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { data, collection } = JSON.parse(req.body);

  try {
    const client = await clientPromise;
    const db = client.db("the_books");

    const movies = await db.collection(collection).insertOne(data);

    res.json(movies);
  } catch (e) {
    console.error(e);
  }
};
