import https from "https";
import { IVersonSource, VerInfo } from "./ver";

export default class GithubFileSource implements IVersonSource {
  _fileUrl: string = "";

  constructor(publicFileUrl: string) {
    this._fileUrl = publicFileUrl;
  }

  readVersionFromFile(fileUrl: string): Promise<VerInfo> {
    return new Promise((resolve, reject) => {
      console.log("readVersionFromFile:", fileUrl);
      https
        .get(fileUrl, (res) => {
          console.log("statusCode:", res.statusCode);
          console.log("headers:", res.headers);
          if (res.statusCode == 302) {
            console.log("location:", res.headers.location);
            return this.readVersionFromFile(res.headers.location!);
          }
          res.on("data", (d) => {
            var jsonString = Buffer.from(d).toString("utf-8");
            console.log("git file content:", jsonString);
            resolve(JSON.parse(jsonString)[0]);
          });
        })
        .on("error", (e) => {
          console.error(e);
          reject(e);
        });
    });
  }

  async read(): Promise<VerInfo> {
    return await this.readVersionFromFile(this._fileUrl);
  }
}
