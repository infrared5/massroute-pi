Feature: Service invokes delegate on success and fault

  Scenario: Delegate:success() is invoked with resultant data
    Given A service instance is established
    When The data is accessible and available
    And The service is invoked to access predictions for given stop id
    Then success() is invoked on the provided delegate

  Scenario: Delegate:error() is invoked with error message
    Given A service instance is established
    When The data is unaccessible but available
    And The service is invoked to access predictions for given stop id
    Then error() is invoked on the provided delgate