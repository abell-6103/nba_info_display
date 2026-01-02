import unittest

from players import PlayerStats, PlayerStatsOut, PlayerCompareResult, CompareMode, InvalidComparisonException
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

  def test_compareplayerstats_badtype(self):
    with self.assertRaises(TypeError):
      self.players.comparePlayerStats("this is not an int", "neither is this", "and this is not a mode")

  def test_compareplayerstats_invalidinput(self):
    mode = CompareMode('career')
    self.assertIsNone(self.players.comparePlayerStats(self.invalid_id_list[0], self.invalid_id_list[1], mode))

  def test_compareplayerstats_validinputgoodtype(self):
    mode = CompareMode('career')
    res = self.players.comparePlayerStats(self.valid_id_list[0], self.valid_id_list[1], mode)
    self.assertTrue(isinstance(res, PlayerCompareResult))

  def test_compareplayerstats_matchingstats(self):
    mode = CompareMode('career')
    res = self.players.comparePlayerStats(self.valid_id_list[0], self.valid_id_list[1], mode)
    player_1 = self.players.getPlayerStats(self.valid_id_list[0])
    player_2 = self.players.getPlayerStats(self.valid_id_list[1])
    self.assertTrue(res.player_1 == player_1)
    self.assertTrue(res.player_2 == player_2)

  def test_compareplayerstats_invalidoverlap(self):
    mode = CompareMode('season', '1965-66')
    with self.assertRaises(InvalidComparisonException):
      self.players.comparePlayerStats(self.valid_id_list[0], self.valid_id_list[1], mode)

if __name__ == "__main__":
  unittest.main()