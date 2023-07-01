interface VerInfo {
  vernum: number; //1
  vercode: String; //1.0.0
  force: boolean; //false
  dateTime: number; // publish timestamp
  forElse: String; // version infomation
}

var zero: VerInfo = {
  vernum: 0,
  vercode: "0.0.0",
  force: false,
  dateTime: 1688203111000,
  forElse: "nothing",
};

type DumpFunc = (value: VerInfo) => Promise<void>;

type PullFunc = () => Promise<VerInfo>;

type WhenFunc = () => Promise<Boolean>;

type ComparatorFunc = (
  oldVersionInfo: VerInfo,
  newVersionInfo: VerInfo
) => Promise<VerInfo | null>;

interface IVersonSource {
  read: () => Promise<VerInfo>;
}

var CompareByVerNumber: ComparatorFunc = async (
  oldVersionInfo,
  newVersionInfo
) => {
  if (newVersionInfo.vercode > oldVersionInfo.vercode) {
    return newVersionInfo;
  }
  return null;
};

class VChecker {
  static KEY = "VerKey";

  private _verInfo: VerInfo = zero;

  private _dumpFunc: DumpFunc | undefined;

  private _pullFunc: PullFunc | undefined;

  private _source!: IVersonSource;

  setStorage(dump: DumpFunc, pull: PullFunc) {
    this._dumpFunc = dump;
    this._pullFunc = pull;
    return this;
  }

  getVersionInfo() {
    return this._verInfo;
  }

  local(verInfo: VerInfo) {
    this._verInfo = verInfo;
    return this;
  }

  remote(source: IVersonSource) {
    this._source = source;
    return this;
  }

  async tryCheck(
    when?: WhenFunc,
    comparator: ComparatorFunc = CompareByVerNumber
  ) {
    if (!when || (await when())) {
      var remoteVersion = await this._source.read();
      var compareResult = await comparator(this._verInfo, remoteVersion);
      return compareResult;
    }
    return null;
  }

  private async _dump() {
    if (localStorage) {
      var dumpData = JSON.stringify(this._verInfo);
      localStorage.setItem(VChecker.KEY, dumpData);
    } else if (this._dumpFunc) {
      await this._dumpFunc(this._verInfo);
    } else {
      throw new Error("can not dump version info!");
    }
  }

  private async _pull() {
    var verInfo = zero;
    if (this._pullFunc) {
      verInfo = await this._pullFunc();
    } else if (localStorage) {
      var verInfoStr = localStorage.getItem(VChecker.KEY);
      if (verInfoStr) {
        verInfo = JSON.parse(verInfoStr);
      }
    }
    return verInfo;
  }
}
