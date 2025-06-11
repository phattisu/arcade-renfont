
namespace SpriteKind {
    export const Renfont = SpriteKind.create()
}
//%block="RenFont"
//%color="#12d48a" 
//%icon="\uf031"
//%group="[sprites, text, images, animation]"
namespace Renfont {

    let rendering = false, findLetter_gapCount: number, tablename: string[] = [], ligs: string[][] = [], ligGlyphImages: Image[][] = [], ligWidths: number[][] = [], ligSubWidths: number[][] = [], ligDirYs: number[][] = [], ligsolidColors: number[][] = [], ligSubColors: number[][] = [], storeid: number[] = [], letterspace: number = 1, curid: number = 0, linespace: number = 1;

    function gettableid(name: string) {
        if (tablename.indexOf(name) < 0) {
            tablename.push(name); storeid.push(curid); ligs.push([]); ligGlyphImages.push([]); ligWidths.push([]); ligSubWidths.push([]); ligDirYs.push([]); ligsolidColors.push([]); ligSubColors.push([]); curid += 1;
            return tablename.length - 1
        }
        return tablename.indexOf(name)
    }

    function findLetter(curstr: string, curidx: number, fromchr: string, tochr: string, static?: boolean) {
        findLetter_gapCount = 0
        let lenfrom = fromchr.length, lento = tochr.length
        if (curstr.substr(curidx, lento) == tochr) return true
        if (curstr.substr(curidx, lenfrom) != fromchr) return false
        if (static) return false
        curidx++, findLetter_gapCount++
        while (curidx < curstr.length) {
            if (curstr.substr(curidx, lento) == tochr) return true
            if (curstr.substr(curidx, lenfrom) != fromchr) return false
            curidx++, findLetter_gapCount++
        }
        return false
    }

    function findCommand(tvj: string, chj: string = "", nvj: number): boolean {
        if (((nvj < tvj.length && tvj.charAt(nvj)) && (nvj + 1 < tvj.length && tvj.charAt(nvj + 1) == "\\")) && ((nvj + 2 < tvj.length && chj.length <= 0))) { return true }
        if (chj.length != 1) { return false }
        if (((nvj + 1 < tvj.length && tvj.charAt(nvj + 1) == "\\")) && ((nvj + 2 < tvj.length && tvj.charAt(nvj + 2) == chj))) { return true }
        return false
    }

    function deepChar(tableId: number = 0, idx: number = 0, charstr: string = "", reverse: boolean = false) {
        let ustr = charstr.charAt(idx)
        let ic = 1
        let uc = charstr.charAt(idx + (reverse?-ic:ic))
        let istr = ustr + uc
        if (ligs[tableId].indexOf(istr) < 0) return ustr
        while (ligs[tableId].indexOf(istr) >= 0) {
            if (reverse) ustr = uc + ustr
            else ustr += uc
            ic++
            uc = charstr.charAt(idx + (reverse?-ic:ic))
            if (reverse) istr = uc + ustr
            else istr = ustr + uc
            if ((reverse && idx - ic < 0) || (!reverse && idx + ic >= charstr.length)) { break }
        }
        return ustr
    }

    function drawOutline(Inputi: Image, color: number, dir8: boolean) {
        let dxl: number[] = [1, 0, -1, 0]
        let dyl: number[] = [0, 1, 0, -1]
        if (dir8) {
            dxl = [1, 1, 1, 0, -1, -1, -1, 0]
            dyl = [1, 0, -1, -1, -1, 0, 1, 1]
        }
        let Uinputi = Inputi.clone()
        for (let curcol = 1; curcol < 16; curcol++) {
            Uinputi.replace(curcol, color)
        }
        let Outputi = image.create(Inputi.width + 2, Inputi.height + 2)
        for (let curdir = 0; curdir < Math.min(dxl.length, dyl.length); curdir++) {
            Outputi.drawTransparentImage(Uinputi, 1 + dxl[curdir], 1 + dyl[curdir])
        }
        Outputi.drawTransparentImage(Inputi, 1, 1)
        return Outputi
    }

    function setImgFrame(ImgF: Image, Wh: number, Ht: number) {
        let ImgOutput = image.create(Wh, Ht)
        let tileWidtht = Math.floor(ImgF.width / 3)
        let tileHeightg = Math.floor(ImgF.height / 3)
        let ImgTable: Image[] = []
        let Uimg: Image = null
        let sw = 0
        let sh = 0
        for (let hj = 0; hj < 3; hj++) {
            for (let wi = 0; wi < 3; wi++) {
                Uimg = image.create(tileWidtht, tileHeightg)
                Uimg.drawTransparentImage(ImgF, 0 - wi * tileWidtht, 0 - hj * tileHeightg)
                ImgTable.push(Uimg.clone())
            }
        }
        for (let wi2 = 0; wi2 < Math.floor(Wh / tileWidtht); wi2++) {
            for (let hj2 = 0; hj2 < Math.floor(Ht / tileHeightg); hj2++) {
                sw = Math.min(wi2 * tileWidtht, Wh - tileWidtht)
                sh = Math.min(hj2 * tileHeightg, Ht - tileHeightg)
                if (hj2 == 0 && wi2 == 0) {
                    ImgOutput.drawTransparentImage(ImgTable[0], sw, sh)
                } else if (hj2 == Math.floor(Ht / tileHeightg) - 1 && wi2 == Math.floor(Wh / tileWidtht) - 1) {
                    ImgOutput.drawTransparentImage(ImgTable[8], sw, sh)
                } else if (hj2 == Math.floor(Ht / tileHeightg) - 1 && wi2 == 0) {
                    ImgOutput.drawTransparentImage(ImgTable[6], sw, sh)
                } else if (hj2 == 0 && wi2 == Math.floor(Wh / tileWidtht) - 1) {
                    ImgOutput.drawTransparentImage(ImgTable[2], sw, sh)
                } else {
                    if (wi2 > 0 && wi2 < Math.floor(Wh / tileWidtht) - 1) {
                        if (hj2 == 0) {
                            ImgOutput.drawTransparentImage(ImgTable[1], sw, sh)
                        } else if (hj2 == Math.floor(Ht / tileHeightg) - 1) {
                            ImgOutput.drawTransparentImage(ImgTable[7], sw, sh)
                        } else {
                            ImgOutput.drawTransparentImage(ImgTable[4], sw, sh)
                        }
                    } else if (hj2 > 0 && hj2 < Math.floor(Ht / tileHeightg) - 1) {
                        if (wi2 == 0) {
                            ImgOutput.drawTransparentImage(ImgTable[3], sw, sh)
                        } else if (wi2 == Math.floor(Wh / tileWidtht) - 1) {
                            ImgOutput.drawTransparentImage(ImgTable[5], sw, sh)
                        } else {
                            ImgOutput.drawTransparentImage(ImgTable[4], sw, sh)
                        }
                    } else {
                        ImgOutput.drawTransparentImage(ImgTable[4], sw, sh)
                    }
                }
            }
        }
        return ImgOutput
    }

