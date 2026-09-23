import { Route, Routes } from "react-router-dom"
import EnquiryList from "./Pages/EnquiryList"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<EnquiryList></EnquiryList>}></Route>
      </Routes>
    </>
  )
}

export default App
