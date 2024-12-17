import { Request, Response } from "express";
import { fetchAlbumsByArtist } from "../services/albumService";

export const getAlbums = async (req: Request, res: Response): Promise<void> => {
  const { artist } = req.query;

  if (!artist) {
    res.status(400).json({ error: "Artist name is required" });
    return;
  }

  try {
    const albums = await fetchAlbumsByArtist(artist as string);
    res.status(200).json(albums);
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ error: "Failed to fetch albums" });
  }
};
