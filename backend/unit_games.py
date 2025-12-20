import unittest
from games import Games
from datetime import date

class TestGames(unittest.TestCase):
  def setUp(self):
    self.games = Games()

  def test_gamesfromday_badtype(self):
    badinput = "tuesday"
    with self.assertRaises(TypeError):
      self.games.getGamesFromDay(badinput)

  def test_gamesfromday_badvalue(self):
    badvalue = date(1902, 4, 20)
    self.assertIsNone(self.games.getGamesFromDay(badvalue))

  def test_gamesfromday_noinput(self):
    with self.assertRaises(TypeError):
      self.games.getGamesFromDay(None)


if __name__ == '__main__':
    unittest.main()