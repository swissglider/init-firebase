const firebase = require("@firebase/testing");
const fs = require("fs");
const { teardown, loadTestData } = require('./helper/helper');
const projectId = `rules-spec-${Date.now()}`;

beforeEach(async () => { });
before(async () => { });
after(async () => { await teardown(); });

const data1 = {
    "authRole/theAuthRole": { roles: ["admin", "authRead", "authWrite", "moderator", "documentsAdmin"] },
    "authGroup/theAuthGroup": { groups: ["Test", "Test1", "Test2", "Test77"] },
    "document2xTest/post1": { groups: ["Test", "Test2"], owner: 'userXRX0' },
    "document2xTest/post2": { groups: ["Test", "Test1"], owner: 'userXRX' },
    "document2xTest/post3": { groups: ["Test", "Test1"], owner: 'admin' },
    "document2xTest/post4": { groups: ["Test", "Test1"], owner: 'moderator' },
    "users/userXRX0": { roles: [], groups: [] },
    "users/userXRX": { roles: [], groups: [] },
    "users/userXRX2": { roles: [], groups: [] },
    "users/admin": { roles: ['admin'], groups: [] },
    "users/authWrite": { roles: ['authWrite'], groups: [] },
    "users/moderator": { roles: ['moderator'], groups: [] },
    "users/documentsAdmin": { roles: ['documentsAdmin'], groups: [] }
};
let db;

describe("Simple-Auth Project - Not Authenticated user - Document Delete", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], null);
    });
    it("1) update  Document correct", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').delete());
    });
});

describe("Simple-Auth Project - Authenticated user - Document Delete", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'userXRX' });
    });
    it("1) delete own Document correct", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post2').delete());
    });
    it("2) delete Document from other user correct", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').delete());
    });
});

describe("Simple-Auth Project - admin user - Document Delete", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'admin' });
    });
    it("1) delete Document from other user correct", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').delete());
    });
});

describe("Simple-Auth Project - authWrite users - Document Delete", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'authWrite' });
    });
    it("1) delete Document from other user correct", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').delete());
    });
    
});

describe("Simple-Auth Project - moderator users - Document Delete", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'moderator' });
    });
    it("1) delete Document from other user correct", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').delete());
    });
    
});

describe("Simple-Auth Project - documentsAdmin users - Document Delete", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'documentsAdmin' });
    });
    it("1) delete Document from other user correct", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').delete());
    });
    
});