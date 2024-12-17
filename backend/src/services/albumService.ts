import axios from "axios";
import { config } from "../config/env";
export const fetchAlbumsByArtist = async (artist: string) => {
  try {
    const response = await axios.get(config.ITUNES_API_URL, {
      params: {
        term: artist,
        media: "music",
        entity: "album",
      },
    });

    const albums = response.data.results.filter(
      (album: any, index: number, self: any) =>
        self.findIndex((a: any) => a.collectionName === album.collectionName) === index
    );

    return albums;
  } catch (error) {
    console.error("Error fetching albums:", error);
    throw new Error("Failed to fetch albums");
  }
};
