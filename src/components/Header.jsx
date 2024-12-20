import styles from "./Header.module.css";

const Header = () => {
  return (
    <div className={`container column-flex ${styles.header}`}>
      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <a
          href="/"
          className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
        >
          <svg
            className="bi me-2"
            width="40"
            height="32"
            role="img"
            aria-label="Bootstrap"
          >
            <use xlinkHref="#bootstrap"></use>
          </svg>
        </a>

        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li>
            <a href="#" className="nav-link px-2 text-secondary">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="nav-link px-2 text-black">
              Features
            </a>
          </li>
          <li>
            <a href="#" className="nav-link px-2 text-black">
              Pricing
            </a>
          </li>
          <li>
            <a href="#" className="nav-link px-2 text-black">
              FAQs
            </a>
          </li>
          <li>
            <a href="#" className="nav-link px-2 text-black">
              About
            </a>
          </li>
        </ul>

        <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3" role="search">
          <input
            type="search"
            className="form-control form-control-black text-bg-white"
            placeholder="Search..."
            aria-label="Search"
          />
        </form>

        <div className="text-end ">
          <button type="button" className="btn btn-outline-dark me-2">
            Login
          </button>
          <button type="button" className="btn btn-warning">
            Sign-up
          </button>
        </div>
      </div>
    </div>
  );
};
export default Header;
