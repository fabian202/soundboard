import React, { useEffect, useState, useCallback } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
const fs = window.require('fs')
const path = window.require('path')

type RouteParams = {
  songId: string
}

type Sound = {
  id: number
  name: string
  file: any
  sound: HTMLAudioElement
  keyMap: number
}

const Details: React.FC = () => {
  // const soundArray: Sound[] = [
  //   { id: 1, name: 'Sound 1', file: require('../../assets/numb_intro.mp3') },
  //   { id: 2, name: 'Sound 2', file: require('../../assets/numb_intro.mp3') },
  //   // Add more sound objects as needed
  // ]

  const [fileArray, setFileArray] = useState<Sound[]>([])

  const navigate = useNavigate()
  const { songId } = useParams<RouteParams>()

  const sounds: { [key: number]: HTMLAudioElement } = {}
  const keyMap: { [key: string]: number } = {}

  const loadSounds = (sound: Sound) => {
    const { id, file } = sound
    sounds[id] = new Audio(file.default)

    // Map the key to the sound ID
    keyMap[id.toString()] = id
  }

  // soundArray.forEach((sound) => {
  //   loadSounds(sound)
  // })

  const handleClick = (audio: HTMLAudioElement) => {
    // console.log('searching', id)
    // console.log(fileArray)
    // const audio = fileArray.find((f) => f.id === id)?.sound //sounds[id]
    if (audio) {
      audio.currentTime = 0 // Reset the sound to the beginning
      audio.play()
    }
  }

  const handleStopAllSounds = () => {
    fileArray.forEach(({ sound }) => {
      sound.pause()
      sound.currentTime = 0 // Reset the sound to the beginning
    })
    // Object.values(sounds).forEach((audio) => {
    //   audio.pause()
    //   audio.currentTime = 0 // Reset the sound to the beginning
    // })
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    // Check if the pressed key is mapped to a sound ID
    console.log('key press', event.key, keyMap)
    console.log(fileArray)
    if (!isNaN(+event.key)) {
      // const parsedValue = parseFloat(event.key);
      const audio = fileArray.find((f) => f.id === +event.key)?.sound
      audio && handleClick(audio)
    } else {
      console.log('The value is not a number')
      handleStopAllSounds()
    }

    // if (event.key in keyMap) {
    //   const soundId = keyMap[event.key]
    //   handleClick(soundId)
    // }
  }

  const readDirectory = (directoryPath: string) => {
    fs.readdir(
      directoryPath,
      (err: NodeJS.ErrnoException | null, files: string[]) => {
        if (err) {
          console.error('Error reading directory:', err)
          return
        }

        // Filter out non-files (directories, etc.) if needed
        const filteredFiles = files.filter((file) => {
          const filePath = path.join(directoryPath, file)
          return fs.statSync(filePath).isFile()
        })

        console.log('filteredFiles', filteredFiles)

        // Update the state with the file array
        setFileArray(
          filteredFiles.map((s, ix) => {
            const file = require(`../../assets/songs/${songId}/${s}`)
            const sound: Sound = {
              id: ix + 1,
              name: s,
              file,
              sound: new Audio(file.default),
              keyMap: ix + 1,
            }

            loadSounds(sound)

            return sound
          })
        )
        console.log('sounds', sounds)
      }
    )
  }

  useEffect(() => {
    // Specify the directory path
    const directoryPath = `./assets/songs/${songId}`
    readDirectory(directoryPath)
    // // Attach the keydown event listener to the document
    // document.addEventListener('keydown', handleKeyPress)

    // // Clean up the event listener on component unmount
    // return () => {
    //   document.removeEventListener('keydown', handleKeyPress)
    // }
  }, [])

  useEffect(() => {
    if (fileArray.length) {
      // Attach the keydown event listener to the document
      document.addEventListener('keydown', handleKeyPress)

      // Clean up the event listener on component unmount
      return () => {
        document.removeEventListener('keydown', handleKeyPress)
      }
    }
  }, [fileArray])

  // useEffect(() => {
  //   if (fileArray.length) {
  //     fileArray.forEach((sound) => {
  //       loadSounds(sound)
  //     })
  //   }
  // }, fileArray)

  const extractWordFromString = (value: string, separator = '_') => {
    const regex = new RegExp(`${separator}(\\w+)\\.`)
    const match = value.match(regex)

    if (match && match[1]) {
      return snakeCaseToTitleCase(match[1])
    } else {
      return null
    }
  }

  const snakeCaseToTitleCase = (snakeCase: string) => {
    const words = snakeCase.split('_')
    const titleCase = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    return titleCase
  }

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <p className="title">{songId && snakeCaseToTitleCase(songId)}</p>
        </Col>
      </Row>
      <Row>
        {fileArray?.map((sound, ix) => (
          <Col key={sound.id}>
            <button 
              className="sound-button"
              onClick={() => handleClick(sound.sound)}
            >
              {extractWordFromString(sound.name)}
            </button>
            <div className="key-indicator">
              {ix + 1}
            </div>
          </Col>
        ))}
      </Row>
      <Row className="my-4">
        <Col>
          <Button onClick={handleStopAllSounds}>Stop All Sounds</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            onClick={() => {
              handleStopAllSounds()
              navigate('/')
            }}
          >
            Go Back
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default Details