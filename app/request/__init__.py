class StopRequest:

  stop_id = 0
  components = []

  def __init__(self, stop_id, components=[]):
    self.stop_id = stop_id
    self.components = components