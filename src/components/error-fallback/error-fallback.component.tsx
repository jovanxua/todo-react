import sadFaceImg from '../../assets/sad-face.svg';

const ErrorFallback = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <img src={sadFaceImg} />

      <h2>Oops, something went wrong...</h2>
      <p>Please try refreshing the page.</p>
    </div>
  );
};

export default ErrorFallback;
