from pydantic import BaseModel
from abc import ABC, abstractmethod

import requests
from bs4 import BeautifulSoup, Tag, ResultSet, PageElement
import json

from time import monotonic
from datetime import datetime, timedelta

ESPN_API_URL = "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/news?limit=40"
NBA_NEWS_URL = "https://www.nba.com/news/category/top-stories"
YAHOO_BASE_URL = "https://sports.yahoo.com"
YAHOO_NEWS_URL = "https://sports.yahoo.com/nba/news/"

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
  good_article_types = ['HeadlineNews']
  try:
    res = []
    espn_articles = response["articles"]
    for article in espn_articles:
      if article['type'] not in good_article_types:
        # ESPN writes a lot of articles, so we only want the highlights
        continue
      article_title = article['headline']
      article_source = "ESPN"
      article_href = article['links']['web']['href']
      article_publish_time = article['published']
      res.append(ArticleInfo(title=article_title, source=article_source, href=article_href,
                            publish_time=article_publish_time))
    return res
  except KeyError:
    return []

def _fetchNbaDotComNews() -> list[ArticleInfo]:
  # Request data
  r = requests.get(NBA_NEWS_URL)
  if not r.status_code == 200:
    return []
  
  # Scrape for json
  page_text = r.text
  soup = BeautifulSoup(page_text, 'html.parser')
  scripts = soup.find_all('script', attrs={"id": "__NEXT_DATA__"})
  if len(scripts) <= 0:
    return []
  response = json.loads(scripts[0].text)
  try:
    nba_articles = response['props']['pageProps']['category']['latest']['items']
  except KeyError:
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

def _findScripts(scripts: ResultSet, target_str: str) -> list[PageElement]:
  found_scripts = []
  for script in scripts:
    if target_str in script.text:
      found_scripts.append(script)
  return found_scripts

def _cleanScriptText(text: str) -> str:
  trimmed_text = text[19:-1]
  clean_text = trimmed_text.replace("\\\"","\"").replace("\\n", "").replace("\\\\\"", "'")[7:-2]
  return clean_text

def _getStreamFromScriptText(text: str) -> list:
  j = json.loads(text)
  stream = j[3]['stream']
  return stream

def _fetchYahooNews() -> list[ArticleInfo]:
  # Request data
  r = requests.get(YAHOO_NEWS_URL)
  if not r.status_code == 200:
    return []
  
  # Find stream json
  soup = BeautifulSoup(r.text, 'html.parser')
  scripts = soup.find_all('script')
  script = _findScripts(scripts, "ntk-assetlist-stream")[0]
  script_text = _cleanScriptText(script.text)
  stream = _getStreamFromScriptText(script_text)

  # Generate and return list
  res = []
  for item in stream:
    article = item['data']['content']
    article_title = article["title"]
    article_source = "Yahoo! Sports"
    article_href = article["clickThroughUrl"]["url"]
    article_publish_time = article["pubDate"]
    time_since = datetime.now() - datetime.strptime(article_publish_time, "%Y-%m-%dT%H:%M:%SZ")
    three_days = timedelta(days=3)
    if time_since > three_days:
      continue
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
    yahoo_news = _fetchYahooNews()

    res = espn_news + nba_news + yahoo_news
    res.sort(key=_sortFunc, reverse=True)

    self.cache = res
    return res