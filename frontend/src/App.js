import {
  Button,
  Heading,
  Pane,
  SelectMenu,
  Text,
  TextInput,
} from "evergreen-ui"
import React, { useEffect, useState } from "react"

import ReactAudioPlayer from "react-audio-player"

function App() {
  const [feedURL, setFeedURL] = useState("")
  const [feedTitle, setFeedTitle] = useState(false)
  const [feedData, setFeedData] = useState(false)
  const [episodes, setEpisodes] = useState(false)
  const [savedFeeds, setSavedFeeds] = useState([])

  useEffect(() => {
    const fetchSavedPodcastsWrapper = async () => {
      const response = await fetch(`/saved`)
      const data = await response.json()
      setSavedFeeds(data)
    }

    fetchSavedPodcastsWrapper()
  }, [])

  useEffect(() => {
    if (feedData) {
      setFeedTitle(
        <Heading size={600} marginBottom={25}>
          {feedData.title}
        </Heading>
      )
      const newEpisodeList = feedData.episodes
        .slice(0, 10)
        .map((episode, index) => {
          const tintColor = index % 2 === 0 ? "blueTint" : ""
          return (
            <Pane display="flex" padding={16} background={tintColor}>
              <Pane flex={1} alignItems="center" display="flex">
                <Heading size={600} marginTop="default">
                  {episode.title}
                </Heading>
                <Text size={400} clear="both">
                  {episode.description}
                </Text>
              </Pane>
              <Pane>
                <ReactAudioPlayer src={episode.enclosures[0].url} controls />
              </Pane>
            </Pane>
          )
        })

      setEpisodes(newEpisodeList)
    }
  }, [feedData])

  const fetchURL = async () => {
    const response = await fetch(`/podcast?feedurl=${feedURL}`)
    if (response.status === 200) {
      // TODO: Show error message if can't fetch
      const data = await response.json()
      setFeedData(data)

      const savedReponse = await fetch(
        `/save?feedurl=${feedURL}&title=${data.title}`
      )
      const savedPodcastsData = await savedReponse.json()
      setSavedFeeds(savedPodcastsData)
    }
  }

  const loadSavedPodcast = (feedItem) => {
    setFeedURL(feedItem.value)
    fetchURL()
  }

  return (
    // TODO: switch to Flex
    <>
      <Pane marginLeft={75} marginTop={feedData ? 20 : 200}>
        <TextInput
          width="80%"
          height={48}
          placeholder="Enter podcast URL"
          type="url"
          value={feedURL}
          onChange={(e) => setFeedURL(e.target.value)}
        />
        <Button
          height={48}
          appearance="primary"
          marginLeft={16}
          marginRight={16}
          onClick={fetchURL}
        >
          Fetch
        </Button>
        <SelectMenu
          title="Select name"
          options={savedFeeds.map((feed) => ({
            label: feed.title,
            value: feed.url,
          }))}
          selected={feedURL}
          onSelect={loadSavedPodcast}
        >
          <Button>Feeds</Button>
        </SelectMenu>
      </Pane>
      <Pane marginLeft={75} marginRight={75} marginTop={15}>
        {feedTitle}
        {episodes}
      </Pane>
    </>
  )
}

export default App
