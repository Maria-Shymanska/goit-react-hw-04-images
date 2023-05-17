import { useState } from 'react';
import PropTypes from 'prop-types';
import toast, { Toaster } from 'react-hot-toast';
import {
  SearchbarHeader,
  SearchForm,
  SearchFormButton,
  SearchFormButtonLabel,
  SearchFormInput,
} from './Searchbar.styled';

export default function SearchBar({ onSubmit }) {
  const [pictureName, setPictureName] = useState('');

  const handleSearchChange = e => {
    setPictureName(e.currentTarget.value.toLowerCase());
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (pictureName.trim() === '') {
      return toast.error('Enter a search query');
    }
    onSubmit(pictureName);
    setPictureName('');
  };

  return (
    <SearchbarHeader>
      <Toaster />
      <SearchForm onSubmit={handleSubmit}>
        <SearchFormButton type="submit">
          <SearchFormButtonLabel>Search</SearchFormButtonLabel>
        </SearchFormButton>

        <SearchFormInput
          value={pictureName}
          onChange={handleSearchChange}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
        />
      </SearchForm>
    </SearchbarHeader>
  );
}

SearchBar.propTypes = { onSubmit: PropTypes.func.isRequired };
