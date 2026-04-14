import {Router, Request, Response} from "express";
import {getMBIDRecords, getMusicBrainzRecords} from "../utils/accoustid.ts";
import {prisma} from "../lib/prisma.ts";
import {StatusCodes} from "http-status-codes";

const lookupRouter =  Router()

lookupRouter.get("/lookup", async (req: Request, res: Response): Promise<any> => {

    const song = await prisma.song.findUnique({where: {id: "1"}})
    if (!song) {
        return res.status(StatusCodes.NOT_FOUND).json({error: "Song not found"})
    }
    const fingerPrintString = song.fingerPrint

    if (!fingerPrintString) {
        return res.status(StatusCodes.BAD_REQUEST).json({error: "Song does not have a fingerprint"})

    }
    const fingerPrint = await JSON.parse(fingerPrintString) as {duration: number, fingerprint: string}
    const ACCOUSTID_CLIENT = process.env.ACCOUSTID_client

    if (!ACCOUSTID_CLIENT){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "Accoustid client not configured"})
    }
    const mbid = await getMBIDRecords(ACCOUSTID_CLIENT,fingerPrint )

    return res.json(mbid)
})


export default lookupRouter