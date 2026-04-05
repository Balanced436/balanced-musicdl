import { readdirSync } from "fs"
export const listSong = () : string[] => {
    const songDir = process.env.SONGS_DIR || "/data/music"
    return readdirSync(songDir).map((name)=>`${songDir}/${name}`)
}