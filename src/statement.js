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
    let {totalAmount, volumeCredits, resultMsg} = handlePermances(invoice.performances, plays);
    let result = generateResult(resultMsg, totalAmount, volumeCredits, invoice.customer);
    return result;
}

function generateHTMLResult(performances, plays) {
    let resultMsg = "";
    let {totalAmount, volumeCredits} = handlePermances(performances, plays);
    for (let perf of performances) {
        let thisAmount = 0;
        const play = plays[perf.playID];
        thisAmount = getThisAmount(thisAmount, play, perf);
        resultMsg += ` <tr><td>${play.name}</td><td>${perf.audience}</td><td>${format(thisAmount)}</td></tr>\n`;
    }

    return {totalAmount, resultMsg, volumeCredits};
}

function statement(invoice, plays) {
    return getStatement(invoice, plays);
}

function statementHtml(invoice, plays) {
    let result = `<h1>Statement for ${invoice.customer}</h1>\n<table>\n<tr><th>play</th><th>seats</th><th>cost</th></tr>`;
    let {totalAmount, resultMsg, volumeCredits} = generateHTMLResult(invoice.performances, plays);
    result += resultMsg;
    result += `</table>\n<p>Amount owed is <em>${format(totalAmount)}</em></p>\n<p>You earned <em>${volumeCredits}</em> credits</p>\n`;
    return result;
}

module.exports = {
    statement,
    statementHtml
};
