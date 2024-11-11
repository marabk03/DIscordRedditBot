import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"; 

function App() {
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)
  const [reddit, setReddit] = useState(false)
  const [discord, setDiscord] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reddit && !discord) {
      alert("You must select one platform to post on")
    }
    
    const formData = new FormData(); 
  
    if (text || image) {
      if (image) {
        formData.append("image", image);
        console.log("e12eqw")
      }
      if (text) {
        formData.append("text", text);
      }
    }
  
    try {
      if (text || image) {
        const response = await axios.post("http://localhost:8000/postdis", formData);
        if (response.data.status === "Success") {
          console.log("Posted to Discord successfully!");
          setText('');
          setImage(null);
          setReddit(false)
          setDiscord(false)
          e.target.reset()
          alert("Message Successfully Sent")
        } else {
          console.log(`Failed to post to Discord: ${response.data.message}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
    
  };
  
  return (
    <>
      <div className='container mx-auto'>
        <form onSubmit={handleSubmit}>
          <div className='max-w-5xl flex flex-col'>
            <h1 className='text-5xl text-center mb-10'>Discord & Reddit Mini Bot</h1>
            <p className='text-2xl my-3 text-left'>What would you like you send?</p>
            <textarea required placeholder='Write your message' cols='30' rows='10' className='border p-2 shadow-sm bg-gray-200 rounded focus:ring focus:ring-sky-500 ' onChange={(e) => setText(e.target.value)}></textarea>
            <p className='text-2xl my-3'> Would you like to add an image? (optional) </p>
            <div className='flex justify-center ' >
              <input type="file" className='block text-md text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 py-4' onChange={(e) => setImage(e.target.files[0])}/>
            </div>
              <p className='text-2xl'> Please Select where you would like to post </p>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <input id="discord-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={(e) => setDiscord(true)}/>
                  <label htmlFor="discord-checkbox" className="ml-2 text-md font-medium text-gray-900 dark:text-gray-300">Discord</label>
                </div>
                <div className="flex items-center">
                  <input id="another-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={(e) => setReddit(true)}/>
                  <label htmlFor="another-checkbox" className="ml-2 text-md font-medium text-gray-900 dark:text-gray-300">Reddit</label>
                </div>
              </div>
            <button className='my-2' type="submit">Submit</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default App
