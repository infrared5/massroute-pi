Feature: Blinker requests write to shifter at alternating intervals

  Scenario: Requests shifter to turn on pins upon :start()
    Given A new Blinker instance provided with a Shifter reference
    When Blinker:start() invoked
    Then Shifter:set_pins() invoked with 1 once

  Scenario: Requests shifter to turn off pins after initial delay
    Given A new Blinker instance with 0.2 second delay
    When Blinker:start() invoked
    And At least 0.2 seconds have lapsed
    Then Shifter:set_pins() invoked with 0

  Scenario: Request shifter to turn on pins after second delay
    Given A new Blinker instance with 0.2 second delay
    When Blinker:start() invoked
    And At least 0.4 seconds have lapsed
    Then Shifter:set_pins() invoked with 1 twice

  Scenario: Blinker stops invoking shifter upon :stop()
    Given A new Blinker instance with 0.2 second delay
    When Blinker:start() invoked
    And Blinker:stop() invoked
    And At least 0.2 seconds have lapsed
    Then Shifter:set_pins() not called more than once