Feature: Request queue cycles through requests and handles results

  Scenario: Request queue invokes next upon success
    Given I have created a request queue
    And There are 2 items added to the queue
    When I invoke the queue to start() and the response is success
    Then The queue is invoked for next()

  Scenario: Request queue invokes next upon failure
    Given I have created a request queue
    And There are 2 items added to the queue
    When I invoke the queue to start() and the response is failure
    Then The queue is invoked for next()

  Scenario: Request cycles through queue once
    Given I have created a request queue
    And There are 2 items added to the queue
    When The service has responded twice
    Then The queue is not invoked for next()