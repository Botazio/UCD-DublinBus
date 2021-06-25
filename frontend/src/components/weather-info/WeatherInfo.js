import React, { useState } from 'react';
import useFetch from '../../helpers/useFetch';
import { Chart } from "react-google-charts";
import WeatherInfoCSS from './WeatherInfo.module.css';
import ScrollMenu from 'react-horizontal-scrolling-menu';

// Styles for the graph
const options = {
   width: "100%",
   height: "100%",
   backgroundColor: 'transparent',
   curveType: "function",
   fontName: "Roboto, sans-serif",
   series: {
      0: { color: "rgb(0, 115, 152)" },
   },
   lineWidth: 3,
   hAxis: {
      title: "Day",
      textStyle: {
         color: "black",
      },
      titleTextStyle: {
         color: "black",
      },
      minorGridlines: {
         count: 0,
      },
   },
   vAxis: {
      titleTextStyle: {
         color: "black",
      },
      textStyle: {
         color: "black",
      },
      minorGridlines: {
         count: 0,
      },
   },
   textStyle: {
      color: "black",
   },
   titleTextStyle: {
      fontSize: 14,
      fontName: "Roboto, sans-serif",
      color: "black",
   },
   legend: {
      textStyle: {
         color: "black",
      },
   },
   title: "Forecast Weather",
};

