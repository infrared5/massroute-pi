import mock
import logging
from behave.log_capture import capture

BUS_BLINK_SCENARIOS = ['Requests shifter to turn on pins upon :start()',
                        'Requests shifter to turn off pins after initial delay',
                        'Request shifter to turn on pins after second delay',
                        'Blinker stops invoking shifter upon :stop()']

class MockGPIO:
  def __init__(self):
    pass

class MockShifter:
  """
    MockShifter is an empty class with interface API of Shifter. 
    This allows for composition and testing on environments without the RPi.GPIO library.

    Use the Mock library in steps in order to stub out method operations/returns.
  """
  def __init__(self):
    pass
  def set_pin(self, value):
    pass
  def set_pins(self, value):
    pass
  def write(self):
    pass

class MockBoard:
  """
    MockBoard is an empty class with interface API of Board. 
    This allows for composition and testing on environments without the RPi.GPIO library.

    Use the Mock library in steps in order to stub out method operations/returns.
  """
  def __init__(self):
    pass

  def reset(self):
    pass

  def run_startup_seq(self):
    pass

  def run_shutdown_seq(self):
    pass

  def run_resource_error(self):
    pass

def before_all(context):
  if not context.config.log_capture:
    logging.basicConfig(level=logging.DEBUG)

# @mock.patch('RPi.GPIO', MockGPIO)
# @mock.patch('app.component.shifter.Shifter', MockShifter)
def before_scenario(context, feature):
  context.shifter = MockShifter()
  context.board = MockBoard()

@capture(level=logging.DEBUG)
def after_scenario(context, scenario):
  if scenario.name in BUS_BLINK_SCENARIOS:
    try:
      context.blinker.stop()
    except Exception, e:
      print 'no blinker: %r' % e