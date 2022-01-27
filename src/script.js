/*
TODO:
・ユーザーがformからアップロードしたpdfファイルをpdf-libで結合
    制約
    ・ファイルの数が二つ以上
    ・ファイルの拡張子がpdf
    設定
    ・先頭にファイルを付け足し
    ・ファイルの順番を入れ替え
・結合したpdfファイルをダウンロードできるように表示(どうやって？)
    ・プレビューを表示しても良いかも
*/

window.addEventListener("load", function init() {
    document.getElementById("now").innerText = new Date().toLocaleDateString();
});

let inputFiles = Array();
const input = document.querySelector("input");
const selectedFilesView = document.getElementById("selectedFilesView");

document.getElementById("addBtn").addEventListener("click", () => {
    console.log("add file");
    for (const file of input.files) {
        console.log(`files info::: filename:${file.name} / size:${file.size} / type:${file.type}`);
        inputFiles.push(file);
    }
    selectedFilesView.innerText = "";
    for (const iF of inputFiles) {
        console.log(`iF info::: filename:${iF.name} / size:${iF.size} / type:${iF.type}`);
        selectedFilesView.innerText = selectedFilesView.innerText + `・${iF.name}\n`;
    }
});

document.getElementById("clearBtn").addEventListener("click", () => {
    console.log("clear all selected files");
    selectedFilesView.innerHTML = "";
    inputFiles = Array();
});

document.getElementById("mergeBtn").addEventListener("click", () => {
    console.log("execute merge");
    // using "pdf-lib" library
    console.log("successful completed");
});