export default function WeatherInfo() {
   // Fetch the stations
   const { data: weatherData, isPending: isPendingWeather, error } = useFetch("https://api.openweathermap.org/data/2.5/onecall?lat=53.350140&lon=-6.266155&exclude=currently,minutely&units=metric&appid=f092bb2fdf927ba79511674732a39c36");
   // Current weather slide
   const [currentSlide, setCurrentSlide] = useState(0);


   // Error handling when fetching for the data
   if (error) return (<div className={WeatherInfoCSS.weather_wrapper}>Unable to get the weather data"</div>)

   // Wait for the data
   if (isPendingWeather) return null;

   console.log(weatherData)

   // Get the data in a google data table
   const forecastWeather = [];
   const datelist = [];
   (weatherData && weatherData.daily.forEach((el) => {
      var date = new Date(el.dt * 1000);
      datelist.push(date);
      forecastWeather.push([
         date,
         el.humidity,
         el.temp.day,
      ]);
   })
   )

   // Get the daily data in slides
   const weatherSlides = [];
   const dayName = [];
   const dates = [];
   for (var i = 0; i < datelist.length; i++) {
      dayName.push(datelist[i].toString().split(" ")[0]);
      dates.push(datelist[i].toString().substr(4, 6));

      // icon 
      var weatherIcon = (
         <img
            className={WeatherInfoCSS.icons}
            height="50px"
            width="50px"
            alt="weather-icon"
            src={"http://openweathermap.org/img/w/" + weatherData.daily[i].weather[0]["icon"] + ".png"} />);

      //create the containers to display the daily weather
      weatherSlides.push(<div key={"weather-slide-" + i} className={WeatherInfoCSS.weather_slide + " " + WeatherInfoCSS.fade}>
         <div className={WeatherInfoCSS.weather_header}>
            <p>{dayName[i]}</p>
            <p>Dublin</p>
            <p>{dates[i]}</p>
         </div>
         <div className={WeatherInfoCSS.weather_main_info}>
            <div>
               {i === 0 && (<h2>{Math.round(weatherData.current.temp)}º</h2>)}
               {i !== 0 && (<h2>{Math.round(weatherData.daily[i].temp.day)}º</h2>)}
            </div>
            <div className={WeatherInfoCSS.weather_items}>
               {weatherIcon}
            </div>
         </div>
         <div className={WeatherInfoCSS.weather_secondary_info}>
            <div className={WeatherInfoCSS.weather_items}>
               <p>Max<br />{Math.round(weatherData.daily[i].temp.max)}º</p>
            </div>
            <div className={WeatherInfoCSS.weather_items}>
               <p>Min<br />{Math.round(weatherData.daily[i].temp.min)}º</p>
            </div>
            <div className={WeatherInfoCSS.weather_items}>
               {weatherData.daily[i].rain && <p>Rain<br />{Math.round(weatherData.daily[i].rain)}%</p>}
               {!weatherData.daily[i].rain && <p>Rain<br />?</p>}
            </div>
            <div className={WeatherInfoCSS.weather_items}>
               {i === 0 && (<p>Wind<br />{Math.round(weatherData.current.wind_speed)} mph</p>)}
               {i !== 0 && (<p>Wind<br />{Math.round(weatherData.daily[i].wind_speed)} mph</p>)}
            </div>
         </div>
      </div>);
   }

   // Same process for the hourly weather
   var hourlySlides = []
   for (var x = 0; x < weatherData.hourly.length; x = x + 3) {
      // hourly icons
      var hourlyIcon = (
         <img
            className={WeatherInfoCSS.icons_hourly}
            height="50px"
            width="50px"
            alt="weather-icon"
            src={"http://openweathermap.org/img/w/" + weatherData.hourly[x].weather[0]["icon"] + ".png"} />);

      // hourly dates
      var date = new Date(weatherData.hourly[x].dt * 1000);

      // hourly slides
      hourlySlides.push(<div key={"hourly-slide" + x} className={WeatherInfoCSS.hourly_slide}>
         <div className={WeatherInfoCSS.hourly_time}>
            <p>{date.getHours() + ":00"}</p>
         </div>
         <div className={WeatherInfoCSS.hourly_icon}>
            {hourlyIcon}
         </div>
         <div className={WeatherInfoCSS.hourly_pop}>
            <p>&#127778;{Math.round(weatherData.hourly[x].pop)}%</p>
         </div>
         <div className={WeatherInfoCSS.hourly_temp}>
            <p>{Math.round(weatherData.hourly[x].temp)}º</p>
         </div>
      </div>)
   }

   return (
      <>
         <div className={WeatherInfoCSS.weather_wrapper}>
            {/* Display the daily slides */}
            <div className={WeatherInfoCSS.weather_slides_wrapper}>
               <div className={WeatherInfoCSS.prev_weather} href="/#" onClick={() => handleCurrentSlide(currentSlide - 1)}>&#10094;</div>
               <div className={WeatherInfoCSS.next_weather} href="/#" onClick={() => handleCurrentSlide(currentSlide + 1)}>&#10095;</div>
               {weatherSlides[currentSlide]}
            </div>

            <div className={WeatherInfoCSS.hourly_outside_wrapper}>
               <p>Hourly</p>
               <div className={WeatherInfoCSS.hourly_inner_wrapper}>
                  <ScrollMenu
                     data={hourlySlides}
                     arrowLeft={<div className={WeatherInfoCSS.prev_weather}>&#10094;</div>}
                     arrowRight={<div className={WeatherInfoCSS.next_weather}>&#10095;</div>}
                     alignCenter={false}
                     wheel={false}
                  />
               </div>
            </div>

            {/* Display the google graph */}
            <div className={WeatherInfoCSS.weather_chart_wrapper}>
               <p>Daily Forecast</p>
               <div id={WeatherInfoCSS.weather_chart}>
                  <Chart
                     chartType="LineChart"
                     rows={forecastWeather}
                     options={options}
                     columns={[
                        {
                           type: "date",
                           label: "Time"
                        },
                        {
                           type: "number",
                           label: "Humidiy"
                        },
                        {
                           type: "number",
                           label: "Temperature"
                        }
                     ]} />
               </div>
            </div>
         </div>
      </>
   )

   function handleCurrentSlide(n) {
      if (n > weatherSlides.length - 1) {
         setCurrentSlide(0);
      }
      else if (n < 0) {
         setCurrentSlide(weatherSlides.length - 1);
      }
      else {
         setCurrentSlide(n)
      }
   }
}