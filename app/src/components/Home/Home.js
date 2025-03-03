import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './Home.css';
import image1 from '../../assets/1.jpg';
import image2 from '../../assets/2.jpg';
import image3 from '../../assets/3.jpg';
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000
    };

    return (
        <div className="container">
            <div className="text-center hero-section">
                <h1>ברוכה הבאה ל-JustRentIt!</h1>
                <p>האתר להשכרת שמלות לאירועים – השמלה המושלמת מחכה לך כאן!</p>
            </div>
            <div className="d-flex justify-content-center gap-4">
                <Link to="/dresses" className="btn btn-primary btn-lg px-4 py-2">
                    <i className="bi bi-gem me-2"></i> צפה בשמלות
                </Link>
                <Link to="/info" className="btn btn-secondary btn-lg px-4 py-2">
                    <i className="bi bi-info-circle me-2"></i> מידע על האתר
                </Link>
                <Link to="/upload" className="btn btn-success btn-lg px-4 py-2">
                    <i className="bi bi-upload me-2"></i> העלאת שמלה
                </Link>
            </div>
            <div className="sliders-container">
                <Slider {...settings}>
                    <div>
                        <img src={image1} alt="שמלה 1" />
                        <p className="legend">שמלה מהממת לאירוע חגיגי</p>
                    </div>
                    <div>
                        <img src={image2} alt="שמלה 2" />
                        <p className="legend">שמלה קלאסית ונוחה</p>
                    </div>
                    <div>
                        <img src={image3} alt="שמלה 3" />
                        <p className="legend">שמלה ייחודית ומרשימה</p>
                    </div>
                </Slider>
                <Slider {...settings}>
                    <div>
                        <img src={image1} alt="שמלה 1" />
                        <p className="legend">שמלה מהממת לאירוע חגיגי</p>
                    </div>
                    <div>
                        <img src={image2} alt="שמלה 2" />
                        <p className="legend">שמלה קלאסית ונוחה</p>
                    </div>
                    <div>
                        <img src={image3} alt="שמלה 3" />
                        <p className="legend">שמלה ייחודית ומרשימה</p>
                    </div>
                </Slider>
            </div>
        </div>
    );
}

export default Home;