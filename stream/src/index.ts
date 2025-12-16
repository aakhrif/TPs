// json-to-xml-stream.ts
import fs from "fs";
import readline from "readline";
import { Transform, pipeline } from "stream";
import { promisify } from "util";

// Pipeline als Promise nutzen für async/await
const pipe = promisify(pipeline);

// Beispiel Pfade
const inputFile = "orders.jsonl"; // Line-delimited JSON
const outputFile = "orders.xml"; // XML-Ausgabe

// 1️⃣ Transform Stream: JSON -> XML
class JsonToXmlTransform extends Transform {
  constructor() {
    super({ readableObjectMode: false, writableObjectMode: true });
  }

  _transform(chunk: any, encoding: string, callback: Function) {
    try {
      const json = JSON.parse(chunk); // JSON-Zeile parsen
      // Optional: filtere z.B. nur paid orders
      if (json.status && json.status !== "paid") {
        return callback(); // überspringen
      }

      // Einfaches XML-Template
      const xml = `<order>
  <id>${json.id}</id>
  <customer>${json.customer}</customer>
  <amount>${json.amount}</amount>
</order>\n`;

      this.push(xml); // Output in WriteStream
      callback();
    } catch (err) {
      callback(err);
    }
  }
}

// 2️⃣ Funktion: JSONL-Datei in XML konvertieren
async function convertJsonToXml(inputPath: string, outputPath: string) {
  // ReadStream → Datei Zeile für Zeile
  const rl = readline.createInterface({
    input: fs.createReadStream(inputPath),
    crlfDelay: Infinity,
  });

  // WriteStream → Ziel XML-Datei
  const writeStream = fs.createWriteStream(outputPath);

  // Wrap readline in Transform für pipeline
  const lineToXml = new JsonToXmlTransform();

  // Jede Zeile von readline als "data" Event pushen
  rl.on("line", (line) => lineToXml.write(line));
  rl.on("close", () => lineToXml.end());

  // Pipeline überwacht Fehler + Backpressure
  await pipe(lineToXml, writeStream);

  console.log("Conversion completed!");
}

// 3️⃣ Aufruf
convertJsonToXml(inputFile, outputFile).catch((err) => console.error(err));
