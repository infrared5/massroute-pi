import json
from behave import *
from mock import MagicMock
from app.component.led import LED
from app.component.modifier.blinker import Blinker
from app.component.resolver.led_resolver import BlinkingApproachingResolver

APPROACHING_IN = str(60*1)
APPROACHING_OUT = str(60*3)

PIN = 6
PINS = [0,1,2,3,4,5]
STOP_ID = 1128
BASE_URL = 'http://nowhere.com'
PREDICTION_URI = 'stop'
JSON = {
   "agencyTitle":"MBTA",
   "routeTitle":"39",
   "routeTag":"39",
   "stopTitle":"South St @ Sedgwick St",
   "stopTag":"1128",
   "predictions":[
      {
         "epochTime":"1373051458708",
         "seconds":"0",
         "minutes":"0",
         "isDeparture":"false",
         "dirTag":"39_1_var1",
         "vehicle":"1025",
         "block":"S39_53",
         "tripTag":"20346870"
      }
   ]
}

@given('LED is setup with service resolver with ApproachingResolver')
def approaching_led_setup_with_request(context):
  shifter = context.shifter
  shifter.set_pins = MagicMock(return_value=None)
  resolver = BlinkingApproachingResolver(PINS, shifter)
  blinker = resolver.blinker
  blinker.start = MagicMock(return_value=None)
  blinker.stop = MagicMock(return_value=None)

  led = LED(STOP_ID, resolver)

  context.blinker = blinker
  context.led = led

@when('Data provided with next prediction bus less than 2 minutes from stop')
def approaching_led_response_in_2_minute_prox(context):
  JSON['predictions'][0]['seconds'] = APPROACHING_IN
  context.led.data(json.dumps(JSON))

@when('Data provided with next prediction bus more than 2 minutes from stop')
def approaching_led_response_out_2_minute_prox(context):
  JSON['predictions'][0]['seconds'] = APPROACHING_OUT
  context.led.data(json.dumps(JSON))

@then('ApproachingLED invokes shifter with 0 on set of pins')
def approaching_led_invokes_show_out(context):
  context.blinker.stop.assert_called_once_with()

@then('ApproachingLED invokes shifter with 1 on set of pins')
def approaching_led_invokes_show_in(context):
  context.blinker.start.assert_called_once_with()