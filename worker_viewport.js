importScripts("https://unpkg.com/dexie/dist/dexie.js");

const db = new Dexie("ProductsDatabase");
db.version(1).stores({
  products: `
    product_id,
    product_title`,
});

this.onmessage = async function () {
  let renderSent = false;
  let data = [];
  for (let i = 0; i < 2_000_000; i++) {
    data.push({ product_id: i, product_title: `Product #${i}` });
    if (data.length === 5000) {
      await db.products.bulkPut(data);
      data = [];

      if (!renderSent) {
        this.postMessage({ type: "render", count: 2_000_000 });
        renderSent = true;
      }
    }
  }

  // if there is a remaining data
  if (data.length > 0) {
    await db.products.bulkPut(data);
    data = [];
  }

  this.postMessage({ type: "done" });
};
