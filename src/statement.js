function calculateAmount(thisAmount, perf, boundary, unitIncrease, startingNumber = 0) {
  if (perf.audience > boundary) {
    thisAmount += startingNumber + unitIncrease * (perf.audience - boundary);
  }
  return thisAmount;
}

function format(thisAmount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(thisAmount / 100);
}

function getVolumeCredits(volumeCredits, perf, play) {
  volumeCredits += Math.max(perf.audience - 30, 0);
  if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);
  return volumeCredits;
}

function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;
    switch (play.type) {
      case 'tragedy':
        thisAmount = calculateAmount(40000, perf, 30, 1000);
        break;
      case 'comedy':
        thisAmount = 30000;
        thisAmount = calculateAmount(30000, perf, 20, 500, 10000);
        thisAmount += 300 * perf.audience;
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }
    volumeCredits = getVolumeCredits(volumeCredits, perf, play)
    //print line for this order
    result += ` ${play.name}: ${format(thisAmount)} (${perf.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
}

module.exports = {
  statement,
};
