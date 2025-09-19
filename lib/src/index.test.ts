import * as fs from "fs"
import * as path from "path"
import * as os from "os"
import { describe, it, expect } from "vitest";
import request from "supertest";
import { createHTTPServer, getConfigByPathByName } from "./index";

describe("Ping endpoint", () => {
  const app = createHTTPServer();

  it("should return 204 No Content", async () => {
    const res = await request(app).get("/ping");
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });
});

describe("config parsing", () => {
  it("should throw if target file is not found", () => {
    expect(() => getConfigByPathByName("./fake-path", "app-name")).toThrow("target config file not found")
  })

  const createTmpFile = (content: string) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "config-test"))
    const badFilePath = path.join(tmpDir, "config.toml")
    fs.writeFileSync(badFilePath, content)
    return badFilePath
  }

  it("should throw if target file has invalid format", () => {
    const filePath = createTmpFile(`{
      "servers": [{"port": 3000}]
    }`)
    expect(() => getConfigByPathByName(filePath, "app-name")).toThrow("error parsing config file")
  })

  it("should fail if servers entry is missing", () => {
    const filePath = createTmpFile(`
      [[fooa]]
        port=3000

      [[fooa]]
        port=3001
    `)
    expect(() => getConfigByPathByName(filePath, "foo")).toThrow("missing httpServers entry")
  })

  it("should fail if app server is missing", () => {
    const filePath = createTmpFile(`
      [[httpServers]]
        app="foo"
        port=3000

      [[httpServers]]
        app="faa"
        port=3001
    `)
    expect(() => getConfigByPathByName(filePath, "fii")).toThrow(`http server config not found for input app "fii"`)
  })

  it("should fail if app server is found but port is missing", () => {
    const filePath = createTmpFile(`
      [[httpServers]]
        app="foo"

      [[httpServers]]
        app="faa"
        port=3001
    `)
    expect(() => getConfigByPathByName(filePath, "foo")).toThrow(`http server port not found for input app "foo"`)
  })

  it("should get http port of app", () => {
    const filePath = createTmpFile(`
      [[httpServers]]
        app="foo"
        port=3000

      [[httpServers]]
        app="faa"
        port=3001
    `)
    expect(getConfigByPathByName(filePath, "foo").server.port).toBe(3000)
    expect(getConfigByPathByName(filePath, "faa").server.port).toBe(3001)
  })
})
