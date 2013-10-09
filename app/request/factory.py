from . import StopRequest
from ..component.led import LED
from ..component.resolver.led_resolver import ProximityResolver, BlinkingApproachingResolver

class StopRequestFactory:

  shifter = None

  def __init__(self, shifter):
    self.shifter = shifter

  def get_approaching(self, stop_id, pin_id, pins):
    pled = LED(stop_id, ProximityResolver(pin_id, self.shifter))
    aled = LED(stop_id, BlinkingApproachingResolver(pins, self.shifter))
    return StopRequest(stop_id, [pled, aled])

  def get_proximity(self, stop_id, pin_id):
    led = LED(stop_id, ProximityResolver(pin_id, self.shifter))
    return StopRequest(stop_id, [led])
