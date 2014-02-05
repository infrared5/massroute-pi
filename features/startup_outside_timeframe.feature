Feature: Start up not within defined 'live' timeframe stops program

  Scenario: Stop Sequence called
    Given The Program is intiated
    When The current time lies outside of the 'live' timeframe
    And The Program is invoked to :start()
    Then The Stop Sequence is initiated