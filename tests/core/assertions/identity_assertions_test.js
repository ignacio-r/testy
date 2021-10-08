'use strict';

const { suite, test } = require('../../../testy');
const { resultOfATestWith } = require('../../support/runner_helpers');
const { expectSuccess, expectFailureOn } = require('../../support/assertion_helpers');

const { I18nMessage } = require('../../../lib/i18n');

suite('identity assertions', () => {
  test('isIdenticalTo pass with same primitive objects', () => {
    const result = resultOfATestWith(assert => assert.that(42).isIdenticalTo(42));
    
    expectSuccess(result);
  });
  
  test('isIdenticalTo fails with different primitive objects', () => {
    const result = resultOfATestWith(assert => assert.that(42).isIdenticalTo(21));
    
    expectFailureOn(result, I18nMessage.of('identity_assertion_be_identical_to', '42', '21'));
  });
  
  test('isIdenticalTo passes with boxed and unboxed objects', () => {
    const result = resultOfATestWith(assert => assert.that(42).isIdenticalTo((42)));
    
    expectSuccess(result);
  });
  
  test('isIdenticalTo does not pass with two equal arrays', () => {
    const result = resultOfATestWith(assert => assert.that([1, 2, 3]).isIdenticalTo([1, 2, 3]));
    
    expectFailureOn(result, I18nMessage.of('identity_assertion_be_identical_to', '[ 1, 2, 3 ]', '[ 1, 2, 3 ]'));
  });
  
  test('isIdenticalTo does not pass with two objects having the same property values', () => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    const objectTwo = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    /* eslint-enable id-length */
    const result = resultOfATestWith(assert => assert.that(objectOne).isIdenticalTo(objectTwo));
    
    expectFailureOn(result, I18nMessage.of('identity_assertion_be_identical_to', "{ a: 'a', b: { b1: 'b1', b2: 'b2' } }", "{ a: 'a', b: { b1: 'b1', b2: 'b2' } }"));
  });

  test('isIdenticalTo passes with two references of the same object', () => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    const anotherObjectOneReference = objectOne;
    /* eslint-enable id-length */
    const result = resultOfATestWith(assert => assert.that(objectOne).isIdenticalTo(anotherObjectOneReference));
    
    expectSuccess(result);
  });
  
  test('isIdenticalTo fails when comparing undefined with an object', () => {
    const resultOne = resultOfATestWith(assert => assert.that(undefined).isIdenticalTo({}));
    const resultTwo = resultOfATestWith(assert => assert.that({}).isIdenticalTo(undefined));
    
    expectFailureOn(resultOne, I18nMessage.of('identity_assertion_be_identical_to', 'undefined', '{}'));
    expectFailureOn(resultTwo, I18nMessage.of('identity_assertion_be_identical_to', '{}', 'undefined'));
  });

  test('isNotIdenticalTo passes when comparing undefined with an object', () => {
    const resultOne = resultOfATestWith(assert => assert.that(undefined).isNotIdenticalTo({}));
    const resultTwo = resultOfATestWith(assert => assert.that({}).isNotIdenticalTo(undefined));
    
    expectSuccess(resultOne);
    expectSuccess(resultTwo);
  });
  
  test('isIdenticalTo fails when comparing null with an object', () => {
    const resultOne = resultOfATestWith(assert => assert.that(null).isIdenticalTo({}));
    const resultTwo = resultOfATestWith(assert => assert.that({}).isIdenticalTo(null));
    
    expectFailureOn(resultOne, I18nMessage.of('identity_assertion_be_identical_to', 'null', '{}'));
    expectFailureOn(resultTwo, I18nMessage.of('identity_assertion_be_identical_to', '{}', 'null'));
  });

  test('isNotIdenticalTo passes when comparing null with an object', () => {
    const resultOne = resultOfATestWith(assert => assert.that(null).isNotIdenticalTo({}));
    const resultTwo = resultOfATestWith(assert => assert.that({}).isNotIdenticalTo(null));
    
    expectSuccess(resultOne);
    expectSuccess(resultTwo);
  });
  
  test('isIdenticalTo fails if both parts are undefined', () => {
    const result = resultOfATestWith(assert => assert.that(undefined).isIdenticalTo(undefined));
    expectFailureOn(result, I18nMessage.of('identity_assertion_failed_due_to_undetermination'));
  });

  test('isNotIdenticalTo fails if both parts are undefined', () => {
    const result = resultOfATestWith(assert => assert.that(undefined).isNotIdenticalTo(undefined));
    expectFailureOn(result, I18nMessage.of('identity_assertion_failed_due_to_undetermination'));
  });

  test('isNotIdenticalTo pass with different primitive objects', () => {
    const result = resultOfATestWith(assert => assert.that(42).isNotIdenticalTo(21));
    
    expectSuccess(result);
  });
  
  test('isNotIdenticalTo fails with same primitive objects', () => {
    const result = resultOfATestWith(assert => assert.that(42).isNotIdenticalTo(42));
    
    expectFailureOn(result, I18nMessage.of('identity_assertion_be_not_identical_to', '42', '42'));
  });

  test('isNotIdenticalTo passes with two equal arrays', () => {
    const result = resultOfATestWith(assert => assert.that([1, 2, 3]).isNotIdenticalTo([1, 2, 3]));
    
    expectSuccess(result);
  });
  
  test('isNotIdenticalTo does passes with two objects having the same property values', () => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    const objectTwo = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    /* eslint-enable id-length */
    const result = resultOfATestWith(assert => assert.that(objectOne).isNotIdenticalTo(objectTwo));
    
    expectSuccess(result);
  });

  test('isNotIdenticalTo does not pass with two references of the same object', () => {
    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    const anotherObjectOneReference = objectOne;
    /* eslint-enable id-length */
    const result = resultOfATestWith(assert => assert.that(objectOne).isNotIdenticalTo(anotherObjectOneReference));

    expectFailureOn(result, I18nMessage.of('identity_assertion_be_not_identical_to', "{ a: 'a', b: { b1: 'b1', b2: 'b2' } }", "{ a: 'a', b: { b1: 'b1', b2: 'b2' } }"));
  });

  test('areIdentical works in the same way as that isIdenticalTo', () => {
    const resultOne = resultOfATestWith(assert => assert.areIdentical(42, 42));
    expectSuccess(resultOne);

    const resultTwo = resultOfATestWith(assert => assert.areIdentical(42, 21));
    expectFailureOn(resultTwo, I18nMessage.of('identity_assertion_be_identical_to', '42', '21'));

    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    const anotherObjectOneReference = objectOne;
    /* eslint-enable id-length */
    const resultThree = resultOfATestWith(assert => assert.areIdentical(objectOne, anotherObjectOneReference));
    expectSuccess(resultThree);

    const resultFour = resultOfATestWith(assert => assert.areIdentical(undefined, undefined));
    expectFailureOn(resultFour, I18nMessage.of('identity_assertion_failed_due_to_undetermination'));
  });

  test('areNotIdentical works in the same way as that isNotIdenticalTo', () => {
    const resultOne = resultOfATestWith(assert => assert.areNotIdentical(42, 42));
    expectFailureOn(resultOne, I18nMessage.of('identity_assertion_be_not_identical_to', '42', '42'));

    const resultTwo = resultOfATestWith(assert => assert.areNotIdentical(42, 21));
    expectSuccess(resultTwo);

    /* eslint-disable id-length */
    const objectOne = { a: 'a', b: { b1: 'b1', b2: 'b2' } };
    const anotherObjectOneReference = objectOne;
    /* eslint-enable id-length */
    const resultThree = resultOfATestWith(assert => assert.areNotIdentical(objectOne, anotherObjectOneReference));
    expectFailureOn(resultThree, I18nMessage.of('identity_assertion_be_not_identical_to', "{ a: 'a', b: { b1: 'b1', b2: 'b2' } }", "{ a: 'a', b: { b1: 'b1', b2: 'b2' } }"));

    const resultFour = resultOfATestWith(assert => assert.areNotIdentical(undefined, undefined));
    expectFailureOn(resultFour, I18nMessage.of('identity_assertion_failed_due_to_undetermination'));
  });
  
});
