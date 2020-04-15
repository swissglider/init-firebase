const firebase = require("@firebase/testing");
const fs = require("fs");
const { teardown, loadTestData } = require('./helper/helper');
const projectId = `rules-spec-${Date.now()}`;

beforeEach(async () => { });
before(async () => { });
after(async () => { await teardown(); });

describe("Simple-Auth Project - Profiles Read", async () => {

    it("non authenticated User", async () => {
        const data = { "profiles/userXRX": {displayName:'', photoURL: ''} };
        const db = await loadTestData(projectId, [data], null);
        await firebase.assertFails(db.collection("profiles").doc("userXRX").get());
        await firebase.assertFails(db.collection("profiles").get());
    });

    it("non auth authenticated User reads own profile", async () => {
        const data = { "profiles/userXRX": {displayName:'', photoURL: ''}  };
        const data1 = { "users/userXRX": {} };
        const db = await loadTestData(projectId, [data, data1], { uid: "userXRX" });
        await firebase.assertSucceeds(db.collection("profiles").doc("userXRX").get());
        await firebase.assertSucceeds(db.collection("profiles").get());
    });

    it("non auth authenticated User reads other profile", async () => {
        const data = { "profiles/userXRX1": {displayName:'', photoURL: ''}  };
        const data1 = { "users/userXRX": {} };
        const db = await loadTestData(projectId, [data, data1], { uid: "userXRX" });
        await firebase.assertSucceeds(db.collection("profiles").doc("userXRX1").get());
    });
});