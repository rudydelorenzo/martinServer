function assignListeners() {
    document.getElementById("copyright-button").addEventListener("click", function(e) {
        alert("COPYRIGHT © 2020 - RUDY DE LORENZO\n\nBMW© AND THE BMW LOGO ARE REGISTERED TRADEMARKS\nOF BAYERISCHE MOTOREN WERKE AG. ALL RIGHTS RESERVED");
    });

    document.getElementById("donate-button").addEventListener("click", function(e) {
        document.getElementById("paypalForm").submit();
    });
}

function addRow() {
    var table = document.getElementById("partsTable");
    var row = table.insertRow(-1);
    var pnCell = row.insertCell(0);
    var pnameCell = row.insertCell(1);
    
    pnCell.innerHTML = '<input type="text" placeholder="PN">';
    pnameCell.innerHTML = '<input type="text" placeholder="Name">';
}

function deleteRow() {
    var table = document.getElementById("partsTable");
    table.deleteRow(-1);
    if (table.rows.length <= 1) {
        var row = table.insertRow(-1);
        var pnCell = row.insertCell(0);
        var pnameCell = row.insertCell(1);

        pnCell.innerHTML = '<input type="text" placeholder="PN">';
        pnameCell.innerHTML = '<input type="text" placeholder="Name">';
    }
}

function submitSearch() {
    var partsText = "";
    var table = document.getElementById("partsTable");
    
    var tableRows = table.rows;
    for (i = 1; i < tableRows.length; i++) {
        currentRow = tableRows[i];
        rowCells = currentRow.cells;
        if (rowCells[0].children[0].value != "") {
            //only add if there is a part number
            partsText = partsText.concat(rowCells[0].children[0].value,"\t",rowCells[1].children[0].value,"\n");
        }
    }
    
    var tli = document.getElementById("textListInput");
    tli.value = partsText;
    
    document.getElementById("searchform").submit();
}