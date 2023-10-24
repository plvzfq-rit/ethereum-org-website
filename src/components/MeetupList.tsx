import { useState } from "react"
import { sortBy } from "lodash"
import {
  Box,
  Flex,
  LinkBox,
  LinkOverlay,
  List,
  ListItem,
  useColorModeValue,
  useToken,
  VisuallyHidden,
} from "@chakra-ui/react"

import Emoji from "@/components/Emoji"
import InfoBanner from "@/components/InfoBanner"
import InlineLink, { BaseLink } from "@/components/Link"
import Input from "@/components/Input"
import Text from "@/components/OldText"
// TODO: add Translation when i18n is set up
// import Translation from "./Translation"

import meetups from "@/data/community-meetups.json"

import { trackCustomEvent } from "@/lib/utils/matomo"

export interface Meetup {
  title: string
  emoji: string
  location: string
  link: string
}

const filterMeetups = (query: string): Array<Meetup> => {
  if (!query) return sortedMeetups

  const lowercaseQuery = query.toLowerCase()

  return sortedMeetups.filter((meetup) => {
    return (
      meetup.title.toLowerCase().includes(lowercaseQuery) ||
      meetup.location.toLowerCase().includes(lowercaseQuery)
    )
  })
}

// sort meetups by country and then by city
const sortedMeetups: Array<Meetup> = sortBy(meetups, ["emoji", "location"])

export interface IProps {}

// TODO create generalized CardList / TableCard
// TODO prop if ordered list or unordered
const MeetupList: React.FC<IProps> = () => {
  const [searchField, setSearchField] = useState<string>("")
  const filteredMeetups = filterMeetups(searchField)
  const listBoxShadow = useColorModeValue("tableBox.light", "tableBox.dark")
  const listItemBoxShadow = useColorModeValue(
    "tableItemBox.light",
    "tableItemBox.dark"
  )

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchField(event.target.value)
    trackCustomEvent({
      eventCategory: "events search",
      eventAction: "click",
      eventName: event.target.value,
    })
  }

  const primaryBaseColor = useToken("colors", "primary.base")

  return (
    <Box>
      <Input
        mb={6}
        onChange={handleSearch}
        placeholder={"Search by meetup title or location"}
        aria-describedby="input-instruction"
      />
      {/* hidden for attachment to input only */}
      <VisuallyHidden hidden id="input-instruction">
        results update as you type
      </VisuallyHidden>

      <List m={0} boxShadow={listBoxShadow} aria-label="Event meetup results">
        {filteredMeetups.map((meetup, idx) => (
          <LinkBox
            as={ListItem}
            key={idx}
            display="flex"
            justifyContent="space-between"
            boxShadow={listItemBoxShadow}
            mb={0.25}
            p={4}
            w="100%"
            _hover={{
              textDecoration: "none",
              borderRadius: "base",
              boxShadow: `0 0 1px ${primaryBaseColor}`,
              bg: "tableBackgroundHover",
            }}
          >
            <Flex flex="1 1 75%" mr={4}>
              <Box mr={4} opacity="0.4">
                {idx + 1}
              </Box>
              <Box>
                <LinkOverlay
                  as={BaseLink}
                  href={meetup.link}
                  textDecor="none"
                  color="text"
                  hideArrow
                >
                  {meetup.title}
                </LinkOverlay>
              </Box>
            </Flex>
            <Flex
              textAlign="right"
              alignContent="flex-start"
              flex="1 1 25%"
              mr={4}
              flexWrap="wrap"
            >
              <Emoji text={meetup.emoji} boxSize={4} mr={2} />
              <Text mb={0} opacity={"0.6"}>
                {meetup.location}
              </Text>
            </Flex>
            <Box
              as="span"
              _after={{
                content: '"↗"',
                ml: 0.5,
                mr: 1.5,
              }}
            ></Box>
          </LinkBox>
        ))}
      </List>
      <Box aria-live="assertive" aria-atomic>
        {!filteredMeetups.length && (
          <InfoBanner emoji=":information_source:">
            {/* TODO: add Translation when i18n is set up */}
            {/* <Translation id="page-community-meetuplist-no-meetups" />{" "} */}
            We don't have any meetups matching this search. Know of one?
            <InlineLink to="https://github.com/ethereum/ethereum-org-website/blob/dev/src/data/community-meetups.json">
              {/* TODO: add Translation when i18n is set up */}
              {/* <Translation id="page-community-please-add-to-page" /> */}
              Please add it to this page!
            </InlineLink>
          </InfoBanner>
        )}
      </Box>
    </Box>
  )
}

export default MeetupList
