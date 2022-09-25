import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.css';
import NewApiImageService from './searchQuery';

const refs = {
  formEl: document.querySelector('#search-form'),
  divEl: document.querySelector('.gallery'),
};

const ImagesApi = new NewApiImageService;

let isShow = 0;

refs.formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  isShow = 0;
  refs.divEl.innerHTML = '';
  ImagesApi.resetPage();
  ImagesApi.query = event.target.elements.searchQuery.value.trim();
  fetchImages();
};

async function fetchImages() {
  const response = await ImagesApi.fetchImage();
  const { hits, total } = response;

  if (!hits.length) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  renderGallery(hits);

  isShow += hits.length;

  if (isShow >= total) {
    Notiflix.Notify.info(
      'We are sorry, but you have reached the end of search results.'
    );
  }
  
  if(ImagesApi.query === '') {
    Notiflix.Notify.warning('Please enter a query');
  }
};

function renderGallery(elements) {
    const markup = elements
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `
              <a class="gallery__link" href="${largeImageURL}">
                  <div class="photo-card">
                      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                      <div class="info">
                          <p class="info-item">
                              <b>Likes</b>
                              ${likes}
                          </p>
                          <p class="info-item">
                              <b>Views</b>
                              ${views}
                          </p>
                          <p class="info-item">
                              <b>Comments</b>
                              ${comments}
                          </p>
                          <p class="info-item">
                              <b>Downloads</b>
                              ${downloads}
                          </p>
                      </div>
                  </div>
              </a>
          `;
        }
      )
      .join('');

      refs.divEl.insertAdjacentHTML('beforeend', markup)
      const simpleLightbox = new SimpleLightbox('.gallery a');
    }
