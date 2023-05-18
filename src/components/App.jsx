import { useState, useEffect } from 'react';
import ImageGallery from './ImageGallery/ImageGallery';
import Searchbar from './Searchbar/Searchbar';
import Modal from './Modal/Modal';
import LoadMore from './Button/Button';
import LoaderSpiner from './Loader/Loader';
import toast from 'react-hot-toast';
import api from 'services/api';
import { mapper } from 'helpers/mapper';

export default function App() {
  const [pictureName, setPictureName] = useState('');
  const [pictureData, setPictureData] = useState([]);
  const [pictureModal, setPictureModal] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (!pictureName) {
      return;
    }

    setStatus('pending');

    const fetchPictureData = async () => {
      try {
        const res = await api.fetchPicture(pictureName, page);
        if (res.data.hits.length === 0) {
          toast.error('There is no picture for that name');
          setStatus(null);
          setIsLoadingMore(false);
          return;
        }

        setPictureData(prevData => [...prevData, ...mapper(res.data.hits)]);
        setStatus('resolved');

        const lengthData = (page - 1) * 12 + res.data.hits.length;

        setIsLoadingMore(lengthData < res.data.totalHits);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPictureData();
  }, [pictureName, page]);

  const handleFormSubmit = name => {
    setPictureName(name);
    setPictureData([]);
    setPage(1);
    setIsLoadingMore(false);
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const pictureModalClick = picture => {
    setPictureModal(picture);
  };

  const closeModal = () => {
    setPictureModal('');
  };

  return (
    <div>
      <Searchbar onSubmit={handleFormSubmit} />
      {pictureData.length > 0 && (
        <ImageGallery pictureData={pictureData} onClick={pictureModalClick} />
      )}
      {status === 'pending' && <LoaderSpiner />}
      {isLoadingMore && <LoadMore onClick={loadMore} />}
      {pictureModal.length > 0 && (
        <Modal onClose={closeModal}>
          <img src={pictureModal} alt="" />
        </Modal>
      )}
    </div>
  );
}