    //%block="$name"
    //%blockId=renfont_tablenameshadow
    //%name.defl="fonttemp"
    //%blockHidden=true shim=TD_ID
    //%name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //%name.fieldOptions.key="tablenameshadow"
    export function _tableNameShadow(name: string) {
        return name
    }

    /**
     * add charcter glyph to the table
     */
    //%blockid=renfont_setcharecter
    //%block="set |table id $tableKey and set letter $glyph to img $imgi=screen_image_picker||and |the letter can move? $notmove and stay on or under the letter? $onthechar and substract width $inchar erase col $eraseColor spacebar col $spaceColor base col $solidColor guard col $subColor"
    //%tableKey.shadow=renfont_tablenameshadow
    //%outlineColor.shadow=colorindexpicker
    //%spaceColor.shadow=colorindexpicker
    //%eraseColor.shadow=colorindexpicker
    //%subColor.shadow=colorindexpicker
    //%group="create"
    //%weight=2
    export function setCharecter(tableKey: string, glyph: string = "", imgi: Image = image.create(5, 8), notmove: boolean = false, onthechar: boolean = false, inchar: boolean = false, eraseColor: number = 0, spaceColor: number = 0, solidColor: number = 0, subColor: number = 0) {
        let tableId = gettableid(tableKey), scnwidt = true, scwidt = false, wi3 = 0, wj = 0, si = 0;
        if (eraseColor > 0 && eraseColor < 16) imgi.replace(eraseColor, 0)
        let uimg = imgi.clone()
        let start = false, stop = false
        let bufv = pins.createBuffer(uimg.height), count = [], i = 0, x0 = 0, x1 = imgi.width, y0 = 0, y1 = imgi.height
        for (let x = 0; x < uimg.width; x += i) {
            count = []
            for (i = 0; x + i < uimg.width; i++) {
                uimg.getRows(x + i, bufv)
                let sumif = bufv.toArray(NumberFormat.UInt8LE).filter(val => (val == solidColor)).length
                sumif += bufv.toArray(NumberFormat.UInt8LE).filter(val => (val == subColor && subColor > 0)).length
                sumif += bufv.toArray(NumberFormat.UInt8LE).filter(val => (val == spaceColor && spaceColor > 0)).length
                count.push(sumif)
                if ((stop && (count[i - 1] > 0 && count[i] <= 0)) || (!stop && (start && count[i] <= 0) || (!start && count[i] > 0))) break;
            }
            if (start) {
                if (stop) {
                    if (x + i < uimg.width) x1 = x + i
                } else {
                    x1 = x + i
                    stop = true
                }
            } else {
                x0 = x + i
                start = true
            }
        }
        wi3 = x0, wj = x1
        let vimg = image.create(Math.abs(x0 - x1), Math.abs(y0 - y1))
        vimg.drawImage(imgi, -x0, -y0)
        let imgj = vimg.clone()
        let uwid = 0
        if (inchar) {
            for (let xw2 = imgi.width - 1; xw2 >= 0; xw2--) {
                si = 0
                for (let yh2 = 0; yh2 < imgi.height; yh2++) {
                    if (imgi.getPixel(xw2, yh2) > 0) { si += 1 }
                }
                if (scnwidt) {
                    if (scwidt) {
                        if (si <= 0) { wj = xw2; scnwidt = false; break; }
                    } else {
                        if (si > 0) { wi3 = xw2; scwidt = true; }
                    }
                }
            }
            if (scnwidt) { wj = imgi.width; scnwidt = false; }
            uwid = Math.abs(wi3 - wj);
            if (true) uwid = wj
        }

        if (ligs[tableId].indexOf(glyph) < 0) {
            ligSubColors[tableId].push(subColor)
            ligsolidColors[tableId].push(solidColor)
            ligs[tableId].push(glyph); ligGlyphImages[tableId].push(imgj);
            if (notmove) {
                if (onthechar) {
                    ligDirYs[tableId].push(10)
                } else {
                    ligDirYs[tableId].push(-10)
                }
                ligWidths[tableId].push(0)
                ligSubWidths[tableId].push(0)
            } else {
                if (uwid == 0) {
                    ligSubWidths[tableId].push(imgj.width)
                } else {
                    ligSubWidths[tableId].push(uwid)
                }
                ligWidths[tableId].push(imgj.width)
                ligDirYs[tableId].push(0)
            }
        } else {
            ligSubColors[tableId][ligs[tableId].indexOf(glyph)] = subColor
            ligsolidColors[tableId][ligs[tableId].indexOf(glyph)] = solidColor
            ligGlyphImages[tableId][ligs[tableId].indexOf(glyph)] = imgj
            if (notmove) {
                if (onthechar) {
                    ligDirYs[tableId][ligs[tableId].indexOf(glyph)] = 10
                } else {
                    ligDirYs[tableId][ligs[tableId].indexOf(glyph)] = -10
                }
                ligWidths[tableId][ligs[tableId].indexOf(glyph)] = 0
                ligSubWidths[tableId][ligs[tableId].indexOf(glyph)] = 0
            } else {
                if (uwid == 0) {
                    ligSubWidths[tableId][ligs[tableId].indexOf(glyph)] = imgj.width
                } else {
                    ligSubWidths[tableId][ligs[tableId].indexOf(glyph)] = uwid
                }
                ligWidths[tableId][ligs[tableId].indexOf(glyph)] = imgj.width
                ligDirYs[tableId][ligs[tableId].indexOf(glyph)] = 0
            }
        }
    }

