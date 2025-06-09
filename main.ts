
namespace SpriteKind {
    export const Renfont = SpriteKind.create()
}
//%block="RenFont"
//%color="#12d48a" 
//%icon="\uf031"
//%group="[Sprites, Text, Images]"
//%weight=10
namespace Renfont {

    let rendering = false, tablename: string[] = [], ligs: string[][] = [], ligages: Image[][] = [], ligwidth: number[][] = [], ligsubw: number[][] = [], ligdir: number[][] = [], ligcol: number[][] = [], ligul: number[][] = [], storeid: number[] = [], letterspace: number = 1, curid: number = 0, lineheight: number = 1;

    function gettableid(name: string) {
        if (tablename.indexOf(name) < 0) {
            tablename.push(name); storeid.push(curid); ligs.push([]); ligages.push([]); ligwidth.push([]); ligsubw.push([]); ligdir.push([]); ligcol.push([]); ligul.push([]); curid += 1;
            return tablename.length - 1
        }
        return tablename.indexOf(name)
    }

    function drawTransparentImage(src: Image, to: Image, x: number, y: number) {
        if (!src || !to) return;
        to.drawTransparentImage(src, x, y)
    }

    function findLetter(curstr: string, curidx: number, fromchr: string, tochr: string) {
        let curi = curidx
        let lenfrom = fromchr.length, lento = tochr.length
        if (curstr.substr(curi + (lento - ((curi % lento) + 1)), lento) == tochr) return true
        if (curstr.substr(curi + (lenfrom - ((curi % lenfrom) + 1)), lenfrom) != fromchr) return false
        curi++
        while (curi < curstr.length) {
            if (curstr.substr(curi + (lento - ((curi % lento) + 1)), lento) == tochr) return true
            if (curstr.substr(curi + (lenfrom - ((curi % lenfrom) + 1)), lenfrom) != fromchr) return false
            curi++
        }
        return false
    }

    function findCommand(tvj: string, chj: string = "", nvj: number): boolean {
        if (((nvj < tvj.length && tvj.charAt(nvj)) && (nvj + 1 < tvj.length && tvj.charAt(nvj + 1) == "\\")) && ((nvj + 2 < tvj.length && chj.length <= 0))) { return true }
        if (chj.length != 1) { return false }
        if (((nvj + 1 < tvj.length && tvj.charAt(nvj + 1) == "\\")) && ((nvj + 2 < tvj.length && tvj.charAt(nvj + 2) == chj))) { return true }
        return false
    }

    function deepChar(tid: number = 0, idx: number = 0, charstr: string = "", reverse: boolean = false) {
        let ustr = charstr.charAt(idx)
        let ic = 1
        let uc = charstr.charAt(idx + (reverse?-ic:ic))
        let istr = ustr + uc
        if (reverse) istr = uc + ustr
        if (ligs[tid].indexOf(istr) < 0) return ustr
        while (ligs[tid].indexOf(istr) >= 0) {
            ustr = "" + ustr + uc
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
            drawTransparentImage(Uinputi, Outputi, 1 + dxl[curdir], 1 + dyl[curdir])
        }
        drawTransparentImage(Inputi, Outputi, 1, 1)
        return Outputi
    }

