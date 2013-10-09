import logging
from app.component.modifier.blinker import blinker_pool

logger = logging.getLogger(__name__)

class ProximityResolver:

  pin_id = 0
  shifter = None
  MIN_PROXIMINITY = 60 * 5 # in seconds
  
  def __init__(self, pin_id, shifter):
    self.pin_id = pin_id
    self.shifter = shifter

  def is_within_proximity(self, seconds):
    return False if seconds > ProximityResolver.MIN_PROXIMINITY else True

  def show_in_proximity(self):
    self.shifter.set_pin(self.pin_id, 1)
    self.shifter.write()

  def show_out_of_proximity(self):
    self.shifter.set_pin(self.pin_id, 0)
    self.shifter.write()

  def resolve(self, predictions):
    if len(predictions) > 0:
      seconds = int(predictions[0]['seconds'])
      logger.info("Seconds left for first prediction: %d seconds" % seconds)
      if self.is_within_proximity(seconds):
        self.show_in_proximity()
      else:
        self.show_out_of_proximity()
    else:
      self.show_out_of_proximity()

  def error(self):
      self.show_out_of_proximity()

class ApproachingResolver:
  
  pins = []
  shifter = None
  MIN_PROXIMINITY = 60 * 2 # seconds

  def __init__(self, pins, shifter):
    self.pins = pins
    self.shifter = shifter

  def is_within_proximity(self, seconds):
    return False if seconds > ApproachingResolver.MIN_PROXIMINITY else True

  def show_multiple_in_proximity(self):
    self.shifter.set_pins(self.pins, 1)
    self.shifter.write()

  def show_multiple_out_of_proximity(self):
    self.shifter.set_pins(self.pins, 0)
    self.shifter.write()

  def resolve(self, predictions):
    if len(predictions) > 0:
      seconds = int(predictions[0]['seconds'])
      logger.info("Seconds left for first prediction: %d" % seconds)
      if self.is_within_proximity(seconds):
        self.show_multiple_in_proximity()
      else:
        self.show_multiple_out_of_proximity()
    else:
      logger.info("Predictions list returned with 0 entries")
      self.show_multiple_out_of_proximity()

  def error(self):
    self.show_multiple_out_of_proximity()

class BlinkingApproachingResolver(ApproachingResolver):

  blinker = None
  BLINK_DELAY = 0.5 # seconds

  def __init__(self, pins, shifter):
    self.pins = pins
    self.shifter = shifter
    self.blinker = blinker_pool.get(shifter)
    self.blinker.set_pins(self.pins)

  def show_multiple_in_proximity(self):
    self.blinker.start()

  def show_multiple_out_of_proximity(self):
    self.blinker.stop()