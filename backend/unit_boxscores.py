import unittest

from boxscores import Boxscores
from callQueue import CallQueue

class TestBoxscores(unittest.TestCase):
  def setUp(self):
    self.delay = 2
    self.call_queue = CallQueue(self.delay)
    self.boxscores = Boxscores(self.call_queue)
    self.valid_id = "0022500397"
    self.future_id = "0022500009"

  def test_getboxscores_badtype(self):
    badinput = 220
    with self.assertRaises(TypeError):
      self.boxscores.getBoxscore(badinput)

  def test_getboxscores_noinput(self):
    with self.assertRaises(TypeError):
      self.boxscores.getBoxscore()

  def test_getboxscores_badvalue(self):
    badvalue = "tomato"
    with self.assertRaises(ValueError):
      self.boxscores.getBoxscore(badvalue)

  def test_getboxscores_badid(self):
    badvalue = "0000000021"
    self.assertIsNone(self.boxscores.getBoxscore(badvalue))

  def test_getboxscores_goodidexists(self):
    self.assertIsNotNone(self.boxscores.getBoxscore(self.valid_id))

  def test_getboxscores_futuregameexists(self):
    self.assertIsNotNone(self.boxscores.getBoxscore(self.future_id))

  def test_getboxscores_attributesexist(self):
    res = self.boxscores.getBoxscore(self.valid_id)
    self.assertIsNotNone(res['team_0'])
    self.assertIsNotNone(res['team_1'])
    self.assertIsNotNone(res['score_exists'])

  def test_getboxscores_attributesaredicts(self):
    res = self.boxscores.getBoxscore(self.valid_id)
    self.assertTrue(isinstance(res['team_0'], dict))
    self.assertTrue(isinstance(res['team_1'], dict))
    self.assertTrue(isinstance(res['score_exists'], bool))
  
  def test_getboxscore_goodidscoreexists(self):
    self.assertTrue(self.boxscores.getBoxscore(self.valid_id)['score_exists'])

  def test_getboxscore_futureidscorenotexists(self):
    self.assertFalse(self.boxscores.getBoxscore(self.future_id)['score_exists'])

  def test_getboxscore_goodidteamattributesexist(self):
    res = self.boxscores.getBoxscore(self.valid_id)

    self.assertIsNotNone(res['team_0']['team_id'])
    self.assertIsNotNone(res['team_0']['team_city'])
    self.assertIsNotNone(res['team_0']['team_stats'])
    self.assertIsNotNone(res['team_0']['player_stats'])

    self.assertIsNotNone(res['team_1']['team_id'])
    self.assertIsNotNone(res['team_1']['team_city'])
    self.assertIsNotNone(res['team_1']['team_stats'])
    self.assertIsNotNone(res['team_1']['player_stats'])

if __name__ == "__main__":
  unittest.main()