import RPi.GPIO as GPIO
from time import sleep

class Shifter:
  """ Interface for series of Shift Registers """
  num_registers = 0
  shift_registers = [0]
  register_range = None

  def __init__(self, data_pin, latch_pin, clock_pin):
    self.data_pin = data_pin
    self.latch_pin = latch_pin
    self.clock_pin = clock_pin
    self.set_shift_register_count(1)
    self.setup()

  def set_shift_register_count(self, value):
    self.num_registers = value
    self.shift_registers = [0 for index in range(0, (self.num_registers*8))]
    self.register_range = range(len(self.shift_registers)-1, -1, -1)

  def set_pin_count(self, value):
    self.shift_registers = [0 for index in range(0, (value))]
    self.register_range = range(len(self.shift_registers)-1, -1, -1)

  def set_pin(self, index, value):
    self.shift_registers[index] = value

  def set_pins(self, indices, value):
    for index in indices:
      self.set_pin(index, value)

  def write(self):
    GPIO.output(self.latch_pin, GPIO.LOW)
    for index in self.register_range:
      value = self.shift_registers[index]
      GPIO.output(self.clock_pin, GPIO.LOW)
      GPIO.output(self.data_pin, value)
      GPIO.output(self.clock_pin, GPIO.HIGH)
    GPIO.output(self.latch_pin, GPIO.HIGH)
    sleep(0.05)

  def clear(self):
    for index in range(0, len(self.shift_registers)):
      self.set_pin(index, 0)
    self.write()

  def setup(self):
    for pin in (self.data_pin, self.latch_pin, self.clock_pin):
      GPIO.setup(pin, GPIO.OUT, initial=GPIO.LOW)
    self.clear()
