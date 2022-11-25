module.exports = order => {
  let latestUpdate
  const fulfillments = order.fulfillments
  const paymentsHistory = order.payments_history
  let latestFulfillment, latestPayment
  if (Array.isArray(fulfillments)) {
    latestFulfillment = fulfillments.reduce((a, b) => (a.date_time > b.date_time ? a : b))
  }
  if (Array.isArray(paymentsHistory)) {
    latestPayment = paymentsHistory.reduce((a, b) => (a.date_time > b.date_time ? a : b))
  }
  if (latestFulfillment && latestPayment) {
    latestUpdate = latestFulfillment.date_time > latestPayment.date_time
      ? latestFulfillment : latestPayment
  } else if (latestFulfillment) {
    latestUpdate = latestFulfillment
  } else if (latestPayment) {
    latestUpdate = latestPayment
  } else {
    return null
  }
  switch (latestUpdate.status) {
    case 'pending':
    case 'under_analysis':
    case 'unknown':
    case 'authorized':
    case 'partially_paid':
    case 'voided':
    case 'refunded':
    case 'in_dispute':
    case 'unauthorized':
    case 'paid':
      return 'financial'
    case 'in_production':
    case 'in_separation':
    case 'invoice_issued':
    case 'ready_for_shipping':
    case 'shipped':
    case 'partially_shipped':
    case 'delivered':
    case 'returned':
      return 'fulfillment'
  }
  return null
}
