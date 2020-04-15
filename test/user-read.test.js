const firebase = require("@firebase/testing");
const fs = require("fs");
const { teardown, loadTestData } = require('./helper/helper');
const projectId = `rules-spec-${Date.now()}`;

beforeEach(async () => { });
before(async () => { });
after(async () => { await teardown(); });

describe("Simple-Auth Project - User Read", async () => {

    it("non authenticated User", async () => {
        const data = { "users/userXRX": {} };
        const db = await loadTestData(projectId, [data], null);
        await firebase.assertFails(db.collection("users").doc("userXRX1").get());
        await firebase.assertFails(db.collection("users").get());
    });

    it("non auth authenticated User reads himself", async () => {
        const data = { "users/userXRX": {} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertSucceeds(db.collection("users").doc("userXRX").get());
        await firebase.assertFails(db.collection("users").get());
    });

    it("non auth authenticated User reads an other user", async () => {
        const data = { "users/userXRX": {} };
        const data1 = { "users/userXRX1": {} };
        const db = await loadTestData(projectId, [data, data1], { uid: "userXRX" });
        await firebase.assertFails(db.collection("users").doc("userXRX1").get());
    });

    it("auth authenticated User check read admin", async () => {
        const data = { "users/userXRX": { roles: ['admin'] } }
        const data1 = { "users/userXRX1": {roles: null} };
        const db = await loadTestData(projectId, [data, data1], { uid: "userXRX" });
        await firebase.assertSucceeds(db.collection("users").doc("userXRX1").get());
        await firebase.assertSucceeds(db.collection("users").get());
    });

    it("auth authenticated User check read authWrite", async () => {
        const data = {"users/userXRX": { roles: ['authWrite'] } }
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertSucceeds(db.collection("users").doc("userXRX").get());
    });

    it("auth authenticated User check read authRead", async () => {
        const data = {"users/userXRX": { roles: ['authRead'] }}
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertSucceeds(db.collection("users").doc("userXRX").get());
    });

    it("auth authenticated User check read * - blacklisted", async () => {
        const data = { "users/userXRX": { roles: ['*'] }, "blacklist/userXRX": {} }
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertFails(db.collection("users").doc("userXRX").get());
    });

    it("auth authenticated User check read authWrite - blacklisted", async () => {
        const data = {"users/userXRX": { roles: ['authWrite'] }, "blacklist/userXRX": {} }
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertFails(db.collection("users").doc("userXRX").get());
    });

    it("auth authenticated User check read authRead - blacklisted", async () => {
        const data = {"users/userXRX": { roles: ['authRead'] }, "blacklist/userXRX": {}}
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertFails(db.collection("users").doc("userXRX").get());
    });
});