    /**
     * add more glyph from charcter sheet to the table
     */
    //%blockid=renfont_setcharfromimgsheet
    //%block="set |table id $tableKey and set img sheet $sheetImage=screen_image_picker with letters $currentChars||and |staying letters $stayingChars letters on the letters $stackedChars and Char Substact $substractedChars width $tileWidth height $tileHeight erase col $eraseColor space col $spaceColor base col $solidColor guard col $subColor"
    //%tableKey.shadow=renfont_tablenameshadow
    //%eraseColor.shadow=colorindexpicker
    //%spaceColor.shadow=colorindexpicker
    //%solidColor.shadow=colorindexpicker
    //%subColor.shadow=colorindexpicker
    //%group="create"
    //%weight=4
    export function setCharFromSheet(tableKey: string, sheetImage: Image = image.create(10, 16), currentChars: string = "", stayingChars: string = "", stackedChars: string = "", substractedChars: string = "", tileWidth: number = 5, tileHeight: number = 8, eraseColor: number = 0, spaceColor: number = 0, solidColor: number = 0, subColor: number = 0) {
        const sheetColumn = Math.round(sheetImage.width / tileWidth)
        for (let tileIndex = 0; tileIndex < currentChars.length; tileIndex++) {
            const unitImage = image.create(tileWidth, tileHeight), tileColumn = tileWidth * (tileIndex % sheetColumn), tileRow = tileHeight * Math.floor(tileIndex / sheetColumn); unitImage.drawTransparentImage(sheetImage, 0 - tileColumn, 0 - tileRow); setCharecter(tableKey, currentChars.charAt(tileIndex), unitImage, stayingChars.includes(currentChars.charAt(tileIndex)), stackedChars.includes(currentChars.charAt(tileIndex)), substractedChars.includes(currentChars.charAt(tileIndex)), eraseColor, spaceColor, solidColor, subColor);
        }
    }

    /**
     * add more long glyph array from charcter sheet to the table
     */
    //%blockid=renfont_setchararrfromimgsheet
    //%block="set |table id $tableKey and set img sheet $sheetImage=screen_image_picker with array of letters $currentChars||and | array of staying letters $stayingChars array of letters on the letters $stackedChars and array of Char Substact $substractedChars width $tileWidth height $tileHeight erase col $eraseColor space col $spaceColor base col $solidColor guard col $subColor"
    //%tableKey.shadow=renfont_tablenameshadow
    //%eraseColor.shadow=colorindexpicker
    //%spaceColor.shadow=colorindexpicker
    //%solidColor.shadow=colorindexpicker
    //%subColor.shadow=colorindexpicker
    //%group="create"
    //%weight=6
    export function setCharArrFromSheet(tableKey: string, sheetImage: Image = image.create(10, 16), currentChars: string[] = [], stayingChars: string[] = [], stackedChars: string[] = [], substractedChars: string[] = [], tileWidth: number = 5, tileHeight: number = 8, eraseColor: number = 0, spaceColor: number = 0, solidColor: number = 0, subColor: number = 0) {
        const sheetColumn = Math.round(sheetImage.width / tileWidth)
        for (let tileIndex = 0; tileIndex < currentChars.length; tileIndex++) {
            const unitImage = image.create(tileWidth, tileHeight), tileColumn = tileWidth * (tileIndex % sheetColumn), tileRow = tileHeight * Math.floor(tileIndex / sheetColumn); unitImage.drawTransparentImage(sheetImage, 0 - tileColumn, 0 - tileRow); setCharecter(tableKey, currentChars[tileIndex], unitImage, stayingChars.indexOf(currentChars[tileIndex]) >= 0, stackedChars.indexOf(currentChars[tileIndex]) >= 0, substractedChars.indexOf(currentChars[tileIndex]) >= 0, eraseColor, spaceColor, solidColor, subColor);
        }
    }

    /**
     * read the length of my charcter in table
     */
    //%blockid=renfont_numofglyphs
    //%block="number of glyphs in table id $tableKey"
    //%tableKey.shadow=renfont_tablenameshadow
    //%group="datainfo"
    //%weight=2
    export function numOfGlyphs(tableKey: string): number {
        const tableId = gettableid(tableKey)
        return ligs[tableId].length
    }

    /**
     * read the array charcter image of my table
     */
    //%blockid=renfont_arrofgypimg
    //%block="array of glyph images in table id $tableKey"
    //%tableKey.shadow=renfont_tablenameshadow
    //%group="datainfo"
    //%weight=4
    export function imageArray(tableKey: string): Image[] {
        const tableId = gettableid(tableKey)
        return ligGlyphImages[tableId]
    }

    /**
     * read the array charcter of my table
     */
    //%blockid=renfont_arrofglyphs
    //%block="array of glyphs in table id $tableKey"
    //%tableKey.shadow=renfont_tablenameshadow
    //%group="datainfo"
    //%weight=6
    export function glyphArray(tableKey: string): String[] {
        const tableId = gettableid(tableKey)
        return ligs[tableId]
    }

