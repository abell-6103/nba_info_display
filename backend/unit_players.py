import unittest

from players import PlayerStats
from callQueue import CallQueue

class TestPlayerStats(unittest.TestCase):
  def setUp(self):
    self.delay = 2
    self.call_queue = CallQueue(self.delay)
    self.players = PlayerStats(self.call_queue)

if __name__ == "__main__":
  unittest.main()