import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { app } from "../app.js";

describe("app", () => {
    let server;
    let baseUrl;

    before(async () => {
        server = app.listen(0);
        await new Promise((resolve) => server.once("listening", resolve));
        baseUrl = `http://127.0.0.1:${server.address().port}`;
    });

    after(() => server.close());

    it("answers 404 in the error format for an unknown route", async () => {
        const res = await fetch(`${baseUrl}/api/unknown`);
        assert.equal(res.status, 404);
        assert.deepEqual(await res.json(), { error: { code: "NOT_FOUND", message: "Route not found" } });
    });

    it("answers 400 for a malformed JSON body", async () => {
        const res = await fetch(`${baseUrl}/api/unknown`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{bad",
        });
        assert.equal(res.status, 400);
        assert.equal((await res.json()).error.code, "BAD_REQUEST");
    });

    it("does not expose the X-Powered-By header", async () => {
        const res = await fetch(`${baseUrl}/api/unknown`);
        assert.equal(res.headers.get("x-powered-by"), null);
    });
});