    function setTextImgValue(arrm: boolean, input: string, pageWidth: number, tableKey: string, solidColor: number = 0, outlineColor: number = 0, alm: number = 0, letterspaceUnit: number = undefined, linespaceUnit: number = undefined) {
        alm = Math.constrain(alm, -1, 1) , input = input.replaceAll("\\n" , "\n")
        let tableId = gettableid(tableKey), overflow = false, overflows: boolean[] = []
        if (rendering) {
            if (arrm) return [image.create(0, 0)] as Image[]
            else return image.create(0, 0) as Image
        }
        rendering = true
        if (linespaceUnit == undefined) linespaceUnit = linespace
        if (letterspaceUnit == undefined) letterspaceUnit = letterspace
        let curchar = "", curchar2 = "", uhei = 0, outputarr: Image[] = [], lnwit: number[] = [], heig = 0, widt = 0, curwidt = 0, uwidt = 0, swidt = 0, nwidt = 0, wie = 0, hie = 0, hvi = 0;
        for (let currentletter = 0; currentletter < input.length; currentletter++) {
            curchar = deepChar(tableId, currentletter, input)
            if (!(ligs[tableId].indexOf(curchar) < 0)) {
                uwidt = ligWidths[tableId][(ligs[tableId].indexOf(curchar))]
                if (ligWidths[tableId][(ligs[tableId].indexOf(curchar))] <= 0) {
                    nwidt = ligGlyphImages[tableId][(ligs[tableId].indexOf(curchar))].width
                } else {
                    nwidt = 0
                }
                if (uwidt > 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                curchar2 = deepChar(tableId, currentletter + 1, input)
                if ((curchar2 != curchar) && Math.abs(ligSubWidths[tableId][ligs[tableId].indexOf(curchar2)] - ligWidths[tableId][ligs[tableId].indexOf(curchar2)]) > 0) {
                    wie += Math.abs(ligWidths[tableId][ligs[tableId].indexOf(curchar)] - Math.abs(ligSubWidths[tableId][ligs[tableId].indexOf(curchar2)] - ligWidths[tableId][ligs[tableId].indexOf(curchar2)]))
                } else if (Math.abs(ligSubWidths[tableId][ligs[tableId].indexOf(curchar)] - ligWidths[tableId][ligs[tableId].indexOf(curchar)]) > 0) {
                    wie += ligSubWidths[tableId][(ligs[tableId].indexOf(curchar))]
                } else if (ligWidths[tableId][(ligs[tableId].indexOf(curchar))] > 0) {
                    wie += Math.abs(uwidt - nwidt)
                }
                if ((pageWidth <= 0 || !(findLetter(input, currentletter, " ", "\n"))) && (ligWidths[tableId][(ligs[tableId].indexOf(input.charAt(Math.min(currentletter + Math.max(curchar.length, 1), input.length - 1))))] > 0 || currentletter + (curchar.length - 1) >= input.length - 1)) {
                    wie += letterspaceUnit
                }
                hvi = ligGlyphImages[tableId][(ligs[tableId].indexOf(curchar))].height
            } else if (input.charAt(currentletter) == " ") {
                if (pageWidth > 0 && !(findLetter(input, currentletter, " ", "\n"))) wie += 3 * letterspaceUnit
                else if (pageWidth <= 0) wie += 3 * letterspaceUnit
            } else {
                if (pageWidth > 0 && !(findLetter(input, currentletter, " ", "\n"))) wie += 3 * letterspaceUnit
                else if (pageWidth <= 0) wie += 3 * letterspaceUnit
            }
            uhei = Math.max(uhei, hvi), heig = Math.max(heig, hie + hvi)
            if (pageWidth > 0) {
                if (wie >= pageWidth || (findLetter(input, currentletter, " ", "\n"))) {
                    if (uhei > hvi) {
                        hie += uhei
                    } else {
                        hie += hvi
                    }
                    hie += linespaceUnit
                    wie = 0;
                    if(findLetter(input, currentletter, " ", "\n")) {
                        currentletter += findLetter_gapCount
                    }
                }
            } else if (findLetter(input, currentletter, " ", "\n")) {
                currentletter += findLetter_gapCount
            }
            if (curchar.length - 1 > 0) { currentletter += curchar.length - 1 }
        }
        wie = 0, widt = 0
        let hix = 0;
        for (let currentletter2 = 0; currentletter2 < input.length; currentletter2++) {
            curchar = deepChar(tableId, currentletter2, input)
            if (!(ligs[tableId].indexOf(curchar) < 0)) {
                uwidt = ligWidths[tableId][(ligs[tableId].indexOf(curchar))]
                if (ligWidths[tableId][(ligs[tableId].indexOf(curchar))] <= 0) {
                    nwidt = ligGlyphImages[tableId][(ligs[tableId].indexOf(curchar))].width
                } else {
                    nwidt = 0
                }
                if (ligWidths[tableId][(ligs[tableId].indexOf(input.charAt(Math.min(currentletter2 + curchar.length, input.length - 1))))] <= 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                curchar2 = deepChar(tableId, currentletter2 + 1, input)
                if ((curchar2 != curchar) && Math.abs(ligSubWidths[tableId][ligs[tableId].indexOf(curchar2)] - ligWidths[tableId][ligs[tableId].indexOf(curchar2)]) > 0) {
                    wie += Math.abs(ligWidths[tableId][ligs[tableId].indexOf(curchar)] - Math.abs(ligSubWidths[tableId][ligs[tableId].indexOf(curchar2)] - ligWidths[tableId][ligs[tableId].indexOf(curchar2)]))
                } else if (Math.abs(ligSubWidths[tableId][ligs[tableId].indexOf(curchar)] - ligWidths[tableId][ligs[tableId].indexOf(curchar)]) > 0) {
                    wie += ligSubWidths[tableId][(ligs[tableId].indexOf(curchar))]
                } else if (ligWidths[tableId][(ligs[tableId].indexOf(curchar))] > 0) {
                    wie += Math.abs(uwidt - nwidt)
                }
                if ((pageWidth <= 0 || !(findLetter(input, currentletter2, " ", "\n"))) && (ligWidths[tableId][(ligs[tableId].indexOf(input.charAt(Math.min(currentletter2 + Math.max(curchar.length, 1), input.length - 1))))] > 0 || currentletter2 + (curchar.length - 1) >= input.length - 1)) {
                    wie += letterspaceUnit
                }
            } else if (input.charAt(currentletter2) == " ") {
                if (pageWidth > 0 && !(findLetter(input, currentletter2, " ", "\n"))) wie += 3 * letterspaceUnit
                else if (pageWidth <= 0) wie += 3 * letterspaceUnit
            } else {
                if (pageWidth > 0 && !(findLetter(input, currentletter2, " ", "\n"))) wie += 3 * letterspaceUnit
                else if (pageWidth <= 0) wie += 3 * letterspaceUnit
            }
            if (pageWidth > 0) {
                if (wie >= pageWidth || (findLetter(input, currentletter2, " ", "\n"))) {
                    widt = Math.max(widt, wie)
                    if (!findLetter(input, currentletter2, " ", "\n") && !overflow) {
                        wie -= letterspaceUnit * 3
                        overflows.push(true)
                        overflow = true
                    } else if (findLetter(input, currentletter2, " ", "\n") && overflow) {
                        overflows.push(false)
                        overflow = false
                    } else {
                        overflows.push(false)
                    }
                    lnwit.push(wie); wie = 0; hix += 1
                    if (findLetter(input, currentletter2, " ", "\n")) {
                        currentletter2 += findLetter_gapCount
                    }
                } else {
                    widt = Math.max(widt, wie)
                }
            } else if (findLetter(input, currentletter2, " ", "\n", true)) {
                widt = Math.max(widt, wie); currentletter2 += findLetter_gapCount;
            } else {
                widt = Math.max(widt, wie)
            }
            if (curchar.length - 1 > 0) { currentletter2 += curchar.length - 1 }
        }
        wie -= letterspace; lnwit.push(wie);
        let hgi = 0, limg = image.create(lnwit[hgi], heig), scwidt2 = true, underc = false, scnwidt2 = false, rimg = image.create(8, 8), output = image.create(widt, heig), sc = 0; hie = 0; wie = 0; curwidt = 0;
        let uoutput: Image = image.create(output.width, output.height), uuoutput: Image = image.create(output.width, output.height);
        if (outlineColor > 0) { uoutput = image.create(output.width + 2, output.height + 2) }
        for (let currentletter3 = 0; currentletter3 < input.length; currentletter3++) {
            wie = 0; curchar = deepChar(tableId, currentletter3, input)
            if (!(ligs[tableId].indexOf(curchar) < 0)) {
                hvi = ligGlyphImages[tableId][(ligs[tableId].indexOf(curchar))].height; uwidt = ligWidths[tableId][(ligs[tableId].indexOf(curchar))];
                if (ligWidths[tableId][(ligs[tableId].indexOf(curchar))] <= 0) {
                    nwidt = ligGlyphImages[tableId][(ligs[tableId].indexOf(curchar))].width
                } else {
                    nwidt = 0
                }
                scwidt2 = false; scnwidt2 = false; wie = 0; rimg = ligGlyphImages[tableId][(ligs[tableId].indexOf(curchar))].clone()
                let ccol = ligSubColors[tableId][ligs[tableId].indexOf(input.charAt(currentletter3))];
                if (ligWidths[tableId][ligs[tableId].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] > 0 && ligDirYs[tableId][ligs[tableId].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] == 0) {
                    rimg.replace(ccol, ligsolidColors[tableId][ligs[tableId].indexOf(curchar)])
                } else if (ligWidths[tableId][ligs[tableId].indexOf(curchar)] > 0 && ligDirYs[tableId][ligs[tableId].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] < 0) {
                    rimg.replace(ccol, 0)
                } else if (ligWidths[tableId][ligs[tableId].indexOf(curchar)] > 0 && ligDirYs[tableId][ligs[tableId].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] > 0) {
                    rimg.replace(ccol, ligsolidColors[tableId][ligs[tableId].indexOf(curchar)])
                }
                if (Math.abs(ligDirYs[tableId][ligs[tableId].indexOf(curchar)]) > 0 && Math.abs(ligDirYs[tableId][ligs[tableId].indexOf(input.charAt(Math.max(currentletter3 - 1, 0)))]) == 0) {
                    sc = 1; wie = 0;
                    while (sc > 0) {
                        sc = 0
                        for (let yh3 = 0; yh3 < rimg.height; yh3++) {
                            if (limg.getPixel((curwidt - letterspace) - wie, yh3) == rimg.getPixel(rimg.width - 1, yh3) && (limg.getPixel((curwidt - letterspace) - wie, yh3) != 0 && limg.getPixel((curwidt - letterspace) - wie, yh3) != 0)) {
                                sc += 1
                            }
                        }
                        if (sc > 0 || (sc == 0 && wie > 0)) {
                            wie += 1
                        }
                    }
                }
                wie = Math.abs(wie)
                limg.drawTransparentImage(rimg, curwidt - ((nwidt + wie) - ((input.charAt(currentletter3) != curchar)?Math.round(rimg.width/curchar.length/2):0)), 0 + (hvi - ligGlyphImages[tableId][(ligs[tableId].indexOf(curchar))].height))
                if (ligWidths[tableId][(ligs[tableId].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1))))] == 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                curchar2 = deepChar(tableId, currentletter3 + 1, input)
                if ((curchar2 != curchar) && Math.abs(ligSubWidths[tableId][ligs[tableId].indexOf(curchar2)] - ligWidths[tableId][ligs[tableId].indexOf(curchar2)]) > 0) {
                    curwidt += Math.abs(ligWidths[tableId][ligs[tableId].indexOf(curchar)] - Math.abs(ligSubWidths[tableId][ligs[tableId].indexOf(curchar2)] - ligWidths[tableId][ligs[tableId].indexOf(curchar2)]))
                } else if (Math.abs(ligSubWidths[tableId][ligs[tableId].indexOf(curchar)] - ligWidths[tableId][ligs[tableId].indexOf(curchar)]) > 0) {
                    curwidt += ligSubWidths[tableId][(ligs[tableId].indexOf(curchar))]
                } else if (ligWidths[tableId][(ligs[tableId].indexOf(curchar))] > 0) {
                    curwidt += Math.abs(uwidt - nwidt)
                }
                if ((pageWidth <= 0 || !(findLetter(input, currentletter3, " ", "\n"))) && (ligWidths[tableId][(ligs[tableId].indexOf(input.charAt(Math.min(currentletter3 + Math.max(curchar.length, 1), input.length - 1))))] > 0 || currentletter3 + (curchar.length - 1) >= input.length - 1)) {
                    curwidt += letterspaceUnit
                }
            } else if (input.charAt(currentletter3) == " ") {
                if (pageWidth > 0 && !(findLetter(input, currentletter3, " ", "\n"))) curwidt += 3 * letterspaceUnit
                else if (pageWidth <= 0) curwidt += 3 * letterspaceUnit
            } else {
                if (pageWidth > 0 && !(findLetter(input, currentletter3, " ", "\n"))) curwidt += 3 * letterspaceUnit
                else if (pageWidth <= 0) curwidt += 3 * letterspaceUnit
            }
            uhei = Math.max(uhei, hvi)
            uuoutput = output.clone()
            if (alm < 0) {
                uuoutput.drawTransparentImage(limg.clone(), 0, hie)
            } else if (alm > 0) {
                uuoutput.drawTransparentImage(limg.clone(), Math.abs(output.width - Math.min(curwidt, limg.width)), hie)
            } else if (alm == 0) {
                uuoutput.drawTransparentImage(limg.clone(), Math.abs((output.width / 2) - (Math.min(curwidt, limg.width) / 2)), hie)
            }
            if (solidColor > 0) {
                for (let ico = 1; ico < 16; ico++) {
                    uuoutput.replace(ico, solidColor)
                }
            }
            if (outlineColor > 0) { uuoutput = drawOutline(uuoutput.clone(), outlineColor, true) } else { uoutput = uuoutput.clone() }
            outputarr.push(uuoutput.clone())
            if (pageWidth > 0) {
                if (curwidt >= pageWidth || (findLetter(input, currentletter3, " ", "\n"))) {
                    if (alm < 0) {
                        output.drawTransparentImage(limg.clone(), 0, hie)
                    } else if (alm > 0) {
                        output.drawTransparentImage(limg.clone(), Math.abs(output.width - limg.width), hie)
                    } else if (alm == 0) {
                        output.drawTransparentImage(limg.clone(), Math.abs((output.width / 2) - (limg.width / 2)), hie)
                    }
                    if (solidColor > 0) {
                        for (let ico2 = 1; ico2 < 16; ico2++) {
                            output.replace(ico2, solidColor)
                        }
                    }
                    if (outlineColor > 0) { uoutput = drawOutline(output.clone(), outlineColor, true) } else { uoutput = output.clone() }
                    outputarr.push(uoutput.clone())
                    hgi += 1; limg = image.create(lnwit[hgi], heig); curwidt = 0;
                    if (overflows[hgi]) curwidt -= 3 * letterspaceUnit
                    if (uhei > hvi) {
                        hie += uhei
                    } else {
                        hie += hvi
                    }
                    hie += linespaceUnit
                    if(findLetter(input, currentletter3, " ", "\n")) {
                        currentletter3 += findLetter_gapCount
                    }
                }
            } else if (findLetter(input, currentletter3, " ", "\n")) {
                currentletter3 += findLetter_gapCount
            }
            if (curchar.length - 1 > 0) { currentletter3 += curchar.length - 1 }
        }
        if (alm < 0) {
            output.drawTransparentImage(limg.clone(), 0, hie)
        } else if (alm > 0) {
            output.drawTransparentImage(limg.clone(), Math.abs(output.width - limg.width), hie)
        } else if (alm == 0) {
            output.drawTransparentImage(limg.clone(), Math.abs((output.width / 2) - (limg.width / 2)), hie)
        }
        if (solidColor > 0) {
            for (let ico3 = 1; ico3 < 16; ico3++) {
                output.replace(ico3, solidColor)
            }
        }
        if (outlineColor > 0) { uoutput = drawOutline(output, outlineColor, true) } else { uoutput = output.clone() }
        outputarr.push(uoutput.clone())
        rendering = false
        if (arrm) { return outputarr as Image[] }
        output = uoutput.clone()
        return output as Image
    }

