const scrap = require("./scrap");

let result;
(async () => {
  const res = await scrap.webScraping();
  result = res;
})();

scrap.webScraping().then(() => {
  console.log(result);
});
