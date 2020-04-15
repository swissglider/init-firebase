const firebase = require("@firebase/testing");
const fs = require("fs");
const { teardown, loadTestData } = require('./helper/helper');
const projectId = `rules-spec-${Date.now()}`;

beforeEach(async () => { });
before(async () => { });
after(async () => { await teardown(); });

const data1 = {
    "authRole/theAuthRole": { roles: ["admin", "authRead", "authWrite", "moderator", "documentsAdmin", "editor"] },
    "authGroup/theAuthGroup": { groups: [
        "Group1",
        "Group2",
        "GroupX1",
        "GroupX2",
        "Test", "Test1", "Test2", "Test77"] },
    
    
    "users/userX": { roles: [], groups: [] },
    "document2xTest/postX01": { groups: [], owner: 'userX' },
    "document2xTest/postX02": { groups: ["Group1"], owner: 'userX' },
    "document2xTest/postX03": { groups: ["Group2"], owner: 'userX' },
    "document2xTest/postX04": { groups: ["Group1", "GroupX1"], owner: 'userX' },
    "document2xTest/postX05": { groups: ["GroupX1", "GroupX2"], owner: 'userX' },

    "users/user": { roles: [], groups: [] },
    "document2xTest/post101": { groups: ["Group1"], owner: 'user' },
    "document2xTest/post102": { groups: [], owner: 'user' },

    "users/user1": { roles: [], groups: ["Group1"] },
    "document2xTest/post201": { groups: ["Group1"], owner: 'user1' },
    "document2xTest/post202": { groups: [], owner: 'user1' },
    "document2xTest/post203": { groups: ["Group2"], owner: 'user1' },

    "users/user2": { roles: [], groups: ["Group1", "Group2"] },
    "document2xTest/post301": { groups: ["Group1"], owner: 'user2' },
    "document2xTest/post302": { groups: [], owner: 'user2' },
    "document2xTest/post303": { groups: ["Group2"], owner: 'user2' },
    "document2xTest/post304": { groups: ["GroupX2"], owner: 'user2' },

    "users/admin": { roles: ['admin'], groups: [] },
    "document2xTest/postA01": { groups: ["Group1"], owner: 'admin' },
    "document2xTest/postA01": { groups: [""], owner: 'admin' },

    "users/authWrite": { roles: ['authWrite'], groups: [] },
    "document2xTest/postAA01": { groups: ["Group1"], owner: 'authWrite' },
    "document2xTest/postAA01": { groups: [""], owner: 'authWrite' },

    "users/authRead": { roles: ['authRead'], groups: [] },
    "document2xTest/postAR01": { groups: ["Group1"], owner: 'authRead' },
    "document2xTest/postAR01": { groups: [""], owner: 'authRead' },

    "users/moderator": { roles: ['moderator'], groups: [] },
    "document2xTest/postM01": { groups: ["Group1"], owner: 'moderator' },
    "document2xTest/postM01": { groups: [""], owner: 'moderator' },

    "users/documentsAdmin": { roles: ['documentsAdmin'], groups: [] },
    "document2xTest/postD01": { groups: ["Group1"], owner: 'documentsAdmin' },
    "document2xTest/postD01": { groups: [""], owner: 'documentsAdmin' },

    "users/editor": { roles: ['editor'], groups: [] },
    "document2xTest/postE01": { groups: ["Group1"], owner: 'editor' },
    "document2xTest/postE01": { groups: [""], owner: 'editor' },
};
let db;

describe("Simple-Auth Project - Not Authenticated user - Document Read", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], null);
    });
    it("1) update  Document correct", async () => {
        await firebase.assertFails(db.doc('document2xTest/post5').get());
    });
});

describe("Simple-Auth Project - Authenticated user wihtout any group - Document Read", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'user' });
    });
    it("1) Read Document post", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post101').get());
    });
    it("2) Read Document post", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post102').get());
    });
    it("3) Read Document from other user", async () => {
        await firebase.assertFails(db.doc('document2xTest/postX02').get());
    });
    it("4) Read Document from other user", async () => {
        await firebase.assertFails(db.doc('document2xTest/postX01').get());
    });
});