    /**
     * render text from my table to the image
     */
    //%blockid=renfont_setimgfromtext
    //%block="create text image of |text $input in page width $pageWidth from table id $tableKey||and |fill col $solidColor with outline $outlineColor and got alignment $alm and get debugalm $debugalm"
    //%tableKey.shadow=renfont_tablenameshadow
    //%alm.min=-1 alm.max=1 alm.defl=0
    //%solidColor.shadow=colorindexpicker
    //%outlineColor.shadow=colorindexpicker
    //%group="render"
    //%weight=4
    export function setTextImage(input: string = "", pageWidth: number = 0, tableKey: string, solidColor: number = 0, outlineColor: number = 0, alm: number = 0, letterspaceUnit: number = 0, linespaceUnit: number = 0) {
        return setTextImgValue(false, input, pageWidth, tableKey, solidColor, outlineColor, alm, letterspaceUnit, linespaceUnit) as Image
    }

    /**
     * render text from my table like basic text animation to image array
     */
    //%blockid=renfont_setimgframefromtext
    //%block="create text image array of |text $input in page width $pageWidth from table id $tableKey||and |fill col $solidColor with outline $outlineColor and got alignment $alm and get debugalm $debugalm"
    //%tableKey.shadow=renfont_tablenameshadow
    //%alm.min=-1 alm.max=1 alm.defl=0
    //%solidColor.shadow=colorindexpicker
    //%outlineColor.shadow=colorindexpicker
    //%group="render"
    //%weight=2
    export function setTextImageArray(input: string = "", pageWidth: number = 0, tableKey: string, solidColor: number = 0, outlineColor: number = 0, alm: number = 0, letterspaceUnit: number = 0, linespaceUnit: number = 0) {
        return setTextImgValue(true, input, pageWidth, tableKey, solidColor, outlineColor, alm, letterspaceUnit, linespaceUnit) as Image[]
    }

