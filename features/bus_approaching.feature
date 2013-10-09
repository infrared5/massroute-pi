Feature: LED component displays state information based on bus data approaching within defined distance

  Scenario: Notifies shifter for LOW with request response greater than 2 minutes
    Given LED is setup with service resolver with ApproachingResolver
    When Data provided with next prediction bus more than 2 minutes from stop
    Then ApproachingLED invokes shifter with 0 on set of pins

  Scenario: Notifies shifter for HIGH with request response less than 2 minutes
    Given LED is setup with service resolver with ApproachingResolver
    When Data provided with next prediction bus less than 2 minutes from stop
    Then ApproachingLED invokes shifter with 1 on set of pins