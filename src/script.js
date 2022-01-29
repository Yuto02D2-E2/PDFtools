
window.addEventListener("load", function init() {
    document.getElementById("now").innerText = new Date().toLocaleDateString();
});

const inputTAG = document.getElementById("inputTAG");
let selectedPDFs = Array();
const selectedFilesView = document.getElementById("selectedFilesView");

document.getElementById("addBtn").addEventListener("click", () => {
    console.log("> add file");
    for (const pdfObj of inputTAG.files) {
        selectedPDFs.push(pdfObj);
        // const url = window.URL.createObjectURL(pdf);
        // console.log(`url:${url}`);
        // window.URL.revokeObjectURL(url);
    }
    selectedFilesView.innerText = "";
    for (const pdf of selectedPDFs) {
        console.log(`selected pdf info::: filename:${pdf.name} / size:${pdf.size} / type:${pdf.type}`);
        selectedFilesView.innerText = selectedFilesView.innerText + `- ${pdf.name}\n`;
    }
});

document.getElementById("clearBtn").addEventListener("click", () => {
    console.log("> clear all selected files");
    selectedFilesView.innerText = "";
    selectedPDFs = Array();
});


/* ref: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/async_function */
document.getElementById("mergeBtn").addEventListener("click", async () => {
    console.log("> execute merge");

    if (selectedPDFs.length < 2) {
        window.alert("ファイルは二つ以上選択してください");
        return;
    }

    for (const pdf of selectedPDFs) {
        console.log(`selected pdf info::: filename:${pdf.name} / size:${pdf.size} / type:${pdf.type}`);
    }

    const PDFDocument = PDFLib.PDFDocument; /* ref: https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.js  */
    const outputPDF = await PDFDocument.create();
    console.log("   > finish create output pdf");

    for (let pdfObj of inputTAG.files) {
        try {
            pdfObj = await PDFDocument.load(await pdfObj.arrayBuffer(), {
                ignoreEncryption: true
            });
            let pdf = await outputPDF.copyPages(pdfObj, pdfObj.getPageIndices());
            pdf.forEach((page) => outputPDF.addPage(page));
        } catch (error) {
            console.log(`err:${error}`);
            window.alert("結合処理でエラーが発生しました\n現在は英語のみのPDFにしか対応していません");
            return;
        }
    }
    console.log("   > finish copy to output pdf");

    const outputPDFbytes = await outputPDF.save();
    console.log("   > finish save");
    const now = new Date();
    const outputFileName = document.getElementById("outputFileName").value ||
        now.toLocaleDateString().replace(/\//g, "-") + "-" + now.toLocaleTimeString().replace(/:/g, "-");
    download(outputPDFbytes, outputFileName, "application/pdf"); /* ref: ./library/download.js */

    console.log("> successful completed");
});
