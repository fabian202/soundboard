import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
// import * as fs from 'fs-extra'
// import fs from 'fs'
// const fs = require('fs')
// import * as fs from 'fs'
const fs = window.require('fs')

const List = () => {
  const [files, setFiles] = useState<string[]>([])

  useEffect(() => {
    const directoryPath = './assets/songs/'

    function getFilesInDirectory() {
      try {
        // console.log(fs)
        const files = fs.readdirSync(directoryPath)
        // return files;
        // console.log('files', files)
        setFiles(files)
      } catch (error) {
        console.error('Error reading directory:', error)
        setFiles([])
        return []
      }
    }

    getFilesInDirectory()
  }, [])

  const snakeCaseToTitleCase = (snakeCase: string) => {
    const words = snakeCase.split('_')
    const titleCase = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    return titleCase
  }

  return (
    <Container>
      <Row className='mt-3'>
        <Col>
          <p className="title">Proyecto UNO</p>
        </Col>
      </Row>
      <ListGroup>
        {files?.map((item, ix) => (
          <ListGroup.Item key={ix} action>
            <Link to={`/details/${item}`}>{snakeCaseToTitleCase(item)}</Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  )
}

export default List
