import random
import logging
import RPi.GPIO as GPIO

from . import enum
from settings import *
from time import sleep
from threading import Timer

from component.shifter import Shifter
from component.modifier.blinker import Blinker

logger = logging.getLogger(__name__)
States = enum(IDLE=0, LIVE=1, ERROR=2)

class Board:
  """ Raspberry Pi interface """
  shifter = None
  error_timer = None
  state = States.IDLE

  def __init__(self):
    GPIO.setmode(GPIO.BCM)
    self.shifter = Shifter(DATA_PIN, LATCH_PIN, CLOCK_PIN)
    self.shifter.set_shift_register_count(NUM_REGISTERS)

  def reset(self):
    self.shifter.clear()
    self.state = States.IDLE
    if not self.error_timer == None:
      self.error_timer.cancel()

  def run_startup_seq(self):
    logger.info('Running startup sequence...')
    self.reset()
    count = 0
    while count < 3:
      for index in range(0, NUM_REGISTERS*8):
        self.shifter.set_pin(index, 1)
        sleep(0.02)
        self.shifter.write()
      sleep(2)
      for index in range(0, NUM_REGISTERS*8):
        self.shifter.set_pin(index, 0)
        sleep(0.02)
        self.shifter.write()
      sleep(2)
      count = count + 1
    logger.info('Done running startup sequence.')

  def run_shutdown_seq(self):
    logger.info('Running shutdown sequence...')
    self.reset()
    count = 0
    for index in range(0, NUM_REGISTERS*8):
      self.shifter.set_pin(index, 1)
      sleep(0.02)
      self.shifter.write()
    while count < 3:
     for index in range(0, NUM_REGISTERS*8):
       self.shifter.set_pin(index, 0)
     self.shifter.write()
     sleep(0.1)
     for index in range(0, NUM_REGISTERS*8):
       self.shifter.set_pin(index, 1)
     self.shifter.write()
     sleep(0.1)     
     count = count + 1
    sleep(0.5)
    self.shifter.clear()
    logger.info('Done running shutdown sequence.')

  def run_resource_error(self):
    logger.info('Running error sequence...')
    if not self.is_in_error_state():
      pins = range(NUM_REGISTERS*8)
      self.reset()
      self.state = States.ERROR
      self.show_error_sequence(pins)

  def show_error_sequence(self, pins):
    if self.is_in_error_state():
      for pin in pins:
        self.shifter.set_pin(pin, 1)
        sleep(0.05)
        self.shifter.write()
        self.shifter.set_pin(pin, 0)
        sleep(0.05)
      self.shifter.clear()
      self.error_timer = Timer(0.5, self.show_error_sequence, [pins])
      self.error_timer.start()

  def is_in_error_state(self):
    return self.state == States.ERROR

  def blinker_test(self):
    blinker = Blinker(self.shifter, 0.5)
    blinker.set_pins([10,11,12,13])
    blinker.start()
