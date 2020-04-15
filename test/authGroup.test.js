const firebase = require("@firebase/testing");
const fs = require("fs");
const { teardown, loadTestData } = require('./helper/helper');
const projectId = `rules-spec-${Date.now()}`;

beforeEach(async () => { });
before(async () => { });
after(async () => { await teardown(); });

describe("Simple-Auth Project - AuthGroup read", async () => {
    it("1) non authenticated User", async () => {
        const data = { "users/userXRX": {} };
        const data1 = { "authGroup/theAuthGroup": {groups:[]} };
        const db = await loadTestData(projectId, [data, data1], null);
        await firebase.assertFails(db.collection("authGroup").get());
        await firebase.assertFails(db.collection("authGroup").doc("theAuthGroup").get());
    });

    it("2) non auth authenticated User that is backlisted", async () => {
        const data = { "users/userXRX": {} };
        const data1 = { "authGroup/theAuthGroup": {groups:[]} };
        const data2 = { "blacklist/userXRX": {} };
        const db = await loadTestData(projectId, [data, data1, data2], { uid: "userXRX" });
        await firebase.assertFails(db.collection("authGroup").get());
        await firebase.assertFails(db.collection("authGroup").doc("theAuthGroup").get());
    });

    it("3) non auth authenticated User", async () => {
        const data = { "users/userXRX": {} };
        const data1 = { "authGroup/theAuthGroup": {groups:[]} };
        const db = await loadTestData(projectId, [data, data1], { uid: "userXRX" });
        await firebase.assertFails(db.collection("authGroup").get());
        await firebase.assertSucceeds(db.collection("authGroup").doc("theAuthGroup").get());
    });

    it("4) auth authenticated User", async () => {
        const data = { "users/userXRX": {roles:['authWrite']} };
        const data1 = { "authGroup/theAuthGroup": {groups:[]} };
        const data2 = { "authGroup/theAuthGroup1": {groups:[]} };
        const db = await loadTestData(projectId, [data, data1, data2], { uid: "userXRX" });
        await firebase.assertFails(db.collection("authGroup").get());
        await firebase.assertSucceeds(db.collection("authGroup").doc("theAuthGroup").get());
        await firebase.assertFails(db.collection("authGroup").doc("theAuthGroup1").get());
    });

    it("5) admin authenticated User", async () => {
        const data = { "users/userXRX": {roles:['admin']} };
        const data1 = { "authGroup/theAuthGroup": {groups:[]} };
        const data2 = { "authGroup/theAuthGroup1": {groups:[]} };
        const db = await loadTestData(projectId, [data, data1, data2], { uid: "userXRX" });
        await firebase.assertFails(db.collection("authGroup").get());
        await firebase.assertSucceeds(db.collection("authGroup").doc("theAuthGroup").get());
        await firebase.assertFails(db.collection("authGroup").doc("theAuthGroup1").get());
    });
});

describe("Simple-Auth Project - AuthGroup write", async () => {
    it("1) non authenticated User", async () => {
        const db = await loadTestData(projectId, null, null);
        await firebase.assertFails(
            db.doc('authGroup/theAuthGroup').set({groups:[]})
        );
    });
    it("2) non auth authenticated User", async () => {
        const data = { "users/userXRX": {} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertFails(
            db.doc('authGroup/theAuthGroup').set({groups:[]})
        );
    });
    it("3) 'authWrite' authenticated User", async () => {
        const data = { "users/userXRX": {roles:['authWrite']} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertSucceeds(
            db.doc('authGroup/theAuthGroup').set({groups:[]})
        );
    });
    it("4) 'authWrite' authenticated User without groups", async () => {
        const data = { "users/userXRX": {roles:['authWrite']} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertFails(
            db.doc('authGroup/theAuthGroup').set({})
        );
    });
    it("5) 'authWrite' authenticated User false groupName", async () => {
        const data = { "users/userXRX": {roles:['authWrite']} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertFails(
            db.doc('authGroup/theAuthGroup1').set({groups:[]})
        );
    });
    it("6) 'admin' authenticated User", async () => {
        const data = { "users/userXRX": {roles:['admin']} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertSucceeds(
            db.doc('authGroup/theAuthGroup').set({groups:[]})
        );
    });
    it("7) 'admin' authenticated User without groups", async () => {
        const data = { "users/userXRX": {roles:['admin']} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertFails(
            db.doc('authGroup/theAuthGroup').set({})
        );
    });
    it("8) 'admin' authenticated User false groupName", async () => {
        const data = { "users/userXRX": {roles:['admin']} };
        const db = await loadTestData(projectId, [data], { uid: "userXRX" });
        await firebase.assertFails(
            db.doc('authGroup/theAuthGroup1').set({groups:[]})
        );
        await firebase.assertFails(
            db.doc('authGroup/theAuthGroup').set({groups:'abs'})
        );
    });
});