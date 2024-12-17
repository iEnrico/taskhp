import { Router } from "express";
import { getAlbums } from "../controllers/albumController";

const router = Router();

router.get("/albums", getAlbums);

export default router;
