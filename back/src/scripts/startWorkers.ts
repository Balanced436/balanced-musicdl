import {metadataWorker} from "../utils/workers";
async function main() {
    metadataWorker().catch(err => {
        console.error("Need to restart the worker", err);
    });
}
main()