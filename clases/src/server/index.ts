import { createWebServer } from "./api";

const port = 3000;
createWebServer().listen(port, () => {
  console.log(`starting "clases" at port ${port}`);
});
