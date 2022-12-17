import { GlobalStyle, Container } from 'style/Global.styled';
import { Searchbar } from './Searchbar/Searchbar';
import { Button } from './Button/Button';
import { Component } from 'react';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { getImages } from './Api/Api';
import { Loader } from './Loader/Loader';
import toast, { Toaster } from 'react-hot-toast';

export class App extends Component {
  state = {
    query: '',
    images: [],
    isLoading: false,
    pageNum: 1,
  };

  async componentDidUpdate(_, prevState) {
    try {
      const prevQuery = prevState.query;
      const newQuery = this.state.query;

      if (prevQuery !== newQuery || prevState.pageNum !== this.state.pageNum) {
        this.setState({ isLoading: true });

        const { pageNum } = this.state;
        const images = await getImages(newQuery, pageNum);

        this.setState(prevState => ({
          images: [...prevState.images, ...images],
          isLoading: false,
        }));
      }
    } catch {
      toast.error('Something wrong :( Please reload this page');
    }
  }

  handleSubmit = ({ queryValue }) => {
    const query = queryValue.toLowerCase().split(' ').join('+');
    if (query !== this.state.query) {
      this.setState({ query, pageNum: 1, images: [] });
    } else if (this.state.query === '') {
      return toast('No, no, enter what you are looking for!!!', {
        icon: '👈',
      });
    }
  };

  onLoadMore = () => {
    this.setState(prevState => ({
      pageNum: prevState.pageNum + 1,
    }));
  };

  render() {
    const { images, isLoading } = this.state;
    return (
      <Container>
        <Searchbar onSubmit={this.handleSubmit} />

        {images.length > 0 && <ImageGallery images={images} />}

        {images.length > 0 && !isLoading && (
          <Button onLoadMore={this.onLoadMore} />
        )}
        {isLoading && <Loader />}
        <Toaster position="top-right" reverseOrder={false} />
        <GlobalStyle />
      </Container>
    );
  }
}
