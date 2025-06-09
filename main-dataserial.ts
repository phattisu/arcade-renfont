
namespace Renfont {

    let cidk: { [key: string]: number } = {}

    export function _indexKeyShadow(name: string) {
        return name
    }

    export function _startIdxKey(name: string, start: number) {
        cidk[name] = start
    }

    export function _getIdxKey(name: string) {
        return cidk[name]
    }

    export function _write(strval: string) {
        let oval = "", curc = ""
        for (let i = 0; i < strval.length; i++) {
            curc = strval.charAt(i)
            if ("\\|".includes(curc)) {
                oval = "" + oval + "\\"
            }
            oval = "" + oval + curc
        }
        oval = "" + oval + "|"
        return oval
    }

    export function _read(txt: string, name: string) {
        if (cidk[name] == null) return "";
        let idx = cidk[name]
        let oval = "", curc = ""
        while (idx < txt.length) {
            curc = txt.charAt(idx)
            if ("|".includes(curc)) {
                break
            } else if ("\\".includes(curc)) {
                idx += 1
                curc = txt.charAt(idx)
            }
            oval = "" + oval + curc
            idx += 1
        }
        idx += 1, cidk[name] = idx
        return oval
    }

    export function _saveImg(InputImg: Image) {
        let OutputStr = ""
        OutputStr = "" + OutputStr + _write("image")
        OutputStr = "" + OutputStr + _write("img.1")
        OutputStr = "" + OutputStr + _write(convertToText(InputImg.width))
        OutputStr = "" + OutputStr + _write(convertToText(InputImg.height))
        let NumVal = InputImg.getPixel(0, 0), Count = 1, Ix = 0, Iy = 0
        for (let index = 0; index <= InputImg.width * InputImg.height - 2; index++) {
            Ix = (index + 1) % InputImg.width, Iy = Math.floor((index + 1) / InputImg.width)
            if (NumVal == InputImg.getPixel(Ix, Iy)) {
                Count += 1
            } else {
                OutputStr = "" + OutputStr + _write(convertToText(Count)), OutputStr = "" + OutputStr + _write(convertToText(NumVal))
                NumVal = InputImg.getPixel(Ix, Iy), Count = 1
            }
        }
        OutputStr = "" + OutputStr + _write(convertToText(Count)), OutputStr = "" + OutputStr + _write(convertToText(NumVal)), OutputStr = "" + OutputStr + _write("ENDimg")
        return OutputStr
    }

    export function _loadImg(DataStr: string) {
        if (DataStr.isEmpty()) return undefined;
        _startIdxKey("_ImgData", 0)
        let StrVal = _read(DataStr, "_ImgData")
        let NumVal = 0, Ix = 0, Iy = 0
        if (!(StrVal.includes("image"))) return undefined;
        StrVal = _read(DataStr, "_ImgData")
        if (!(StrVal.includes("img."))) return undefined;
        let Widt = parseFloat(_read(DataStr, "_ImgData")), Heig = parseFloat(_read(DataStr, "_ImgData"))
        let OutputImg = image.create(Widt, Heig)
        let I = 0, CountStr = _read(DataStr, "_ImgData"), Count = parseFloat(CountStr)
        while (_getIdxKey("_ImgData") < DataStr.length) {
            Ix = I % Widt
            Iy = Math.floor(I / Widt)
            NumVal = parseFloat(_read(DataStr, "_ImgData"))
            for (let index = 0; index < Count; index++) {
                OutputImg.setPixel(Ix, Iy, NumVal)
                I += 1
                Ix = I % Widt
                Iy = Math.floor(I / Widt)
            }
            CountStr = _read(DataStr, "_ImgData")
            if (CountStr.includes("END")) break;
            Count = parseFloat(CountStr)
        }
        return OutputImg
    }
}