    function setImgFrame(ImgF: Image, Wh: number, Ht: number) {
        let ImgOutput = image.create(Wh, Ht)
        let Twidt = Math.floor(ImgF.width / 3)
        let Theig = Math.floor(ImgF.height / 3)
        let ImgTable: Image[] = []
        let Uimg: Image = null
        let sw = 0
        let sh = 0
        for (let hj = 0; hj < 3; hj++) {
            for (let wi = 0; wi < 3; wi++) {
                Uimg = image.create(Twidt, Theig)
                drawTransparentImage(ImgF, Uimg, 0 - wi * Twidt, 0 - hj * Theig)
                ImgTable.push(Uimg.clone())
            }
        }
        for (let wi2 = 0; wi2 < Math.floor(Wh / Twidt); wi2++) {
            for (let hj2 = 0; hj2 < Math.floor(Ht / Theig); hj2++) {
                sw = Math.min(wi2 * Twidt, Wh - Twidt)
                sh = Math.min(hj2 * Theig, Ht - Theig)
                if (hj2 == 0 && wi2 == 0) {
                    drawTransparentImage(ImgTable[0], ImgOutput, sw, sh)
                } else if (hj2 == Math.floor(Ht / Theig) - 1 && wi2 == Math.floor(Wh / Twidt) - 1) {
                    drawTransparentImage(ImgTable[8], ImgOutput, sw, sh)
                } else if (hj2 == Math.floor(Ht / Theig) - 1 && wi2 == 0) {
                    drawTransparentImage(ImgTable[6], ImgOutput, sw, sh)
                } else if (hj2 == 0 && wi2 == Math.floor(Wh / Twidt) - 1) {
                    drawTransparentImage(ImgTable[2], ImgOutput, sw, sh)
                } else {
                    if (wi2 > 0 && wi2 < Math.floor(Wh / Twidt) - 1) {
                        if (hj2 == 0) {
                            drawTransparentImage(ImgTable[1], ImgOutput, sw, sh)
                        } else if (hj2 == Math.floor(Ht / Theig) - 1) {
                            drawTransparentImage(ImgTable[7], ImgOutput, sw, sh)
                        } else {
                            drawTransparentImage(ImgTable[4], ImgOutput, sw, sh)
                        }
                    } else if (hj2 > 0 && hj2 < Math.floor(Ht / Theig) - 1) {
                        if (wi2 == 0) {
                            drawTransparentImage(ImgTable[3], ImgOutput, sw, sh)
                        } else if (wi2 == Math.floor(Wh / Twidt) - 1) {
                            drawTransparentImage(ImgTable[5], ImgOutput, sw, sh)
                        } else {
                            drawTransparentImage(ImgTable[4], ImgOutput, sw, sh)
                        }
                    } else {
                        drawTransparentImage(ImgTable[4], ImgOutput, sw, sh)
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
    //%block="set |table id $gid and set letter $glyph to img $imgi=screen_image_picker||and |the letter can move? $notmove and stay on or under the letter? $onthechar and substract width $inchar erase col $bcol spacebar col $scol base col $mcol guard col $ncol"
    //%gid.shadow=renfont_tablenameshadow
    //%bcol.shadow=colorindexpicker
    //%scol.shadow=colorindexpicker
    //%mcol.shadow=colorindexpicker
    //%ncol.shadow=colorindexpicker
    //%group="create"
    //%weight=2
    export function setCharecter(gid: string, glyph: string = "", imgi: Image = image.create(5, 8), notmove: boolean = false, onthechar: boolean = false, inchar: boolean = false, bcol: number = 0, scol: number = 0, mcol: number = 0, ncol: number = 0) {
        let tid = gettableid(gid), sncol = true, scnwidt = true, scwidt = false, wi3 = 0, wj = 0, si = 0;
        if (bcol > 0 && bcol < 16) imgi.replace(bcol, 0)
        let uimg = imgi.clone()
        let start = false, stop = false
        let bufv = pins.createBuffer(uimg.height), count = [], i = 0, x0 = 0, x1 = imgi.width, y0 = 0, y1 = imgi.height
        for (let x = 0; x < uimg.width; x += i) {
            count = []
            for (i = 0; x + i < uimg.width; i++) {
                uimg.getRows(x + i, bufv)
                let sumif = bufv.toArray(NumberFormat.UInt8LE).filter(val => (val == mcol)).length
                sumif += bufv.toArray(NumberFormat.UInt8LE).filter(val => (val == ncol && ncol > 0)).length
                sumif += bufv.toArray(NumberFormat.UInt8LE).filter(val => (val == scol && scol > 0)).length
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

        if (ligs[tid].indexOf(glyph) < 0) {
            ligul[tid].push(ncol)
            ligcol[tid].push(mcol)
            ligs[tid].push(glyph); ligages[tid].push(imgj);
            if (notmove) {
                if (onthechar) {
                    ligdir[tid].push(10)
                } else {
                    ligdir[tid].push(-10)
                }
                ligwidth[tid].push(0)
                ligsubw[tid].push(0)
            } else {
                if (uwid == 0) {
                    ligsubw[tid].push(imgj.width)
                } else {
                    ligsubw[tid].push(uwid)
                }
                ligwidth[tid].push(imgj.width)
                ligdir[tid].push(0)
            }
        } else {
            ligul[tid][ligs[tid].indexOf(glyph)] = ncol
            ligcol[tid][ligs[tid].indexOf(glyph)] = mcol
            ligages[tid][ligs[tid].indexOf(glyph)] = imgj
            if (notmove) {
                if (onthechar) {
                    ligdir[tid][ligs[tid].indexOf(glyph)] = 10
                } else {
                    ligdir[tid][ligs[tid].indexOf(glyph)] = -10
                }
                ligwidth[tid][ligs[tid].indexOf(glyph)] = 0
                ligsubw[tid][ligs[tid].indexOf(glyph)] = 0
            } else {
                if (uwid == 0) {
                    ligsubw[tid][ligs[tid].indexOf(glyph)] = imgj.width
                } else {
                    ligsubw[tid][ligs[tid].indexOf(glyph)] = uwid
                }
                ligwidth[tid][ligs[tid].indexOf(glyph)] = imgj.width
                ligdir[tid][ligs[tid].indexOf(glyph)] = 0
            }
        }
    }

    /**
     * add more glyph
     * from charcter sheet
     * to the table
     */
    //%blockid=renfont_setcharfromimgsheet
    //%block="set |table id $tid and set img sheet $PngSheet=screen_image_picker with letters $GroupChar||and |staying letters $StayChar letters on the letters $CharOnChar and Char Substact $CharSubW width $twid height $thei erase col $bcl space col $scl base col $mcl guard col $ncl"
    //%tid.shadow=renfont_tablenameshadow
    //%bcl.shadow=colorindexpicker
    //%scl.shadow=colorindexpicker
    //%mcl.shadow=colorindexpicker
    //%ncl.shadow=colorindexpicker
    //%group="create"
    //%weight=4
    export function setCharFromSheet(tid: string, PngSheet: Image = image.create(10, 16), GroupChar: string = "", StayChar: string = "", CharOnChar: string = "", CharSubW: string = "", twid: number = 5, thei: number = 8, bcl: number = 0, scl: number = 0, mcl: number = 0, ncl: number = 0) {
        let gwid = Math.round(PngSheet.width / twid), uig = image.create(twid, thei), txi = 0, tyi = 0;
        for (let tvn = 0; tvn < GroupChar.length; tvn++) {
            uig = image.create(twid, thei); txi = twid * (tvn % gwid); tyi = thei * Math.floor(tvn / gwid); drawTransparentImage(PngSheet, uig, 0 - txi, 0 - tyi); setCharecter(tid, GroupChar.charAt(tvn), uig, StayChar.includes(GroupChar.charAt(tvn)), CharOnChar.includes(GroupChar.charAt(tvn)), CharSubW.includes(GroupChar.charAt(tvn)), bcl, scl, mcl, ncl);
        }
    }

    /**
     * add more long glyph array
     * from charcter sheet
     * to the table
     */
    //%blockid=renfont_setchararrfromimgsheet
    //%block="set |table id $tid and set img sheet $PngSheet=screen_image_picker with array of letters $GroupChar||and | array of staying letters $StayChar array of letters on the letters $CharOnChar and array of Char Substact $CharSubW width $twid height $thei erase col $bcl space col $scl base col $mcl guard col $ncl"
    //%tid.shadow=renfont_tablenameshadow
    //%bcl.shadow=colorindexpicker
    //%scl.shadow=colorindexpicker
    //%mcl.shadow=colorindexpicker
    //%ncl.shadow=colorindexpicker
    //%group="create"
    //%weight=6
    export function setCharArrFromSheet(tid: string, PngSheet: Image = image.create(10, 16), GroupChar: string[] = [], StayChar: string[] = [], CharOnChar: string[] = [], CharSubW: string[] = [], twid: number = 5, thei: number = 8, bcl: number = 0, scl: number = 0, mcl: number = 0, ncl: number = 0) {
        let gwid2 = Math.round(PngSheet.width / twid), uig2 = image.create(twid, thei), txi2 = 0, tyi2 = 0;
        for (let tvn2 = 0; tvn2 < GroupChar.length; tvn2++) {
            uig2 = image.create(twid, thei); txi2 = twid * (tvn2 % gwid2); tyi2 = thei * Math.floor(tvn2 / gwid2); drawTransparentImage(PngSheet, uig2, 0 - txi2, 0 - tyi2); setCharecter(tid, GroupChar[tvn2], uig2, StayChar.indexOf(GroupChar[tvn2]) >= 0, CharOnChar.indexOf(GroupChar[tvn2]) >= 0, CharSubW.indexOf(GroupChar[tvn2]) >= 0, bcl, scl, mcl, ncl);
        }
    }

    /**
     * read the length of
     * my charcter in table
     */
    //%blockid=renfont_numofglyphs
    //%block="number of glyphs in table id $gid"
    //%gid.shadow=renfont_tablenameshadow
    //%group="datainfo"
    //%weight=2
    export function numOfGlyphs(gid: string): number {
        let tid2 = gettableid(gid)
        return ligs[tid2].length
    }

    /**
     * read the array charcter image
     * of my table
     */
    //%blockid=renfont_arrofgypimg
    //%block="array of glyph images in table id $gid"
    //%gid.shadow=renfont_tablenameshadow
    //%group="datainfo"
    //%weight=4
    export function imageArray(gid: string): Image[] {
        let tid3 = gettableid(gid)
        return ligages[tid3]
    }

    /**
     * read the array charcter
     * of my table
     */
    //%blockid=renfont_arrofglyphs
    //%block="array of glyphs in table id $gid"
    //%gid.shadow=renfont_tablenameshadow
    //%group="datainfo"
    //%weight=6
    export function glyphArray(gid: string): String[] {
        let tid4 = gettableid(gid)
        return ligs[tid4]
    }

    function setTextImgValue(arrm: boolean, input: string, iwidt: number, lid: string, icol: number = 0, bcol: number = 0, alm: number = 0, spacew: number = undefined, lineh: number = undefined) {
        let tid5 = gettableid(lid)
        if (rendering) { if (arrm) { return [image.create(1, 1)] as Image[] } else { return image.create(1, 1) as Image } }
        rendering = true
        if (lineh == undefined) { lineh = lineheight }
        if (spacew == undefined) { spacew = letterspace }
        let curchar = "", curchar2 = "", uhei = 0, outputarr: Image[] = [], lnwit: number[] = [], heig = 0, widt = 0, curwidt = 0, uwidt = 0, swidt = 0, nwidt = 0, wie = 0, hie = 0, hvi = 0;
        for (let currentletter = 0; currentletter < input.length; currentletter++) {
            curchar = deepChar(tid5, currentletter, input)
            if (!(ligs[tid5].indexOf(curchar) < 0)) {
                uwidt = ligwidth[tid5][(ligs[tid5].indexOf(curchar))]
                if (ligwidth[tid5][(ligs[tid5].indexOf(curchar))] <= 0) {
                    nwidt = ligages[tid5][(ligs[tid5].indexOf(curchar))].width
                } else {
                    nwidt = 0
                }
                if (uwidt > 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                curchar2 = deepChar(tid5, currentletter + 1, input)
                if ((curchar2 != curchar) && Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar2)] - ligwidth[tid5][ligs[tid5].indexOf(curchar2)]) > 0) {
                    wie += Math.abs(ligwidth[tid5][ligs[tid5].indexOf(curchar)] - Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar2)] - ligwidth[tid5][ligs[tid5].indexOf(curchar2)]))
                } else if (Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar)] - ligwidth[tid5][ligs[tid5].indexOf(curchar)]) > 0) {
                    wie += ligsubw[tid5][(ligs[tid5].indexOf(curchar))]
                } else if (ligwidth[tid5][(ligs[tid5].indexOf(curchar))] > 0) {
                    wie += Math.abs(uwidt - nwidt)
                }
                if ((iwidt <= 0 || !(findCommand(input, "n", currentletter))) && (ligwidth[tid5][(ligs[tid5].indexOf(input.charAt(Math.min(currentletter + Math.max(curchar.length, 1), input.length - 1))))] > 0 || currentletter + (curchar.length - 1) >= input.length - 1)) {
                    wie += spacew
                }
                hvi = ligages[tid5][(ligs[tid5].indexOf(curchar))].height
            } else if (input.charAt(currentletter) == " ") {
                if (iwidt > 0 && (findLetter(input, currentletter, " ", "\\n") || findLetter(input, currentletter, " ", "\n"))) wie += 3 * spacew
                else if (iwidt <= 0) wie += 3 * spacew
            } else {
                if (iwidt > 0 && (findLetter(input, currentletter, " ", "\\n") || findLetter(input, currentletter, " ", "\n"))) wie += 2 * spacew
                else if (iwidt <= 0) wie += 2 * spacew
            }
            uhei = Math.max(uhei, hvi), heig = Math.max(heig, hie + hvi)
            if (iwidt > 0) {
                if (wie >= iwidt || findCommand(input, "n", currentletter)) {
                    if (uhei > hvi) {
                        hie += uhei
                    } else {
                        hie += hvi
                    }
                    hie += lineh
                    wie = 0;
                    if (findCommand(input, "n", currentletter)) {
                        currentletter += 2
                    }
                }
            } else if (findCommand(input, "n", currentletter)) {
                currentletter += 2
            }
            if (curchar.length - 1 > 0) { currentletter += curchar.length - 1 }
        }
        wie = 0, widt = 0
        let hix = 0;
        for (let currentletter2 = 0; currentletter2 < input.length; currentletter2++) {
            curchar = deepChar(tid5, currentletter2, input)
            if (!(ligs[tid5].indexOf(curchar) < 0)) {
                uwidt = ligwidth[tid5][(ligs[tid5].indexOf(curchar))]
                if (ligwidth[tid5][(ligs[tid5].indexOf(curchar))] <= 0) {
                    nwidt = ligages[tid5][(ligs[tid5].indexOf(curchar))].width
                } else {
                    nwidt = 0
                }
                if (ligwidth[tid5][(ligs[tid5].indexOf(input.charAt(Math.min(currentletter2 + curchar.length, input.length - 1))))] <= 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                curchar2 = deepChar(tid5, currentletter2 + 1, input)
                if ((curchar2 != curchar) && Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar2)] - ligwidth[tid5][ligs[tid5].indexOf(curchar2)]) > 0) {
                    wie += Math.abs(ligwidth[tid5][ligs[tid5].indexOf(curchar)] - Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar2)] - ligwidth[tid5][ligs[tid5].indexOf(curchar2)]))
                } else if (Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar)] - ligwidth[tid5][ligs[tid5].indexOf(curchar)]) > 0) {
                    wie += ligsubw[tid5][(ligs[tid5].indexOf(curchar))]
                } else if (ligwidth[tid5][(ligs[tid5].indexOf(curchar))] > 0) {
                    wie += Math.abs(uwidt - nwidt)
                }
                if ((iwidt <= 0 || !(findCommand(input, "n", currentletter2))) && (ligwidth[tid5][(ligs[tid5].indexOf(input.charAt(Math.min(currentletter2 + Math.max(curchar.length, 1), input.length - 1))))] > 0 || currentletter2 + (curchar.length - 1) >= input.length - 1)) {
                    wie += spacew
                }
            } else if (input.charAt(currentletter2) == " ") {
                if (iwidt > 0 && (findLetter(input, currentletter2, " ", "\\n") || findLetter(input, currentletter2, " ", "\n"))) wie += 3 * spacew
                else if (iwidt <= 0) wie += 3 * spacew
            } else {
                if (iwidt > 0 && (findLetter(input, currentletter2, " ", "\\n") || findLetter(input, currentletter2, " ", "\n"))) wie += 2 * spacew
                else if (iwidt <= 0) wie += 2 * spacew
            }
            if (false) { widt = Math.max(widt, wie) }
            if (iwidt > 0) {
                if (wie >= iwidt || findCommand(input, "n", currentletter2)) {
                    widt = Math.max(widt, wie)
                    lnwit.push(wie); wie = 0; hix += 1
                    if (findCommand(input, "n", currentletter2)) {
                        currentletter2 += 2
                    }
                } else {
                    widt = Math.max(widt, wie)
                }
            } else if (findCommand(input, "n", currentletter2)) {
                widt = Math.max(widt, wie); currentletter2 += 2;
            } else {
                widt = Math.max(widt, wie)
            }
            if (curchar.length - 1 > 0) { currentletter2 += curchar.length - 1 }
        }
        wie -= letterspace; lnwit.push(wie);
        let hgi = 0, limg = image.create(lnwit[hgi], heig), scwidt2 = true, underc = false, scnwidt2 = false, rimg = image.create(8, 8), output = image.create(widt, heig), sc = 0; hie = 0; wie = 0; curwidt = 0;
        let uoutput: Image = image.create(output.width, output.height), uuoutput: Image = image.create(output.width, output.height);
        if (bcol > 0) { uoutput = image.create(output.width + 2, output.height + 2) }
        for (let currentletter3 = 0; currentletter3 < input.length; currentletter3++) {
            wie = 0; curchar = deepChar(tid5, currentletter3, input)
            if (!(ligs[tid5].indexOf(curchar) < 0)) {
                hvi = ligages[tid5][(ligs[tid5].indexOf(curchar))].height; uwidt = ligwidth[tid5][(ligs[tid5].indexOf(curchar))];
                if (ligwidth[tid5][(ligs[tid5].indexOf(curchar))] <= 0) {
                    nwidt = ligages[tid5][(ligs[tid5].indexOf(curchar))].width
                } else {
                    nwidt = 0
                }
                scwidt2 = false; scnwidt2 = false; wie = 0; rimg = ligages[tid5][(ligs[tid5].indexOf(curchar))].clone()
                let ccol = ligul[tid5][ligs[tid5].indexOf(input.charAt(currentletter3))];
                if (ligwidth[tid5][ligs[tid5].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] > 0 && ligdir[tid5][ligs[tid5].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] == 0) {
                    rimg.replace(ccol, ligcol[tid5][ligs[tid5].indexOf(curchar)])
                } else if (ligwidth[tid5][ligs[tid5].indexOf(curchar)] > 0 && ligdir[tid5][ligs[tid5].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] < 0) {
                    rimg.replace(ccol, 0)
                } else if (ligwidth[tid5][ligs[tid5].indexOf(curchar)] > 0 && ligdir[tid5][ligs[tid5].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1)))] > 0) {
                    rimg.replace(ccol, ligcol[tid5][ligs[tid5].indexOf(curchar)])
                }
                if (Math.abs(ligdir[tid5][ligs[tid5].indexOf(curchar)]) > 0 && Math.abs(ligdir[tid5][ligs[tid5].indexOf(input.charAt(Math.max(currentletter3 - 1, 0)))]) == 0) {
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
                if (wie < 0) { wie = Math.abs(wie) }
                drawTransparentImage(rimg, limg, curwidt - (nwidt + wie), 0 + (hvi - ligages[tid5][(ligs[tid5].indexOf(curchar))].height))
                if (ligwidth[tid5][(ligs[tid5].indexOf(input.charAt(Math.min(currentletter3 + curchar.length, input.length - 1))))] == 0) {
                    swidt = uwidt
                } else {
                    swidt = 0
                }
                curchar2 = deepChar(tid5, currentletter3 + 1, input)
                if ((curchar2 != curchar) && Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar2)] - ligwidth[tid5][ligs[tid5].indexOf(curchar2)]) > 0) {
                    curwidt += Math.abs(ligwidth[tid5][ligs[tid5].indexOf(curchar)] - Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar2)] - ligwidth[tid5][ligs[tid5].indexOf(curchar2)]))
                } else if (Math.abs(ligsubw[tid5][ligs[tid5].indexOf(curchar)] - ligwidth[tid5][ligs[tid5].indexOf(curchar)]) > 0) {
                    curwidt += ligsubw[tid5][(ligs[tid5].indexOf(curchar))]
                } else if (ligwidth[tid5][(ligs[tid5].indexOf(curchar))] > 0) {
                    curwidt += Math.abs(uwidt - nwidt)
                }
                if ((iwidt <= 0 || !(findCommand(input, "n", currentletter3))) && (ligwidth[tid5][(ligs[tid5].indexOf(input.charAt(Math.min(currentletter3 + Math.max(curchar.length, 1), input.length - 1))))] > 0 || currentletter3 + (curchar.length - 1) >= input.length - 1)) {
                    curwidt += spacew
                }
            } else if (input.charAt(currentletter3) == " ") {
                if (iwidt > 0 && (findLetter(input, currentletter3, " ", "\\n") || findLetter(input, currentletter3, " ", "\n"))) curwidt += 3 * spacew
                else if (iwidt <= 0) curwidt += 3 * spacew
            } else {
                if (iwidt > 0 && (findLetter(input, currentletter3, " ", "\\n") || findLetter(input, currentletter3, " ", "\n"))) curwidt += 2 * spacew
                else if (iwidt <= 0) curwidt += 2 * spacew
            }
            uhei = Math.max(uhei, hvi)
            uuoutput = output.clone()
            if (alm < 0) {
                drawTransparentImage(limg.clone(), uuoutput, 0, hie)
            } else if (alm > 0) {
                drawTransparentImage(limg.clone(), uuoutput, Math.abs(output.width - Math.min(curwidt, limg.width)), hie)
            } else if (alm == 0) {
                drawTransparentImage(limg.clone(), uuoutput, Math.abs((output.width / 2) - (Math.min(curwidt, limg.width) / 2)), hie)
            }
            if (icol > 0) {
                for (let ico = 1; ico < 16; ico++) {
                    uuoutput.replace(ico, icol)
                }
            }
            if (bcol > 0) { uuoutput = drawOutline(uuoutput.clone(), bcol, true) } else { uoutput = uuoutput.clone() }
            outputarr.push(uuoutput.clone())
            if (iwidt > 0) {
                if (curwidt >= iwidt || findCommand(input, "n", currentletter3)) {
                    if (alm < 0) {
                        drawTransparentImage(limg.clone(), output, 0, hie)
                    } else if (alm > 0) {
                        drawTransparentImage(limg.clone(), output, Math.abs(output.width - limg.width), hie)
                    } else if (alm == 0) {
                        drawTransparentImage(limg.clone(), output, Math.abs((output.width / 2) - (limg.width / 2)), hie)
                    }
                    if (icol > 0) {
                        for (let ico2 = 1; ico2 < 16; ico2++) {
                            output.replace(ico2, icol)
                        }
                    }
                    if (bcol > 0) { uoutput = drawOutline(output.clone(), bcol, true) } else { uoutput = output.clone() }
                    outputarr.push(uoutput.clone())
                    hgi += 1; limg = image.create(lnwit[hgi], heig); curwidt = 0;
                    if (uhei > hvi) {
                        hie += uhei
                    } else {
                        hie += hvi
                    }
                    hie += lineh
                    if (findCommand(input, "n", currentletter3) || input.charAt(currentletter3) == "\n") {
                        currentletter3 += 2
                    }
                }
            } else if (findCommand(input, "n", currentletter3) || input.charAt(currentletter3) == "\n") {
                currentletter3 += 2
            }
            if (curchar.length - 1 > 0) { currentletter3 += curchar.length - 1 }
        }
        if (alm < 0) {
            drawTransparentImage(limg.clone(), output, 0, hie)
        } else if (alm > 0) {
            drawTransparentImage(limg.clone(), output, Math.abs(output.width - limg.width), hie)
        } else if (alm == 0) {
            drawTransparentImage(limg.clone(), output, Math.abs((output.width / 2) - (limg.width / 2)), hie)
        }
        if (icol > 0) {
            for (let ico3 = 1; ico3 < 16; ico3++) {
                output.replace(ico3, icol)
            }
        }
        if (bcol > 0) { uoutput = drawOutline(output, bcol, true) } else { uoutput = output.clone() }
        outputarr.push(uoutput.clone())
        rendering = false
        if (arrm) { return outputarr as Image[] }
        output = uoutput.clone()
        return output as Image
    }

    /**
     * render text from my table
     * to the image
     */
    //%blockid=renfont_setimgfromtext
    //%block="create the image of |text $input in page width $iwidt from table id $tid||and |fill col $icol with outline $bcol and got alignment $alm and get debugalm $debugalm"
    //%tid.shadow=renfont_tablenameshadow
    //%alm.min=-1 alm.max=1 alm.defl=0
    //%icol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="render"
    //%weight=4
    export function setTextImage(input: string = "", iwidt: number = 0, tid: string, icol: number = 0, bcol: number = 0, alm: number = 0, spacew: number = 0, lineh: number = 0) {
        return setTextImgValue(false, input, iwidt, tid, icol, bcol, alm, spacew, lineh) as Image
    }

    /**
     * render text from my table
     * like basic text animation
     * to image array
     */
    //%blockid=renfont_setimgframefromtext
    //%block="create the image frame of |text $input in page width $iwidt from table id $tid||and |fill col $icol with outline $bcol and got alignment $alm and get debugalm $debugalm"
    //%tid.shadow=renfont_tablenameshadow
    //%alm.min=-1 alm.max=1 alm.defl=0
    //%icol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="render"
    //%weight=2
    export function setTextImageArray(input: string = "", iwidt: number = 0, tid: string, icol: number = 0, bcol: number = 0, alm: number = 0, spacew: number = 0, lineh: number = 0) {
        return setTextImgValue(true, input, iwidt, tid, icol, bcol, alm, spacew, lineh) as Image[]
    }

    /** 
     * render text
     * and stamp to 
     * my dialog frame
     */
    //%blockid=renfont_stamptexttoframe
    //%block="StampStrImgToTheDialogFrame $Fimg=dialog_image_picker Text $Txt Text width $Wval TableId $arrid||And text color col $ucol and outline $bcol Alignment $ualm"
    //%arrid.shadow=renfont_tablenameshadow
    //%ualm.min=-1 ualm.max=1 ualm.defl=0
    //%ucol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="Dialog render"
    //%weight=4
    export function stampStrToDialog(Fimg: Image, Txt: string = "", Wval: number = 0, arrid: string, ucol: number = 0, bcol: number = 0, ualm: number = 0, spacew: number = 0, lineh: number = 0) {
        let StrImg: Image = setTextImage(Txt, Wval, arrid, ucol, bcol, ualm, spacew, lineh)
        let gapw = Math.floor(Fimg.width / 3)
        let gaph = Math.floor(Fimg.height / 3)
        let UfImg: Image = setImgFrame(Fimg, StrImg.width + ((gapw * 2) + Math.floor(gapw / 2)), StrImg.height + ((gaph * 2) + Math.floor(gaph / 2)))
        drawTransparentImage(StrImg.clone(), UfImg, gapw, gaph)
        return UfImg
    }

    /**
     * render text
     * like basic text animation
     * and stamp to 
     * my dialog frame
     * as image array
     */
    //%blockid=renfont_stamptextarrtoframe
    //%block="StampStrAnimToDialogFrame $Fimg=dialog_image_picker Text input $Txt In text width $Wval At table id $arrid||and text color $ucol with outline $bcol And alignment $ualm "
    //%arrid.shadow=renfont_tablenameshadow
    //%ualm.min=-1 ualm.max=1 ualm.defl=0
    //%ucol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="Dialog render"
    //%weight=2
    export function stampStrArrToDialog(Fimg: Image, Txt: string = "", Wval: number = 0, arrid: string, ucol: number = 0, bcol: number = 0, ualm: number = 0, spacew: number = 0, lineh: number = 0) {
        let StrImg2: Image[] = setTextImageArray(Txt, Wval, arrid, ucol, bcol, ualm, spacew, lineh)
        let gapw2 = Math.floor(Fimg.width / 3)
        let gaph2 = Math.floor(Fimg.height / 3)
        let UfImg2: Image = setImgFrame(Fimg, StrImg2[0].width + ((gapw2 * 2) + Math.floor(gapw2 / 2)), StrImg2[0].height + ((gaph2 * 2) + Math.floor(gaph2 / 2)))
        let imgArr: Image[] = []
        let uimg: Image = null
        for (let mgi = 0; mgi < StrImg2.length; mgi++) {
            uimg = UfImg2.clone()
            drawTransparentImage(StrImg2[mgi].clone(), uimg, gapw2, gaph2)
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
        lineheight = input
    }

    /**
     * change the line gap by value
     */
    //%blockid=renfont_changelinegap
    //%block="change line gap by $input"
    //%group="main propety"
    //%weight=2
    export function ChangeLine(input: number) {
        lineheight += input
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

    export enum tempfont { MainFont = 1, ArcadeFont = 2, LatinMini = 3 }

    /**
     * set charcter
     * from template
     */
    //%blockid=renfont_presetfont
    //%block="SetupPresetFont $tempf with table id $tid"
    //%tid.shadow=renfont_tablenameshadow
    //%group="create"
    //%weight=10
    export function setupPresetFont(tempf: tempfont, tid: string) {
        switch (tempf) {
            case 1:
                _mainfont(tid)
                break;
            case 2:
                _arcadefont(tid)
                break;
            case 3:
                _latinmini(tid)
                break;
            default:
                _mainfont(tid)
                break;
        }
    }

    export enum thisDataNumType { Tcol = 1, Bcol = 2, PageW = 3, Talg = 4 }

    export enum spacetype { letterspace = 1, lineheight = 2 }

    export enum colortype { solidcolor = 1, outlinecolor = 2 }

    export enum delaytype { delaypermsec = 1, multisec = 2 }

    /**
     * create the renfont as Sprite
     */
    //%blockid=renfont_Sprite_create
    //%block="create renfont Sprite as $Text in color $Col with outline $Bcol in alignment $alg and tableid $Tid||and page width $PageW"
    //%Tid.shadow=renfont_tablenameshadow Tid.defl="fonttemp"
    //%Col.shadow=colorindexpicker
    //%Bcol.shadow=colorindexpicker
    //%blockSetVariable="myRenfont"
    //%group="Sprite mode"
    //%weight=22
    export function createSprite(Text: string = "", Col: number, Bcol: number, alg: align, Tid: string, PageW: number = 0) {
        let renfontSprite = new RenfontSprite(Text, Col, Bcol, alg, Tid, PageW)
        renfontSprite.setKind(SpriteKind.Renfont)
        renfontSprite.setPosition(Math.floor(scene.screenWidth() / 2), Math.floor(scene.screenHeight() / 2))
        return renfontSprite
    }

    export class RenfontSprite extends Sprite {
        stxt: string
        scol: number
        stid: string
        salg: number
        pagew: number
        spacew: number
        lineh: number
        bcol: number
        scval: number
        anim: boolean
        sdim: Image
        nimg: Image
        imgarr: Image[]

        protected spriteUpdate() {
            if (!this) return;
            if (this.sdim) {
                this.nimg = stampStrToDialog(
                    this.sdim, 
                    this.stxt, 
                    this.pagew, 
                    this.stid, 
                    this.scol, 
                    this.bcol, 
                    this.salg, 
                    this.spacew, 
                    this.lineh
                )
            } else {
                this.nimg = setTextImage(
                    this.stxt, 
                    this.pagew, 
                    this.stid, 
                    this.scol, 
                    this.bcol, 
                    this.salg, 
                    this.spacew, 
                    this.lineh
                )
            }
            if (this.image.equals(this.nimg)) return;
            this.setImage(this.nimg)
        }

        constructor(txt: string, scol: number, bcol: number, alg: align, tid: string, pagew: number) {
            super(setTextImage(
                txt,
                pagew,
                tid,
                scol,
                bcol,
                alg
            ))
            this.stxt = txt, this.scol = scol, this.bcol = bcol, this.stid = tid, this.salg = alg, this.pagew = pagew
            this.spriteUpdate()
        }
    
        /**
         * get text data
         * from renfont Sprite
         */
        //%blockid=renfont_Sprite_readtxt
        //%block="get $this as text data"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=18
        public getSpriteText() {
            return this.stxt
        }
    
        /**
         * get option data number
         * from renfont Sprite
         */
        //%blockid=renfont_Sprite_readthisdatainnum
        //%block="get $this from $NumType"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=16
        public getSpriteTextData(NumType: thisDataNumType) {
            switch (NumType) {
                case 1:
                    return this.scol;
                case 2:
                    return this.bcol;
                case 3:
                    return this.pagew;
                case 4:
                    return this.salg;
                default:
                    return -1;
            }
        }
    
        /**
         * set alignment as enum
         * to renfont Sprite
         */
        //%blockid=renfont_Sprite_setalign
        //%block=" $this=variables_get set align to $alg"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=14
        public setSpriteAlign(alg: align) {
            if (this.salg == getAlign(alg)) return;
            this.salg = getAlign(alg)
            this.spriteUpdate()
        }
    
        /**
         * set alignment as number
         * to renfont Sprite
         */
        //%blockid=renfont_Sprite_setalignnum
        //%block=" $this set align value to $aln"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=12
        public setSpriteAlignNum(aln: number = 0) {
            aln = Math.constrain(aln, -1, 1)
            if (this.salg == aln) return;
            this.salg = aln
            this.spriteUpdate()
        }
    
        /**
         * add or set dialog frame
         * to renfont Sprite
         */
        //%blockid=renfont_Sprite_setdialog
        //%block=" $this set dialog frame to $DlImg=dialog_image_picker"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=10
        public setSpriteDialogTxt(DlImg: Image) {
            if (this.sdim && this.sdim.equals(DlImg)) return;
            this.sdim = DlImg
            this.spriteUpdate()
        }
    
        /**
         * remove dialog frame
         * at renfont Sprite
         */
        //%blockid=renfont_Sprite_cleardialog
        //%block=" $this clear dialog frame"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=9
        public clearSpriteDialog() {
            if (!this.sdim) return;
            this.sdim = undefined
            this.spriteUpdate()
        }
    
    
        /**
         * set gap space 
         * to renfont Sprite
         */
        //%blockid=renfont_Sprite_setlinespace
        //%block=" $this set $gaptype to $value"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=8
        public setGap(gaptype: spacetype, value: number = 0) {
            switch (gaptype) {
                case 1:
                    if (this.spacew == value) return;
                    this.spacew = value
                    break;
                case 2:
                    if (this.lineh == value) return;
                    this.lineh = value
                    break;
                default:
                    return;
            }
            this.spriteUpdate()
        }
    
        /**
         * clear gap space
         * at renfont Sprite
         */
        //%blockid=renfont_Sprite_setdefaultlinespace
        //%block=" $this set $gaptype to default value"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=7
        public setDefaultGap(gaptype: spacetype) {
            switch (gaptype) {
                case 1:
                    if (this.spacew == undefined) return; 
                    this.spacew = undefined
                    break;
                case 2:
                    if (this.lineh == undefined) return;
                    this.lineh = undefined
                    break;
                default:
                    return;
            }
            this.spriteUpdate()
        }
    
        /**
         * set text to render
         * to renfont Sprite
         */
        //%blockid=renfont_Sprite_settextdata
        //%block=" $this set text to $Text"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=20
        public setSpriteText(Text: string) {
            if (this.stxt == Text) return;
            this.stxt = Text
            this.spriteUpdate()
        }

        /**
         * set text color index
         * to renfont Sprite
         */
        //%blockid=renfont_Sprite_settextcolor
        //%block=" $this set $colortexttype to $ncolor"
        //%this.shadow=variables_get this.defl=myRenfont
        //%ncolor.shadow=colorindexpicker
        //%group="Sprite mode"
        //%weight=6
        public setSpriteTextCol(colortexttype: colortype, ncolor: number = 0) {
            switch (colortexttype) {
                case 1:
                    if (this.scol == ncolor) return;
                    this.scol = ncolor
                    break;
                case 2:
                    if (this.bcol == ncolor) return;
                    this.bcol = ncolor
                    break;
                default:
                    return;
            }
            this.spriteUpdate()
        }
    
        /**
         * set table id 
         * to renfont Sprite
         */
        //%blockid=renfont_Sprite_settableid
        //%block=" $this set Table id to $Tid"
        //%Tid.shadow=renfont_tablenameshadow
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=3
        public setSpriteTableId(Tid: string) {
            if (this.stid == Tid) return;
            this.stid = Tid
            this.spriteUpdate()
        }
    
        /**
         * set page width
         * to renfont Sprite
         */
        //%blockid=renfont_Sprite_setpagewidth
        //%block=" $this set page width to $PageW"
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=4
        public setSpritePageWidth(PageW: number = 0) {
            if (this.pagew == PageW) return;
            this.pagew = PageW
            this.spriteUpdate()
        }

        /**
         * play text animation
         * from renfont Sprite
         */
        //%blockid=renfont_Sprite_playanimatiom
        //%block=" $this get animation play for pause type $delaymode in (ms) $secval||and paused $pausev"
        //%secval.defl=100
        //%this.shadow=variables_get this.defl=myRenfont
        //%group="Sprite mode"
        //%weight=2
        public getSpriteAnimPlay(delaymode: delaytype, secval: number, pausev: boolean = false) {
            if (this.anim) return;
            this.anim = true
            this.scval = 0
            let umsec = 0, lensec = 0;
            if (this.sdim) {
                this.imgarr = stampStrArrToDialog(
                    this.sdim, 
                    this.stxt, 
                    this.pagew, 
                    this.stid, 
                    this.scol, 
                    this.bcol, 
                    this.salg, 
                    this.spacew, 
                    this.lineh
                )
            } else {
                this.imgarr = setTextImageArray(
                    this.stxt, 
                    this.pagew, 
                    this.stid, 
                    this.scol, 
                    this.bcol, 
                    this.salg, 
                    this.spacew, 
                    this.lineh
                )
            }
            switch (delaymode) {
                case 1:
                    this.scval = secval - 1
                    umsec = this.scval
                    lensec = this.scval * this.imgarr.length
                    break;
                case 2:
                    this.scval = secval / this.imgarr.length
                    umsec = secval - 1
                    lensec = secval - 1
                    break;
                default:
                    return;
            }
            animation.runImageAnimation(this, this.imgarr, this.scval, false)
            setTimeout(function () {
                this.anim = false
                this.setImage(this.nimg)
            }, lensec)
            if (pausev) pause(lensec);
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
