Feature: Scheduler manages availability based on 'live' timeframe

  Scenario: Scheduler is considered available when within of timeframe
    Given A Scheduler has a 'live' timeframe of 6am to 10pm
    When Current time is within timeframe
    Then Scheduler is considered available

  Scenario: Scheduler is considered unavailable when outside of timeframe
    Given A Scheduler has a 'live' timeframe of 6am to 10pm
    When Current time is not within timeframe
    Then Scheduler is not considered available