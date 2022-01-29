/*
とりあえずちゃんと動くようになった(日本語も大体OK．ファイルによってはエラーになる時もある)
試行錯誤しながら書いたからコードがめちゃくちゃ汚いので，後でリファクタリングする
後，余裕があれば「表紙を付ける」機能を実装しても良いかも
*/


window.addEventListener("load", function init() {
    document.getElementById("now").innerText = new Date().toLocaleDateString();
    document.getElementById("errWindow").innerHTML = "";
});

const inputTAG = document.getElementById("inputTAG");
let selectedPDFs = Array();
const selectedFilesView = document.getElementById("selectedFilesView");
let selectedFilesCnt = 0;

document.getElementById("addBtn").addEventListener("click", () => {
    console.log("> add file");
    if (inputTAG.files.length < 1) {
        window.alert(`
ファイルが選択されていません．
結合したいファイルを左側の「ファイル選択」から追加してください
    `);
    }
    for (const pdfObj of inputTAG.files) {
        selectedPDFs.push(pdfObj);
        selectedFilesCnt += 1;
        // const url = window.URL.createObjectURL(pdf);
        // console.log(`url:${url}`);
        // window.URL.revokeObjectURL(url);
    }
    selectedFilesView.innerText = "";
    for (const pdf of selectedPDFs) {
        console.log(`selected pdf info::: filename:${pdf.name} / size:${pdf.size} / type:${pdf.type}`);
        selectedFilesView.innerText = selectedFilesView.innerText + `- ${pdf.name}\n`;
    }
    document.getElementById("selectedFilesCnt").innerText = selectedFilesCnt;
});

document.getElementById("clearBtn").addEventListener("click", () => {
    console.log("> clear all selected files");
    selectedFilesView.innerText = "";
    selectedPDFs = Array();
    selectedFilesCnt = 0;
    document.getElementById("selectedFilesCnt").innerText = selectedFilesCnt;
});

/* ref: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/async_function */
document.getElementById("mergeBtn").addEventListener("click", async () => {
    console.log("> execute merge");

    if (selectedPDFs.length < 2) {
        window.alert(`
ファイルが選択されていないか，ファイルの数が少ないです．
ファイルは二つ以上必要です．
また，ファイルを選択後，addボタンを押してください．
        `);
        return;
    }

    for (const pdf of selectedPDFs) {
        console.log(`selected pdf info::: filename:${pdf.name} / size:${pdf.size} / type:${pdf.type}`);
    }

    // create output pdf object
    const PDFDocument = PDFLib.PDFDocument; /* ref: https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.js  */
    const outputPDF = await PDFDocument.create();
    console.log("   > finish create output pdf");

    // font settings for japanese
    outputPDF.registerFontkit(fontkit);
    const fontUrl = "./font/NotoSerifJP-Regular.otf";
    const fontBytes = await fetch(fontUrl).then((res) => {
        return res.arrayBuffer();
    });
    // const customFont = await outputPDF.embedFont(fontBytes);

    // copy data from input pdf to output pdf
    for (let pdfObj of inputTAG.files) {
        try {
            pdfObj = await PDFDocument.load(await pdfObj.arrayBuffer(), {
                ignoreEncryption: true
            });
            let pdf = await outputPDF.copyPages(pdfObj, pdfObj.getPageIndices());
            pdf.forEach((page) => outputPDF.addPage(page));
        } catch (errMessage) {
            console.log(`err:${errMessage}`);
            window.scroll({
                top: 0,
                behavior: "smooth"
            });
            document.getElementById("errWindow").innerHTML = `
                <h1>エラー</h1>
                結合処理中にエラーが発生しました．作者もよく分かっていませんが，フォント？などの問題っぽいです．
                ファイルの順番を入れ替えたり，違うファイルで試して見てください．
                <h2>エラーメッセージ</h2>
                <p>${errMessage}</p>
            `;
            return;
        }
    }
    console.log("   > finish copy to output pdf");

    // set output file name and exec download
    const outputPDFbytes = await outputPDF.save();
    console.log("   > finish save");
    const now = new Date();
    const outputFileName = document.getElementById("outputFileName").value ||
        now.toLocaleDateString().replace(/\//g, "-") + "-" + now.toLocaleTimeString().replace(/:/g, "-");
    download(outputPDFbytes, outputFileName, "application/pdf"); /* ref: ./library/download.js */

    console.log("> successful completed");
});
