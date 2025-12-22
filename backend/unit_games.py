import unittest

from games import Games
from callQueue import CallQueue

from datetime import date
import requests

class TestGames(unittest.TestCase):
  def setUp(self):
    self.delay = 2
    self.call_queue = CallQueue(self.delay)
    self.games = Games(self.call_queue)
    self.valid_date = date(2025,12,20)

  def test_gamesfromday_badtype(self):
    badinput = "tuesday"
    with self.assertRaises(TypeError):
      self.games.getGamesFromDay(badinput)

  def test_gamesfromday_noinput(self):
    with self.assertRaises(TypeError):
      self.games.getGamesFromDay(None)

  def test_gamesfromday_nogames(self):
    pre_nba_date = date(1900,1,1)
    self.assertEqual(len(self.games.getGamesFromDay(pre_nba_date)), 0)

  def test_gamesfromday_somegames(self):
    self.assertGreater(len(self.games.getGamesFromDay(self.valid_date)), 0)

  def test_gamesfromday_attributesnotnone(self):
    res = self.games.getGamesFromDay(self.valid_date)
    self.assertIsNotNone(res[0]['game_id'])
    self.assertIsNotNone(res[0]['status'])
    self.assertIsNotNone(res[0]['home_team'])
    self.assertIsNotNone(res[0]['away_team'])

  def test_gamesfromday_teamattributesnotnone(self):
    res = self.games.getGamesFromDay(self.valid_date)
    home_team = res[0]['home_team']
    away_team = res[0]['away_team']

    self.assertIsNotNone(home_team['team_id'])
    self.assertIsNotNone(home_team['city'])
    self.assertIsNotNone(home_team['score'])
    self.assertIsNotNone(home_team['logo'])

    self.assertIsNotNone(away_team['team_id'])
    self.assertIsNotNone(away_team['city'])
    self.assertIsNotNone(away_team['score'])
    self.assertIsNotNone(away_team['logo'])

  def test_gamesfromday_attributetypes(self):
    res = self.games.getGamesFromDay(self.valid_date)
    self.assertTrue(isinstance(res[0]['game_id'], int))
    self.assertTrue(isinstance(res[0]['status'], str))
    self.assertTrue(isinstance(res[0]['home_team'], dict))
    self.assertTrue(isinstance(res[0]['away_team'], dict))

  def test_gamesfromday_teamattributetypes(self):
    res = self.games.getGamesFromDay(self.valid_date)
    home_team = res[0]['home_team']
    away_team = res[0]['away_team']

    self.assertTrue(isinstance(home_team['team_id'], int))
    self.assertTrue(isinstance(home_team['city'], str))
    self.assertTrue(isinstance(home_team['score'], int))
    self.assertTrue(isinstance(home_team['logo'], str))

    self.assertTrue(isinstance(away_team['team_id'], int))
    self.assertTrue(isinstance(away_team['city'], str))
    self.assertTrue(isinstance(away_team['score'], int))
    self.assertTrue(isinstance(away_team['logo'], str))

  def test_gamesfromday_validlogos(self):
    res = self.games.getGamesFromDay(self.valid_date)
    home_team = res[0]['home_team']
    away_team = res[0]['away_team']

    self.assertEquals(requests.get(home_team['logo']).status_code, 200)
    self.assertEquals(requests.get(away_team['logo']).status_code, 200)

if __name__ == '__main__':
  unittest.main()