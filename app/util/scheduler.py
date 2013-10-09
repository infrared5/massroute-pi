import time
from time import strftime

class Scheduler:

  start_hour = 0
  end_hour = 0
  available = False

  def __init__(self, start_hour, end_hour):
    self.start_hour = start_hour
    self.end_hour = end_hour
    self.check()

  def check(self):
    now = self.current_hour()
    self.available = False if now >= self.end_hour or now <= self.start_hour else True
    return self.available

  def current_hour(self):
    return int(strftime("%H",time.localtime()))