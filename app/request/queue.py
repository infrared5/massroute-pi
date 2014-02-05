import logging
from time import sleep

logger = logging.getLogger(__name__)

class StopRequestQueue:

  cursor = 0
  queue = None
  service = None
  current_request = None
  request_delay = 0 # seconds

  def __init__(self, service, request_delay=10):
    self.queue = []
    self.service = service
    self.request_delay = request_delay

  def add_request(self, request):
    self.queue.append(request)
    logger.info("Request added for %r. Queue length at %d" % (request.stop_id, len(self.queue)))

  def success(self, data):
    logger.debug("Success returned")
    # could become none upon stop(), considered inactive
    if self.current_request is not None:
      for component in self.current_request.components:
        component.data(data)
      sleep(self.request_delay)
      self.next()

  def failure(self, error):
    logger.debug("Failure returned")
    # could become none upon stop(), considered inactive
    if self.current_request is not None:
      for component in self.current_request.components:
        component.error(error)
      sleep(self.request_delay)
      self.next()

  def next(self, increment=True):
    logger.info('next()')
    self.cursor = self.cursor + 1 if increment else self.cursor
    if self.cursor < len(self.queue):
      self.current_request = self.queue[self.cursor]
      self.service.access(self.current_request.stop_id, self)

    """
      Not allowing wrapped cursor. 
      :next() is run through, then this queue is exited and the service
      availability is checked again, starting the sequence again.
    """
    # self.cursor = 0 if self.cursor == len(self.queue) - 1 else self.cursor + 1

  def start(self):
    logger.info('start()')
    self.cursor = 0
    self.next(False)
    logger.info('start() - out')

  def stop(self):
    del self.queue[:]
    self.current_request = None
