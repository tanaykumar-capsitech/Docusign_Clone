import { Route, Routes } from "react-router-dom"
import EnquiryList from "./Pages/EnquiryList"
import SignPage from "./Pages/SignPage"

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<EnquiryList></EnquiryList>}></Route>
        <Route path="/serviceDetails/:id" element={<SignPage />}></Route>
      </Routes>
    </>
  )
}

export default App
