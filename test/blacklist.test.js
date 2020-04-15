const firebase = require("@firebase/testing");
const fs = require("fs");
const { teardown, loadTestData } = require('./helper/helper');
const projectId = `rules-spec-${Date.now()}`;

beforeEach(async () => { });
before(async () => { });
after(async () => { await teardown(); });

describe("Simple-Auth Project - Blacklist read", async () => {
    it("non authenticated User", async () => {
        const data = { "users/userXRX": {} };
        const data1 = { "blacklist/userXRX1": {} };
        const db = await loadTestData(projectId, [data, data1], null);
        await firebase.assertFails(db.collection("blacklist").get());
        await firebase.assertFails(db.collection("blacklist").doc("userXRX1").get());
    });

    it("non auth authenticated User that is backlisted", async () => {
        const data = { "users/userXRX": {} };
        const data1 = { "blacklist/userXRX": {} };
        const db = await loadTestData(projectId, [data, data1], { uid: "userXRX" });
        await firebase.assertFails(db.collection("blacklist").get());
        await firebase.assertFails(db.collection("blacklist").doc("userXRX").get());
    });

    it("non auth authenticated User", async () => {
        const data = { "users/userXRX": {} };
        const data1 = { "blacklist/userXRX1": {} };
        const db = await loadTestData(projectId, [data, data1], { uid: "userXRX" });
        await firebase.assertSucceeds(db.collection("blacklist").get());
        await firebase.assertFails(db.collection("blacklist").doc("userXRX1").get());
    });
});

describe("Simple-Auth Project - Blacklist write", async () => {
    it("non authenticated User", async () => {
        const db = await loadTestData(projectId, null, null);
        await firebase.assertFails(
            db.doc('blacklist/userXRX').set({})
        );
    });
    it("non auth authenticated User", async () => {
        const data = { "users/userXRX": {} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertFails(
            db.doc('blacklist/userXRX').set({})
        );
    });
    it("'authWrite' authenticated User blacklists himselfe", async () => {
        const data = { "users/userXRX": {roles:['authWrite']} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertSucceeds(
            db.doc('blacklist/userXRX').set({})
        );
    });
    it("'authWrite' authenticated User blacklists other authWrite User", async () => {
        const data = { "users/userXRX": {roles:['authWrite']} };
        const data1 = { "users/userXRX1": {roles:['authWrite']} };
        const db = await loadTestData(projectId, [data, data1], { uid: "userXRX" });
        await firebase.assertSucceeds(
            db.doc('blacklist/userXRX1').set({})
        );
    });
    it("'authWrite' authenticated User blacklists other admin user", async () => {
        const data = { "users/userXRX": {roles:['authWrite']} };
        const data1 = { "users/userXRX1": {roles:['admin']} };
        const db = await loadTestData(projectId, [data, data1], { uid: "userXRX" });
        await firebase.assertFails(
            db.doc('blacklist/userXRX1').set({})
        );
    });
    it("'authWrite' authenticated User blacklists other user with parameter", async () => {
        const data = { "users/userXRX": {roles:['authWrite']} };
        const data1 = { "users/userXRX1": {roles:['']} };
        const db = await loadTestData(projectId, [data, data1], { uid: "userXRX" });
        await firebase.assertFails(
            db.doc('blacklist/userXRX1').set({test:''})
        );
    });
    it("'admin' authenticated User blacklists other user with parameter", async () => {
        const data = { "users/userXRX": {roles:['admin']} };
        const data1 = { "users/userXRX1": {roles:['']} };
        const db = await loadTestData(projectId, [data, data1], { uid: "userXRX" });
        await firebase.assertFails(
            db.doc('blacklist/userXRX1').set({test:''})
        );
    });
    it("'admin' authenticated User blacklists other user with parameter", async () => {
        const data = { "users/userXRX": {roles:['admin']} };
        const data1 = { "users/userXRX1": {roles:['admin']} };
        const db = await loadTestData(projectId, [data, data1], { uid: "userXRX" });
        await firebase.assertSucceeds(
            db.doc('blacklist/userXRX1').set({})
        );
    });
});