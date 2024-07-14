const db = new Dexie("ProductsDatabase");
db.version(1).stores({
  products: `
    product_id,
    product_title`,
});

const worker = new Worker("worker_viewport.js");
worker.onmessage = function (event) {
  const { type } = event.data;

  if (type === "render") {
    datasource.params.setRowCount(event.data.count, true);
  } else if (type === "done") {
    worker.terminate();
  }
};
worker.postMessage({ type: "start" });

const gridOptions = {
  columnDefs: [{ field: "product_id" }, { field: "product_title" }],
  rowModelType: "viewport",
};

const datasource = {
  async init(params) {
    this.params = params;
  },
  async setViewportRange(firstRow, lastRow) {
    const storeData = await db.products.bulkGet(
      Array(lastRow - firstRow)
        .fill()
        .map((_, idx) => firstRow + idx),
    );
    const rowData = {};
    for (let i = firstRow, r = 0; i <= lastRow; i++, r++) {
      rowData[i] = storeData[r];
    }
    this.params.setRowData(rowData);
  },
};

const myGridElement = document.querySelector("#myGrid");
const gridApi = agGrid.createGrid(myGridElement, gridOptions);

gridApi.setGridOption("viewportDatasource", datasource);
