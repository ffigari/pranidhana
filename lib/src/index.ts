import * as fs from "fs";
import express, { Express } from "express";
import * as TOML from "@iarna/toml"

export const createHTTPServer = (): Express => {
	const app = express();

	app.get("/ping", (_, res) => {
		res.sendStatus(204)
	})

	return app
}

export class HTTPServerConfig {
	constructor(public port: number) {}
}

export class AppConfig {
	constructor(public server: HTTPServerConfig) {}
}

type tomlServerEntry =  { app?: string, port?: number };

export const getConfigByPathByName = (path: string, appName: string): AppConfig => {
	try {
		const tomlString = fs.readFileSync(path, "utf-8");
		const parsedTOML = TOML.parse(tomlString)
		
		if (!("httpServers" in parsedTOML)) {
			throw new Error("missing httpServers entry")
		}

		const serverConfig = (parsedTOML["httpServers"] as tomlServerEntry[]).find((parsedServerConfig: {
			app?: string,
		}) => "app" in parsedServerConfig && parsedServerConfig["app"] === appName);
		
		if (!serverConfig) {
			throw new Error(`http server config not found for input app "${appName}"`)
		}

		if (!serverConfig.port) {
			throw new Error(`http server port not found for input app "${appName}"`)
		}

		return new AppConfig(new HTTPServerConfig(serverConfig.port))
	} catch (err: any) {
		if (err.code === "ENOENT") {
			throw new Error("target config file not found")
		}

		if (err.name === "TomlError") {
			throw new Error("error parsing config file")
		}

		throw err
	}
}

export const getConfigByName = (appName: string): AppConfig => {
	return getConfigByPathByName("../config.toml", appName);
}