    /** 
     * render text and stamp to my dialog frame
     */
    //%blockid=renfont_stamptexttoframe
    //%block="create dialog text $dialogImage=dialog_image_picker text $txt text width $pageWidth TableId $arrid||And text color col $solidColor and outline $outlineColor Alignment $ualm"
    //%arrid.shadow=renfont_tablenameshadow
    //%ualm.min=-1 ualm.max=1 ualm.defl=0
    //%solidColor.shadow=colorindexpicker
    //%outlineColor.shadow=colorindexpicker
    //%group="Dialog render"
    //%weight=4
    export function stampStrToDialog(dialogImage: Image, txt: string = "", pageWidth: number = 0, arrid: string, solidColor: number = 0, outlineColor: number = 0, ualm: number = 0, letterspaceUnit: number = 0, linespaceUnit: number = 0) {
        let textImage: Image = setTextImage(txt, pageWidth, arrid, solidColor, outlineColor, ualm, letterspaceUnit, linespaceUnit)
        let tileDialogWidth = Math.floor(dialogImage.width / 3)
        let tileDialogHeight = Math.floor(dialogImage.height / 3)
        let dialogImageBox: Image = setImgFrame(dialogImage, textImage.width + ((tileDialogWidth * 2) + Math.floor(tileDialogWidth / 2)), textImage.height + ((tileDialogHeight * 2) + Math.floor(tileDialogHeight / 2)))
        dialogImageBox.drawTransparentImage(textImage.clone(), tileDialogWidth, tileDialogHeight)
        return dialogImageBox
    }

    /**
     * render text like basic text animation and stamp to my dialog frame as image array
     */
    //%blockid=renfont_stamptextarrtoframe
    //%block="create dialog text array $dialogImage=dialog_image_picker text input $txt In page width $pageWidth At table id $arrid||and text color $solidColor with outline $outlineColor And alignment $ualm "
    //%arrid.shadow=renfont_tablenameshadow
    //%ualm.min=-1 ualm.max=1 ualm.defl=0
    //%solidColor.shadow=colorindexpicker
    //%outlineColor.shadow=colorindexpicker
    //%group="Dialog render"
    //%weight=2
    export function stampStrArrToDialog(dialogImage: Image, txt: string = "", pageWidth: number = 0, arrid: string, solidColor: number = 0, outlineColor: number = 0, ualm: number = 0, letterspaceUnit: number = 0, linespaceUnit: number = 0) {
        let textImageArray: Image[] = setTextImageArray(txt, pageWidth, arrid, solidColor, outlineColor, ualm, letterspaceUnit, linespaceUnit)
        let tileDialogWidth = Math.floor(dialogImage.width / 3)
        let tileDialogHeight = Math.floor(dialogImage.height / 3)
        let dialogImageBox: Image = setImgFrame(dialogImage, textImageArray[0].width + ((tileDialogWidth * 2) + Math.floor(tileDialogWidth / 2)), textImageArray[0].height + ((tileDialogHeight * 2) + Math.floor(tileDialogHeight / 2)))
        let imgArr: Image[] = []
        let uimg: Image = null
        for (let mgi = 0; mgi < textImageArray.length; mgi++) {
            uimg = dialogImageBox.clone()
            uimg.drawTransparentImage(textImageArray[mgi].clone(), tileDialogWidth, tileDialogHeight)
            imgArr.push(uimg)
        }
        return imgArr
    }

    /**
     * set the letterspace by value
     */
    //%blockid=renfont_setletterspacing
    //%block="set letter spacing to $input"
    //%group="main propety"
    //%weight=8
    export function SetSpace(input: number) {
        letterspace = input
    }

    /**
     * change the letterspace by value
     */
    //%blockid=renfont_changeletterspacing
    //%block="change letter spacing by $input"
    //%group="main propety"
    //%weight=6
    export function ChangeSpace(input: number) {
        letterspace += input
    }

    /**
     * set the line gap by value
     */
    //%blockid=renfont_setlinegap
    //%block="set line gap by $input"
    //%group="main propety"
    //%weight=4
    export function SetLine(input: number) {
        linespace = input
    }

    /**
     * change the line gap by value
     */
    //%blockid=renfont_changelinegap
    //%block="change line gap by $input"
    //%group="main propety"
    //%weight=2
    export function ChangeLine(input: number) {
        linespace += input
    }

