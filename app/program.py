import logging

from settings import *
from time import sleep
from request.queue import StopRequestQueue
from app.component.modifier.blinker import blinker_pool
from board import States

logger = logging.getLogger(__name__)

class Program:

  board = None
  scheduler = None
  service = None
  queue = None

  def __init__(self, board, scheduler):
    self.board = board
    self.scheduler = scheduler

  def set_service(self, service):
    self.service = service

  def enqueue(self, factory):
    self.queue = StopRequestQueue(self.service)
    self.queue.add_request(factory.get_approaching(INBOUND_STOP_1, INBOUND_STOP_1_PIN, INBOUND_STOP_1_PIN_CLUSTER))
    self.queue.add_request(factory.get_proximity(INBOUND_STOP_2, INBOUND_STOP_2_PIN))
    self.queue.add_request(factory.get_proximity(INBOUND_STOP_3, INBOUND_STOP_3_PIN))
    self.queue.add_request(factory.get_approaching(OUTBOUND_STOP_1, OUTBOUND_STOP_1_PIN, OUTBOUND_STOP_1_PIN_CLUSTER))
    self.queue.add_request(factory.get_proximity(OUTBOUND_STOP_2, OUTBOUND_STOP_2_PIN))
    self.queue.add_request(factory.get_proximity(OUTBOUND_STOP_3, OUTBOUND_STOP_3_PIN))

  def start(self):
    self.board.run_startup_seq()
    self.board.reset()
    while self.scheduler.check():
      if self.service.resource_available():
        logger.info('Service available.')
        if self.board.is_in_error_state():
          self.board.reset()
        self.queue.start()
      else:
        logger.info('Service unavailable.')
        # TODO: Have a limit to unavailability response before exiting?
        blinker_pool.stop_all()
        self.board.run_resource_error()
        sleep(60)
    self.stop()
    # exit.
    # allow cron job to restart process at 6am to do its job :)

  def stop(self):
    blinker_pool.drain()
    if not self.queue == None:
      self.queue.stop()
    self.board.run_shutdown_seq()
