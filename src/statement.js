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

function getThisAmount(thisAmount, play, perf) {
    switch (play.type) {
        case 'tragedy':
            thisAmount = calculateAmount(40000, perf, 30, 1000);
            break;
        case 'comedy':
            thisAmount = calculateAmount(30000, perf, 20, 500, 10000);
            thisAmount += 300 * perf.audience;
            break;
        default:
            throw new Error(`unknown type: ${play.type}`);
    }
    return thisAmount;
}

function handlePermances(performances, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let resultMsg = "";
    for (let perf of performances) {
        const play = plays[perf.playID];
        let thisAmount = 0;
        thisAmount = getThisAmount(thisAmount, play, perf);
        volumeCredits = getVolumeCredits(volumeCredits, perf, play)
        resultMsg += ` ${play.name}: ${format(thisAmount)} (${perf.audience} seats)\n`;
        totalAmount += thisAmount;
    }
    return {totalAmount, resultMsg, volumeCredits};
}

function generateResult(resultMsg, totalAmount, volumeCredits, customer) {
    let result = `Statement for ${customer}\n`;
    result += resultMsg;
    result += `Amount owed is ${format(totalAmount)}\n`;
    result += `You earned ${volumeCredits} credits \n`;
    return result;
}

function getStatement(invoice, plays) {
    let {resultMsg, totalAmount, volumeCredits} = handlePermances(invoice.performances, plays);
    let result = generateResult(resultMsg, totalAmount, volumeCredits, invoice.customer);
    return result;
}

function statement(invoice, plays) {
    return getStatement(invoice, plays);
}

module.exports = {
    statement,
};
