import json
from behave import *
from mock import MagicMock
from app.component.led import LED
from app.component.resolver.led_resolver import ProximityResolver

PROXIMITY_IN = str(60*4)
PROXIMITY_OUT = str(60*6)

PIN = 0
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

@given('LED is setup with service resolver with ProximityLED')
def led_setup_with_request(context):
  shifter = context.shifter
  shifter.set_pin = MagicMock(return_value=None)

  resolver = ProximityResolver(PIN, shifter)
  led = LED(STOP_ID, resolver)

  context.shifter = shifter
  context.led = led

@when('Data provided with next prediction bus less than 5 minutes from stop')
def led_response_in_5_minute_prox(context):
  JSON['predictions'][0]['seconds'] = PROXIMITY_IN
  context.led.data(json.dumps(JSON))

@when('Data provided with next prediction bus more than 5 minutes from stop')
def led_response_out_5_minute_prox(context):
  JSON['predictions'][0]['seconds'] = PROXIMITY_OUT
  context.led.data(json.dumps(JSON))

@then('ProximityLED invokes shifter with 1')
def led_invokes_show_proximity(context):
  context.shifter.set_pin.assert_called_once_with(PIN, 1)

@then('ProximityLED invokes shifter with 0')
def led_invokes_show_out_of_proximity(context):
  context.shifter.set_pin.assert_called_once_with(PIN, 0)