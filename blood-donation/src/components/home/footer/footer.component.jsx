import "./footer.style.scss";
import { Fragment } from "react";

const Footer = () => {
  return (
    <Fragment>
      <footer className="bg-dark text-center text-white">
        <div className="container ">
          <section className="mb-4"></section>

          <section className="">
            {/* <form action="">
              <div className="row d-flex justify-content-center">
                <div className="col-auto">
                  <p className="pt-2">
                    <strong>Sign up for our newsletter</strong>
                  </p>
                </div>

                <div className="col-md-5 col-12">
                  <div className="form-outline form-white mb-4">
                    <input
                      type="email"
                      id="form5Example21"
                      className="form-control"
                    />
                    <label className="form-label" htmlFor="form5Example21">
                      Email address
                    </label>
                  </div>
                </div>

                <div className="col-auto">
                  <button type="submit" className="btn btn-outline-light mb-4">
                    Subscribe
                  </button>
                </div>
              </div>
            </form> */}
          </section>

          <section className="mb-4">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt
              distinctio earum repellat quaerat voluptatibus placeat nam,
              commodi optio pariatur est quia magnam eum harum corrupti dicta,
              aliquam sequi voluptate quas.
            </p>
          </section>

          <section className="">
            <div className="row">
              <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                <h6 className="text-uppercase">Nguyễn Như Đại</h6>
                <span>20215191</span>
              </div>
              <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                <h6 className="text-uppercase">Trần Trọng Kỳ</h6>
                <span>20194784</span>
              </div>
              <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                <h6 className="text-uppercase">Nguyễn Đình Hồng Phong</h6>
                <span>20215233</span>
              </div>
              <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                <h6 className="text-uppercase">Vũ Minh Tuệ</h6>
                <span>20215252</span>
              </div>
            </div>
          </section>
        </div>

        <div
          className="text-center p-3"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
        >
          2023 Copyright :
          <a className="text-white" href="https://mdbootstrap.com/">
            MDBootstrap.com
          </a>
        </div>
      </footer>
    </Fragment>
  );
};

export default Footer;
