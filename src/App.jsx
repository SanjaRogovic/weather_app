import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  IoMdSunny,
  IoMdRainy,
  IoMdCloudy,
  IoMdSnow,
  IoMdThunderstorm,
  IoMdSearch,
} from "react-icons/io";
import {
  BsCloudHaze2Fill,
  BsCloudDrizzleFill,
  BsEye,
  BsWater,
  BsThermometer,
  BsWind,
  BsExclamationSquareFill,
} from "react-icons/bs";
import { TbMoodNeutralFilled, TbTemperatureCelsius } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";

//open weather map api
const API_KEY = "73637129bc96ba0d18be0f8f4db16bdf";

function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState("Vienna");
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [animate, setAnimate] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(inputValue);

    //if input value is not empty, set location
    if (inputValue !== "") {
      setLocation(inputValue);
    }

    //if input value is empty, set animate to true for 0.5s
    if (inputValue === "") {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 500);
    }

  };


  //fetch the weather data
  const getWeatherData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
      );
      // console.log("API response:", response.data);

      //set the weather data after 1.5s
      setTimeout(() => {
        setData(response.data);
        setLoading(false);
      }, 1500);

    } catch (error) {
      setErrorMessage("Not found", error);
    }finally{
      setInputValue("")
    }
  };


  //error message
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMessage("")
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [errorMessage])


  useEffect(() => {
    getWeatherData();
  }, [location]);


  //set the icon according to the weather
  let icon;

  if (!loading && data && data.weather?.[0]?.main) {
    const changeIcon = data.weather[0].main;

    switch (changeIcon) {
      case "Clouds":
        icon = <IoMdCloudy />;
        break;
      case "Haze":
        icon = <BsCloudHaze2Fill />;
        break;
      case "Rain":
        icon = <IoMdRainy className="text-[#31cafb]"/>;
        break;
      case "Clear":
        icon = <IoMdSunny className="text-[#ffde33]"/>;
        break;
      case "Drizzle":
        icon = <BsCloudDrizzleFill className="text-[#31cafb]"/>;
        break;
      case "Snow":
        icon = <IoMdSnow className="text-[#31cafb]"/>;
        break;
      case "Thunderstorm":
        icon = <IoMdThunderstorm />;
      case "Mist":
        icon = <BsEye />;
        break;
      default:
        icon = <BsExclamationSquareFill />;
    }
  }

  const date = new Date();

  // console.log("Data:", data);
  // console.log("Icon:", icon);

  return (
    <div className="w-full h-screen bg-gradient-to-r from-sky-300 to-indigo-400 bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0">
      <>

      {
        errorMessage && <div className="w-full max-w-[90vw] lg:max-w-[450px] bg-red-400 text-white absolute top-2 lg:top-10 p-4 capitalize rounded-md">{`${errorMessage}`}</div>
      }
        {/* {form} */}
        <form
          className={`${
            animate ? "animate-shake" : "animate-none"
          } h-16 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-8`}
        >
          <div className="h-full relative flex items-center justify-between p-2">
            <input
              className="flex-1 bg-transparent outline-none placeholder:text-white text-white text-[15px] font-light pl-6 h-full"
              type="text"
              placeholder="Search by city or country"
              onChange={(e) => handleInput(e)}
            />
            <button
              onClick={(e) => handleSubmit(e)}
              className="bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 rounded-full flex justify-center items-center transition"
            >
              <IoMdSearch className="text-2xl text-white" />
            </button>
          </div>
        </form>

        <div className="w-full max-w-[450px] bg-black/20 min-h-[584px] text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6">
          
          {loading ? (
            <div className="w-full h-full flex justify-center items-center">
              <ImSpinner8 className="animate-spin  text-white text-5xl" />
            </div>
          ) : (
            <div>
              {/* {card top} */}

              {data ? (
                <div className="flex items-center gap-x-5">
                  <div className="text-[87px]">{icon}</div>
                  <div>
                    <div className="text-2xl font-semibold">
                      {data.name}, {data.sys.country}
                    </div>
                    <div>
                      {date.getUTCDate()}/{date.getUTCMonth() + 1}/
                      {date.getUTCFullYear()}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* {card body} */}

              {data ? (
                <div className="my-20">
                  <div className="flex justify-center items-center">
                    <div className="text-[144px] leading-none font-light">
                      {parseInt(data.main.temp)}
                    </div>
                    <div className="text-4xl">
                      <TbTemperatureCelsius />
                    </div>
                  </div>
                  <div className="capitalize text-center">
                    {data.weather[0].description}
                  </div>
                </div>
              ) : null}

              {/* {card bottom} */}

              {data ? (
                <div className="max-w-[378px] mx-auto flex flex-col gap-y-6">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-x-2">
                      <div className="text-[20px]">
                        <BsEye />
                      </div>
                      <div>
                        Visibility
                        <span className="ml-2">
                          {data.visibility / 1000} km
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <div className="text-[20px]">
                        <BsThermometer />
                      </div>
                      <div className="flex ">
                        Feels like
                        <div className="flex ml-2">
                          {parseInt(data.main.feels_like)}
                          <TbTemperatureCelsius />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-center gap-x-2">
                      <div className="text-[20px]">
                        <BsWater />
                      </div>
                      <div>
                        Humidity
                        <span className="ml-2">{data.main.humidity} %</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <div className="text-[20px]">
                        <BsWind />
                      </div>
                      <div>
                        Wind <span className="ml-2">{data.wind.speed}m/s</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </>
    </div>
  );
}

export default App;
