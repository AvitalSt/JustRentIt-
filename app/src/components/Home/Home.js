import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './Home.css';
import fabricImage from '../../assets/dressR.jpg'; 

function Home() {

    return (
        <div className="container">
            <div className="hero-section">
                <h1>השמלה המושלמת מחכה לך!</h1>
                <p></p>
                <div>
                    <a href="/dresses" className="btn btn-primary"><i className="bi bi-gem"></i> צפה בשמלות</a>
                    <a href="/about" className="btn btn-secondary"><i className="bi bi-info-circle"></i> מידע על האתר</a>
                    <a href="/upload" className="btn btn-success"><i className="bi bi-upload"></i> העלאת שמלה</a>
                </div>
            </div>
            <div className="collection-section">
                <div className="collection-text">
                    <h2>בואי לגלות את מבחר השמלות שלנו!</h2>
                    <p>מגוון רחב של שמלות לכל אירוע ולכל סגנון.</p>
                </div>
                <div className="fabric-image">
                    <img src={fabricImage} alt="בד ורוד" />
                </div>
            </div>
        </div>
    );
}

export default Home;