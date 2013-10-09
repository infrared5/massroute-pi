import json
import requests
from requests.exceptions import *
from mock import Mock
from mock import MagicMock
from app.service.service import Service
from app.request.queue import StopRequestQueue

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
JSON_DUMP = json.dumps(JSON)

ERROR_MESSAGE = 'Uh-oh!'
ERROR_JSON = {
  "error": ERROR_MESSAGE
}

@given('A service instance is established')
def service_is_established(context):
  service = Service(BASE_URL, PREDICTION_URI)
  delegate = StopRequestQueue(service)
  delegate.success = MagicMock(return_value=None)
  delegate.failure = MagicMock(return_value=None)

  context.service = service
  context.delegate = delegate

@when('The data is accessible and available')
def service_response_success(context):
  payload = type('obj', (object,), {'text':JSON_DUMP})
  requests.get = MagicMock(return_value=payload)

@when('The data is unaccessible but available')
def service_response_error(context):
  def throwRE(*args, **kwargs):
    raise RequestException(ERROR_MESSAGE)
    
  payload = type('obj', (object,), {'text':json.dumps(ERROR_JSON)})
  requests.get = MagicMock(return_value=None)
  requests.get.side_effect = throwRE

@when('The service is invoked to access predictions for given stop id')
def service_access_with_stop_id_and_delegate(context):
  context.service.access(1128, context.delegate)

@then('success() is invoked on the provided delegate')
def delegate_success_invoked(context):
  context.delegate.success.assert_called_once_with(JSON_DUMP)

@then('error() is invoked on the provided delgate')
def delegate_error_invoked(context):
  context.delegate.failure.assert_called_once()