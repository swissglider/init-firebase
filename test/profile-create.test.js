const firebase = require("@firebase/testing");
const fs = require("fs");
const { teardown, loadTestData } = require('./helper/helper');
const projectId = `rules-spec-${Date.now()}`;

beforeEach(async () => { });
before(async () => { });
after(async () => { await teardown(); });

describe("Simple-Auth Project - Profile Create", async () => {

    it("1) new user creates his own profile", async () => {
        const data1 = { "users/userXRX1": {roles:[]} };
        const db = await loadTestData(projectId, [data1], { uid: 'userXRX1'});
        await firebase.assertSucceeds(
            db.doc('profiles/userXRX1').set({displayName:'', photoURL: ''})
        );
    });
    it("2) new user creates his own profile without displayName", async () => {
        const data1 = { "users/userXRX1": {roles:[]} };
        const db = await loadTestData(projectId, [data1], { uid: 'userXRX1'});
        await firebase.assertFails(
            db.doc('profiles/userXRX1').set({photoURL: ''})
        );
    });
    it("3) new user creates his own profile without photoURL", async () => {
        const data1 = { "users/userXRX1": {roles:[]} };
        const db = await loadTestData(projectId, [data1], { uid: 'userXRX1'});
        await firebase.assertFails(
            db.doc('profiles/userXRX1').set({displayName:''})
        );
    });
    it("4) new user creates an other profile", async () => {
        const data1 = { "users/userXRX1": {roles:[]} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const db = await loadTestData(projectId, [data1, data2], { uid: 'userXRX1'});
        await firebase.assertFails(
            db.doc('profiles/userXRX2').set({displayName:'', photoURL: ''})
        );
    });
    it("5) admin user creates an other profile", async () => {
        const data1 = { "users/userXRX1": {roles:['admin']} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const db = await loadTestData(projectId, [data1, data2], { uid: 'userXRX1'});
        await firebase.assertSucceeds(
            db.doc('profiles/userXRX2').set({displayName:'', photoURL: ''})
        );
    });
    it("6) authWrite user creates an other profile", async () => {
        const data1 = { "users/userXRX1": {roles:['authWrite']} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const db = await loadTestData(projectId, [data1, data2], { uid: 'userXRX1'});
        await firebase.assertSucceeds(
            db.doc('profiles/userXRX2').set({displayName:'', photoURL: ''})
        );
    });
    it("7) authWrite user creates an other profile from an admin user", async () => {
        const data1 = { "users/userXRX1": {roles:['authWrite']} };
        const data2 = { "users/userXRX2": {roles:['admin']} };
        const db = await loadTestData(projectId, [data1, data2], { uid: 'userXRX1'});
        await firebase.assertFails(
            db.doc('profiles/userXRX2').set({displayName:'', photoURL: ''})
        );
    });
    it("8) authRead user creates an other profile", async () => {
        const data1 = { "users/userXRX1": {roles:['authRead']} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const db = await loadTestData(projectId, [data1, data2], { uid: 'userXRX1'});
        await firebase.assertFails(
            db.doc('profiles/userXRX2').set({displayName:'', photoURL: ''})
        );
    });
    it("9) user updates his own profile", async () => {
        const data1 = { "users/userXRX1": {roles:[]} };
        const data2 = { "profiles/userXRX1": {displayName:'', photoURL: ''}};
        const db = await loadTestData(projectId, [data1, data2], { uid: 'userXRX1'});
        await firebase.assertSucceeds(
            db.doc('profiles/userXRX1').set({displayName:'1', photoURL: '1'})
        );
    });
    it("10) user updates his own profile without displayName", async () => {
        const data1 = { "users/userXRX1": {roles:[]} };
        const data2 = { "profiles/userXRX1": {displayName:'', photoURL: ''}};
        const db = await loadTestData(projectId, [data1, data2], { uid: 'userXRX1'});
        await firebase.assertFails(
            db.doc('profiles/userXRX1').set({photoURL: ''})
        );
    });
    it("11) user updates his own profile without photoURL", async () => {
        const data1 = { "users/userXRX1": {roles:[]} };
        const data2 = { "profiles/userXRX1": {displayName:'', photoURL: ''}};
        const db = await loadTestData(projectId, [data1, data2], { uid: 'userXRX1'});
        await firebase.assertFails(
            db.doc('profiles/userXRX1').set({displayName:''})
        );
    });
    it("12) user updates an other profile", async () => {
        const data1 = { "users/userXRX1": {roles:[]} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const data3 = { "profiles/userXRX2": {displayName:'', photoURL: ''}};
        const db = await loadTestData(projectId, [data1, data2, data3], { uid: 'userXRX1'});
        await firebase.assertFails(
            db.doc('profiles/userXRX2').set({displayName:'', photoURL: ''})
        );
    });
    it("13) admin user updates an other profile", async () => {
        const data1 = { "users/userXRX1": {roles:['admin']} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const data3 = { "profiles/userXRX2": {displayName:'', photoURL: ''}};
        const db = await loadTestData(projectId, [data1, data2, data3], { uid: 'userXRX1'});
        await firebase.assertSucceeds(
            db.doc('profiles/userXRX2').set({displayName:'1', photoURL: '1'})
        );
    });
    it("14) authWrite user updates an other profile", async () => {
        const data1 = { "users/userXRX1": {roles:['authWrite']} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const data3 = { "profiles/userXRX2": {displayName:'', photoURL: ''}};
        const db = await loadTestData(projectId, [data1, data2, data3], { uid: 'userXRX1'});
        await firebase.assertSucceeds(
            db.doc('profiles/userXRX2').set({displayName:'1', photoURL: '1'})
        );
    });
    it("15) authWrite user updates an other profile from an admin user", async () => {
        const data1 = { "users/userXRX1": {roles:['authWrite']} };
        const data2 = { "users/userXRX2": {roles:['admin']} };
        const data3 = { "profiles/userXRX2": {displayName:'', photoURL: ''}};
        const db = await loadTestData(projectId, [data1, data2, data3], { uid: 'userXRX1'});
        await firebase.assertFails(
            db.doc('profiles/userXRX2').set({displayName:'1', photoURL: '1'})
        );
    });
    it("16) authRead user updates an other profile", async () => {
        const data1 = { "users/userXRX1": {roles:['authRead']} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const data3 = { "profiles/userXRX2": {displayName:'', photoURL: ''}};
        const db = await loadTestData(projectId, [data1, data2, data3], { uid: 'userXRX1'});
        await firebase.assertFails(
            db.doc('profiles/userXRX2').set({displayName:'1', photoURL: '1'})
        );
    });
    it("17) user delete his own profile", async () => {
        const data1 = { "users/userXRX1": {roles:[]} };
        const data2 = { "profiles/userXRX1": {displayName:'', photoURL: ''}};
        const db = await loadTestData(projectId, [data1, data2], { uid: 'userXRX1'});
        await firebase.assertFails(
            db.doc('profiles/userXRX1').delete()
        );
    });
    it("18) user deletes an other profile", async () => {
        const data1 = { "users/userXRX1": {roles:[]} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const data3 = { "profiles/userXRX2": {displayName:'', photoURL: ''}};
        const db = await loadTestData(projectId, [data1, data2, data3], { uid: 'userXRX1'});
        await firebase.assertFails(
            db.doc('profiles/userXRX2').delete()
        );
    });
    it("19) admin user deletes an other profile", async () => {
        const data1 = { "users/userXRX1": {roles:['admin']} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const data3 = { "profiles/userXRX2": {displayName:'', photoURL: ''}};
        const db = await loadTestData(projectId, [data1, data2, data3], { uid: 'userXRX1'});
        await firebase.assertSucceeds(
            db.doc('profiles/userXRX2').delete()
        );
    });
    it("20) admin user deletes his own profile", async () => {
        const data1 = { "users/userXRX1": {roles:['admin']} };
        const data3 = { "profiles/userXRX1": {displayName:'', photoURL: ''}};
        const db = await loadTestData(projectId, [data1, data3], { uid: 'userXRX1'});
        await firebase.assertSucceeds(
            db.doc('profiles/userXRX1').delete()
        );
    });
    it("21) authWrite user deletes an other profile", async () => {
        const data1 = { "users/userXRX1": {roles:['authWrite']} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const data3 = { "profiles/userXRX2": {displayName:'', photoURL: ''}};
        const db = await loadTestData(projectId, [data1, data2, data3], { uid: 'userXRX1'});
        await firebase.assertSucceeds(
            db.doc('profiles/userXRX2').delete()
        );
    });
    it("22) authWrite user deletes an other profile from an admin user", async () => {
        const data1 = { "users/userXRX1": {roles:['authWrite']} };
        const data2 = { "users/userXRX2": {roles:['admin']} };
        const data3 = { "profiles/userXRX2": {displayName:'', photoURL: ''}};
        const db = await loadTestData(projectId, [data1, data2, data3], { uid: 'userXRX1'});
        await firebase.assertFails(
            db.doc('profiles/userXRX2').delete()
        );
    });
    it("23) authRead user deletes an other profile", async () => {
        const data1 = { "users/userXRX1": {roles:['authRead']} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const data3 = { "profiles/userXRX2": {displayName:'', photoURL: ''}};
        const db = await loadTestData(projectId, [data1, data2, data3], { uid: 'userXRX1'});
        await firebase.assertFails(
            db.doc('profiles/userXRX2').delete()
        );
    });
});