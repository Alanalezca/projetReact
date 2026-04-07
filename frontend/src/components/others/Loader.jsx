import PropTypes from 'prop-types';

const Loader = ({ taille = 'lg', mt = '5' }) => {
  return (
      <div className={`d-flex justify-content-center mt-${mt}`}>
        <i className={`bx bx-loader-circle bx-spin bx-rotate-90 bx-${taille}`}></i>
      </div>
  );
};

Loader.propTypes = {
  taille: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  mt: PropTypes.oneOf(['0', '1', '2', '3', '4', '5'])
};

export default Loader;