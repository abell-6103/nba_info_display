import unittest

import requests
from datetime import datetime
from time import sleep

from news import News, ArticleInfo

def valid_href(href: str):
  delay = 6
  sleep(delay)
  r = requests.head(href, headers={'User-agent': 'Mozilla/5.0'})
  redirect_codes = [301, 302, 303, 307, 308]
  if r.status_code in redirect_codes:
    new_href = r.headers['Location']
    return valid_href(new_href)
  return r.status_code == 200 or r.status_code == 304

def valid_publish_time(publish_time: str):
  iso_format = "%Y-%m-%dT%H:%M:%SZ"
  try:
    dt_obj = datetime.strptime(publish_time, iso_format)
    return isinstance(dt_obj, datetime)
  except ValueError:
    return False
  
class TestNews(unittest.TestCase):
  def setUp(self):
    self.news = News()

  def test_getnews_goodtyping(self):
    res = self.news.getNews()
    self.assertTrue(isinstance(res, list))
    for item in res:
      self.assertTrue(isinstance(item, ArticleInfo))
  
  def test_getnews_goodattrtyping(self):
    res = self.news.getNews()
    for item in res:
      self.assertTrue(isinstance(item.title, str))
      self.assertTrue(isinstance(item.source, str))
      self.assertTrue(isinstance(item.href, str))
      self.assertTrue(isinstance(item.publish_time, str))

  def test_getnews_validhrefs(self):
    res = self.news.getNews()
    for item in res:
      self.assertTrue(valid_href(item.href))

  def test_getnews_validpublishtimes(self):
    res = self.news.getNews()
    for item in res:
      self.assertTrue(valid_publish_time(item.publish_time))

if __name__ == "__main__":
  unittest.main()