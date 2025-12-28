from pydantic import BaseModel

class ArticleInfo(BaseModel):
  title: str
  source: str
  href: str
  publish_time: str