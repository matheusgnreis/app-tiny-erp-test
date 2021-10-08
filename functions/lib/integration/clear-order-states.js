const { firestore } = require('firebase-admin')

module.exports = context => {
  const date = new Date()
  date.setDate(date.getDate() - 1)

  const delOldDocs = (collName, fieldName, fieldVal) => {
    return firestore()
      .collection(collName)
      .where(fieldName, '<', fieldVal)
      .limit(500)
      .get().then(async querySnapshot => {
        for (const doc of querySnapshot.docs) {
          await doc.ref.delete()
        }
        return querySnapshot
      })
  }

  return delOldDocs('tiny_orders', 'updatedAt', firestore.Timestamp.fromDate(date))
    .then(querySnapshot => {
      console.log(`> Deleted ${querySnapshot.size} Tiny order states`)
      return delOldDocs('integration_retries', 'd', date.toISOString())
        .then(querySnapshot => {
          console.log(`> Deleted ${querySnapshot.size} integration retries`)
        })
    })
}
