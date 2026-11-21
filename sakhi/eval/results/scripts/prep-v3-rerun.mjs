import { readFileSync, writeFileSync } from "fs";

const c = JSON.parse(readFileSync(process.argv[2], "utf-8"));
c.records = c.records.filter((r) => r.mode !== "v3");
c.hindiPilot = (c.hindiPilot || []).filter((r) => r.mode !== "v3");
writeFileSync("eval/results/checkpoint.json", JSON.stringify(c, null, 2));
console.log("kept", c.records.length, "records; V3 will be re-run");