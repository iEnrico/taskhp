import request from "supertest";
import app from "../app";
import axios from "axios";

jest.mock("axios");

describe("GET /api/albums", () => {
    const mockAlbums = [
        { collectionName: "Album 1", artistName: "Adele" },
        { collectionName: "Album 2", artistName: "Adele" },
    ];

    const mockedAxios = axios as jest.Mocked<typeof axios>;

    it("returns 400 if artist name is not provided", async () => {
        const response = await request(app).get("/api/albums");

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Artist name is required");
    });

    it("returns albums for a valid artist", async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { results: mockAlbums },
        });

        const response = await request(app).get("/api/albums?artist=Adele");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(2);
        expect(response.body[0].collectionName).toBe("Album 1");
    });

    it("handles errors when fetching albums from the iTunes API", async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

        const response = await request(app).get("/api/albums?artist=Adele");

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Failed to fetch albums");
    });
});
