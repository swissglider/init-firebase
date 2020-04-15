const firebase = require("@firebase/testing");
const fs = require("fs");

module.exports.loadTestData = (async (projectId, testDataArray, auth) => {
    await firebase.clearFirestoreData({ projectId });
    const rules = fs.readFileSync("firestore.rules", "utf8");
    await firebase.loadFirestoreRules({ projectId, rules });
    const app = await firebase.initializeAdminApp({ projectId });
    const db = app.firestore();

    if (testDataArray) {
        const data = Object.assign({}, ...testDataArray);
        for (const key in data) {
            const ref = db.doc(key);
            await ref.set(data[key]);
        }
    }

    const app1 = await firebase.initializeTestApp({ projectId, auth });
    const db1 = app1.firestore();
    return db1;
});

module.exports.teardown = async () => {
    Promise.all(firebase.apps().map(app => app.delete()));
  };


// => for each test


