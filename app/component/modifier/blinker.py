from threading import Timer

class Blinker:
  
  flag = 0
  pins = []
  shifter = None
  timer = None
  active = False
  delay = 0.5 # seconds

  def __init__(self, shifter, delay=0.5):
    self.flag = 0
    self.shifter = shifter
    self.delay = delay

  def set_pins(self, pins):
    self.pins = pins

  def blink(self):
    if self.flag % 2 == 0:
      self.shifter.set_pins(self.pins, 1)
    else:
      self.shifter.set_pins(self.pins, 0)
    
    self.shifter.write()
    self.timer = Timer(self.delay, self.blink)
    self.timer.start()
    self.flag = 0 if self.flag == 1 else 1

  def start(self):
    if self.active == False:
      self.active = True
      self.flag = 0
      self.blink()

  def stop(self):
    self.active = False
    if not self.timer == None:
      self.timer.cancel()
      self.shifter.set_pins(self.pins, 0)
      self.shifter.write()

class BlinkerPool:

  pool = []

  def __init__(self):
    self.pool = []

  def get(self, shifter, delay=0.5):
    blinker = Blinker(shifter, delay)
    self.pool.append(blinker)
    return blinker

  def stop_all(self):
    for blinker in self.pool:
      blinker.stop()

  def drain(self):
    self.stop_all()
    del self.pool[:]

blinker_pool = BlinkerPool()