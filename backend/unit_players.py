import unittest

from players import PlayerStats, PlayerStatsOut
from callQueue import CallQueue

class TestPlayerStats(unittest.TestCase):
  def setUp(self):
    self.delay = 2
    self.call_queue = CallQueue(self.delay)
    self.players = PlayerStats(self.call_queue)
    self.invalid_id_list = [-5, 1641704, 222222222222]
    self.valid_id_list = [893, 2544, 202711, 1641705]

  def test_getplayerstats_badtype(self):
    with self.assertRaises(TypeError):
      self.players.getPlayerStats("this is not an int")

  def test_getplayerstats_noneinput(self):
    with self.assertRaises(TypeError):
      self.players.getPlayerStats(None)
  
  def test_getplayerstats_invalidinput(self):
    for invalid_id in self.invalid_id_list:
      self.assertIsNone(self.players.getPlayerStats(invalid_id))

  def test_getplayerstats_validinputisnotnone(self):
    for valid_id in self.valid_id_list:
      self.assertIsNotNone(self.players.getPlayerStats(valid_id))

  def test_getplayerstats_validinputgoodtype(self):
    for valid_id in self.valid_id_list:
      self.assertTrue(isinstance(self.players.getPlayerStats(valid_id), PlayerStatsOut))

if __name__ == "__main__":
  unittest.main()