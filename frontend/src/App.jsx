import { useState } from "react";
import "./App.css";
import axios from "axios";

const initialState = {
  text: "",
  image: null,
  reddit: false,
  discord: false,
  redditFormat: "",
  redditTitle: "",
};

function App() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reddit && !formData.discord) {
      alert("You must select at least one platform to post on.");
      return;
    }

    const data = new FormData();
    if (formData.text) data.append("text", formData.text);
    if (formData.image) data.append("image", formData.image);
    data.append("discord", formData.discord);
    data.append("reddit", formData.reddit);
    if (formData.reddit) {
      data.append("redditTitle", formData.redditTitle);
      data.append("redditFormat", formData.redditFormat);
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/postdis", data);
      if (response.data.status === "Success") {
        setFormData(initialState);
        e.target.reset();
        alert("Message Successfully Sent");
      } else {
        alert(`Failed to post: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else if (error.request) {
        alert("No response from server. Please try again later.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl flex flex-col">
          <h1 className="text-5xl text-center mb-10">
            Discord & Reddit Mini Bot
          </h1>
          <p className="text-2xl text-left mb-4">
            Please select where you would like to post:
          </p>

          <fieldset className="flex flex-col space-y-2">
            <div className="flex items-center">
              <input
                id="discord-checkbox"
                type="checkbox"
                name="discord"
                checked={formData.discord}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="discord-checkbox"
                className="ml-2 text-md font-medium text-gray-900 dark:text-gray-300"
              >
                Discord
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="reddit-checkbox"
                type="checkbox"
                name="reddit"
                checked={formData.reddit}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="reddit-checkbox"
                className="ml-2 text-md font-medium text-gray-900 dark:text-gray-300"
              >
                Reddit
              </label>
            </div>
          </fieldset>

          {formData.reddit && (
            <div className="flex flex-col space-y-6 mt-4 ">
              <p className="text-2xl text-left">Reddit Post Title</p>
              <label htmlFor="reddit-title" className="sr-only">
                Reddit Title
              </label>
              <input
                required
                type="text"
                id="reddit-title"
                name="redditTitle"
                placeholder="Reddit Title"
                value={formData.redditTitle}
                onChange={handleChange}
                className="input-base bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />

              <p className="text-2xl text-left">
                Which format would you like to post to Reddit?
              </p>
              <div className="flex items-center space-x-4 justify-start">
                <input
                  id="reddit-text-radio"
                  type="radio"
                  name="redditFormat"
                  value="text"
                  checked={formData.redditFormat === "text"}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="reddit-text-radio"
                  className="ml-2 text-md font-medium text-gray-900 dark:text-gray-300"
                >
                  Text
                </label>

                <input
                  id="reddit-image-radio"
                  type="radio"
                  name="redditFormat"
                  value="image"
                  checked={formData.redditFormat === "image"}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="reddit-image-radio"
                  className="ml-2 text-md font-medium text-gray-900 dark:text-gray-300"
                >
                  Image
                </label>
              </div>
            </div>
          )}
          {(formData.redditFormat == "text" || formData.discord) && (
            <div className="my-3 text-left">
              <label htmlFor="message" className="text-2xl my-3 text-left">
                What would you like to send?
              </label>
              <textarea
                id="message"
                name="text"
                required
                placeholder="Write your message"
                rows="10"
                value={formData.text}
                onChange={handleChange}
                className="input-base bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              ></textarea>
            </div>
          )}
          {(formData.redditFormat == "image" || formData.discord) && (
            <div className="text-left mt-3">
              <label htmlFor="image-upload" className="text-2xl my-3 text-left">
                Would you like to add an image?
              </label>
              <input
                type="file"
                id="image-upload"
                name="image"
                onChange={handleChange}
                className="block text-md text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white focus:ring-blue-500 focus:border-blue-500 py-4"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-4 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
