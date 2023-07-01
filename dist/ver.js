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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VChecker = void 0;
var zero = {
    vernum: 0,
    vercode: "0.0.0",
    force: false,
    dateTime: 1688203111000,
    forElse: "nothing",
};
var CompareByVerNumber = (oldVersionInfo, newVersionInfo) => __awaiter(void 0, void 0, void 0, function* () {
    if (newVersionInfo.vercode > oldVersionInfo.vercode) {
        return newVersionInfo;
    }
    return null;
});
class VChecker {
    constructor() {
        this._verInfo = zero;
    }
    setStorage(dump, pull) {
        this._dumpFunc = dump;
        this._pullFunc = pull;
        return this;
    }
    getVersionInfo() {
        return this._verInfo;
    }
    local(verInfo) {
        this._verInfo = verInfo;
        return this;
    }
    remote(source) {
        this._source = source;
        return this;
    }
    tryCheck(when, comparator = CompareByVerNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!when || (yield when())) {
                var remoteVersion = yield this._source.read();
                var compareResult = yield comparator(this._verInfo, remoteVersion);
                return compareResult;
            }
            return null;
        });
    }
    _dump() {
        return __awaiter(this, void 0, void 0, function* () {
            if (localStorage) {
                var dumpData = JSON.stringify(this._verInfo);
                localStorage.setItem(VChecker.KEY, dumpData);
            }
            else if (this._dumpFunc) {
                yield this._dumpFunc(this._verInfo);
            }
            else {
                throw new Error("can not dump version info!");
            }
        });
    }
    _pull() {
        return __awaiter(this, void 0, void 0, function* () {
            var verInfo = zero;
            if (this._pullFunc) {
                verInfo = yield this._pullFunc();
            }
            else if (localStorage) {
                var verInfoStr = localStorage.getItem(VChecker.KEY);
                if (verInfoStr) {
                    verInfo = JSON.parse(verInfoStr);
                }
            }
            return verInfo;
        });
    }
}
exports.VChecker = VChecker;
VChecker.KEY = "VerKey";
