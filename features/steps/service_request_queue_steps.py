import requests
import logging
from time import sleep
from behave import *
from mock import Mock
from mock import MagicMock
from mock import patch
from app.service.service import Service
from app.request import StopRequest
from app.request.queue import StopRequestQueue

logger = logging.getLogger(__name__)

BASE_URL = 'http://nowhere.com'
PREDICTION_URI = 'stop'

@given('I have created a request queue')
def request_queue_creation(context):
  service = Service(BASE_URL, PREDICTION_URI)
  queue = StopRequestQueue(service)
  queue.next = MagicMock(return_value=None)
  # @patch.object(queue, 'next')
  # def call_through(mock_method):
  #   queue.next(False)
  # with patch.object(queue, 'next') as mock_method:
  #   queue.next(True)
  context.queue = queue

@given('There are 2 items added to the queue')
def two_items_in_request_queue(context):
  first_request = StopRequest(1128)
  second_request = StopRequest(1129)
  context.queue.add_request(first_request)
  context.queue.add_request(second_request)

@when('I invoke the queue to start() and the response is success')
def request_queue_invocation(context):
  payload = type('obj', (object,), {'text':{'success': True}})
  requests.get = Mock(return_value=payload)
  context.queue.start()

@when('I invoke the queue to start() and the response is failure')
def request_response_successful(context):
  payload = type('obj', (object,), {'text':{'error': 'Uh-oh!'}})
  requests.get = Mock(return_value=payload)
  context.queue.start()

@when('The service has responded twice')
def next_called_to_empty_list(context):
  complete = False
  payload = type('obj', (object,), {'text':{'success': True}})
  requests.get = Mock(return_value=payload)
  context.queue.start()
  while not complete:
    logger.info('complete? %d' % len(context.queue.next.mock_calls))
    complete = requests.get.call_count >= 0

@then('The queue is invoked for next()')
def next_is_called(context):
  call_length = len(context.queue.next.mock_calls)
  assert call_length >= 1, 'expected next to be called at least once, was %d' % call_length

@then('The queue is not invoked for next()')
def next_not_called_again(context):
  call_length = len(context.queue.next.mock_calls)
  assert call_length == 2, 'expected 2 but was %d' % call_length