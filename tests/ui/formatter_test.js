'use strict';

const { suite, test, before, assert } = require('../../testy');
const { withRunner, runSingleTest } = require('../support/runner_helpers');
const { aTestWithBody, aPendingTest } = require('../support/tests_factory');

const Formatter = require('../../lib/formatter');
const { I18n } = require('../../lib/i18n');
const FakeConsole = require('./fake_console');

suite('formatter', () => {
  let formatter, fakeConsole, i18n;
  
  before(() => {
    fakeConsole = new FakeConsole();
  
    i18n = I18n.default();
    formatter = new Formatter(fakeConsole, i18n);
  });
  
  test('display errors in red', () => {
    formatter.displayError('things happened');
    const expectedErrorMessage = '\x1b[31mthings happened\x1b[0m';
    assert.that(fakeConsole.messages()).includesExactly(expectedErrorMessage);
  });
  
  test('display pending status in yellow including reason', () => {
    withRunner((runner, _assert, _fail, pending) => {
      const test = aTestWithBody(() => pending.dueTo('in a rush'));
      runSingleTest(runner, test);
      formatter.displayPendingResult(test);
      const testResultMessage = '[\u001b[33m\u001b[1mWIP\u001b[0m] \u001b[33mjust a test\u001b[0m';
      const pendingReasonMessage = '  => in a rush';
      assert.that(fakeConsole.messages()).isEqualTo([testResultMessage, pendingReasonMessage]);
    });
  });
  
  test('display error status in red when not specifying a reason', () => {
    withRunner((runner, _assert, _fail, pending) => {
      const test = aTestWithBody(() => pending.dueTo());
      runSingleTest(runner, test);
      formatter.displayErrorResult(test);
      const testResultMessage = '[\u001b[31m\u001b[1mERROR\u001b[0m] \u001b[31mjust a test\u001b[0m';
      const pendingReasonMessage = '  => In order to mark a test as pending, you need to specify a reason.';
      assert.that(fakeConsole.messages()).isEqualTo([testResultMessage, pendingReasonMessage]);
    });
  });
  
  test('display failure status in red including reason', () => {
    withRunner((runner, _assert, fail) => {
      const test = aTestWithBody(() => fail.with('I wanted to fail'));
      runSingleTest(runner, test);
      formatter.displayFailureResult(test);
      const testResultMessage = '[\u001b[31m\u001b[1mFAIL\u001b[0m] \u001b[31mjust a test\u001b[0m';
      const failureDetailMessage = '  => I wanted to fail';
      assert.that(fakeConsole.messages()).isEqualTo([testResultMessage, failureDetailMessage]);
    });
  });
  
  test('display failure status in red including default explicit failure reason', () => {
    withRunner((runner, _assert, fail) => {
      const test = aTestWithBody(() => fail.with());
      runSingleTest(runner, test);
      formatter.displayFailureResult(test);
      const testResultMessage = '[\u001b[31m\u001b[1mFAIL\u001b[0m] \u001b[31mjust a test\u001b[0m';
      const failureDetailMessage = '  => Explicitly failed';
      assert.that(fakeConsole.messages()).isEqualTo([testResultMessage, failureDetailMessage]);
    });
  });
  
  test('display pending status in yellow and no reason if the test is empty', () => {
    withRunner(runner => {
      const test = aPendingTest();
      runSingleTest(runner, test);
      formatter.displayPendingResult(test);
      const testResultMessage = '[\u001b[33m\u001b[1mWIP\u001b[0m] \u001b[33ma work in progress\u001b[0m';
      assert.that(fakeConsole.messages()).includesExactly(testResultMessage);
    });
  });
});
