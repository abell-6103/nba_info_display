import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Linking, Pressable } from 'react-native';
import { styles } from '../styles';
import { ArticleInfo } from '../types';

export default function News() {
  const api_uri = process.env.EXPO_PUBLIC_API_URI;

  const [loading_news, setLoadingNews] = useState<boolean>(true);
  const [load_news_success, setLoadNewsSuccess] = useState<boolean>(false);
  const [news, setNews] = useState<ArticleInfo[]>([]);

  const getNews = async() => {
    setLoadingNews(true);
    try {
      const response = await fetch(api_uri + `/news/`);
      if (response.ok) {
        const json = await response.json();
        setNews(json);
        setLoadNewsSuccess(true);
      } else {
        console.error("Couldn't load news.")
        setLoadNewsSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setLoadNewsSuccess(false);
    }
    setLoadingNews(false);
  }

  useEffect(() => {
    getNews();
  }, []);

  function getTimeSincePublished(article: ArticleInfo): String {
    const article_date = new Date(article.publish_time);
    const ms_since = Date.now() - article_date.getTime();

    const minutes_since = Math.floor(ms_since / 60000);
    if (minutes_since < 60) {
      return `${minutes_since}m ago`;
    }

    const hours_since = Math.floor(minutes_since / 60);
    if (hours_since < 24) {
      return `${hours_since}h ago`
    }

    const days_since = Math.floor(hours_since / 24);
    return `${days_since}d ago`;
  }

  function NewsCard({article}: {article: ArticleInfo}) {
    const handlePress = async () => {
      const supported = await Linking.canOpenURL(article.href);
      if (supported) {
        await Linking.openURL(article.href)
      } else {
        console.warn(`Cannot open URL: ${article.href}`)
      }
    }

    return (
      <View style={styles.NewsCard}>
        <Pressable style={{flex: 1}} onPress={handlePress}>
          <View style={styles.NewsCardBody}>
            <Text style={styles.NewsCardTitle}>{article.title}</Text>
            <Text style={styles.NewsCardSubtitle}>Source: {article.source} - {getTimeSincePublished(article)}</Text>
          </View>
        </Pressable>
      </View>
    )
  }

  function NewsFeed() {
    return (
      <ScrollView style={{flex: 1, width: '100%'}}>
        {news?.map((article, index) => (
          <NewsCard key={index} article={article}/>
        ))}
      </ScrollView>
    )
  }

  return (
    <View style={styles.container}>
      {loading_news ? (
        <ActivityIndicator animating={true}/>
      ) : (
        load_news_success ? (
          <NewsFeed />
        ) : (
          <Text style={styles.text}>Couldn't load news :(</Text>
        )
      )}
    </View>
  )
}