describe("Simple-Auth Project - Authenticated user group Group1 - Document Read", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'user1' });
    });
    it("1) read Document as owner", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post201').get());
    });
    it("2) read Document as owner", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post202').get());
    });
    it("3) read Document as owner", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post203').get());
    });
    it("4) read Document other owner ; group ok", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post101').get());
    });
    it("5) read Document other owner ; group not ok", async () => {
        await firebase.assertFails(db.doc('document2xTest/post102').get());
    });
    it("6) read Document other owner ; group not ok", async () => {
        await firebase.assertFails(db.doc('document2xTest/postX01').get());
    });
    it("7) read Document other owner ; group ok", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/postX02').get());
    });
    it("8) read Document other owner ; group not ok", async () => {
        await firebase.assertFails(db.doc('document2xTest/postX03').get());
    });
    it("9) read Document other owner ; group ok", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/postX04').get());
    });
});

describe("Simple-Auth Project - Authenticated user group Group1/Group2 - Document Read", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'user2' });
    });
    it("1) read Document as owner", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post301').get());
    });
    it("2) read Document as owner", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post302').get());
    });
    it("3) read Document as owner", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post303').get());
    });
    it("4) read Document as owner", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post304').get());
    });
    it("5) read Document other owner ; group ok", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post201').get());
    });
    it("6) read Document other owner ; group not ok", async () => {
        await firebase.assertFails(db.doc('document2xTest/post202').get());
    });
    it("7) read Document other owner ; group ok", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post203').get());
    });
    it("8) read Document other owner ; group ok", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post101').get());
    });
    it("9) read Document other owner ; group not ok", async () => {
        await firebase.assertFails(db.doc('document2xTest/post102').get());
    });
    it("10) read Document other owner ; group not ok", async () => {
        await firebase.assertFails(db.doc('document2xTest/postX01').get());
    });
    it("11) read Document other owner ; group ok", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/postX02').get());
    });
    it("12) read Document other owner ; group ok", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/postX03').get());
    });
    it("13) read Document other owner ; group ok", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/postX04').get());
    });
    it("14) read Document other owner ; group not ok", async () => {
        await firebase.assertFails(db.doc('document2xTest/postX05').get());
    });
});

describe("Simple-Auth Project - user with roles - Document Read", async () => {
    beforeEach(async () => {
        
    });
    const getAllDocuments = (async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/postX01').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postX02').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postX03').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postX04').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postX05').get());
        await firebase.assertSucceeds(db.doc('document2xTest/post101').get());
        await firebase.assertSucceeds(db.doc('document2xTest/post102').get());
        await firebase.assertSucceeds(db.doc('document2xTest/post201').get());
        await firebase.assertSucceeds(db.doc('document2xTest/post202').get());
        await firebase.assertSucceeds(db.doc('document2xTest/post203').get());
        await firebase.assertSucceeds(db.doc('document2xTest/post301').get());
        await firebase.assertSucceeds(db.doc('document2xTest/post302').get());
        await firebase.assertSucceeds(db.doc('document2xTest/post303').get());
        await firebase.assertSucceeds(db.doc('document2xTest/post304').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postA01').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postA01').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postAA01').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postAA01').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postAR01').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postAR01').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postM01').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postM01').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postD01').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postD01').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postD01').get());
        await firebase.assertSucceeds(db.doc('document2xTest/postD01').get());
    });
    it("1) get Document as admin", async () => {
        db = await loadTestData(projectId, [data1], { uid: 'admin' });
        await getAllDocuments();
    });
    it("2) get Document as authWrite", async () => {
        db = await loadTestData(projectId, [data1], { uid: 'authWrite' });
        await getAllDocuments();
    });
    it("3) get Document as authRead", async () => {
        db = await loadTestData(projectId, [data1], { uid: 'authWrite' });
        await getAllDocuments();
    });
    it("4) get Document as authRead", async () => {
        db = await loadTestData(projectId, [data1], { uid: 'authRead' });
        await getAllDocuments();
    });
    it("5) get Document as moderator", async () => {
        db = await loadTestData(projectId, [data1], { uid: 'moderator' });
        await getAllDocuments();
    });
    it("6) get Document as documentsAdmin", async () => {
        db = await loadTestData(projectId, [data1], { uid: 'documentsAdmin' });
        await getAllDocuments();
    });
    it("7) get Document as editor", async () => {
        db = await loadTestData(projectId, [data1], { uid: 'editor' });
        await getAllDocuments();
    });
});