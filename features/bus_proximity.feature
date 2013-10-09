Feature: ProximityLED component displays state information based on bus proximity within defined distance

  Scenario: Notifies shifter for LOW with request response greater than 5 minutes
    Given LED is setup with service resolver with ProximityLED
    When Data provided with next prediction bus more than 5 minutes from stop
    Then ProximityLED invokes shifter with 0

  Scenario: Notifies shifter for HIGH with request response less than 5 minutes
    Given LED is setup with service resolver with ProximityLED
    When Data provided with next prediction bus less than 5 minutes from stop
    Then ProximityLED invokes shifter with 1