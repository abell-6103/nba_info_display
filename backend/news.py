from pydantic import BaseModel
from abc import ABC, abstractmethod

import requests
from bs4 import BeautifulSoup
import json

from time import monotonic, sleep

ESPN_API_URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news"
NBA_NEWS_URL = "https://www.nba.com/news/category/top-stories"

class ArticleInfo(BaseModel):
  title: str
  source: str
  href: str
  publish_time: str

  def __repr__(self):
    source_str = f"Source: {self.source}"
    title_str = f"Title: {self.title}"
    link_str = f"Link: {self.href}"
    published_str = f"Published: {self.publish_time}"
    return "\n".join([source_str, title_str, link_str, published_str])

def _fetchEspnNews() -> list[ArticleInfo]:
  # Request data
  r = requests.get(ESPN_API_URL)
  if not r.status_code == 200:
    print("Unsuccessful request")
    return []
  
  # Parse json
  try:
    response = r.json()
  except requests.exceptions.JSONDecodeError:
    return []
  
  # Generate and return list
  res = []
  espn_articles = response["articles"]
  for article in espn_articles:
    article_title = article['headline']
    article_source = "ESPN"
    article_href = article['links']['web']['href']
    article_publish_time = article['published']
    res.append(ArticleInfo(title=article_title, source=article_source, href=article_href,
                           publish_time=article_publish_time))
  return res

def _fetchNbaDotComNews() -> list[ArticleInfo]:
  # Request data
  r = requests.get(NBA_NEWS_URL)
  if not r.status_code == 200:
    print("Unsuccessful request")
    return []
  
  # Scrape for json
  page_text = r.text
  soup = BeautifulSoup(page_text, 'html.parser')
  scripts = soup.find_all('script', attrs={"id": "__NEXT_DATA__"})
  if len(scripts) <= 0:
    print("No scripts found")
    return []
  response = json.loads(scripts[0].text)
  try:
    nba_articles = response['props']['pageProps']['category']['latest']['items']
  except KeyError:
    print("Couldn't find attributes")
    return []

  # Generate and return list
  res = []
  for article in nba_articles:
    article_title = article['shortTitle']
    article_source = "NBA.com"
    article_href = article['permalink']
    article_publish_time = article['date']
    res.append(ArticleInfo(title=article_title, source=article_source, href=article_href,
                           publish_time=article_publish_time))
  return res
  
class NewsInterface(ABC):
  @abstractmethod
  def getNews(self) -> list[ArticleInfo]:
    ...

def _sortFunc(item: ArticleInfo) -> str:
  return item.publish_time

class News(NewsInterface):
  def __init__(self):
    self.cache = []
    self.last_update = 0
    self.wait_time = 60

  def getNews(self) -> list[ArticleInfo]:
    if (monotonic() - self.last_update) <= self.wait_time:
      return self.cache
    
    espn_news = _fetchEspnNews()
    nba_news = _fetchNbaDotComNews()

    res = espn_news + nba_news
    res.sort(key=_sortFunc, reverse=True)

    self.cache = res
    return res