"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
class GithubFileSource {
    constructor(publicFileUrl) {
        this._fileUrl = "";
        this._fileUrl = publicFileUrl;
    }
    readVersionFromFile(fileUrl) {
        return new Promise((resolve, reject) => {
            console.log("readVersionFromFile:", fileUrl);
            https_1.default
                .get(fileUrl, (res) => {
                console.log("statusCode:", res.statusCode);
                console.log("headers:", res.headers);
                if (res.statusCode == 302) {
                    console.log("location:", res.headers.location);
                    return this.readVersionFromFile(res.headers.location);
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
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.readVersionFromFile(this._fileUrl);
        });
    }
}
exports.default = GithubFileSource;
