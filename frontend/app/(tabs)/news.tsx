import { use, useState } from 'react';
import { View, Text } from 'react-native';
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

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        News page
      </Text>
    </View>
  )
}