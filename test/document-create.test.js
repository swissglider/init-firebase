const firebase = require("@firebase/testing");
const fs = require("fs");
const { teardown, loadTestData } = require('./helper/helper');
const projectId = `rules-spec-${Date.now()}`;

beforeEach(async () => { });
before(async () => { });
after(async () => { await teardown(); });

const data1 = {
    "authRole/theAuthRole": { roles: ["admin", "authRead", "authWrite", "moderator", "documentsAdmin"] },
    "authGroup/theAuthGroup": { groups: ["Test", "Test2"] },
    "users/userXRX": { roles: [], groups: [] },
    "users/userXRX2": { roles: [], groups: [] },
    "users/admin" : { roles: ['admin'], groups: [] },
    "users/moderator" : { roles: ['moderator'], groups: [] },
    "users/documentsAdmin" : { roles: ['documentsAdmin'], groups: [] }
};
let db;

describe("Simple-Auth Project - Not Authenticated user - Document Create", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], null);
    });
    it("1) create  Document correct", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 'userXRX', groups: [] }));
    });
    it("2) create  Document correct", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: null, groups: [] }));
    });
});

describe("Simple-Auth Project - Authenticated user - Document Create", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'userXRX' });
    });
    it("1) create  Document correct", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').set({ owner: 'userXRX', groups: [] }));
    });
    it("2) create  Document without groups array", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 'userXRX' }));
    });
    it("3) create  Document without empty groups array", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 'userXRX', groups: ["Test"] }));
    });
    it("4) create  Document other owner", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 'userXRX2', groups: [] }));
    });
    it("5) create  Document without owner", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ groups: [] }));
    });
    it("6) create  Document with owner as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 0, groups: [] }));
    });
    it("7) create  Document with groups as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 'userXRX', groups: 0 }));
    });
});

describe("Simple-Auth Project - admin user - Document Create", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'admin' });
    });
    it("1) create  Document correct", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').set({ owner: 'admin', groups: [] }));
    });
    it("2) create  Document without groups array", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 'admin' }));
    });
    it("3) create  Document without empty groups array", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').set({ owner: 'admin', groups: ["Test"] }));
    });
    it("4) create  Document other owner", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').set({ owner: 'userXRX2', groups: [] }));
    });
    it("5) create  Document without owner", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ groups: [] }));
    });
    it("6) create  Document with owner as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 0, groups: [] }));
    });
    it("7) create  Document with groups as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 'userXRX', groups: 0 }));
    });
});

describe("Simple-Auth Project - moderator user - Document Create", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'moderator' });
    });
    it("1) create  Document correct", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').set({ owner: 'moderator', groups: [] }));
    });
    it("2) create  Document without groups array", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 'moderator' }));
    });
    it("3) create  Document without empty groups array", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').set({ owner: 'moderator', groups: ["Test"] }));
    });
    it("4) create  Document other owner", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 'userXRX2', groups: [] }));
    });
    it("5) create  Document without owner", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ groups: [] }));
    });
    it("6) create  Document with owner as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 0, groups: [] }));
    });
    it("7) create  Document with groups as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 'userXRX', groups: 0 }));
    });
});

describe("Simple-Auth Project - documentsAdmin user - Document Create", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'documentsAdmin' });
    });
    it("1) create  Document correct", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').set({ owner: 'documentsAdmin', groups: [] }));
    });
    it("2) create  Document without groups array", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 'documentsAdmin' }));
    });
    it("3) create  Document without empty groups array", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').set({ owner: 'documentsAdmin', groups: ["Test"] }));
    });
    it("4) create  Document other owner", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').set({ owner: 'userXRX2', groups: [] }));
    });
    it("5) create  Document without owner", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ groups: [] }));
    });
    it("6) create  Document with owner as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 0, groups: [] }));
    });
    it("7) create  Document with groups as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 'userXRX', groups: 0 }));
    });
});