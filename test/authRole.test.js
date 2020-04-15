const firebase = require("@firebase/testing");
const fs = require("fs");
const { teardown, loadTestData } = require('./helper/helper');
const projectId = `rules-spec-${Date.now()}`;

beforeEach(async () => { });
before(async () => { });
after(async () => { await teardown(); });

describe("Simple-Auth Project - AuthRole read", async () => {
    it("1) non authenticated User", async () => {
        const data = { "users/userXRX": {} };
        const data1 = { "authRole/theAuthRole": {roles:[]} };
        const db = await loadTestData(projectId, [data, data1], null);
        await firebase.assertFails(db.collection("authRole").get());
        await firebase.assertFails(db.collection("authRole").doc("theAuthRole").get());
    });

    it("2) non auth authenticated User that is backlisted", async () => {
        const data = { "users/userXRX": {} };
        const data1 = { "authRole/theAuthRole": {roles:[]} };
        const data2 = { "blacklist/userXRX": {} };
        const db = await loadTestData(projectId, [data, data1, data2], { uid: "userXRX" });
        await firebase.assertFails(db.collection("authRole").get());
        await firebase.assertFails(db.collection("authRole").doc("theAuthRole").get());
    });

    it("3) non auth authenticated User", async () => {
        const data = { "users/userXRX": {} };
        const data1 = { "authRole/theAuthRole": {roles:[]} };
        const db = await loadTestData(projectId, [data, data1], { uid: "userXRX" });
        await firebase.assertFails(db.collection("authRole").get());
        await firebase.assertSucceeds(db.collection("authRole").doc("theAuthRole").get());
    });

    it("4) auth authenticated User", async () => {
        const data = { "users/userXRX": {roles:['authWrite']} };
        const data1 = { "authRole/theAuthRole": {roles:[]} };
        const data2 = { "authRole/theAuthRole1": {roles:[]} };
        const db = await loadTestData(projectId, [data, data1, data2], { uid: "userXRX" });
        await firebase.assertFails(db.collection("authRole").get());
        await firebase.assertSucceeds(db.collection("authRole").doc("theAuthRole").get());
        await firebase.assertFails(db.collection("authRole").doc("theAuthRole1").get());
    });

    it("5) admin authenticated User", async () => {
        const data = { "users/userXRX": {roles:['admin']} };
        const data1 = { "authRole/theAuthRole": {roles:[]} };
        const data2 = { "authRole/theAuthRole1": {roles:[]} };
        const db = await loadTestData(projectId, [data, data1, data2], { uid: "userXRX" });
        await firebase.assertFails(db.collection("authRole").get());
        await firebase.assertSucceeds(db.collection("authRole").doc("theAuthRole").get());
        await firebase.assertFails(db.collection("authRole").doc("theAuthRole1").get());
    });
});

describe("Simple-Auth Project - AuthRole write", async () => {
    it("1) non authenticated User", async () => {
        const db = await loadTestData(projectId, null, null);
        await firebase.assertFails(
            db.doc('authRole/theAuthRole').set({roles:[]})
        );
    });
    it("2) non auth authenticated User", async () => {
        const data = { "users/userXRX": {} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertFails(
            db.doc('authRole/theAuthRole').set({roles:[]})
        );
    });
    it("3) 'authWrite' authenticated User", async () => {
        const data = { "users/userXRX": {roles:['authWrite']} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertSucceeds(
            db.doc('authRole/theAuthRole').set({roles:[]})
        );
        await firebase.assertSucceeds(
            db.doc('authRole/theAuthRole').set({roles:['hallo']})
        );
    });
    it("4) 'authWrite' authenticated User without roles", async () => {
        const data = { "users/userXRX": {roles:['authWrite']} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertFails(
            db.doc('authRole/theAuthRole').set({})
        );
    });
    it("5) 'authWrite' authenticated User false groupName", async () => {
        const data = { "users/userXRX": {roles:['authWrite']} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertFails(
            db.doc('authRole/theAuthRole1').set({roles:[]})
        );
        await firebase.assertFails(
            db.doc('authRole/theAuthRole').set({role:[]})
        );
    });
    it("6) 'admin' authenticated User", async () => {
        const data = { "users/userXRX": {roles:['admin']} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertSucceeds(
            db.doc('authRole/theAuthRole').set({roles:[]})
        );
        await firebase.assertSucceeds(
            db.doc('authRole/theAuthRole').set({roles:['dd', 'esd', 'drwe']})
        );
    });
    it("7) 'admin' authenticated User without roles", async () => {
        const data = { "users/userXRX": {roles:['admin']} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertFails(
            db.doc('authRole/theAuthRole').set({})
        );
    });
    it("8) 'admin' authenticated User false groupName", async () => {
        const data = { "users/userXRX": {roles:['admin']} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertFails(
            db.doc('authRole/theAuthRole1').set({roles:[]})
        );
        await firebase.assertSucceeds(
            db.doc('authRole/theAuthRole').set({roles:[]})
        );
        await firebase.assertFails(
            db.doc('authRole/theAuthRole').set({role:[]})
        );
        await firebase.assertFails(
            db.doc('authRole/theAuthRole').set({roles:[], edv:[]})
        );
        await firebase.assertFails(
            db.doc('authRole/theAuthRole').set({roles:'abs'})
        );
    });
});