import React from "react";
import Slider from "react-slick";
import hero1 from "../../assets/hero.png";
import ai from "../../assets/ai1.png";
import it from "../../assets/it.png";
import data from "../../assets/data.png";
import "./HeroSection.css";

function HeroSection() {
  const heroSlides = [
    {
      title: "Master tomorrow's skills today",
      description:
        "Power up your AI, career, and life skills with the most up-to-date, expert-led learning.",
      button1: "Get Started",
      button2: "Learn AI",
      image: hero1,
    },
    {
      title: "Empower your future with AI",
      description:
        "Learn Generative AI, Machine Learning, and Deep Learning with Apical Soft’s expert courses.",
      button1: "Explore AI Courses",
      button2: "Join Now",
      image: ai,
    },
    {
      title: "Advance Your IT Career",
      description:
        "Get certified in cloud computing, cybersecurity, and IT networking from industry leaders.",
      button1: "Browse IT",
      button2: "Start Learning",
      image: it,
    },
    {
      title: "Master Data Science",
      description:
        "Learn to analyze, visualize, and make data-driven decisions with real-world projects.",
      button1: "View Courses",
      button2: "Learn More",
      image: data,
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3500,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
  };

  return (
    <section className="hero-carousel">
      <Slider {...settings}>
        {heroSlides.map((slide, index) => (
          <div key={index} className="hero-slide">
            <div className="hero-content">
              <div className="hero-text">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <div className="hero-buttons">
                  <button className="primary-btn">{slide.button1}</button>
                  <button className="secondary-btn">{slide.button2}</button>
                </div>
              </div>
              <div className="hero-image">
                <img src={slide.image} alt={slide.title} />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}

export default HeroSection;
