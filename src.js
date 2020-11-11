var body = document.body;
var tableCreated = false;
var myTableDiv = document.getElementById("myDynamicTable");
var rowCountEle = document.getElementById("rowCount");
var colCountEle = document.getElementById("colCount");
var rowCount = 5,
  colCount = 5;

document.getElementById("new").addEventListener("click", tableCreate);
document.getElementById("addRow").addEventListener("click", addRowToTable);
document.getElementById("addCol").addEventListener("click", addColToTable);
document.getElementById("export").addEventListener("click", exportTableToCSV);

var tbl = document.createElement("table");
tbl.id = "mytable";
tbl.className = "table table-hover";
tbl.style.border = "1px solid black";

function tableCreate() {
  getDimensions();
  if (!tableCreated) {
    createNewTable();
  }
}

function createNewTable() {
  var thead = tbl.createTHead();
  var tbody = tbl.createTBody();
  var thr = thead.insertRow();
  thr.insertCell("");
  for (var i = 0; i < colCount; i++) {
    var td = thr.insertCell();
    td.className = "head-main-data";
    td.id = "col_" + i;
    addDelIcon(td, deleteColumn);
    addSortIcon(td, sortColumn);
  }

  for (var j = 0; j < rowCount; j++) {
    addRow(tbody, "row_" + j);
  }
  myTableDiv.appendChild(tbl);
  tableCreated = true;
}

function getDimensions() {
  if (rowCountEle.value != "") {
    rowCount = parseInt(rowCountEle.value);
  }
  if (colCountEle.value != "") {
    colCount = parseInt(colCountEle.value);
  }
  if (myTableDiv.children.length > 0) {
    myTableDiv.removeChild(tbl);
  }

  deleteOldTable();
  tableCreated = false;
}

function addRow(tbody, id) {
  var tr = tbody.insertRow();
  tr.id = id;
  var td = tr.insertCell();
  td.className = "row-main-data";

  addDelIcon(td, removeRow);
  for (var k = 0; k < colCount; k++) {
    td = tr.insertCell();
    td.id = id + "_col_" + k;
    td.appendChild(editableText());
    td.style.border = "1px solid black";
    td.style.padding = "1px";
  }
}

function addDelIcon(td, action) {
  var i = document.createElement("i");
  i.className = "fa fa-trash-o";
  i.addEventListener("click", action);

  td.appendChild(i);
}

function addSortIcon(td, action) {
  var i = document.createElement("i");
  i.className = "fa fa-sort icon-margin";

  // i.addEventListener("click", action);

  td.appendChild(i);
}

function editableText() {
  var p = document.createElement("p");
  p.className = "cell-data";
  p.innerHTML = "   ";
  p.contentEditable = true;
  return p;
}

function deleteOldTable() {
  tbl = null;
  tbl = document.createElement("table");
  tbl.id = "mytable";
  tbl.className = "table table-hover";
  tbl.style.border = "1px solid black";
}

function addRowToTable() {
  if (tableCreated) {
    var tbody = tbl.children[1];
    addRow(tbody, "row_" + rowCount);
    rowCount += 1;
  } else {
    alert("Please add table before adding row");
  }
}

function addColToTable() {
  var thead = tbl.children[0];
  var tbody = tbl.children[1];
  if (tableCreated) {
    var td = thead.children[0].insertCell();
    td.className = "head-main-data";
    td.id = "col_" + colCount;

    addDelIcon(td, deleteColumn);
    addSortIcon(td, sortColumn);
    for (var i = 0; i < tbody.children.length; i++) {
      td = tbody.children[i].insertCell();
      td.appendChild(editableText());
      td.style.border = "1px solid black";
      td.style.padding = "1px";
      td.id = "row_" + i + "_col_" + colCount;
    }

    colCount += 1;
  } else {
    alert("Please add table before adding column");
  }
}

function removeRow(e) {
  deleteRow(e.target.parentElement.parentElement.id);
  rowCount -= 1;
}
function deleteRow(rowid) {
  var row = document.getElementById(rowid);
  var table = row.parentNode;
  while (table && table.tagName != "TABLE") table = table.parentNode;
  if (!table) return;
  table.deleteRow(row.rowIndex);
}

function deleteColumn(e) {
  var id = e.target.parentElement.id;
  var index = 0;
  for (var i = 0; i < tbl.rows[0].children.length; i++) {
    if (tbl.rows[0].children[i].id === id) {
      index = i;
      break;
    }
  }
  console.log(index, id);
  for (var i = 0; i < tbl.rows.length; i++) {
    tbl.rows[i].deleteCell(index);
  }
  colCount -= 1;
}

//Export to CSV Functions
function downloadCSV(csv, filename) {
  let csvFile;
  let downloadLink;

  // CSV file
  csvFile = new Blob([csv], {
    type: "text/csv",
  });
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(csvFile, filename);
  } else {
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
  }
}

function exportTableToCSV(event) {
  if (event.isTrusted) {
    let filename = "spreadsheet.csv";
    let csv = [];
    let rows = document.querySelectorAll("table tr");

    for (let i = 0; i < rows.length; i++) {
      let row = [];
      if (i > 0) {
        let cols = rows[i].querySelectorAll("td");
        for (let j = 0; j <= cols.length; j++) {
          if (j > 0) {
            cols = rows[i].querySelectorAll("td p");
            row.push(cols[j - 1].innerText);
          } else {
            row.push(cols[j].innerText);
          }
        }
      } else {
        let cols = rows[i].querySelectorAll("th");
        for (let j = 0; j < cols.length; j++) {
          row.push(cols[j].innerText);
        }
      }
      csv.push(row.join(","));
    }

    downloadCSV(csv.join("\n"), filename);
  }
}

function sortColumn(e) {}
