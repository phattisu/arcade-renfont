
namespace RenFontTable {
    let kindid: number;

    export function create() {
        if (!(kindid)) kindid = 0
        return kindid++
    }

    //%isKind
    export const myMember = create()
}

namespace SpriteKind {
    export const renfontSprite = SpriteKind.create()
}

//%color="#12d48a" icon="\uf031" group="[Sprites, Scene, Text]" block="Ren font"
namespace RenFont {

    let rendering = false, tablename: number[] = [], ligs: string[][] = [], ligages: Image[][] = [], ligwidth: number[][] = [], ligsubw: number[][] = [], ligdir: number[][] = [], ligcol: number[][] = [], ligul: number[][] = [], storeid: number[] = [], letterspace: number = 1, curid: number = 0, lineheight: number = 1;

    function gettableid(name: number) {
        if (tablename.indexOf(name) < 0) {
            tablename.push(name); storeid.push(curid); ligs.push([]); ligages.push([]); ligwidth.push([]); ligsubw.push([]); ligdir.push([]); ligcol.push([]); ligul.push([]); curid += 1;
            return tablename.length - 1
        }
        return tablename.indexOf(name)
    }

    function drawTransparentImage(src: Image, to: Image, x: number, y: number) {
        if (!src || !to) { return; }
        to.drawTransparentImage(src, x, y)
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
        let uc = charstr.charAt(idx + ic)
        let istr = "" + ustr + uc
        if (ligs[tid].indexOf(istr) < 0) { return ustr }
        while (ligs[tid].indexOf(istr) >= 0) {
            ustr = "" + ustr + uc
            if (reverse) ic--;
            else ic++;
            uc = charstr.charAt(idx + ic)
            istr = "" + ustr + uc
            if (idx + ic >= charstr.length) { break }
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

    function SetImgFrame(ImgF: Image, Wh: number, Ht: number) {
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

    function background(then: () => void) {
        control.runInBackground(then)
    }

    function after(time: number, thenDo: () => void) {
        setTimeout(thenDo, time)
    }

    //%shim=KIND_GET
    //%kindMemberName=font
    //%blockHidden
    //%blockid=renfont_tablenameshadow
    //%block="$kind"
    //%kindNamespace=RenFontTable
    //%kindPromptHint="enter your font name here"
    //%name.fieldEditor="autocomplete" name.fieldOptions.decompileLiterals=true
    //%name.fieldOptions.key="tablenameshadow"
    export function _tableNameShadow(kind: number) {
        return kind
    }

    /**
     * add charcter glyph to the table
     */
    //%blockid=renfont_setcharecter
    //%block="set |table id $gid and set letter $glyph to img $imgi=screen_image_picker||and |the letter can move? $notmove and stay on or under the letter? $onthechar and substract width $inchar erase col $bcol spacebar col $scol base col $mcol guard col $ncol"
    //%gid.shadow=renfont_tablenameshadow gid.defl="fonttemp"
    //%bcol.shadow=colorindexpicker
    //%scol.shadow=colorindexpicker
    //%mcol.shadow=colorindexpicker
    //%ncol.shadow=colorindexpicker
    //%group="create"
    //%weight=2
    export function setCharecter(gid: number, glyph: string = "", imgi: Image = image.create(5, 8), notmove: boolean = false, onthechar: boolean = false, inchar: boolean = false, bcol: number = 0, scol: number = 0, mcol: number = 0, ncol: number = 0) {
        let tid = gettableid(gid), sncol = true, scnwidt = true, scwidt = false, wi3 = 0, wj = 0, si = 0, imgj = image.create(imgi.width, imgi.height);
        if (bcol > 0 && bcol < 16) imgi.replace(bcol, 0)
        let uimg = imgi.clone()
        let start = false, stop = false
        let bufv = pins.createBuffer(uimg.height), count = [], i = 0, x0 = 0, x1 = imgi.width, y0 = 0, y1 = imgi.height
        for (let x = 0; x < uimg.width; x += i) {
            count = []
            for (i = 0; x + i < uimg.width; i++) {
                uimg.getRows(x + i, bufv)
                count.push(bufv.toArray(NumberFormat.UInt8LE).filter(val => ((val == mcol || val == ncol) || val == scol)).length)
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
            uwid = Math.abs(wi3 - wj); if (true) { uwid = wj }
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

    export class gCprop { constructor(public chars: string, public offsets: number[]) { } }

    //%blockid=renfont_gcharsprop
    //%block="chars $chars offset $offsets"
    export function gCharProp(chars: string, offsets: number[]) { return new gCprop(chars, offsets) }

    export function charprops(groupc: gCprop, stayc: gCprop, cinc: gCprop, csub: gCprop): gCprop[] { return [groupc, stayc, cinc, csub] }

    export class gCarrProp { constructor(public chars: string[], public offsets: number[]) { } }




    //%blockid=renfont_gchararrsprop
    //%block="chars array $chars offset $offsets"
    export function gcarrprop(chars: string[], offsets: number[]) { return new gCarrProp(chars, offsets) }

    export class colorGlyphProp { constructor(public bgcolor: number, public gapcolor: number, public basecolor: number, public guardcolor: number) { } }

    //%blockid=renfont_colglyphprop
    //%block="color:| bg $bgcol gap $gapcol base $basecol guard $guardcol"
    export function colglyphprop(bgcol: number, gapcol: number, basecol: number, guardcol: number) { return new colorGlyphProp(bgcol, gapcol, basecol, guardcol) }

    /**
     * add more glyph
     * from charcter sheet
     * to the table
     */
    //%blockid=renfont_setcharfromimgsheet
    //%block="set |table id $tid and set img sheet $PngSheet=screen_image_picker with letters $GroupChar||and |staying letters $StayChar letters on the letters $CharOnChar and Char Substact $CharSubW width $twid height $thei erase col $bcl space col $scl base col $mcl guard col $ncl"
    //%tid.shadow=renfont_tablenameshadow tid.defl="fonttemp"
    //%bcl.shadow=colorindexpicker
    //%scl.shadow=colorindexpicker
    //%mcl.shadow=colorindexpicker
    //%ncl.shadow=colorindexpicker
    //%group="create"
    //%weight=4
    export function setCharFromSheet(tid: number, PngSheet: Image = image.create(10, 16), GroupChar: string = "", StayChar: string = "", CharOnChar: string = "", CharSubW: string = "", twid: number = 5, thei: number = 8, bcl: number = 0, scl: number = 0, mcl: number = 0, ncl: number = 0) {
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
    //%tid.shadow=renfont_tablenameshadow tid.defl="fonttemp"
    //%bcl.shadow=colorindexpicker
    //%scl.shadow=colorindexpicker
    //%mcl.shadow=colorindexpicker
    //%ncl.shadow=colorindexpicker
    //%group="create"
    //%weight=6
    export function setCharArrFromSheet(tid: number, PngSheet: Image = image.create(10, 16), GroupChar: string[] = [], StayChar: string[] = [], CharOnChar: string[] = [], CharSubW: string[] = [], twid: number = 5, thei: number = 8, bcl: number = 0, scl: number = 0, mcl: number = 0, ncl: number = 0) {
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
    //%gid.shadow=renfont_tablenameshadow gid.defl="fonttemp"
    //%group="datainfo"
    //%weight=2
    export function NumOfGlyphs(gid: number): number {
        let tid2 = gettableid(gid)
        return ligs[tid2].length
    }

    /**
     * read the array charcter image
     * of my table
     */
    //%blockid=renfont_arrofgypimg
    //%block="array of glyph images in table id $gid"
    //%gid.shadow=renfont_tablenameshadow gid.defl="fonttemp"
    //%group="datainfo"
    //%weight=4
    export function ImageArray(gid: number): Image[] {
        let tid3 = gettableid(gid)
        return ligages[tid3]
    }

    /**
     * read the array charcter
     * of my table
     */
    //%blockid=renfont_arrofglyphs
    //%block="array of glyphs in table id $gid"
    //%gid.shadow=renfont_tablenameshadow gid.defl="fonttemp"
    //%group="datainfo"
    //%weight=6
    export function GlyphArray(gid: number): String[] {
        let tid4 = gettableid(gid)
        return ligs[tid4]
    }

    function SetTextImgValue(arrm: boolean, input: string, iwidt: number, lid: number, icol: number = 0, bcol: number = 0, alm: number = 0, spacew: number = undefined, lineh: number = undefined) {
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
                wie += 3 * spacew
            } else {
                wie += 2 * spacew
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
                wie += 3 * spacew
            } else {
                wie += 2 * spacew
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
                curwidt += 3 * spacew
            } else {
                curwidt += 2 * spacew
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
                    if (findCommand(input, "n", currentletter3)) {
                        currentletter3 += 2
                    }
                }
            } else if (findCommand(input, "n", currentletter3)) {
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
    //%block="create the image of |text $input in page width $iwidt from table id $tid||and |fill col $icol with outline $bcol and got alignment $alm gapwidth $spacew lineheight $lineh"
    //%tid.shadow=renfont_tablenameshadow tid.defl="fonttemp"
    //%alm.min=-1 alm.max=1 alm.defl=0
    //%icol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="render"
    //%weight=4
    export function SetTextImage(input: string = "", iwidt: number = 0, tid: number, icol: number = 0, bcol: number = 0, alm: number = 0, spacew: number = 0, lineh: number = 0) {
        return SetTextImgValue(false, input, iwidt, tid, icol, bcol, alm, spacew, lineh) as Image
    }

    /**
     * render text from my table
     * like basic text animation
     * to image array
     */
    //%blockid=renfont_setimgframefromtext
    //%block="create the image frame of |text $input in page width $iwidt from table id $tid||and |fill col $icol with outline $bcol and got alignment $alm gapwidth $spacew lineheight $lineh"
    //%tid.shadow=renfont_tablenameshadow tid.defl="fonttemp"
    //%alm.min=-1 alm.max=1 alm.defl=0
    //%icol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="render"
    //%weight=2
    export function SetTextImageArray(input: string = "", iwidt: number = 0, tid: number, icol: number = 0, bcol: number = 0, alm: number = 0, spacew: number = 0, lineh: number = 0) {
        return SetTextImgValue(true, input, iwidt, tid, icol, bcol, alm, spacew, lineh) as Image[]
    }

    /** 
     * render text
     * and stamp to 
     * my dialog frame
     */
    //%blockid=renfont_stamptexttoframe
    //%block="StampStrImgToTheDialogFrame $Fimg=dialog_image_picker Text $Txt Text width $Wval TableId $arrid||And text color col $ucol and outline $bcol Alignment $ualm gapwidth $spacew lineheight $lineh"
    //%arrid.shadow=renfont_tablenameshadow arrid.defl="fonttemp"
    //%ualm.min=-1 ualm.max=1 ualm.defl=0
    //%ucol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="Dialog render"
    //%weight=4
    export function StampStrToDialog(Fimg: Image, Txt: string = "", Wval: number = 0, arrid: number, ucol: number = 0, bcol: number = 0, ualm: number = 0, spacew: number = 0, lineh: number = 0) {
        let StrImg: Image = SetTextImage(Txt, Wval, arrid, ucol, bcol, ualm, spacew, lineh)
        let gapw = Math.floor(Fimg.width / 3)
        let gaph = Math.floor(Fimg.height / 3)
        let UfImg: Image = SetImgFrame(Fimg, StrImg.width + ((gapw * 2) + Math.floor(gapw / 2)), StrImg.height + ((gaph * 2) + Math.floor(gaph / 2)))
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
    //%block="StampStrAnimToDialogFrame $Fimg=dialog_image_picker Text input $Txt In text width $Wval At table id $arrid||and text color $ucol with outline $bcol And alignment $ualm gapwidth $spacew lineheight $lineh"
    //%arrid.shadow=renfont_tablenameshadow arrid.defl="fonttemp"
    //%ualm.min=-1 ualm.max=1 ualm.defl=0
    //%ucol.shadow=colorindexpicker
    //%bcol.shadow=colorindexpicker
    //%group="Dialog render"
    //%weight=2
    export function StampStrArrToDialog(Fimg: Image, Txt: string = "", Wval: number = 0, arrid: number, ucol: number = 0, bcol: number = 0, ualm: number = 0, spacew: number = 0, lineh: number = 0) {
        let StrImg2: Image[] = SetTextImageArray(Txt, Wval, arrid, ucol, bcol, ualm, spacew, lineh)
        let gapw2 = Math.floor(Fimg.width / 3)
        let gaph2 = Math.floor(Fimg.height / 3)
        let UfImg2: Image = SetImgFrame(Fimg, StrImg2[0].width + ((gapw2 * 2) + Math.floor(gapw2 / 2)), StrImg2[0].height + ((gaph2 * 2) + Math.floor(gaph2 / 2)))
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
    //%group="modify"
    //%weight=8
    export function SetSpace(input: number) {
        letterspace = input
    }

    /**
     * change the letterspace by value
     */
    //%blockid=renfont_changeletterspacing
    //%block="change letter spacing by $input"
    //%group="modify"
    //%weight=6
    export function ChangeSpace(input: number) {
        letterspace += input
    }

    /**
     * set the line gap by value
     */
    //%blockid=renfont_setlinegap
    //%block="set line gap by $input"
    //%group="modify"
    //%weight=4
    export function SetLine(input: number) {
        lineheight = input
    }

    /**
     * change the line gap by value
     */
    //%blockid=renfont_changelinegap
    //%block="change line gap by $input"
    //%group="modify"
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
    //%group="modify"
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
    //%tid.shadow=renfont_tablenameshadow tid.defl="fonttemp"
    //%group="create"
    //%weight=10
    export function SetupPresetFont(tempf: tempfont, tid: number) {
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

    export class RenfontSprite extends Sprite {
        //%blockCombine
        stxt: string
        //%blockCombine
        scol: number
        //%blockCombine
        stid: number
        //%blockCombine
        stxw: number
        //%blockCombine
        salg: number
        //%blockCombine
        pagew: number
        //%blockCombine
        spacew: number
        //%blockCombine
        lineh: number
        //%blockCombine
        bcol: number
        
        scval: number
        sidx: number
        anim: boolean
        anip: boolean
        sdim: Image
        nimg: Image
        imgarr: Image[]

        constructor(txt: string, tcol: number, bcol: number, alg: align, tid: number, pagew: number = 0) {
            super(image.create(16, 16))
            this.stxt = txt, this.scol = tcol, this.bcol = bcol, this.salg = alg, this.stid = tid, this.pagew = pagew
            this.spriteUpdate()
        }

        spriteUpdate() {
            if (this.sdim) {
                this.nimg = StampStrToDialog(this.sdim, this.stxt, this.pagew, this.stid, this.scol, this.bcol, this.salg, this.spacew, this.lineh)
            } else {
                this.nimg = SetTextImage(this.stxt, this.pagew, this.stid, this.scol, this.bcol, this.salg, this.spacew, this.lineh)
            }
            if (this.image.equals(this.nimg)) return;
            this.setImage(this.nimg)
        }
    }
        
    /**
     * get text data
     * from unifont sprite
     */
    //%blockid=renfont_sprite_readtxt
    //%block="get $myrenfont as text data"
    //%myrenfont.shadow=variables_get myrenfont.defl=myrenfont
    //%group="sprite mode"
    //%weight=18
    export function getTextData(myrenfont: Sprite) { return (myrenfont as RenfontSprite).stxt}

    /**
     * set alignment as enum
     * to unifont sprite
     */
    //%blockid=renfont_sprite_setalign
    //%block=" $myrenfont=variables_get set align to $alg"
    //%myrenfont.shadow=variables_get myrenfont.defl=myrenfont
    //%group="sprite mode"
    //%weight=14
    export function setAlign(myrenfont: Sprite, alg: align) {
        if ((myrenfont as RenfontSprite).salg == getAlign(alg)) return;
        (myrenfont as RenfontSprite).salg = getAlign(alg);
        (myrenfont as RenfontSprite).spriteUpdate();
    }

    /**
     * set alignment as number
     * to unifont sprite
     */
    //%blockid=renfont_sprite_setalignnum
    //%block=" $myrenfont set align value to $aln"
    //%myrenfont.shadow=variables_get myrenfont.defl=myrenfont
    //%group="sprite mode"
    //%weight=12
    export function setAlignNum(myrenfont: Sprite, aln: number) {
        if ((myrenfont as RenfontSprite).salg == aln) return;
        (myrenfont as RenfontSprite).salg = aln;
        (myrenfont as RenfontSprite).spriteUpdate();
    }

    /**
     * add or set dialog frame
     * to unifont sprite
     */
    //%blockid=renfont_sprite_setdialog
    //%block=" $myrenfont set dialog frame to $DlImg=dialog_image_picker"
    //%myrenfont.shadow=variables_get myrenfont.defl=myrenfont
    //%group="sprite mode"
    //%weight=10
    export function setDialogTxt(myrenfont: Sprite, DlImg: Image) {
        if ((myrenfont as RenfontSprite).sdim && ((myrenfont as RenfontSprite).sdim.equals(DlImg) && !((myrenfont as RenfontSprite).sdim.equals(image.create(1,1))))) return;
        (myrenfont as RenfontSprite).sdim = DlImg;
        (myrenfont as RenfontSprite).spriteUpdate();
    }

    /**
     * remove dialog frame
     * at unifont sprite
     */
    //%blockid=renfont_sprite_cleardialog
    //%block=" $myrenfont clear dialog frame"
    //%myrenfont.shadow=variables_get myrenfont.defl=myrenfont
    //%group="sprite mode"
    //%weight=9
    export function clearDialog(myrenfont: Sprite) {
        if (!((myrenfont as RenfontSprite).sdim)) { return; }
        (myrenfont as RenfontSprite).sdim = image.create(1,1);
        (myrenfont as RenfontSprite).spriteUpdate();
    }

    export enum SprDataNumType { Tcol = 1, Bcol = 2, PageW = 3, Talg = 4 }

    /**
     * create the renfont as sprite
     */
    //%blockid=renfont_sprite_create
    //%block="create renfont sprite as $Text in color $Col with outline $Bcol in alignment $alg and tableid $Tid||and page width $PageW"
    //%Tid.shadow=renfont_tablenameshadow Tid.defl="fonttemp"
    //%Col.shadow=colorindexpicker
    //%Bcol.shadow=colorindexpicker
    //%blockSetVariable="myrenfont"
    //%group="sprite mode"
    //%weight=22
    export function createRenfontSprite(Text: string = "", Col: number, Bcol: number, alg: align, Tid: number, PageW: number = 0) {
        let renfontSprite = new RenfontSprite(Text, Col, Bcol, alg, Tid, PageW)
        renfontSprite.setPosition(Math.floor(scene.screenWidth() / 2), Math.floor(scene.screenHeight() / 2))
        return renfontSprite
    }

    /**
     * get text data
     * from unifont sprite
     */
    //%blockid=renfont_sprite_readtxt
    //%block="get $myrenfont as text data"
    //%myrenfont.shadow=variables_get myrenfont.defl=myrenfont
    //%group="sprite mode"
    //%weight=18
    export function getSpriteText(myrenfont: Sprite) {
        return (myrenfont as RenfontSprite).stxt
    }

    export enum spacetype { letterspace = 1, lineheight = 2 }

    /**
     * set gap space 
     * to unifont sprite
     */
    //%blockid=renfont_sprite_setlinespace
    //%block=" $myrenfont set $gaptype to $value"
    //%myrenfont.shadow=variables_get myrenfont.defl=myrenfont
    //%group="sprite mode"
    //%weight=8
    export function setGapSpr(myrenfont: Sprite, gaptype: spacetype, value: number = 0) {
        switch (gaptype) {
            case 1:
                if ((myrenfont as RenfontSprite).spacew == value) return;
                (myrenfont as RenfontSprite).spacew = value
                break;
            case 2:
                if ((myrenfont as RenfontSprite).lineh == value) return;
                (myrenfont as RenfontSprite).lineh = value
                break;
            default:
                return;
        }
        (myrenfont as RenfontSprite).spriteUpdate()
    }

    /**
     * clear gap space
     * at unifont sprite
     */
    //%blockid=renfont_sprite_setdefaultlinespace
    //%block=" $myrenfont set $gaptype to default value"
    //%myrenfont.shadow=variables_get myrenfont.defl=myrenfont
    //%group="sprite mode"
    //%weight=7
    export function setDefaultGapSpr(myrenfont: Sprite, gaptype: spacetype) {
        switch (gaptype) {
            case 1:
                if ((myrenfont as RenfontSprite).spacew == undefined) return;
                (myrenfont as RenfontSprite).spacew = undefined
                break;
            case 2:
                if ((myrenfont as RenfontSprite).lineh == undefined) return;
                (myrenfont as RenfontSprite).lineh = undefined
                break;
            default:
                return;
        }
        (myrenfont as RenfontSprite).spriteUpdate()
    }

    /**
     * set text to render
     * to unifont sprite
     */
    //%blockid=renfont_sprite_settextdata
    //%block=" $myrenfont set text to $Text"
    //%myrenfont.shadow=variables_get myrenfont.defl=myrenfont
    //%group="sprite mode"
    //%weight=20
    export function setSpriteText(myrenfont: Sprite, Text: string = "") {
        if ((myrenfont as RenfontSprite).stxt == Text) return;
        (myrenfont as RenfontSprite).stxt = Text;
        (myrenfont as RenfontSprite).spriteUpdate();
    }

    export enum colortype { solidcolor = 1, outlinecolor = 2 }

    /**
     * set text color index
     * to unifont sprite
     */
    //%blockid=renfont_sprite_settextcolor
    //%block=" $myrenfont set $colortexttype to $ncolor"
    //%myrenfont.shadow=variables_get myrenfont.defl=myrenfont
    //%ncolor.shadow=colorindexpicker
    //%group="sprite mode"
    //%weight=6
    export function setSpriteTextCol(myrenfont: Sprite, colortexttype: colortype, ncolor: number = 0) {
        switch (colortexttype) {
            case 1:
                if ((myrenfont as RenfontSprite).scol == ncolor) return;
                (myrenfont as RenfontSprite).scol = ncolor
                break;
            case 2:
                if ((myrenfont as RenfontSprite).bcol == ncolor) return;
                (myrenfont as RenfontSprite).bcol = ncolor
                break;
            default:
                return;
        }
        (myrenfont as RenfontSprite).spriteUpdate()
    }

    /**
     * set table id 
     * to unifont sprite
     */
    //%blockid=renfont_sprite_settableid
    //%block=" $myrenfont set Table id to $Tid"
    //%Tid.shadow=renfont_tablenameshadow Tid.defl="fonttemp"
    //%myrenfont.shadow=variables_get myrenfont.defl=myrenfont
    //%group="sprite mode"
    //%weight=3
    export function setSpriteTableId(myrenfont: Sprite, Tid: number) {
        if ((myrenfont as RenfontSprite).stid == Tid) return;
        (myrenfont as RenfontSprite).stid = Tid;
        (myrenfont as RenfontSprite).spriteUpdate();
    }

    /**
     * set page width
     * to unifont sprite
     */
    //%blockid=renfont_sprite_setpagewidth
    //%block=" $myrenfont set page width to $PageW"
    //%myrenfont.shadow=variables_get myrenfont.defl=myrenfont
    //%group="sprite mode"
    //%weight=4
    export function setSpritePageWidth(myrenfont: Sprite, PageW: number = 0) {
        if ((myrenfont as RenfontSprite).stxw == PageW) return;
        (myrenfont as RenfontSprite).stxw = PageW;
        (myrenfont as RenfontSprite).spriteUpdate();
    }

    export enum delaytype { delaypermsec = 1, multisec = 2 }

    /**
     * play text animation
     * from unifont sprite
     */
    //%blockid=renfont_sprite_playanimatiom
    //%block=" $myrenfont get animation play for pause type $delaymode in (ms) $secval||and separeted $pausev"
    //%secval.defl=100
    //%myrenfont.shadow=variables_get myrenfont.defl=myrenfont
    //%group="sprite mode"
    //%weight=2
    export function getSpriteAnimPlay(myrenfont: Sprite, delaymode: delaytype, secval: number, pausev: boolean = false) {
        if ((myrenfont as RenfontSprite).anim) return;
        (myrenfont as RenfontSprite).scval = 0
        let umsec = 0, lensec = 0;
        if ((myrenfont as RenfontSprite).sdim) {
            (myrenfont as RenfontSprite).imgarr = StampStrArrToDialog(
                (myrenfont as RenfontSprite).sdim,
                (myrenfont as RenfontSprite).stxt,
                (myrenfont as RenfontSprite).stxw,
                (myrenfont as RenfontSprite).stid,
                (myrenfont as RenfontSprite).scol,
                (myrenfont as RenfontSprite).bcol,
                (myrenfont as RenfontSprite).salg,
                (myrenfont as RenfontSprite).spacew,
                (myrenfont as RenfontSprite).lineh
            )
        } else {
            (myrenfont as RenfontSprite).imgarr = SetTextImageArray(
                (myrenfont as RenfontSprite).stxt,
                (myrenfont as RenfontSprite).stxw,
                (myrenfont as RenfontSprite).stid,
                (myrenfont as RenfontSprite).scol,
                (myrenfont as RenfontSprite).bcol,
                (myrenfont as RenfontSprite).salg,
                (myrenfont as RenfontSprite).spacew,
                (myrenfont as RenfontSprite).lineh
                )
        }
        switch (delaymode) {
            case 1:
                (myrenfont as RenfontSprite).scval = secval
                umsec = secval
                lensec = secval * (myrenfont as RenfontSprite).imgarr.length
                break;
            case 2:
                (myrenfont as RenfontSprite).scval = secval / (myrenfont as RenfontSprite).imgarr.length
                umsec = secval
                lensec = secval
                break;
            default:
                return;
        }
        (myrenfont as RenfontSprite).sidx = 0
        if (pausev) {
            (myrenfont as RenfontSprite).anim = true;
            (myrenfont as RenfontSprite).anip = false;
            background(function () {
                for (let i = 0; i < (myrenfont as RenfontSprite).imgarr.length; i++) {
                    myrenfont.setImage((myrenfont as RenfontSprite).imgarr[i])
                    pause((myrenfont as RenfontSprite).scval)
                }
            })
            myrenfont.setImage((myrenfont as RenfontSprite).nimg);
            (myrenfont as RenfontSprite).anim = false;
            return;
        }
        if (!(myrenfont as RenfontSprite).anim && !(myrenfont as RenfontSprite).anip) {
            (myrenfont as RenfontSprite).anip = true;
            (myrenfont as RenfontSprite).anim = true;
            animation.runImageAnimation(myrenfont, (myrenfont as RenfontSprite).imgarr, (myrenfont as RenfontSprite).scval, false)
        } else if (myrenfont.image.equals((myrenfont as RenfontSprite).nimg)) {
            (myrenfont as RenfontSprite).anip = false;
            (myrenfont as RenfontSprite).anim = false;
        }
        after(lensec, function () {
            (myrenfont as RenfontSprite).anip = false;
            (myrenfont as RenfontSprite).anim = false;
            myrenfont.setImage((myrenfont as RenfontSprite).nimg);
        })
    }

    /**
     * check unifont sprite
     * playing animation until done
     */
    //%blockid=renfont_sprite_playanimisdone
    //%block=" $myrenfont get animation is stop"
    //%myrenfont.shadow=variables_get myrenfont.defl=myrenfont
    //%group="sprite mode"
    //%weight=1
    export function animdone(myrenfont: Sprite) {
        return !((myrenfont as RenfontSprite).anim)
    }

    function rot90(im: Image) {
        const w = im.width;
        const h = im.height;
        const output = image.create(h, w);
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                const c = im.getPixel(x, h - y - 1);
                output.setPixel(y, x, c);
            }
        }
        return output;
    }

}