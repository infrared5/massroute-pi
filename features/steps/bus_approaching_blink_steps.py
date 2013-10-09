from time import sleep
from app.component.modifier.blinker import Blinker

PINS = [0,1,2,3]
DELAY = 0.2

@given('A new Blinker instance provided with a Shifter reference')
def blinker_setup_with_shifter(context):
  shifter = context.shifter
  blinker = Blinker(shifter)
  blinker.set_pins(PINS)

  shifter.set_pins = MagicMock(return_value=None)
  
  context.blinker = blinker

@when('Blinker:start() invoked')
def blinker_start(context):
  context.blinker.start()

@then('Shifter:set_pins() invoked with 1 once')
def shifter_set_pins_on_once(context):
  context.shifter.set_pins.assert_called_once_with(PINS, 1)

@given('A new Blinker instance with 0.2 second delay')
def blinker_setup_with_delay(context):
  shifter = context.shifter
  blinker = Blinker(shifter, DELAY)
  blinker.set_pins(PINS)

  shifter.set_pins = MagicMock(return_value=None)
  context.blinker = blinker

@when('At least 0.2 seconds have lapsed')
def time_elapsed_two_milliseconds(context):
  sleep(0.22)

@when('At least 0.4 seconds have lapsed')
def time_elapsed_four_milliseconds(context):
  sleep(0.42)

@when('Blinker:stop() invoked')
def blinker_stop(context):
  context.blinker.stop()

@then('Shifter:set_pins() invoked with 0')
def shifter_set_pins_off(context):
  context.shifter.set_pins.assert_called_with(PINS, 0)

@then('Shifter:set_pins() invoked with 1 twice')
def shifter_set_pins_on_twice(context):
  # once for off, twice for on
  assert context.shifter.set_pins.call_count == 3

@then('Shifter:set_pins() not called more than once')
def shifter_set_pins_called_once(context):
  context.shifter.set_pins.assert_called_once()