import {Box, Heading, Text} from '@primer/components'
import React from 'react'
import useSiteMetadata from '../use-site-metadata'
import Container from './container'

function Hero() {
  const {title, description} = useSiteMetadata()

  return (
    <Box bg="auto.black" py={6}>
      <Container>
        <Heading as="h1" color="auto.blue.4" fontSize={7} m={0}>
          {title}
        </Heading>
        <Text as="p" m={0} color="auto.blue.2" fontSize={4}>
          {description}
        </Text>
      </Container>
    </Box>
  )
}

export default Hero
