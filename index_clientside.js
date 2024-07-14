const data = [];
for (let i = 0; i < 2_000_000; i++) {
  data.push({ product_id: i, product_title: `Product #${i}` });
}

const gridOptions = {
  columnDefs: [{ field: "product_id" }, { field: "product_title" }],
};

const myGridElement = document.querySelector("#myGrid");
const gridApi = agGrid.createGrid(myGridElement, gridOptions);

gridApi.setGridOption("rowData", data);
data = []; // just to be sure