    export enum align { left = -1, center = 0, right = 1 }

    /**
     * get alignment value
     */
    //%blockid=renfont_getalignmentval
    //%block="get $alg of alignment"
    //%group="main propety"
    export function getAlign(alg: align) {
        return alg
    }

    export enum tempfont {
        //%block="main font"
        MainFont = 1,
        //%block="arcade font"
        ArcadeFont = 2,
        //%block="latin mini"
        LatinMini = 3
    }

    /**
     * set charcter from template
     */
    //%blockid=renfont_presetfont
    //%block="SetupPresetFont $tempf with table id $tableKey"
    //%tableKey.shadow=renfont_tablenameshadow
    //%group="create"
    //%weight=10
    export function setupPresetFont(tempf: tempfont, tableKey: string) {
        switch (tempf) {
            case 1:
                _mainfont(tableKey)
                break;
            case 2:
                _arcadefont(tableKey)
                break;
            case 3:
                _latinmini(tableKey)
                break;
            default:
                _mainfont(tableKey)
                break;
        }
    }

    export enum thisDataNumType {
        //%block="solid color"
        solidColor = 1,
        //%block="outline color"
        outlineColor = 2,
        //%block="page width"
        pageWidth = 3,
        //%block="alignment"
        align = 4
    }

    export enum spacetype {
        //%block="letter space"
        letterspace = 1,
        //%block="line height"
        linespace = 2
    }

    export enum colortype {
        //%block="solid color"
        solidcolor = 1,
        //%block="outline color"
        outlinecolor = 2
    }

    export enum delaytype {
        //%block="delay per milisecond"
        delaypermsec = 1,
        //%block="divide milisec"
        divmsec = 2
    }

    /**
     * create the renfont as Sprite
     */
    //%blockid=renfont_Sprite_create
    //%block="create renfont Sprite as $text in color $solidColor with outline $outlineColor in alignment $alg and tableid $tableKey||and page width $pageWidth"
    //%tableKey.shadow=renfont_tablenameshadow tableKey.defl="fonttemp"
    //%solidColor.shadow=colorindexpicker
    //%outlineColor.shadow=colorindexpicker
    //%blockSetVariable="myRenfont"
    //%group="Sprite mode"
    //%weight=22
    export function createSprite(text: string = "", solidColor: number, outlineColor: number, alg: align, tableKey: string, pageWidth: number = 0) {
        let renfontSprite = new RenfontSprite(text, solidColor, outlineColor, alg, tableKey, pageWidth)
        renfontSprite.setKind(SpriteKind.Renfont)
        renfontSprite.setPosition(Math.floor(scene.screenWidth() / 2), Math.floor(scene.screenHeight() / 2))
        return renfontSprite
    }

    export class RenfontSprite extends Sprite {
        txt: string
        solidColor: number
        tableKey: string
        salg: number
        pageWidth: number
        letterspace: number
        linespace: number
        outlineColor: number
        msec: number
        anim: boolean
        dialogImage: Image
        saveImage: Image
        saveImageArray: Image[]

        protected flagTick() {
            if (this.flags & sprites.Flag.RelativeToCamera) {
                this.x -= scene.cameraProperty(CameraProperty.Left), this.y -= scene.cameraProperty(CameraProperty.Top)
                if (this.bottom < 0) this.top = scene.screenHeight(); if (this.top > scene.screenHeight()) this.bottom = 0
                if (this.right < 0) this.left = scene.screenWidth(); if (this.left > scene.screenWidth()) this.right = 0
            } if (!(this.flags & sprites.Flag.GhostThroughWalls || this.flags & sprites.Flag.Ghost)) {
                if (this.isHittingTile(CollisionDirection.Right)) if (this.vx > 0) this.vx = 0;
                if (this.isHittingTile(CollisionDirection.Left)) if (this.vx < 0) this.vx = 0
                if (this.isHittingTile(CollisionDirection.Bottom)) if (this.vy > 0) this.vy = 0;
                if (this.isHittingTile(CollisionDirection.Top)) if (this.vy < 0) this.vy = 0;
            } if (this.flags & sprites.Flag.StayInScreen) {
                if (this.bottom > scene.screenHeight() + 1 || this.top < 0) { if (this.vy < 0) this.top = 0; else if (this.vy > 0) this.bottom = scene.screenHeight(); this.vy = 0 }
                if (this.right > scene.screenWidth() + 1 || this.left < 0) { if (this.vx < 0) this.left = 0; else if (this.vx > 0) this.right = scene.screenWidth(); this.vx = 0 }
            } if (this.flags & sprites.Flag.BounceOnWall) {
                if (this.vy !== 0) if (this.bottom > scene.screenHeight()+1) this.vy = -this.vy;else if (this.top < 0) this.vy = -this.vy
                if (this.vx !== 0) if (this.right > scene.screenWidth()+1) this.vx = -this.vx;else if (this.left < 0) this.vx = -this.vx
            }
        }

        protected runMain() {
            basic.forever( function() {
                const currentDelta = game.currentScene().eventContext.deltaTime;
                control.runInBackground( function() { this.x += this.vx * currentDelta, this.y += this.vy * currentDelta; if (this.vx !== 0 || this.vy !== 0) this.flagTick(); })
                pause(currentDelta);
            })
        }

        constructor(txt: string, solidColor: number, outlineColor: number, alg: align, tableKey: string, pageWidth: number) {
            super(setTextImage(
                txt,
                pageWidth,
                tableKey,
                solidColor,
                outlineColor,
                alg
            ))
            this.txt = txt, this.solidColor = solidColor, this.outlineColor = outlineColor, this.tableKey = tableKey, this.salg = alg, this.pageWidth = pageWidth
            this.updateImageSprite()
            this.runMain()
        }

        protected updateImageSprite() {
            if (!this) return;
            if (this.dialogImage) {
                this.saveImage = stampStrToDialog(
                    this.dialogImage,
                    this.txt,
                    this.pageWidth,
                    this.tableKey,
                    this.solidColor,
                    this.outlineColor,
                    this.salg,
                    this.letterspace,
                    this.linespace
                )
            } else {
                this.saveImage = setTextImage(
                    this.txt,
                    this.pageWidth,
                    this.tableKey,
                    this.solidColor,
                    this.outlineColor,
                    this.salg,
                    this.letterspace,
                    this.linespace
                )
            }
            if (this.image.equals(this.saveImage)) return;
            this.setImage(this.saveImage)
        }
    
        /**
         * get text data from renfont Sprite
         */
        //%blockid=renfont_Sprite_readtxt
        //%block="get $this as text data"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=18
        public gettext() {
            return this.txt
        }
    
