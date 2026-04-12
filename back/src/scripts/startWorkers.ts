import { downloadWorker, metadataWorker } from "../utils/workers";
async function main() {
  metadataWorker().catch((err) => {
    console.error("Need to restart the worker", err);
  });

  downloadWorker().catch((err) => {
    console.error("Need to restart the worker", err);
  });
}
main();
