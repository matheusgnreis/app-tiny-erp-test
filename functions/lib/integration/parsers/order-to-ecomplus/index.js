module.exports = (tinyOrder, shippingLines, tiny) => new Promise((resolve, reject) => {
  console.log(JSON.stringify(tinyOrder))
  const partialOrder = {}
  if (tinyOrder.obs_interna) {
    partialOrder.staff_notes = tinyOrder.obs_interna
  }

  console.log(JSON.stringify(shippingLines))

  if (shippingLines && shippingLines.length) {
    const shippingLine = shippingLines[0]
    console.log(JSON.stringify(shippingLine))
    if (
      tinyOrder.codigo_rastreamento &&
      (!shippingLine.tracking_codes || !shippingLine.tracking_codes.length)
    ) {
      const tracking = {
        code: tinyOrder.codigo_rastreamento
      }
      console.log(JSON.stringify(tracking))
      if (tinyOrder.url_rastreamento) {
        tracking.link = tinyOrder.url_rastreamento
      }
      shippingLine.tracking_codes = [tracking]
      console.log(JSON.stringify(shippingLine))
      partialOrder.shipping_lines = shippingLines
    }
    console.log(JSON.stringify(partialOrder))

    if (tinyOrder.id_nota_fiscal > 0) {
      console.log(2, JSON.stringify(partialOrder))
      shippingLine.invoices = []
      return tiny.post('/nota.fiscal.obter.php', { id: tinyOrder.id_nota_fiscal })
        .then(tinyInvoice => {
          const number = String(tinyInvoice.nota_fiscal.numero)
          if (number && !shippingLine.invoices.find(invoice => invoice.number === number)) {
            shippingLine.invoices.push({
              number,
              serial_number: String(tinyInvoice.nota_fiscal.serie)
            })
          }
          console.log(3)
          partialOrder.shipping_lines = shippingLines
          resolve(partialOrder)
        })
        .catch(reject)
    }
  }

  console.log(JSON.stringify(partialOrder))
  resolve(partialOrder)
})