        /**
         * get option data number from renfont Sprite
         */
        //%blockid=renfont_Sprite_readthisdatainnum
        //%block="get $this from $NumType"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=16
        public gettextData(NumType: thisDataNumType) {
            switch (NumType) {
                case 1:
                    return this.solidColor;
                case 2:
                    return this.outlineColor;
                case 3:
                    return this.pageWidth;
                case 4:
                    return this.salg;
                default:
                    return -1;
            }
        }
    
        /**
         * set alignment as enum to renfont Sprite
         */
        //%blockid=renfont_Sprite_setalign
        //%block=" $this=variables_get set align to $alg"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=14
        public setAlign(alg: align) {
            if (this.salg == getAlign(alg)) return;
            this.salg = getAlign(alg)
            this.updateImageSprite()
        }
    
        /**
         * set alignment as number to renfont Sprite
         */
        //%blockid=renfont_Sprite_setalignnum
        //%block=" $this set align value to $aln"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=12
        public setAlignNum(aln: number = 0) {
            aln = Math.constrain(aln, -1, 1)
            if (this.salg == aln) return;
            this.salg = aln
            this.updateImageSprite()
        }
    
        /**
         * add or set dialog frame to renfont Sprite
         */
        //%blockid=renfont_Sprite_setdialog
        //%block=" $this set dialog frame to $dialogImage=dialog_image_picker"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=10
        public setDialogtxt(dialogImage: Image) {
            if (this.dialogImage && this.dialogImage.equals(dialogImage)) return;
            this.dialogImage = dialogImage
            this.updateImageSprite()
        }
    
        /**
         * remove dialog frame at renfont Sprite
         */
        //%blockid=renfont_Sprite_cleardialog
        //%block=" $this clear dialog frame"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=9
        public clearSpriteDialog() {
            if (!this.dialogImage) return;
            this.dialogImage = undefined
            this.updateImageSprite()
        }
    
    
        /**
         * set gap space to renfont Sprite
         */
        //%blockid=renfont_Sprite_setlinespace
        //%block=" $this set $gaptype to $value"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=8
        public setGap(gaptype: spacetype, value: number = 0) {
            switch (gaptype) {
                case 1:
                    if (this.letterspace == value) return;
                    this.letterspace = value
                    break;
                case 2:
                    if (this.linespace == value) return;
                    this.linespace = value
                    break;
                default:
                    return;
            }
            this.updateImageSprite()
        }
    
        /**
         * clear gap space at renfont Sprite
         */
        //%blockid=renfont_Sprite_setdefaultlinespace
        //%block=" $this set $gaptype to default value"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=7
        public setDefaultGap(gaptype: spacetype) {
            switch (gaptype) {
                case 1:
                    if (this.letterspace == undefined) return; 
                    this.letterspace = undefined
                    break;
                case 2:
                    if (this.linespace == undefined) return;
                    this.linespace = undefined
                    break;
                default:
                    return;
            }
            this.updateImageSprite()
        }
    
        /**
         * set text to render
         * to renfont Sprite
         */
        //%blockid=renfont_Sprite_settextdata
        //%block=" $this set text to $text"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=20
        public settext(text: string) {
            if (this.txt == text) return;
            this.txt = text
            this.updateImageSprite()
        }

        /**
         * set text color index
         * to renfont Sprite
         */
        //%blockid=renfont_Sprite_settexsolidColoror
        //%block=" $this set $colortexttype to $subColoror"
        //%this.shadow=variables_get this.defl=myRenfont
        //%subColoror.shadow=colorindexpicker
        //%group="Sprite mode"
        //%weight=6
        public settexsolidColoror(colortexttype: colortype, subColoror: number = 0) {
            switch (colortexttype) {
                case 1:
                    if (this.solidColor == subColoror) return;
                    this.solidColor = subColoror
                    break;
                case 2:
                    if (this.outlineColor == subColoror) return;
                    this.outlineColor = subColoror
                    break;
                default:
                    return;
            }
            this.updateImageSprite()
        }
    
        /**
         * set table id 
         * to renfont Sprite
         */
        //%blockid=renfont_Sprite_settableid
        //%block=" $this set Table id to $tableKey"
        //%tableKey.shadow=renfont_tablenameshadow
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=3
        public setTableId(tableKey: string) {
            if (this.tableKey == tableKey) return;
            this.tableKey = tableKey
            this.updateImageSprite()
        }
    
        /**
         * set page width
         * to renfont Sprite
         */
        //%blockid=renfont_Sprite_setpageWidthidth
        //%block=" $this set page width to $pageWidth"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=4
        public setpageWidthidth(pageWidth: number = 0) {
            if (this.pageWidth == pageWidth) return;
            this.pageWidth = pageWidth
            this.updateImageSprite()
        }

        /**
         * play text animation
         * from renfont Sprite
         */
        //%blockid=renfont_Sprite_playanimatiom
        //%block=" $this get animation play for (ms) $msecval in $delaymode||and paused $pausev"
        //%msecval.defl=100
        //%pausev.shadow=toggleYesNo
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=2
        public getAnimPlay(msecval: number, delaymode: delaytype, pausev: boolean = false) {
            if (this.anim) return;
            this.anim = true
            this.msec = 0
            let umsec: number, lensec: number;
            if (this.dialogImage) {
                this.saveImageArray = stampStrArrToDialog(
                    this.dialogImage, 
                    this.txt, 
                    this.pageWidth, 
                    this.tableKey, 
                    this.solidColor, 
                    this.outlineColor, 
                    this.salg, 
                    this.letterspace, 
                    this.linespace
                )
            } else {
                this.saveImageArray = setTextImageArray(
                    this.txt, 
                    this.pageWidth, 
                    this.tableKey, 
                    this.solidColor, 
                    this.outlineColor, 
                    this.salg, 
                    this.letterspace, 
                    this.linespace
                )
            }
            switch (delaymode) {
                case 1:
                    this.msec = msecval - 1
                    umsec = this.msec
                    lensec = this.msec * this.saveImageArray.length
                    break;
                case 2:
                    this.msec = Math.floor(msecval / this.saveImageArray.length)
                    umsec = msecval - 1
                    lensec = msecval - 1
                    break;
                default:
                    return;
            }
            animation.runImageAnimation(this, this.saveImageArray, this.msec, false)
            let unitTimeout = setTimeout(function () {
                this.anim = false
                this.updateImageSprite()
                clearTimeout(unitTimeout)
            }, lensec)
            if (pausev) pauseUntil(() => !this.anim);
        }
    
        /**
         * check renfont Sprite
         * playing animation until done
         */
        //%blockid=renfont_Sprite_playanimisdone
        //%block=" $this get animation is stop"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=1
        public animdone() {
            return !(this.anim)
        }
    }
}
