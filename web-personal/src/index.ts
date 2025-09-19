import { createHTTPServer } from "@pranidhana/lib";

const name = "web-personal"

const port = 3000

createHTTPServer().listen(port, () => {
	console.log(`starting "${name}" at port ${port}`)
})
