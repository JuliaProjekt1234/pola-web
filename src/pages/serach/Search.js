import React, { useState, useEffect } from 'react'
import SearchModal from './SearchModal';
import axios from 'axios'
import { InputGroup, FormControl, Button, Modal } from "react-bootstrap"
import { SearchButton, SearchFormControl, SearchInputGroup } from "./Search.css"
import { ImSearch } from 'react-icons/im'

const Search = () => {
  const [ean, setEan] = useState("")
  const [data, setData] = useState({})
  const [isOpen, setOpen] = useState(false)
  const [deviceId, setDeviceId] = useState('')

  const randomDeviceId = () => {
    let deviceId = 'WEB-';
    let asciiNumber;
    for (let i = 0; i < 32; i++) {
      asciiNumber = Math.floor(Math.random() * 35);
      if (asciiNumber >= 0 && asciiNumber <= 9) {
        deviceId = deviceId + String.fromCharCode(asciiNumber + 48)
      }
      else {
        deviceId = deviceId + String.fromCharCode(asciiNumber + 87)
      }
    }
    return deviceId
  }

  useEffect(() => {
    if (localStorage.getItem('DEVICE_ID') == null) {
      const id = randomDeviceId();
      localStorage.setItem('DEVICE_ID', id);
      setDeviceId(id)

    }
  }, []);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ean.length > 0) {
      axios.get('/get_by_code',
        {
          params: {
            code: ean,
            device_id: deviceId
          }
        }
      )
        .then(resp => {
          openModal();
          setData(resp.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <form style={{ width: '50%', margin: '0 auto' }} onSubmit={handleSubmit}>
        <InputGroup className="mb-3 border-0 w-100" >
          <SearchFormControl
            type='text'
            value={ean}
            onChange={e => setEan(e.target.value)}
            placeholder="Wpisz tutaj kod kreskowy"
          />
          <InputGroup.Append>
            <SearchButton type='submit' variant="outline-secondary">
              <ImSearch />
            </SearchButton>
          </InputGroup.Append>
        </InputGroup>
      </form>
      <Modal
        size="lg"
        show={isOpen}
        onHide={closeModal}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Large Modal
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SearchModal
            data={data}
          />
        </Modal.Body>
      </Modal>
      {/* {
        isOpen &&
        <SearchModal
          data={data}
        />
      } */}
      {/* <form>
        <input type="text"
          value={ean}
          onChange={e => setEan(e.target.value)}
        />
        <button type="submit">Sprawdź</button>
     
      </form> */}
    </div >
  )
}

export default Search;