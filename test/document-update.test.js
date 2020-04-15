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
    "users/moderator": { roles: ['moderator'], groups: [] },
    "users/documentsAdmin": { roles: ['documentsAdmin'], groups: [] }
};
let db;

describe("Simple-Auth Project - Not Authenticated user - Document Update", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], null);
    });
    it("1) update  Document correct", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').set({ owner: 'userXRX0', groups: [] }));
    });
});

describe("Simple-Auth Project - Authenticated user - Document Update", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'userXRX' });
    });
    it("1) update  own Document correct", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post2').update({owner: 'userXRX', groups: ["Test", "Test1"]}));
    });
    it("1.1) update  own Document correct", async () => {
        await firebase.assertFails(db.doc('document2xTest/post2').update({owner: 'userXRX', groups: ["Test", "Test12"]}));
    });
    it("2) update  Document without groups array", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post2').update({ owner: 'userXRX' }));
    });
    it("3) update  Document without empty groups array", async () => {
        await firebase.assertFails(db.doc('document2xTest/post2').update({ owner: 'userXRX', groups: ["Test"] }));
    });
    it("4) update  Document other owner", async () => {
        await firebase.assertFails(db.doc('document2xTest/post2').update({ owner: 'userXRX2', groups: [] }));
    });
    it("5) update  Document without owner", async () => {
        await firebase.assertFails(db.doc('document2xTest/post2').update({ groups: [] }));
    });
    it("6) update  Document with owner as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post2').update({ owner: 0, groups: [] }));
    });
    it("7) update  Document with groups as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post2').update({ owner: 'userXRX', groups: 0 }));
    });
    it("8) update  Document correct but from an other user", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').update({ owner: 'userXRX', groups: [] }));
    });
});

describe("Simple-Auth Project - admin user - Document Update", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'admin' });
    });
    it("1) update  Document correct", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post3').update({ owner: 'admin', groups: [] }));
    });
    it("2) update  Document without groups array", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post3').update({ owner: 'admin' }));
    });
    it("3) update  Document without empty groups array", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post3').update({ owner: 'admin', groups: ["Test"] }));
    });
    it("4) update  Document other owner", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post3').update({ owner: 'userXRX2', groups: [] }));
    });
    it("5) update  Document without owner", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post3').update({ groups: [] }));
    });
    it("6) update  Document with owner as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post3').update({ owner: 0, groups: [] }));
    });
    it("7) update  Document with groups as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post3').update({ owner: 'userXRX', groups: 0 }));
    });
    it("8) update  Document correct but from an other user", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').update({ owner: 'admin', groups: [] }));
    });
    it("9) update  Document correct but from an other user wih group that is not existing", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').update({ owner: 'userXRX0', groups: ['Hallo'] }));
    });
});

describe("Simple-Auth Project - moderator user - Document Update", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'moderator' });
    });
    it("1) update  Document correct", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post4').update({ owner: 'moderator', groups: [] }));
    });
    it("2) update  Document without groups array", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post4').update({ owner: 'moderator' }));
    });
    it("3) update  Document without empty groups array", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post4').update({ owner: 'moderator', groups: ["Test"] }));
    });
    it("4) update  Document other owner", async () => {
        await firebase.assertFails(db.doc('document2xTest/post4').update({ owner: 'userXRX2', groups: [] }));
    });
    it("5) update  Document without owner", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post4').update({ groups: [] }));
    });
    it("6) update  Document with owner as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post4').update({ owner: 0, groups: [] }));
    });
    it("7) update  Document with groups as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post4').update({ owner: 'userXRX', groups: 0 }));
    });
    it("8) update  Document correct but from an other user", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').update({ owner: 'moderator', groups: [] }));
    });
    it("9) update  Document correct but from an other user", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').update({ owner: 'userXRX0', groups: ['Test77'] }));
    });
    it("10) update  Document correct but from an other user", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').update({groups: ['Test77'] }));
    });
    it("11) update  Document correct but from an other user and changes owner", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').update({owner: 'moderator', groups: ['Test77'] }));
    });
    it("12) update  Document correct but from an other user wih group that is not existing", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').update({ owner: 'userXRX0', groups: ['Hallo'] }));
    });
});

describe("Simple-Auth Project - documentsAdmin user - Document Update", async () => {
    beforeEach(async () => {
        db = await loadTestData(projectId, [data1], { uid: 'documentsAdmin' });
    });
    it("1) update  Document correct", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').update({ owner: 'documentsAdmin', groups: [] }));
    });
    it("2) update  Document without groups array", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').update({ owner: 'documentsAdmin' }));
    });
    it("3) update  Document without empty groups array", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').update({ owner: 'documentsAdmin', groups: ["Test"] }));
    });
    it("4) update  Document other owner", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').update({ owner: 'userXRX2', groups: [] }));
    });
    it("5) update  Document without owner", async () => {
        await firebase.assertSucceeds(db.doc('document2xTest/post1').update({ groups: [] }));
    });
    it("6) update  Document with owner as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').update({ owner: 0, groups: [] }));
    });
    it("7) update  Document with groups as int", async () => {
        await firebase.assertFails(db.doc('document2xTest/post1').update({ owner: 'userXRX', groups: 0 }));
    });
});