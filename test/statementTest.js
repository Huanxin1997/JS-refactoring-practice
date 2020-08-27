const test = require('ava');
const { statement, statementHtml } = require('../src/statement');

test("statement case 1. Customer without performance.", t => {
    const invoice = {
        'customer': 'BigCo',
        'performances': [],
    };

    const plays = {};

    const result = statement(invoice, plays);
    const expectedResult = 'Statement for BigCo\n' +
        'Amount owed is $0.00\n' +
        'You earned 0 credits \n'

    t.is(result, expectedResult);
})

test("statement case 2. Customer BigCo has one performance hamlet and audience is 30.", t => {
    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'hamlet',
                'audience': 30,
            }
        ],
    };

    const plays = {
        'hamlet': {
            'name': 'Hamlet',
            'type': 'tragedy',
        }
    };

    const result = statement(invoice, plays);
    const expectedResult = 'Statement for BigCo\n' +
        ' Hamlet: $400.00 (30 seats)\n' +
        'Amount owed is $400.00\n' +
        'You earned 0 credits \n'

    t.is(result, expectedResult);
})

test("statement case 3. Customer BigCo has one performance hamlet and audience is 40.", t => {
    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'hamlet',
                'audience': 40,
            }
        ],
    };

    const plays = {
        'hamlet': {
            'name': 'Hamlet',
            'type': 'tragedy',
        }
    };

    const result = statement(invoice, plays);
    const expectedResult = 'Statement for BigCo\n' +
        ' Hamlet: $500.00 (40 seats)\n' +
        'Amount owed is $500.00\n' +
        'You earned 10 credits \n'

    t.is(result, expectedResult);
})

test("statement case 4. Customer BigCo has one performance as-like and audience is 20.", t => {
    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'as-like',
                'audience': 20,
            },
        ],
    };

    const plays = {
        'as-like': {
            'name': 'As You Like It',
            'type': 'comedy',
        },
    };

    const result = statement(invoice, plays);
    const expectedResult = 'Statement for BigCo\n' +
        ' As You Like It: $360.00 (20 seats)\n' +
        'Amount owed is $360.00\n' +
        'You earned 4 credits \n'

    t.is(result, expectedResult);
})

test("statement case 5. Customer BigCo has one performance as-like and audience is 25.", t => {
    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'as-like',
                'audience': 25,
            },
        ],
    };

    const plays = {
        'as-like': {
            'name': 'As You Like It',
            'type': 'comedy',
        },
    };

    const result = statement(invoice, plays);
    const expectedResult = 'Statement for BigCo\n' +
        ' As You Like It: $500.00 (25 seats)\n' +
        'Amount owed is $500.00\n' +
        'You earned 5 credits \n'

    t.is(result, expectedResult);
})

test('statement case 6. Customer BigCo has three performances. ', t => {
    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'hamlet',
                'audience': 30,
            },
            {
                'playID': 'as-like',
                'audience': 20,
            },
            {
                'playID': 'othello',
                'audience': 30,
            },
        ],
    };

    const plays = {
        'hamlet': {
            'name': 'Hamlet',
            'type': 'tragedy',
        },
        'as-like': {
            'name': 'As You Like It',
            'type': 'comedy',
        },
        'othello': {
            'name': 'Othello',
            'type': 'tragedy',
        },
    };

    const result = statement(invoice, plays);
    const expectedResult = 'Statement for BigCo\n' +
        ' Hamlet: $400.00 (30 seats)\n' +
        ' As You Like It: $360.00 (20 seats)\n' +
        ' Othello: $400.00 (30 seats)\n' +
        'Amount owed is $1,160.00\n' +
        'You earned 4 credits \n'

    t.is(result, expectedResult);
});

test('statement case 7. Customer BigCo has one unknown performance. ', t => {
    const plays = {
        'othello': {
            'name': 'Othello',
            'type': 'tragedy1',
        },
    };
    
    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'othello',
                'audience': 40,
            },
        ],
    };

    try {
        statement(invoice, plays);
        t.fail();
    }
    catch (e) {
        t.is(e.message, 'unknown type: tragedy1');
    }
});

test('statement case 8. Customer BigCo has three performances. ' +
    'Hamlet has 55 audiences. ' +
    'As You Like Is has 35 audiences. ' +
    'Othello has 40 audiences.outPutHTML ', t => {

    const invoice = {
        'customer': 'BigCo',
        'performances': [
            {
                'playID': 'hamlet',
                'audience': 32,
            },
            {
                'playID': 'as-like',
                'audience': 35,
            },
            {
                'playID': 'othello',
                'audience': 38,
            },
        ],
    };

    const plays = {
        'hamlet': {
            'name': 'Hamlet',
            'type': 'tragedy',
        },
        'as-like': {
            'name': 'As You Like It',
            'type': 'comedy',
        },
        'othello': {
            'name': 'Othello',
            'type': 'tragedy',
        },
    };

    const result = statementHtml(invoice, plays);

    t.is(result, '<h1>Statement for BigCo</h1>\n' +
        '<table>\n' +
        '<tr><th>play</th><th>seats</th><th>cost</th></tr>' +
        ' <tr><td>Hamlet</td><td>32</td><td>$420.00</td></tr>\n' +
        ' <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>\n' +
        ' <tr><td>Othello</td><td>38</td><td>$480.00</td></tr>\n' +
        '</table>\n' +
        '<p>Amount owed is <em>$1,480.00</em></p>\n' +
        '<p>You earned <em>22</em> credits</p>\n');

});