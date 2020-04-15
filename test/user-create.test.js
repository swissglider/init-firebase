const firebase = require("@firebase/testing");
const fs = require("fs");
const { teardown, loadTestData } = require('./helper/helper');
const projectId = `rules-spec-${Date.now()}`;

beforeEach(async () => { });
before(async () => { });
after(async () => { await teardown(); });

describe("Simple-Auth Project - User Create", async () => {

    it("0) new user creates a new user not verified email", async () => {
        let newUser = "userXRX1"
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test"]} };
        const db = await loadTestData(projectId, [data0, data], { uid: newUser});
        await firebase.assertFails(db.doc('users/' + newUser).set({roles:[],groups:[]}));
    });
    it("1) new user creates a new user", async () => {
        let newUser = "userXRX1"
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test"]} };
        const db = await loadTestData(projectId, [data0, data], { uid: newUser, email_verified:true});
        await firebase.assertFails(db.doc('users/' + newUser).set({roles:[]}));
        await firebase.assertFails(db.doc('users/' + newUser).set({groups:[]}));
        await firebase.assertFails(db.doc('users/' + newUser).set({roles:[], groups:['ali']}) );
        await firebase.assertFails(db.doc('users/' + newUser).set({roles:['admin'], groups:[]}));
        await firebase.assertSucceeds(db.doc('users/' + newUser).set({roles:[],groups:[]}));
        await firebase.assertSucceeds(db.collection("users").doc(newUser).get());
    });
    it("2) not auth admin user create a user but not him selc", async () => {
        let newUser = "userXRX1"
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test"]} };
        const db = await loadTestData(projectId, [data0, data], { uid: 'userXRX2', email_verified:true});
        await firebase.assertFails(db.doc('users/' + newUser).set({roles:[]}));
    });
    it("3) news user creates a new user with roles", async () => {
        let newUser = "userXRX1"
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test"]} };
        const db = await loadTestData(projectId, [data0, data], { uid: 'userXRX2', email_verified:true});
        await firebase.assertFails(db.doc('users/' + newUser).set({roles:['admin']}));
    });

    it("4) admin user creates new user", async () => {
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test"]} };
        const data1 = { "users/userXRX": {roles:['admin']} };
        let newUser = "userXRX1"
        const db = await loadTestData(projectId, [data0, data, data1], { uid: "userXRX", email_verified:true });
        await firebase.assertSucceeds(
            db.doc('users/' + newUser).set({roles:['admin'], groups:[]})
        );
        await firebase.assertSucceeds(
            db.doc('users/' + 'hallo').set({roles:['admin', "authRead"], groups:[]})
        );
        await firebase.assertFails(
            db.doc('users/' + 'hallo').set({roles:['admin1', "authRead"], groups:[]})
        );
        await firebase.assertFails(
            db.doc('users/' + 'hallo').set({roles:['admin1'], groups:[]})
        );
        let auth = { uid: newUser, email_verified:true }
        const db1 = await firebase.initializeTestApp({ projectId, auth }).firestore();
        await firebase.assertSucceeds(db1.collection("users").doc(newUser).get());
    });
    it("5) authWrite user creates new user with ['admin'] role", async () => {
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test"]} };
        const data1 = { "users/userXRX": {roles:["authWrite"]} };
        let newUser = "userXRX1"
        const db = await loadTestData(projectId, [data0, data, data1], { uid: "userXRX", email_verified:true });
        await firebase.assertFails(
            db.doc('users/' + newUser).set({roles:['admin']})
        );
    });
    it("6) authWrite user creates new user", async () => {
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test"]} };
        const data1 = { "users/userXRX": {roles:["authWrite"]} };
        let newUser = "userXRX1"
        const db = await loadTestData(projectId, [data0, data, data1], { uid: "userXRX", email_verified:true });
        await firebase.assertSucceeds(
            db.doc('users/' + newUser).set({roles:['authWrite'], groups:[]})
        );
        let auth = { uid: newUser , email_verified:true}
        const db1 = await firebase.initializeTestApp({ projectId, auth }).firestore();
        await firebase.assertSucceeds(db1.collection("users").doc(newUser).get());
    });
    it("7) authRead user creates new user", async () => {
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test"]} };
        const data1 = { "users/userXRX": {roles:["authRead"]} };
        let newUser = "userXRX1"
        const db = await loadTestData(projectId, [data0, data, data1], { uid: "userXRX", email_verified:true });
        await firebase.assertFails(
            db.doc('users/' + newUser).set({roles:[]})
        );
    });

    it("8) not auth user updates his user", async () => {
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test"]} };
        const data1 = { "users/userXRX": {roles:[]} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const db = await loadTestData(projectId, [data0, data, data1, data2], { uid: "userXRX", email_verified:true });
        await firebase.assertFails(
            db.doc('users/userXRX2').set({test:'hallo'})
        );
        await firebase.assertFails(
            db.doc('users/userXRX2').set({roles:['admin']})
        );
    });
    it("9) admin user updates a user", async () => {
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test"]} };
        const data1 = { "users/userXRX": {roles:['admin']} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const db = await loadTestData(projectId, [data0, data, data1, data2], { uid: "userXRX", email_verified:true });
        await firebase.assertSucceeds(
            db.doc('users/userXRX2').set({roles:[], groups:[]})
        );
        await firebase.assertSucceeds(
            db.doc('users/userXRX2').set({roles:['admin'], groups:[]})
        );
        await firebase.assertFails(
            db.doc('users/userXRX2').set({roles:'admin', groups:[]})
        );
        await firebase.assertFails(
            db.doc('users/userXRX2').set({roles:['admin1'], groups:[]})
        );
        await firebase.assertSucceeds(
            db.doc('users/userXRX2').set({roles:['admin', 'authRead'], groups:[]})
        );
    });
    it("10) authWrite user updates a user", async () => {
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test", "Test2"]} };
        const data1 = { "users/userXRX": {roles:['authWrite']} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const data3 = { "users/userXRX3": {roles:['admin']} };
        const db = await loadTestData(projectId, [data0, data, data1, data2, data3], { uid: "userXRX", email_verified:true });
        await firebase.assertFails(
            db.doc('users/userXRX2').set({roles:[], groups:''})
        );
        await firebase.assertFails(
            db.doc('users/userXRX2').set({roles:[], groups:[], test:'hallo'})
        );
        await firebase.assertSucceeds(
            db.doc('users/userXRX2').set({roles:['authWrite'], groups:[]})
        );
        await firebase.assertSucceeds(
            db.doc('users/userXRX2').set({roles:['authWrite'], groups:["Test"]})
        );
        await firebase.assertSucceeds(
            db.doc('users/userXRX2').set({roles:['authWrite'], groups:["Test2"]})
        );
        await firebase.assertSucceeds(
            db.doc('users/userXRX2').set({roles:['authWrite'], groups:["Test", "Test2"]})
        );
        await firebase.assertFails(
            db.doc('users/userXRX2').set({roles:['authWrite'], groups:["Test1", "Test2"]})
        );
        await firebase.assertFails(
            db.doc('users/userXRX2').set({roles:['authWrite'], groups:["Test", "Test2", "Test3"]})
        );
        await firebase.assertFails(
            db.doc('users/userXRX2').set({roles:['authWrite'], groups:["Test3"]})
        );
        await firebase.assertFails(
            db.doc('users/userXRX2').set({roles:['admin'], groups:[]})
        );
        await firebase.assertFails(
            db.doc('users/userXRX3').set({roles:[], groups:[]})
        );
        await firebase.assertFails(
            db.doc('users/userXRX').set({roles:['admin'], groups:[]})
        );
    });
    it("11) authRead user updates a user", async () => {
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test"]} };
        const data1 = { "users/userXRX": {roles:['authRead']} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const db = await loadTestData(projectId, [data0, data, data1, data2], { uid: "userXRX", email_verified:true });
        await firebase.assertFails(
            db.doc('users/userXRX2').set({roles:[],test:'hallo'})
        );
        await firebase.assertFails(
            db.doc('users/userXRX2').set({roles:['authWrite']})
        );
        await firebase.assertFails(
            db.doc('users/userXRX2').set({roles:['admin']})
        );
    });

    it("12) not auth user deletes his user", async () => {
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test"]} };
        const data1 = { "users/userXRX": {roles:[]} };
        const data2 = { "users/userXRX2": {roles:[]} };
        const db = await loadTestData(projectId, [data0, data, data1, data2], { uid: "userXRX", email_verified:true });
        await firebase.assertFails(
            db.doc('users/userXRX2').delete()
        );
        await firebase.assertFails(
            db.doc('users/userXRX').delete()
        );
    });
    it("13) admin user deletes a user", async () => {
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test"]} };
        const data1 = { "users/userXRX": {roles:['admin']} };
        const data2 = { "users/userXRX2": {roles:['admin']} };
        const data3 = { "users/userXRX3": {roles:[]} };
        const data4 = { "users/userXRX4": {roles:[]} };
        const db = await loadTestData(projectId, [data0, data, data1, data2, data3, data4], { uid: "userXRX", email_verified:true });
        await firebase.assertSucceeds(
            db.doc('users/userXRX2').delete()
        );
        await firebase.assertSucceeds(
            db.doc('users/userXRX3').delete()
        );
        await firebase.assertSucceeds(
            db.doc('users/userXRX').delete()
        );
        await firebase.assertFails(
            db.doc('users/userXRX4').delete()
        );
    });
    it("14) authWrite user deletes a user", async () => {
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test"]} };
        const data1 = { "users/userXRX": {roles:['authWrite']} };
        const data2 = { "users/userXRX2": {roles:['admin']} };
        const data3 = { "users/userXRX3": {roles:[]} };
        const data4 = { "users/userXRX4": {roles:[]} };
        const db = await loadTestData(projectId, [data0, data, data1, data2, data3, data4], { uid: "userXRX", email_verified:true });
        await firebase.assertSucceeds(
            db.doc('users/userXRX3').delete()
        );
        await firebase.assertFails(
            db.doc('users/userXRX2').delete()
        );
        await firebase.assertSucceeds(
            db.doc('users/userXRX').delete()
        );
        await firebase.assertFails(
            db.doc('users/userXRX4').delete()
        );
    });
    it("15) authRead user deletes a user", async () => {
        const data0 = { "authRole/theAuthRole": {roles:["admin", "authRead", "authWrite"]} };
        const data = { "authGroup/theAuthGroup": {groups:["Test"]} };
        const data1 = { "users/userXRX": {roles:['authRead']} };
        const data2 = { "users/userXRX2": {roles:['admin']} };
        const data3 = { "users/userXRX3": {roles:[]} };
        const data4 = { "users/userXRX4": {roles:[]} };
        const db = await loadTestData(projectId, [data0, data, data1, data2, data3, data4], { uid: "userXRX", email_verified:true });
        await firebase.assertFails(
            db.doc('users/userXRX3').delete()
        );
        await firebase.assertFails(
            db.doc('users/userXRX2').delete()
        );
        await firebase.assertFails(
            db.doc('users/userXRX').delete()
        );
        await firebase.assertFails(
            db.doc('users/userXRX4').delete()
        );
    });
});